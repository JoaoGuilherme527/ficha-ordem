/* =========================================================================
   MESA — cenários 2D para projetar na TV
   Duas telas no mesmo arquivo, escolhidas pelo hash:
     #/         painel do mestre (notebook)
     #/palco    tela dos jogadores (TV)
   A sincronia entre as duas janelas é BroadcastChannel — mesma origem,
   sem servidor. Vida, esforço e sanidade vêm do Supabase, do mesmo banco
   que a ficha usa, então o celular do jogador atualiza a TV.
   ========================================================================= */

const $ = s => document.querySelector(s);
const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
/* U (pixels por unidade de grid) vem do mapa.js, que roda antes e declara a
   constante no mesmo escopo global de script. Redeclarar aqui derrubava o
   arquivo inteiro com "Identifier 'U' has already been declared". */
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : "t" + Date.now() + Math.random());

/* =======================================================================
   ESTADO COMPARTILHADO ENTRE AS DUAS JANELAS
   ======================================================================= */

const CANAL = "op-mesa-2d";
const CHAVE = "op-mesa-estado";

function estadoPadrao() {
  return { cenarioId: CENARIOS[0].id, revelado: false, aviso: "",
           grade: true, rotulos: true, iluminacao: true,
           pontosAbertos: [], tokens: {}, ocultas: {}, imgNome: {},
           calib: {}, usarDesenho: {}, dado: null };
}

function carregar() {
  try {
    const b = localStorage.getItem(CHAVE);
    return b ? Object.assign(estadoPadrao(), JSON.parse(b)) : estadoPadrao();
  } catch (e) { return estadoPadrao(); }
}

let estado = carregar();
let canal = null;

function abrirCanal(aoReceber) {
  try { canal = new BroadcastChannel(CANAL); } catch (e) { return; }
  canal.onmessage = ev => {
    const d = ev.data || {};
    if (d.tipo === "estado") { estado = d.estado; aoReceber(); }
    if (d.tipo === "pedido" && ehMestre) { transmitir(); reenviarImagens(); }
    if (d.tipo === "imagem") {
      if (imagensMem[d.cenId]) URL.revokeObjectURL(imagensMem[d.cenId]);
      imagensMem[d.cenId] = d.blob ? URL.createObjectURL(d.blob) : null;
      aoReceber();
    }
  };
}

function transmitir() {
  try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) { }
  if (canal) canal.postMessage({ tipo: "estado", estado });
}

/* tokens ficam guardados por cenário, para não se perderem ao trocar de cena */
function tokensDaVista(v) {
  if (!estado.tokens[v.chave])
    estado.tokens[v.chave] = v.padrao.map(t => Object.assign({ id: uid() }, t));
  return estado.tokens[v.chave];
}

/* imagens enviadas na sessão ficam só em memória (não vão para o banco) */
const imagensMem = {};
const blobsMem = {};
function reenviarImagens() {
  if (!canal) return;
  Object.keys(blobsMem).forEach(cenId =>
    canal.postMessage({ tipo: "imagem", cenId, blob: blobsMem[cenId] }));
}

function ocultasDaCena(id) { return estado.ocultas[id] || (estado.ocultas[id] = []); }

/* Uma cena pode ser vista de dois jeitos: o desenho gerado ou uma imagem.
   Cada vista tem suas próprias medidas, pontos e posições de token. */
function vista(cen) {
  const enviada = imagensMem[cen.id];
  const embutida = cen.imagem;
  const usarDesenho = estado.usarDesenho[cen.id];
  if (usarDesenho || (!enviada && !embutida))
    return { chave: cen.id, w: cen.mapa.w, h: cen.mapa.h,
             pontos: cen.pontos || [], padrao: cen.tokens || [], url: null, luzes: [] };

  const cal = estado.calib[cen.id];
  if (enviada) {
    return { chave: cen.id + "@env", url: enviada,
             w: (cal && cal.w) || cen.mapa.w, h: (cal && cal.h) || cen.mapa.h,
             pontos: cen.pontos || [], padrao: cen.tokens || [], luzes: [], enviada: true };
  }
  return { chave: cen.id + "@img", url: embutida.url,
           w: (cal && cal.w) || embutida.w, h: (cal && cal.h) || embutida.h,
           pontos: embutida.pontos || cen.pontos || [],
           padrao: embutida.tokens || cen.tokens || [],
           luzes: embutida.luzes || [], escuridao: embutida.escuridao };
}

const vistaAtual = () => vista(cenarioAtual());
const cenarioAtual = () => CENARIOS.find(c => c.id === estado.cenarioId) || CENARIOS[0];

/* =======================================================================
   SUPABASE — mesma configuração e mesma sessão do app da ficha
   ======================================================================= */

