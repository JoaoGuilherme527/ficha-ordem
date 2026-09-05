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
/* Sobe quando o conjunto de tokens padrão das cenas muda. As peças que o
   mestre moveu ficam guardadas por cena no `localStorage`, então sem isso o
   estado antigo continuaria ressuscitando os tokens "Agentes" que saíram das
   cenas — e os monstros novos nunca apareceriam. Só `tokens` é descartado; o
   resto do estado (cena aberta, véus, calibração) sobrevive. */
const VERSAO_ESTADO = 3;

function estadoPadrao() {
  return { versao: VERSAO_ESTADO,
           cenarioId: CENARIOS[0].id, revelado: false, aviso: "",
           grade: true, rotulos: true, iluminacao: true,
           pontosAbertos: [], tokens: {}, ocultas: {}, imgNome: {},
           calib: {}, usarDesenho: {}, dado: null,
           veus: {}, revelacao: null };
}

function carregar() {
  try {
    const b = localStorage.getItem(CHAVE);
    if (!b) return estadoPadrao();
    const e = Object.assign(estadoPadrao(), JSON.parse(b));
    if (e.versao !== VERSAO_ESTADO) { e.tokens = {}; e.versao = VERSAO_ESTADO; }
    return e;
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

/* Véus: retângulos pretos que o mestre desenha por cima do cenário para
   esconder o cômodo ao lado. Guardados pela chave da vista, e não pela cena,
   porque as coordenadas do desenho e as da imagem são grades diferentes —
   um véu do desenho cairia no lugar errado sobre a foto. */
function veusDaVista(v) { return estado.veus[v.chave] || (estado.veus[v.chave] = []); }

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
  /* Peça marcada como `oculto` fica só do lado do mestre: ele posiciona o
     monstro na planta antes da cena começar e os jogadores não veem nada até
     ele mandar. É o que deixa o bicho papão já montado na fábrica sem
     entregar a surpresa na TV. A luz também não vaza — uma lanterna de peça
     oculta acenderia o mapa dos jogadores e denunciaria a posição. */
  const pecas = tokensDaVista(v).filter(t => o.modoMestre || !t.oculto);
  const luzes = v.luzes.concat(
    pecas.filter(t => t.luz).map(t => ({ x: t.x, y: t.y, r: 5.5, tom: "fria" })));
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
  pecas.forEach(t => {
    const b = el("button", "token");
    b.dataset.token = t.id;
    b.style.left = (t.x / v.w * 100) + "%";
    b.style.top = (t.y / v.h * 100) + "%";
    b.style.setProperty("--cor", corDoElemento(t.elemento));
    b.setAttribute("aria-label", t.nome);
    if (o.selecionado === t.id) b.classList.add("sel");
    if (t.oculto) b.classList.add("oculto");

    const ag = t.agenteId ? agentePorId(t.agenteId) : null;
    /* Duas fontes de arte para a mesma moldura: a ficha do agente e o
       catálogo do elenco. A peça do elenco respeita o `morto`, então trocar
       a versão é só virar o campo — a arte vem atrás. */
    const pc = elencoDaPeca(t);
    const foto = (ag && ag.ficha && ag.ficha.token) || (pc ? arteElenco(pc, t.morto) : null);
    if (pc) {
      b.classList.add("mst");
      if (t.morto) b.classList.add("morto");
      if (pc.tam && pc.tam !== 1) b.style.setProperty("--tam", pc.tam);
    }
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

  /* Véus por último, para ficarem por cima dos tokens: o pedido é que o
     bloco esconda o que estiver embaixo dele, peça inclusive. Só o mestre
     enxerga através (o CSS baixa a opacidade em `.mapa.editavel`), e só no
     modo de edição eles aceitam clique — fora dele o arrasto de token
     continua passando reto. */
  veusDaVista(v).forEach(q => {
    const d = el("div", "veu");
    d.style.left = (q.x / v.w * 100) + "%";
    d.style.top = (q.y / v.h * 100) + "%";
    d.style.width = (q.w / v.w * 100) + "%";
    d.style.height = (q.h / v.h * 100) + "%";
    d.dataset.veu = q.id;
    if (o.modoVeu) {
      d.classList.add("edit");
      if (o.veuSel === q.id) d.classList.add("sel");
      d.appendChild(el("span", "alca"));
    }
    caixa.appendChild(d);
  });
}

let arrastando = null;

/* Converte um evento de ponteiro para unidades de grid da vista. O retângulo
   medido é o do <svg>, não o da caixa: no palco a caixa pode sobrar dos lados
   do desenho, e medir a caixa jogaria tudo alguns metros para o lado. */
function posNoMapa(caixa, v, ev) {
  const svg = caixa.querySelector("svg");
  const r = (svg || caixa).getBoundingClientRect();
  return {
    x: clamp((ev.clientX - r.left) / r.width * v.w, 0, v.w),
    y: clamp((ev.clientY - r.top) / r.height * v.h, 0, v.h)
  };
}

function ligarArraste(caixa, v, aoMover, aoSoltar) {
  caixa.onpointerdown = null;
  caixa.onpointermove = ev => { if (arrastando) aoMover(arrastando, posNoMapa(caixa, v, ev)); };
  caixa.onpointerup = caixa.onpointercancel = () => {
    if (arrastando) { arrastando = null; aoSoltar && aoSoltar(); }
  };
}

/* A ação em curso mora fora da função de propósito: cada render() reatribui
   os handlers da caixa, e uma variável de closure seria zerada no meio do
   arrasto — o bloco largaria o ponteiro no primeiro repinte. */
let veuAcao = null;
const VEU_MIN = 0.6; // menor bloco que vale a pena guardar, em metros

function ligarVeus(caixa, v, aoMudar) {
  const lista = veusDaVista(v);
  const pinta = q => {
    const d = caixa.querySelector('[data-veu="' + q.id + '"]');
    if (!d) return;
    d.style.left = (q.x / v.w * 100) + "%";
    d.style.top = (q.y / v.h * 100) + "%";
    d.style.width = (q.w / v.w * 100) + "%";
    d.style.height = (q.h / v.h * 100) + "%";
  };

  caixa.onpointerdown = ev => {
    const cx = ev.target.closest ? ev.target.closest(".veu") : null;
    const naAlca = !!(ev.target.classList && ev.target.classList.contains("alca"));
    const p = posNoMapa(caixa, v, ev);
    /* Um bloco grande cobre o mapa embaixo dele, e sem escapatória não haveria
       como desenhar um segundo bloco dentro do primeiro. Shift força bloco
       novo mesmo com o ponteiro sobre um que já existe. */
    if (cx && !ev.shiftKey) {
      const q = lista.find(x => x.id === cx.dataset.veu);
      if (!q) return;
      veuSel = q.id;
      veuAcao = naAlca ? { modo: "tam", q } : { modo: "mover", q, dx: p.x - q.x, dy: p.y - q.y };
    } else {
      const q = { id: uid(), x: p.x, y: p.y, w: 0, h: 0 };
      lista.push(q);
      veuSel = q.id;
      veuAcao = { modo: "novo", q, x0: p.x, y0: p.y };
    }
    ev.preventDefault();
    caixa.setPointerCapture(ev.pointerId);
    aoMudar();
  };

  caixa.onpointermove = ev => {
    if (!veuAcao) return;
    const p = posNoMapa(caixa, v, ev), q = veuAcao.q;
    if (veuAcao.modo === "novo") {
      q.x = Math.min(veuAcao.x0, p.x); q.y = Math.min(veuAcao.y0, p.y);
      q.w = Math.abs(p.x - veuAcao.x0); q.h = Math.abs(p.y - veuAcao.y0);
    } else if (veuAcao.modo === "mover") {
      q.x = clamp(p.x - veuAcao.dx, 0, Math.max(0, v.w - q.w));
      q.y = clamp(p.y - veuAcao.dy, 0, Math.max(0, v.h - q.h));
    } else {
      q.w = clamp(p.x - q.x, VEU_MIN, v.w - q.x);
      q.h = clamp(p.y - q.y, VEU_MIN, v.h - q.y);
    }
    pinta(q);
    const agora = Date.now();
    if (agora - ultimaTransmissao > 90) { ultimaTransmissao = agora; transmitir(); }
  };

  caixa.onpointerup = caixa.onpointercancel = () => {
    if (!veuAcao) return;
    const q = veuAcao.q;
    /* Um clique seco no vazio nasce com 0×0. Em vez de deixar um bloco
       invisível preso no mapa, ele é descartado na soltura. */
    if (q.w < VEU_MIN || q.h < VEU_MIN) {
      estado.veus[v.chave] = lista.filter(x => x.id !== q.id);
      if (veuSel === q.id) veuSel = null;
    }
    veuAcao = null;
    transmitir(); aoMudar();
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
            <button class="btn ghost sm" id="btnVeus">Blocos</button>
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
              <button class="btn sm" id="btnOculto">Esconder na TV</button>
              <button class="btn sm" id="btnLanterna">Lanterna</button>
              <button class="btn sm" id="btnAgentes">Trazer agentes</button>
              <button class="btn sm" id="btnRepor">Repor posições</button>
              <button class="btn ghost sm" id="btnReporTudo">Repor todas as cenas</button>
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
            <div class="row" id="linhaVeu" hidden>
              <span class="hint">Arraste no vazio para criar · no bloco para mover · na alça para
                redimensionar · Shift cria um bloco dentro de outro. Ficam gravados na cena.</span>
              <div class="grow"></div>
              <button class="btn sm" id="btnVeuTira">Remover bloco</button>
              <button class="btn ghost sm" id="btnVeuLimpa">Limpar todos</button>
            </div>
            <div class="row" id="linhaVinc" hidden>
              <span class="hint">Token selecionado:</span>
              <select id="selAgente" style="max-width:210px"></select>
              <span class="hint" id="vincInfo"></span>
            </div>
            <div class="row" id="linhaMonstro" hidden>
              <span class="hint" id="mstSelNome">Monstro:</span>
              <button class="btn sm" id="btnMorto">Versão morta</button>
              <span class="hint" id="mstSelInfo"></span>
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
          <header><h3>Monstros</h3><div class="grow"></div><span class="hint" id="mstStatus"></span></header>
          <div class="pad stack">
            <div class="row">
              <select id="selMonstro" style="max-width:220px"></select>
              <button class="btn sm" id="btnPorMonstro">Colocar em cena</button>
            </div>
            <div class="row">
              <button class="btn sm" id="btnMostrarMonstro">Mostrar na TV</button>
              <button class="btn ghost sm" id="btnPararMonstro">Voltar para a cena</button>
            </div>
            <p class="hint" id="mstNota"></p>
          </div>
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
  /* Os dois modos de edição do mapa mordem o mesmo ponteiro: um clica em
     cômodo, o outro desenha bloco. Ligar um desliga o outro. */
  $("#btnComodos").onclick = () => {
    modoComodos = !modoComodos;
    if (modoComodos) modoVeu = false;
    render();
  };
  $("#btnVeus").onclick = () => {
    modoVeu = !modoVeu;
    if (modoVeu) { modoComodos = false; selecionado = null; } else veuSel = null;
    render();
  };
  $("#btnVeuTira").onclick = () => {
    if (!veuSel) return;
    const v = vistaAtual();
    estado.veus[v.chave] = veusDaVista(v).filter(q => q.id !== veuSel);
    veuSel = null; transmitir(); render();
  };
  $("#btnVeuLimpa").onclick = () => {
    const v = vistaAtual();
    if (!veusDaVista(v).length) return;
    estado.veus[v.chave] = [];
    veuSel = null; transmitir(); render();
  };

  $("#btnPorMonstro").onclick = () => {
    const m = elencoPorId($("#selMonstro").value);
    if (!m) return;
    const v = vistaAtual();
    const novo = { id: uid(), arte: m.id, nome: m.nome, elemento: m.elemento || "neutro",
                   x: v.w / 2, y: v.h / 2 };
    tokensDaVista(v).push(novo);
    selecionado = novo.id;
    transmitir(); render();
  };
  $("#btnMostrarMonstro").onclick = () => {
    const id = $("#selMonstro").value;
    if (!id) return;
    estado.revelacao = estado.revelacao === id ? null : id;
    transmitir(); render();
  };
  $("#btnPararMonstro").onclick = () => { estado.revelacao = null; transmitir(); render(); };
  $("#btnMorto").onclick = () => {
    if (!selecionado) return;
    const t = tokensDaVista(vistaAtual()).find(t => t.id === selecionado);
    if (!t || !elencoDaPeca(t)) return;
    t.morto = !t.morto;
    transmitir(); render();
  };
  $("#btnLanterna").onclick = () => {
    if (!selecionado) return;
    const t = tokensDaVista(vistaAtual()).find(t => t.id === selecionado);
    if (t) { t.luz = !t.luz; transmitir(); render(); }
  };
  $("#btnOculto").onclick = () => {
    if (!selecionado) return;
    const t = tokensDaVista(vistaAtual()).find(t => t.id === selecionado);
    if (t) { t.oculto = !t.oculto; transmitir(); render(); }
  };

  $("#btnVista").onclick = () => {
    const id = cenarioAtual().id;
    estado.usarDesenho[id] = !estado.usarDesenho[id];
    selecionado = null; veuSel = null; transmitir(); render();
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
  /* Escotilha de emergência. As peças ficam guardadas por vista no
     `localStorage`, então quando o repositório ganha arte nova ou perde um
     token as cenas que o mestre já abriu continuam com a cópia velha. Isto
     joga fora a cópia de todas as cenas de uma vez e remonta pelo
     `cenarios.js`. Só as peças: véus, cômodos e calibração ficam. */
  $("#btnReporTudo").onclick = () => {
    if (!confirm("Remontar as peças de todas as cenas pelo repositório?\nBlocos, cômodos escondidos e calibração continuam como estão.")) return;
    estado.tokens = {};
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
let modoVeu = false;
let veuSel = null;
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
      selecionado = null; painelPonto = null; veuSel = null;
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
  $("#btnVeus").classList.toggle("on", modoVeu);
  $("#linhaVeu").hidden = !modoVeu;
  if (modoVeu) {
    $("#btnVeuTira").disabled = !veuSel;
    $("#btnVeuLimpa").disabled = !veusDaVista(v).length;
  }

  /* Catálogo do elenco. O `select` é remontado a cada render porque a marca
     "(desta cena)" depende da cena aberta; a escolha do mestre é preservada,
     e o padrão é a primeira peça da cena. */
  const selM = $("#selMonstro");
  const daCena = elencoDaCena(cen.id).map(m => m.id);
  const antes = selM.value;
  selM.innerHTML = "";
  [["Monstros", MONSTROS], ["Pessoas", PESSOAS]].forEach(([rot, lista]) => {
    if (!lista.length) return;
    const g = el("optgroup");
    g.label = rot;
    lista.forEach(m => g.appendChild(
      new Option(m.nome + (daCena.indexOf(m.id) >= 0 ? " (desta cena)" : ""), m.id)));
    selM.appendChild(g);
  });
  selM.value = ELENCO.some(m => m.id === antes) ? antes : (daCena[0] || ELENCO[0].id);
  const mSel = elencoPorId(selM.value);
  $("#mstNota").textContent = mSel
    ? (mSel.nota || "") + (mSel.normal ? "" : " A revelação usa o próprio token — não há arte “-normal” na pasta.")
    : "";
  const mRev = estado.revelacao ? elencoPorId(estado.revelacao) : null;
  $("#mstStatus").textContent = mRev ? "na TV: " + mRev.nome : "";
  $("#btnMostrarMonstro").classList.toggle("on", !!mRev && mRev.id === selM.value);
  $("#btnPararMonstro").disabled = !mRev;

  const temEnvio = !!imagensMem[cen.id];
  const temAlguma = temEnvio || !!cen.imagem;
  $("#btnImagemTira").hidden = !temEnvio;
  $("#btnVista").hidden = !temAlguma;
  $("#btnVista").textContent = estado.usarDesenho[cen.id] ? "Ver imagem" : "Ver desenho";
  $("#btnVista").classList.toggle("on", !estado.usarDesenho[cen.id]);
  const tSel = selecionado ? tokensDaVista(v).find(t => t.id === selecionado) : null;
  const bo = $("#btnOculto");
  bo.disabled = !tSel;
  bo.classList.toggle("on", !!(tSel && tSel.oculto));
  bo.textContent = tSel && tSel.oculto ? "Mostrar na TV" : "Esconder na TV";
  $("#btnLanterna").disabled = !tSel;
  $("#btnRemover").disabled = !tSel;
  const mTok = elencoDaPeca(tSel);
  $("#linhaMonstro").hidden = !mTok;
  if (mTok) {
    $("#mstSelNome").textContent = mTok.nome + ":";
    $("#btnMorto").disabled = !temMorto(mTok);
    $("#btnMorto").classList.toggle("on", !!tSel.morto);
    $("#mstSelInfo").textContent = temMorto(mTok)
      ? (tSel.morto ? "mostrando a versão morta" : "")
      : "sem arte “-morto” na pasta";
  }
  /* Vincular a agente só faz sentido em peça solta: um monstro não é ficha. */
  $("#linhaVinc").hidden = !tSel || !!mTok;
  if (tSel && !mTok) {
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
    /* No modo de blocos o ponteiro é todo do véu: token arrastável junto
       roubaria o pointerdown e o mestre não conseguiria desenhar sobre uma
       peça. */
    arrastavel: !modoVeu,
    modoMestre: true,
    modoComodos,
    modoVeu,
    veuSel,
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
  caixa.classList.toggle("veuando", modoVeu);
  if (modoVeu) ligarVeus(caixa, v, render);
  else ligarArraste(caixa, v, (id, pos) => {
    const t = tokensDaVista(v).find(t => t.id === id);
    if (!t) return;
    t.x = pos.x; t.y = pos.y;
    /* Procura pelo id, não pela posição na lista: peça oculta não é desenhada
       no palco, então índice de lista e índice de botão deixaram de casar. */
    const b = caixa.querySelector('[data-token="' + id + '"]');
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
    </div>
    <div class="revelacao" id="revelacao" hidden><img id="revImg" alt=""></div>`;
  if (canal) canal.postMessage({ tipo: "pedido" });
  ligarZoomPalco();
  renderPalco();
}

/* ---------- zoom da TV ----------
   A roda do mouse aproxima o mapa dos jogadores no ponto onde o cursor está,
   que é como o mestre mostra um canto da planta sem trocar de cena. O estado
   fica aqui fora porque `montarMapa()` só troca o miolo da caixa: o elemento
   `#mapa` sobrevive aos repintes e o transform inline junto com ele.
   É zoom local desta janela — não entra no estado transmitido, já que quem
   gira a roda está sentado nesta tela. */
const ZOOM_MIN = 1, ZOOM_MAX = 6;
let zoom = 1, zoomX = 0, zoomY = 0, zoomCena = null;

function aplicarZoom() {
  const m = $("#mapa");
  if (!m) return;
  m.style.transform = zoom === 1 ? "" : "translate(" + zoomX + "px," + zoomY + "px) scale(" + zoom + ")";
}

function zerarZoom() { zoom = 1; zoomX = zoomY = 0; }

/* Segura o mapa dentro da moldura: sem isso dá para empurrar a cena inteira
   para fora da tela e sobrar só o fundo preto. O retângulo medido já vem
   ampliado, então a largura original é `r.width / zoom`. */
function limitarZoom() {
  const m = $("#mapa");
  if (!m) return;
  if (zoom <= ZOOM_MIN) { zerarZoom(); return; }
  const r = m.getBoundingClientRect();
  zoomX = clamp(zoomX, -(r.width - r.width / zoom) / 2, (r.width - r.width / zoom) / 2);
  zoomY = clamp(zoomY, -(r.height - r.height / zoom) / 2, (r.height - r.height / zoom) / 2);
}

function ligarZoomPalco() {
  const area = document.querySelector(".palco-mapa");
  const m = $("#mapa");
  if (!area || !m) return;

  area.addEventListener("wheel", ev => {
    ev.preventDefault();
    /* Um passo de roda vem em pixels, em linhas ou em páginas conforme o
       mouse e o navegador; sem normalizar, o mesmo giro daria saltos bem
       diferentes entre uma máquina e outra. */
    const passo = ev.deltaMode === 1 ? 16 : ev.deltaMode === 2 ? 400 : 1;
    const k = clamp(zoom * Math.exp(-ev.deltaY * passo * 0.0018), ZOOM_MIN, ZOOM_MAX);
    if (k === zoom) return;
    /* O centro sem deslocamento: o retângulo medido já está deslocado por
       (zoomX, zoomY), então descontá-los devolve a origem do transform. Daí
       sai o deslocamento novo que mantém parado o ponto sob o cursor. */
    const r = m.getBoundingClientRect();
    const ex = ev.clientX - (r.left + r.width / 2 - zoomX);
    const ey = ev.clientY - (r.top + r.height / 2 - zoomY);
    const f = k / zoom;
    zoomX = ex - f * (ex - zoomX);
    zoomY = ey - f * (ey - zoomY);
    zoom = k;
    aplicarZoom(); limitarZoom(); aplicarZoom();
  }, { passive: false });

  // duplo clique volta a cena inteira, que é a saída rápida do zoom
  area.addEventListener("dblclick", () => { zerarZoom(); aplicarZoom(); });
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

  /* Revelação de monstro: passa por cima de tudo. Sem legenda, sem faixa de
     agentes, sem aviso, sem mapa — só a arte no escuro. Vale mesmo com a cena
     ainda oculta, que é justamente quando o susto funciona. */
  const rev = estado.revelacao ? elencoPorId(estado.revelacao) : null;
  const cxRev = $("#revelacao");
  cxRev.hidden = !rev;
  if (rev) {
    const arte = arteRevelacao(rev);
    const img = $("#revImg");
    if (img.getAttribute("src") !== arte) img.setAttribute("src", arte);
    img.alt = rev.nome;
    $("#cena").hidden = true;
    $("#espera").hidden = true;
    return;
  }

  $("#cena").hidden = !estado.revelado;
  $("#espera").hidden = !!estado.revelado;
  if (!estado.revelado) return;

  /* Trocou de cena, some o zoom: entrar num cenário novo já ampliado num
     canto qualquer só confunde quem está olhando a TV. */
  if (zoomCena !== cen.id) { zoomCena = cen.id; zerarZoom(); }
  montarMapa($("#mapa"), cen, { somentePontosAbertos: true });
  aplicarZoom();
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