const _env = window.APP_CONFIG || {};
const CFGKEY = "op-supabase-config";

function getCfg() {
  let l = {};
  try { l = JSON.parse(localStorage.getItem(CFGKEY) || "{}") || {}; } catch (e) { }
  return {
    url: String(_env.SUPABASE_URL || l.url || "").trim().replace(/\/+$/, ""),
    key: String(_env.SUPABASE_ANON_KEY || l.key || "").trim()
  };
}

let sb = null, user = null, perfil = null;
let agentes = [], rolagens = [];

function conectar() {
  const cfg = getCfg();
  if (!cfg.url || !cfg.key) return "sem-config";
  try {
    sb = window.supabase.createClient(cfg.url, cfg.key, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    return null;
  } catch (e) { return e.message || "falha ao conectar"; }
}

async function carregarAgentes() {
  const { data, error } = await sb.from("agentes")
    .select("id,nome,jogador,classe,nex,ficha,sessao,atualizado_em")
    .order("atualizado_em", { ascending: false });
  if (error) { console.warn(error.message); return; }
  agentes = data || [];
}

async function carregarRolagens() {
  const { data, error } = await sb.from("rolagens")
    .select("id,agente_id,autor_nome,tipo,descricao,criado_em")
    .order("criado_em", { ascending: false }).limit(24);
  if (error) { console.warn(error.message); return; }
  rolagens = data || [];
}

/* Realtime quando disponível; senão, uma consulta a cada 10 s.
   Assim funciona tanto com Realtime ligado no projeto quanto sem. */
let modoAoVivo = "sondagem";

function ligarAoVivo(aoMudar) {
  let recebeu = false;
  try {
    sb.channel("mesa-2d")
      .on("postgres_changes", { event: "*", schema: "public", table: "agentes" },
        async () => { recebeu = true; await carregarAgentes(); aoMudar(); })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "rolagens" },
        async () => { recebeu = true; await carregarRolagens(); aoMudar(); })
      .subscribe(st => {
        if (st === "SUBSCRIBED") { modoAoVivo = "realtime"; aoMudar(); }
      });
  } catch (e) { /* segue na sondagem */ }

  setInterval(async () => {
    if (modoAoVivo === "realtime" && recebeu) return;
    await Promise.all([carregarAgentes(), carregarRolagens()]);
    aoMudar();
  }, 10000);
}

/* =======================================================================
   PEÇAS DE INTERFACE REAPROVEITADAS PELAS DUAS TELAS
   ======================================================================= */

const agentePorId = id => agentes.find(a => a.id === id);

function fracaoPV(a) {
  const s = (a && a.sessao) || {}, m = s.max || {};
  if (typeof s.pv !== "number" || !(m.pv > 0)) return null;
  return clamp(s.pv / m.pv, 0, 1);
}

const corDoElemento = e => (ELEMENTOS[e] || ELEMENTOS.neutro).cor;

function montarMapa(caixa, cen, opcoes) {
  const o = opcoes || {};
  const v = vista(cen);
  const luzes = v.luzes.concat(
    tokensDaVista(v).filter(t => t.luz).map(t => ({ x: t.x, y: t.y, r: 5.5, tom: "fria" })));
  caixa.innerHTML = svgMapa(cen, {
    dims: { w: v.w, h: v.h },
    grade: estado.grade !== false,
    rotulos: estado.rotulos !== false,
    iluminacao: estado.iluminacao !== false,
    escuridao: v.escuridao,
    atenuar: o.modoMestre ? .55 : 1,
    luzes,
    ocultas: ocultasDaCena(cen.id),
    modoComodos: o.modoComodos,
    modoMestre: o.modoMestre,
    imagemURL: v.url
  });
  /* A proporção da cena precisa chegar ao CSS: o palco dimensiona a caixa pela
     altura da TV e tira a largura daqui. Sem isso o container mediria pelo
     SVG e o SVG pelo container. Como a caixa fica exatamente do tamanho do
     desenho, os tokens em % continuam caindo no lugar certo. */
  caixa.style.aspectRatio = v.w + " / " + v.h;
  if (o.modoComodos) {
    caixa.querySelectorAll("[data-sala]").forEach(r => {
      r.addEventListener("pointerdown", ev => {
        ev.stopPropagation();
        const i = Number(r.getAttribute("data-sala"));
        const oc = ocultasDaCena(cen.id), j = oc.indexOf(i);
        if (j < 0) oc.push(i); else oc.splice(j, 1);
        transmitir(); o.aoMudar && o.aoMudar();
      });
    });
  }

  // pontos de interesse
  v.pontos.forEach(p => {
    if (o.somentePontosAbertos && estado.pontosAbertos.indexOf(p.n) < 0) return;
    const b = el("button", "pi", String(p.n));
    b.style.left = (p.x / v.w * 100) + "%";
    b.style.top = (p.y / v.h * 100) + "%";
    b.title = p.nome;
    if (estado.pontosAbertos.indexOf(p.n) >= 0) b.classList.add("on");
    if (o.aoTocarPonto) b.onclick = () => o.aoTocarPonto(p);
    else b.tabIndex = -1;
    caixa.appendChild(b);
  });

  // tokens
  tokensDaVista(v).forEach(t => {
    const b = el("button", "token");
    b.style.left = (t.x / v.w * 100) + "%";
    b.style.top = (t.y / v.h * 100) + "%";
    b.style.setProperty("--cor", corDoElemento(t.elemento));
    b.setAttribute("aria-label", t.nome);
    if (o.selecionado === t.id) b.classList.add("sel");

    const ag = t.agenteId ? agentePorId(t.agenteId) : null;
    const foto = ag && ag.ficha && ag.ficha.token;
    if (!foto) b.appendChild(el("span", "ini", (t.nome || "?").slice(0, 1).toUpperCase()));
    const fr = ag ? fracaoPV(ag) : null;
    if (fr != null) {
      const anel = el("span", "anel");
      anel.style.setProperty("--p", (fr * 100).toFixed(1));
      if (fr <= .25) anel.classList.add("baixo");
      if ((ag.sessao || {}).morrendo) anel.classList.add("morrendo");
      b.appendChild(anel);
    }
    /* A arte vai num filho, e não no fundo do botão: o `border-radius:50%`
       recortaria um background em círculo. Entra depois do anel para ficar
       por cima dele, e transborda a moldura de propósito — a bola marca a
       posição na grade, a arte é só o retrato. */
    if (foto) {
      b.classList.add("foto");
      const arte = el("span", "arte");
      arte.style.backgroundImage = 'url("' + foto + '")';
      b.appendChild(arte);
    }
    b.appendChild(el("span", "nm", ag ? ag.nome : t.nome));
    if (o.arrastavel) {
      b.addEventListener("pointerdown", ev => {
        ev.preventDefault();
        arrastando = t.id;
        o.aoSelecionar && o.aoSelecionar(t.id);
        b.setPointerCapture(ev.pointerId);
      });
    } else b.tabIndex = -1;
    caixa.appendChild(b);
  });
}

let arrastando = null;

function ligarArraste(caixa, v, aoMover, aoSoltar) {
  const posicao = ev => {
    const svg = caixa.querySelector("svg");
    const r = (svg || caixa).getBoundingClientRect();
    return {
      x: clamp((ev.clientX - r.left) / r.width * v.w, 0, v.w),
      y: clamp((ev.clientY - r.top) / r.height * v.h, 0, v.h)
    };
  };
  caixa.onpointermove = ev => { if (arrastando) aoMover(arrastando, posicao(ev)); };
  caixa.onpointerup = caixa.onpointercancel = () => {
    if (arrastando) { arrastando = null; aoSoltar && aoSoltar(); }
  };
}

function barrasDoAgente(a, grande) {
  const s = a.sessao || {};
  const max = s.max || {};
  const linhas = [
    ["Vida", s.pv, max.pv, "var(--pv)"],
    ["Esforço", s.pe, max.pe, "var(--pe)"],
    ["Sanidade", s.san, max.san, "var(--san)"]
  ];
  const box = el("div", "barras");
  linhas.forEach(([rot, v, m, cor]) => {
    const temMax = typeof m === "number" && m > 0;
    const val = typeof v === "number" ? v : (temMax ? m : null);
    const b = el("div", "barra");
    const i = el("i");
    i.style.width = (temMax && val != null ? clamp(val / m * 100, 0, 100) : 0) + "%";
    i.style.background = cor;
    const t = el("span");
    t.appendChild(el("b", null, rot));
    t.appendChild(el("b", "num", val == null ? "—" : (temMax ? val + "/" + m : String(val))));
    b.appendChild(i); b.appendChild(t);
    box.appendChild(b);
  });
  return box;
}

function fichaCurta(a) {
  const d = el("div", "ag");
  const h = el("h4");
  h.appendChild(document.createTextNode(a.nome || "Agente"));
  h.appendChild(el("span", "nex", "NEX " + (a.nex || 0) + "%"));
  d.appendChild(h);
  const s = a.sessao || {};
  if (s.morrendo) { const w = el("div", "hint"); w.textContent = "morrendo"; w.style.color = "var(--bad)"; d.appendChild(w); }
  else if (Array.isArray(s.cond) && s.cond.length) d.appendChild(el("div", "hint", s.cond.join(", ")));
  d.appendChild(barrasDoAgente(a));
  return d;
}

/* =======================================================================
   TELA DO MESTRE
   ======================================================================= */

let ehMestre = false;
let selecionado = null;
let painelPonto = null;

function telaMestre() {
  ehMestre = true;
  document.body.classList.remove("palco");
  $("#app").innerHTML = `
    <div class="top">
      <div class="brand"><span class="mark">OP</span><b>Mesa</b></div>
      <span class="crumb" id="crumb">—</span>
      <div class="grow"></div>
      <div class="statusbar"><span class="dot off" id="dotVivo"></span><span id="txtVivo">conectando…</span></div>
      <button class="btn ghost sm" id="btnTema">Tema</button>
      <a class="btn ghost sm" href="/">Fichas</a>
      <button class="btn primary sm" id="btnPalco">Abrir tela dos jogadores</button>
    </div>
    <div class="wrap">
      <div class="col">
        <div class="card">
          <header><h3>Cenários</h3></header>
          <div id="listaCen"></div>
        </div>
      </div>
      <div class="col">
        <div class="card">
          <header>
            <h3 id="tituloCena">—</h3>
            <div class="grow"></div>
            <button class="btn ghost sm" id="btnLuz">Luz</button>
            <button class="btn ghost sm" id="btnComodos">Cômodos</button>
            <button class="btn ghost sm" id="btnGrade">Grade</button>
            <button class="btn ghost sm" id="btnRotulos">Rótulos</button>
            <button class="btn sm" id="btnRevelar">Revelar cena</button>
          </header>
          <div class="pad stack">
            <div class="mapa editavel" id="mapa"></div>
            <p class="hint" id="resumo"></p>
            <div class="row">
              <button class="btn sm" id="btnToken">Novo token</button>
              <button class="btn sm" id="btnRemover">Remover</button>
              <button class="btn sm" id="btnLanterna">Lanterna</button>
              <button class="btn sm" id="btnAgentes">Trazer agentes</button>
              <button class="btn sm" id="btnRepor">Repor posições</button>
              <div class="grow"></div>
              <div class="row" id="cores"></div>
            </div>
            <div class="row">
              <button class="btn ghost sm" id="btnImagem">Enviar imagem…</button>
              <button class="btn ghost sm" id="btnVista">Ver desenho</button>
              <button class="btn ghost sm" id="btnImagemTira" hidden>Descartar envio</button>
              <span class="hint" id="imgNome"></span>
              <input type="file" id="arqImagem" accept="image/*" hidden>
            </div>
            <div class="row" id="linhaVinc" hidden>
              <span class="hint">Token selecionado:</span>
              <select id="selAgente" style="max-width:210px"></select>
              <span class="hint" id="vincInfo"></span>
            </div>
            <div class="row" id="linhaCalib" hidden>
              <span class="hint">Grade da imagem:</span>
              <input type="text" id="calW" style="max-width:64px" inputmode="decimal">
              <span class="hint">×</span>
              <input type="text" id="calH" style="max-width:64px" inputmode="decimal">
              <button class="btn sm" id="btnCalib">Aplicar</button>
              <span class="hint">quantos quadrados a imagem tem</span>
            </div>
          </div>
          <div id="detPonto"></div>
        </div>
        <div class="card">
          <header><h3>Dados</h3><div class="grow"></div><span class="hint" id="ultDado"></span></header>
          <div class="pad stack">
            <div class="row" id="dados"></div>
            <div class="row">
              <input type="text" id="dadoExpr" placeholder="ex.: 2d6+3" autocomplete="off" style="max-width:130px">
              <button class="btn sm" id="btnDadoExpr">Rolar</button>
              <span class="hint">O resultado aparece grande na TV.</span>
            </div>
          </div>
        </div>
        <div class="card">
          <header><h3>Aviso na tela</h3></header>
          <div class="pad stack">
            <input type="text" id="aviso" placeholder="ex.: Teste de Vontade, DT 15" autocomplete="off">
            <div class="row">
              <button class="btn sm" id="btnAviso">Mostrar na TV</button>
              <button class="btn ghost sm" id="btnLimpaAviso">Limpar</button>
            </div>
            <p class="hint">O aviso aparece grande sobre o mapa, na tela dos jogadores.</p>
          </div>
        </div>
      </div>
      <div class="col col-dir">
        <div class="card">
          <header><h3>Agentes</h3><div class="grow"></div><button class="btn ghost sm" id="btnRecarregar">Atualizar</button></header>
          <div id="listaAg"><div class="vazio">carregando…</div></div>
        </div>
        <div class="card">
          <header><h3>Rolagens</h3></header>
          <div class="feed" id="feed"><div class="vazio">—</div></div>
        </div>
      </div>
    </div>`;

  ligarTema();
  $("#btnPalco").onclick = () => window.open(location.pathname + "#/palco", "op-palco", "width=1280,height=760");
  $("#btnRevelar").onclick = () => { estado.revelado = !estado.revelado; transmitir(); render(); };
  $("#btnGrade").onclick = () => { estado.grade = estado.grade === false; transmitir(); render(); };
  $("#btnLuz").onclick = () => { estado.iluminacao = estado.iluminacao === false; transmitir(); render(); };
  $("#btnComodos").onclick = () => { modoComodos = !modoComodos; render(); };
  $("#btnLanterna").onclick = () => {
    if (!selecionado) return;
    const t = tokensDaVista(vistaAtual()).find(t => t.id === selecionado);
    if (t) { t.luz = !t.luz; transmitir(); render(); }
  };

  $("#btnVista").onclick = () => {
    const id = cenarioAtual().id;
    estado.usarDesenho[id] = !estado.usarDesenho[id];
    selecionado = null; transmitir(); render();
  };
  $("#btnCalib").onclick = () => {
    const w = parseFloat(($("#calW").value || "").replace(",", "."));
    const h = parseFloat(($("#calH").value || "").replace(",", "."));
    if (!(w > 0) || !(h > 0)) return;
    estado.calib[cenarioAtual().id] = { w, h };
    transmitir(); render();
  };
  $("#btnAgentes").onclick = () => {
    const v = vistaAtual(), lista = tokensDaVista(v);
    let n = 0;
    agentes.forEach((a, i) => {
      if (lista.some(t => t.agenteId === a.id)) return;
      lista.push({ id: uid(), agenteId: a.id, nome: a.nome, elemento: "neutro",
                   x: clamp(v.w * .5 + (i - agentes.length / 2) * 1.2, 1, v.w - 1),
                   y: clamp(v.h - 1.5, 1, v.h - 1) });
      n++;
    });
    if (n) { transmitir(); render(); }
  };

  $("#selAgente").onchange = ev => {
    const t = tokensDaVista(vistaAtual()).find(t => t.id === selecionado);
    if (!t) return;
    t.agenteId = ev.target.value || null;
    const a = t.agenteId ? agentePorId(t.agenteId) : null;
    if (a) t.nome = a.nome;
    transmitir(); render();
  };

  $("#btnImagem").onclick = () => $("#arqImagem").click();
  $("#arqImagem").onchange = ev => {
    const arq = ev.target.files && ev.target.files[0];
    if (!arq) return;
    const id = cenarioAtual().id;
    blobsMem[id] = arq;
    if (imagensMem[id]) URL.revokeObjectURL(imagensMem[id]);
    imagensMem[id] = URL.createObjectURL(arq);
    estado.imgNome[id] = arq.name;
    if (canal) canal.postMessage({ tipo: "imagem", cenId: id, blob: arq });
    transmitir(); render();
    ev.target.value = "";
  };
  $("#btnImagemTira").onclick = () => {
    const id = cenarioAtual().id;
    delete blobsMem[id];
    if (imagensMem[id]) URL.revokeObjectURL(imagensMem[id]);
    imagensMem[id] = null;
    delete estado.imgNome[id];
    if (canal) canal.postMessage({ tipo: "imagem", cenId: id, blob: null });
    transmitir(); render();
  };

  const caixaDados = $("#dados");
  [4, 6, 8, 10, 12, 20, 100].forEach(f => {
    const b = el("button", "btn sm", "d" + f);
    b.onclick = () => rolarDado(1, f, 0);
    caixaDados.appendChild(b);
  });
  $("#btnDadoExpr").onclick = () => {
    const m = /^\s*(\d*)d(\d+)\s*([+-]\s*\d+)?\s*$/i.exec($("#dadoExpr").value);
    if (!m) return;
    rolarDado(clamp(Number(m[1] || 1), 1, 20), Number(m[2]), Number((m[3] || "0").replace(/\s/g, "")));
  };
  $("#btnRotulos").onclick = () => { estado.rotulos = estado.rotulos === false; transmitir(); render(); };
  $("#btnAviso").onclick = () => { estado.aviso = $("#aviso").value.trim(); transmitir(); render(); };
  $("#btnLimpaAviso").onclick = () => { estado.aviso = ""; $("#aviso").value = ""; transmitir(); render(); };
  $("#btnRecarregar").onclick = async () => { await Promise.all([carregarAgentes(), carregarRolagens()]); render(); };

  $("#btnToken").onclick = () => {
    const nome = prompt("Nome do token");
    if (!nome) return;
    const cen = cenarioAtual();
    const v = vista(cen);
    tokensDaVista(v).push({ id: uid(), nome, elemento: "neutro", x: v.w / 2, y: v.h / 2 });
    transmitir(); render();
  };
  $("#btnRemover").onclick = () => {
    if (!selecionado) return;
    const v = vistaAtual();
    estado.tokens[v.chave] = tokensDaVista(v).filter(t => t.id !== selecionado);
    selecionado = null; transmitir(); render();
  };
  $("#btnRepor").onclick = () => {
    delete estado.tokens[vistaAtual().chave];
    selecionado = null; transmitir(); render();
  };

  const cores = $("#cores");
  Object.keys(ELEMENTOS).forEach(k => {
    const b = el("button", "btn sm");
    b.title = ELEMENTOS[k].nome;
    b.style.width = "24px"; b.style.height = "24px"; b.style.padding = "0";
    b.style.borderRadius = "50%"; b.style.background = ELEMENTOS[k].cor; b.style.borderColor = "transparent";
    b.onclick = () => {
      if (!selecionado) return;
      const t = tokensDaVista(vistaAtual()).find(t => t.id === selecionado);
      if (t) { t.elemento = k; transmitir(); render(); }
    };
    cores.appendChild(b);
  });

  montarLista();
  render();
}

let modoComodos = false;
let ultimaTransmissao = 0;

function rolarDado(q, faces, mod) {
  const rolos = [];
  for (let i = 0; i < q; i++) rolos.push(1 + Math.floor(Math.random() * faces));
  const total = rolos.reduce((a, b) => a + b, 0) + (mod || 0);
  const rotulo = q + "d" + faces + (mod ? (mod > 0 ? "+" + mod : mod) : "");
  estado.dado = { id: uid(), rotulo, total, rolos: rolos.join(" · "), faces, critico: q === 1 && rolos[0] === faces, desastre: q === 1 && rolos[0] === 1 };
  transmitir(); render();
}

function montarLista() {
  const box = $("#listaCen");
  box.innerHTML = "";
  let grupo = null;
  CENARIOS.forEach(c => {
    if (c.grupo !== grupo) {
      grupo = c.grupo;
      box.appendChild(el("div", "grupo", grupo.toUpperCase()));
    }
    const b = el("button", "cen");
    b.appendChild(el("span", "tag", c.cena || "livre"));
    b.appendChild(el("span", "nm", c.titulo));
    b.appendChild(el("span", "sb", c.subtitulo || ""));
    b.dataset.id = c.id;
    b.onclick = () => {
      estado.cenarioId = c.id;
      estado.pontosAbertos = [];
      selecionado = null; painelPonto = null;
      transmitir(); render();
    };
    box.appendChild(b);
  });
}

function render() {
  const cen = cenarioAtual();
  /* Precisa vir antes de tudo: a calibração e o token selecionado, mais acima,
     já leem `v`. Declarada só na hora de montar o mapa, ela caía na zona morta
     do `const` e render() estourava antes de preencher agentes e rolagens. */
  const v = vista(cen);

  document.querySelectorAll(".cen").forEach(b => b.classList.toggle("sel", b.dataset.id === cen.id));
  $("#crumb").textContent = (cen.cena ? cen.cena + " · " : "") + cen.titulo;
  $("#tituloCena").textContent = cen.titulo;
  $("#resumo").textContent = cen.resumo || "";
  const br = $("#btnRevelar");
  br.textContent = estado.revelado ? "Ocultar cena" : "Revelar cena";
  br.classList.toggle("on", estado.revelado);
  $("#btnGrade").classList.toggle("on", estado.grade !== false);
  $("#btnRotulos").classList.toggle("on", estado.rotulos !== false);
  $("#btnLuz").classList.toggle("on", estado.iluminacao !== false);
  $("#btnComodos").classList.toggle("on", modoComodos);
  const temEnvio = !!imagensMem[cen.id];
  const temAlguma = temEnvio || !!cen.imagem;
  $("#btnImagemTira").hidden = !temEnvio;
  $("#btnVista").hidden = !temAlguma;
  $("#btnVista").textContent = estado.usarDesenho[cen.id] ? "Ver imagem" : "Ver desenho";
  $("#btnVista").classList.toggle("on", !estado.usarDesenho[cen.id]);
  const tSel = selecionado ? tokensDaVista(v).find(t => t.id === selecionado) : null;
  $("#linhaVinc").hidden = !tSel;
  if (tSel) {
    const sel = $("#selAgente");
    sel.innerHTML = "";
    sel.appendChild(new Option("— peça solta —", ""));
    agentes.forEach(a => sel.appendChild(new Option(a.nome || "Agente", a.id)));
    sel.value = tSel.agenteId || "";
    const ag = tSel.agenteId ? agentePorId(tSel.agenteId) : null;
    $("#vincInfo").textContent = ag
      ? (ag.ficha && ag.ficha.token ? "usa o token da ficha" : "sem token na ficha — envie pela ficha do agente")
      : "";
  }
  $("#linhaCalib").hidden = !v.url;
  if (v.url && document.activeElement !== $("#calW") && document.activeElement !== $("#calH")) {
    $("#calW").value = v.w; $("#calH").value = v.h;
  }
  $("#imgNome").textContent = temEnvio ? (estado.imgNome[cen.id] || "imagem enviada")
    : cen.imagem ? "imagem do repositório"
    : (estado.imgNome[cen.id] ? "o envio se perdeu ao recarregar — mande de novo" : "");
  $("#ultDado").textContent = estado.dado ? estado.dado.rotulo + " \u2192 " + estado.dado.total : "";
  $("#aviso").value = estado.aviso || "";

  const caixa = $("#mapa");
  montarMapa(caixa, cen, {
    arrastavel: true,
    modoMestre: true,
    modoComodos,
    aoMudar: render,
    selecionado,
    aoSelecionar: id => { selecionado = id; render(); },
    aoTocarPonto: p => {
      painelPonto = painelPonto && painelPonto.n === p.n ? null : p;
      const i = estado.pontosAbertos.indexOf(p.n);
      if (i < 0) estado.pontosAbertos.push(p.n); else estado.pontosAbertos.splice(i, 1);
      transmitir(); render();
    }
  });
  ligarArraste(caixa, v, (id, pos) => {
    const t = tokensDaVista(v).find(t => t.id === id);
    if (!t) return;
    t.x = pos.x; t.y = pos.y;
    const b = [...caixa.querySelectorAll(".token")][tokensDaVista(v).indexOf(t)];
    if (b) { b.style.left = (pos.x / v.w * 100) + "%"; b.style.top = (pos.y / v.h * 100) + "%"; }
    const agora = Date.now();
    if (agora - ultimaTransmissao > 90) { ultimaTransmissao = agora; transmitir(); }
  }, () => { transmitir(); render(); });

  const det = $("#detPonto");
  det.innerHTML = "";
  if (painelPonto) {
    const d = el("div", "pidet");
    d.appendChild(el("h4", null, painelPonto.n + ". " + painelPonto.nome));
    d.appendChild(el("p", null, painelPonto.detalhe));
    det.appendChild(d);
  }

  const la = $("#listaAg");
  la.innerHTML = "";
  if (!agentes.length) la.appendChild(el("div", "vazio", "Nenhum agente no banco ainda."));
  else agentes.slice(0, 8).forEach(a => la.appendChild(fichaCurta(a)));

  const feed = $("#feed");
  feed.innerHTML = "";
  if (!rolagens.length) feed.appendChild(el("div", "vazio", "Sem rolagens registradas."));
  else rolagens.forEach(r => {
    const d = el("div", "rol");
    const m = el("div", "meta");
    m.appendChild(el("span", null, hora(r.criado_em)));
    m.appendChild(el("span", null, r.autor_nome || "—"));
    d.appendChild(m);
    d.appendChild(el("div", null, r.descricao || r.tipo || ""));
    feed.appendChild(d);
  });

  $("#dotVivo").className = "dot " + (modoAoVivo === "realtime" ? "viva" : "");
  $("#txtVivo").textContent = modoAoVivo === "realtime" ? "ao vivo" : "atualizando a cada 10s";
}

function hora(iso) {
  if (!iso) return "";
  const t = new Date(iso);
  return String(t.getHours()).padStart(2, "0") + ":" + String(t.getMinutes()).padStart(2, "0");
}

/* =======================================================================
   TELA DOS JOGADORES
   ======================================================================= */

function telaPalco() {
  ehMestre = false;
  document.body.classList.add("palco");
  $("#app").innerHTML = `
    <div class="palco-wrap" id="cena" hidden>
      <div class="palco-mapa">
        <div class="mapa" id="mapa"></div>
        <div class="legenda" id="legenda"></div>
        <div class="aviso" id="aviso" hidden></div>
      </div>
      <footer class="faixa" id="faixa"></footer>
    </div>
    <div class="espera" id="espera">
      <div class="selo">OP</div>
      <h1>Ordo Realitas</h1>
      <p>AGUARDE</p>
    </div>`;
  if (canal) canal.postMessage({ tipo: "pedido" });
  renderPalco();
}

let ultimoDadoId = null;
function mostrarDado() {
  const d = estado.dado;
  if (!d || d.id === ultimoDadoId) return;
  ultimoDadoId = d.id;
  const antigo = document.querySelector(".dadoTV");
  if (antigo) antigo.remove();
  const box = el("div", "dadoTV" + (d.critico ? " critico" : d.desastre ? " desastre" : ""));
  box.appendChild(el("div", "rot", d.rotulo));
  box.appendChild(el("div", "tot", String(d.total)));
  if (d.rolos && d.rolos.indexOf("\u00B7") >= 0) box.appendChild(el("div", "det", d.rolos));
  document.querySelector(".palco-mapa").appendChild(box);
  setTimeout(() => box.remove(), 7000);
}

function renderPalco() {
  const cen = cenarioAtual();
  $("#cena").hidden = !estado.revelado;
  $("#espera").hidden = !!estado.revelado;
  if (!estado.revelado) return;

  montarMapa($("#mapa"), cen, { somentePontosAbertos: true });
  mostrarDado();

  const lg = $("#legenda");
  lg.innerHTML = "";
  if (cen.cena) lg.appendChild(el("div", "cn", cen.cena.toUpperCase()));
  lg.appendChild(el("h2", null, cen.titulo));
  if (cen.subtitulo) lg.appendChild(el("p", null, cen.subtitulo));

  const av = $("#aviso");
  av.hidden = !estado.aviso;
  av.textContent = estado.aviso || "";

  const f = $("#faixa");
  f.innerHTML = "";
  agentes.slice(0, 4).forEach(a => {
    const d = el("div", "ag");
    const h = el("h4");
    h.appendChild(document.createTextNode(a.nome || "Agente"));
    h.appendChild(el("span", "nex", "NEX " + (a.nex || 0) + "%"));
    d.appendChild(h);
    d.appendChild(barrasDoAgente(a, true));
    f.appendChild(d);
  });
  const ult = rolagens[0];
  if (ult) {
    const r = el("div", "rodape");
    r.appendChild(el("div", "tt", "ÚLTIMA ROLAGEM"));
    r.appendChild(el("div", "ul", (ult.autor_nome ? ult.autor_nome + " — " : "") + (ult.descricao || "")));
    f.appendChild(r);
  }
}

/* =======================================================================
   TEMA E PARTIDA
   ======================================================================= */

function ligarTema() {
  const b = $("#btnTema");
  if (!b) return;
  let tema = "";
  try { tema = localStorage.getItem("op-tema") || ""; } catch (e) { }
  const aplicar = () => {
    if (tema) document.documentElement.setAttribute("data-theme", tema);
    else document.documentElement.removeAttribute("data-theme");
    b.textContent = tema === "dark" ? "Claro" : tema === "light" ? "Escuro" : "Tema";
  };
  b.onclick = () => {
    tema = tema === "" ? "light" : tema === "light" ? "dark" : "";
    try { localStorage.setItem("op-tema", tema); } catch (e) { }
    aplicar();
  };
  aplicar();
}

function aplicarTemaSalvo() {
  try {
    const t = localStorage.getItem("op-tema");
    if (t) document.documentElement.setAttribute("data-theme", t);
  } catch (e) { }
}

function avisoDeErro(msg, link) {
  $("#app").innerHTML = `<div class="wrap" style="grid-template-columns:1fr; max-width:560px; margin:60px auto">
    <div class="card"><div class="pad stack">
      <h2>${esc(msg)}</h2>
      ${link ? `<p class="hint">Abra o app das fichas, conecte e entre com sua conta. Depois volte para esta tela.</p>
      <div class="row"><a class="btn primary" href="/">Ir para as fichas</a></div>` : ""}
    </div></div></div>`;
}

const ehPalco = () => location.hash === "#/palco";

async function iniciar() {
  aplicarTemaSalvo();

  abrirCanal(() => { ehPalco() ? renderPalco() : render(); });
  addEventListener("hashchange", () => location.reload());

  const erro = conectar();
  if (erro === "sem-config") { avisoDeErro("Banco não configurado", true); return; }
  if (erro) { avisoDeErro(erro, true); return; }

  const { data } = await sb.auth.getSession();
  if (!data || !data.session) { avisoDeErro("Você precisa entrar com sua conta", true); return; }
  user = data.session.user;

  try {
    const r = await sb.from("perfis").select("id,nome,mestre").eq("id", user.id).maybeSingle();
    perfil = r.data || null;
  } catch (e) { }

  await Promise.all([carregarAgentes(), carregarRolagens()]);

  if (ehPalco()) telaPalco(); else telaMestre();
  ligarAoVivo(() => { ehPalco() ? renderPalco() : render(); });
}

iniciar();
