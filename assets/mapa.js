/* =========================================================================
   MAPA — desenho dos cenários em SVG
   Estilo battlemap visto de cima: piso com textura, paredes com espessura e
   sombra, móveis desenhados peça por peça. Nada de imagem externa — tudo é
   gerado, então escala sem perder nitidez em qualquer TV.

   O tipo de cada móvel é deduzido do nome (ver TIPOS), ou declarado
   explicitamente com `tipo:` na forma.
   ========================================================================= */

const U = 10; // pixels por unidade de grid (1 unidade ≈ 1 metro)

const escT = s => String(s == null ? "" : s)
  .replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------------------------------------------------------------- paleta */
const P = {
  parede: "#3B342C", paredeTopo: "#5A5147", paredeSombra: "#221E19",
  madeira: "#6E4C31", madeiraClara: "#8A6242", madeiraEscura: "#4E351F",
  metal: "#7C8288", metalClaro: "#9BA1A6", metalEscuro: "#565C61",
  tecido: "#8E9E8A", tecidoEscuro: "#5F6E5D",
  branco: "#D9D6CC", brancoSujo: "#C2BEB0",
  vidro: "#7E9AA0", preto: "#1A1815",
  sangue: "#7E2B2E", ouro: "#C79A2E", chama: "#E8A33D"
};

/* ------------------------------------------------------------- utilitário */
const rect = (x, y, w, h, fill, st, rx) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}"${rx ? ` rx="${rx}"` : ""} fill="${fill}"${st ? ` stroke="${st}" stroke-width=".7"` : ""}/>`;
const linha = (x1, y1, x2, y2, cor, w, op) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${cor}" stroke-width="${w || .7}"${op ? ` opacity="${op}"` : ""}/>`;
const circ = (cx, cy, r, fill, st) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${st ? ` stroke="${st}" stroke-width=".7"` : ""}/>`;

/* ------------------------------------------------------------- definições */
function defsMapa() {
  return `<defs>
  <filter id="fSombra" x="-30%" y="-30%" width="180%" height="180%">
    <feDropShadow dx="1.2" dy="2.2" stdDeviation="1.4" flood-color="#0B0906" flood-opacity=".45"/>
  </filter>
  <filter id="fSombraLeve" x="-30%" y="-30%" width="180%" height="180%">
    <feDropShadow dx=".8" dy="1.4" stdDeviation=".9" flood-color="#0B0906" flood-opacity=".38"/>
  </filter>

  <!-- assoalho de madeira: tábuas com emendas alternadas -->
  <pattern id="fMadeira" width="90" height="24" patternUnits="userSpaceOnUse">
    <rect width="90" height="24" fill="#6B4A2E"/>
    <rect y="0"  width="90" height="8" fill="#734F31"/>
    <rect y="8"  width="90" height="8" fill="#664529"/>
    <rect y="16" width="90" height="8" fill="#6F4C2E"/>
    ${linha(0, 8, 90, 8, "#412C1A", .9)}${linha(0, 16, 90, 16, "#412C1A", .9)}${linha(0, 24, 90, 24, "#412C1A", .9)}
    ${linha(0, 0, 0, 8, "#412C1A", .9)}${linha(34, 0, 34, 8, "#412C1A", .9)}${linha(66, 0, 66, 8, "#412C1A", .9)}
    ${linha(18, 8, 18, 16, "#412C1A", .9)}${linha(52, 8, 52, 16, "#412C1A", .9)}
    ${linha(8, 16, 8, 24, "#412C1A", .9)}${linha(46, 16, 46, 24, "#412C1A", .9)}${linha(78, 16, 78, 24, "#412C1A", .9)}
    ${linha(4, 3, 30, 3.6, "#7C5637", .7, .55)}${linha(22, 11, 48, 11.5, "#7C5637", .7, .5)}${linha(52, 20, 76, 20.4, "#7C5637", .7, .5)}
  </pattern>

  <!-- piso frio: ladrilho quadrado com rejunte -->
  <pattern id="fFrio" width="40" height="40" patternUnits="userSpaceOnUse">
    <rect width="40" height="40" fill="#8E8B80"/>
    <rect x="0"  y="0"  width="19.2" height="19.2" fill="#A6A296"/>
    <rect x="20.8" y="0"  width="19.2" height="19.2" fill="#9B9789"/>
    <rect x="0"  y="20.8" width="19.2" height="19.2" fill="#989487"/>
    <rect x="20.8" y="20.8" width="19.2" height="19.2" fill="#A9A599"/>
    <ellipse cx="9" cy="30" rx="8" ry="5" fill="#8B8779" opacity=".5"/>
    <ellipse cx="31" cy="8" rx="7" ry="5" fill="#8E8A7C" opacity=".45"/>
    ${linha(0, 20, 40, 20, "#7C7970", 1.2)}${linha(20, 0, 20, 40, "#7C7970", 1.2)}
    ${linha(0, 0, 40, 0, "#7C7970", 1.2)}${linha(0, 0, 0, 40, "#7C7970", 1.2)}
  </pattern>

  <!-- concreto: placas com juntas e manchas de óleo -->
  <pattern id="fConcreto" width="80" height="80" patternUnits="userSpaceOnUse">
    <rect width="80" height="80" fill="#8A877F"/>
    <ellipse cx="22" cy="26" rx="18" ry="12" fill="#84817A" opacity=".7"/>
    <ellipse cx="58" cy="60" rx="20" ry="13" fill="#807D76" opacity=".65"/>
    <ellipse cx="64" cy="18" rx="9" ry="6" fill="#726F69" opacity=".5"/>
    ${linha(0, 40, 80, 40, "#75726B", 1.4)}${linha(40, 0, 40, 80, "#75726B", 1.4)}
    ${linha(0, 0, 80, 0, "#75726B", 1.4)}${linha(0, 0, 0, 80, "#75726B", 1.4)}
    ${circ(12, 62, 1.1, "#6E6B65")}${circ(70, 34, .9, "#6E6B65")}
  </pattern>

  <!-- pedra: blocos irregulares -->
  <pattern id="fPedra" width="60" height="34" patternUnits="userSpaceOnUse">
    <rect width="60" height="34" fill="#5D5A53"/>
    <rect x="1"  y="1"  width="24" height="14" fill="#67645C" rx="1.5"/>
    <rect x="27" y="1"  width="15" height="14" fill="#615E57" rx="1.5"/>
    <rect x="44" y="1"  width="15" height="14" fill="#6A675F" rx="1.5"/>
    <rect x="1"  y="18" width="15" height="15" fill="#625F58" rx="1.5"/>
    <rect x="18" y="18" width="24" height="15" fill="#68655D" rx="1.5"/>
    <rect x="44" y="18" width="15" height="15" fill="#5E5B54" rx="1.5"/>
  </pattern>

  <!-- concreto queimado: manchas de fuligem -->
  <pattern id="fFuligem" width="187" height="151" patternUnits="userSpaceOnUse">
    <ellipse cx="40" cy="30" rx="46" ry="26" fill="#282521" opacity=".45"/>
    <ellipse cx="150" cy="96" rx="52" ry="30" fill="#2B2823" opacity=".4"/>
    <ellipse cx="96" cy="132" rx="38" ry="20" fill="#413B33" opacity=".3"/>
    <ellipse cx="172" cy="22" rx="30" ry="18" fill="#3F3931" opacity=".28"/>
  </pattern>
  <pattern id="fQueimado" width="56" height="56" patternUnits="userSpaceOnUse">
    <rect width="56" height="56" fill="#39352F"/>
    <ellipse cx="14" cy="16" rx="13" ry="9" fill="#2C2924" opacity=".8"/>
    <ellipse cx="42" cy="38" rx="15" ry="10" fill="#302C27" opacity=".75"/>
    <ellipse cx="46" cy="10" rx="8" ry="6" fill="#413C35" opacity=".6"/>
    <ellipse cx="10" cy="44" rx="9" ry="6" fill="#443E37" opacity=".5"/>
    ${linha(0, 28, 56, 28, "#2A2722", .8, .5)}${linha(28, 0, 28, 56, "#2A2722", .8, .4)}
  </pattern>

  <!-- áreas externas -->
  <pattern id="gGrama" width="34" height="34" patternUnits="userSpaceOnUse">
    <rect width="34" height="34" fill="#4C6238"/>
    <ellipse cx="9" cy="11" rx="10" ry="7" fill="#546B3E" opacity=".85"/>
    <ellipse cx="26" cy="26" rx="11" ry="8" fill="#455A33" opacity=".85"/>
    <path d="M5 20 l1.5 -5 M8 21 l.6 -6 M11 20 l2 -5" stroke="#5E7846" stroke-width="1.1" fill="none"/>
    <path d="M20 9 l1.5 -5 M23 10 l.6 -6 M26 9 l2 -5" stroke="#5E7846" stroke-width="1.1" fill="none"/>
    <path d="M25 33 l1.2 -5 M29 32 l.8 -5.5" stroke="#617C48" stroke-width="1.1" fill="none"/>
  </pattern>
  <pattern id="gTerra" width="30" height="30" patternUnits="userSpaceOnUse">
    <rect width="30" height="30" fill="#6A5842"/>
    <ellipse cx="8" cy="9" rx="8" ry="6" fill="#71604A" opacity=".8"/>
    <ellipse cx="22" cy="22" rx="9" ry="6" fill="#63523E" opacity=".8"/>
    ${circ(14, 6, 1.1, "#544636")}${circ(25, 12, .9, "#544636")}${circ(6, 24, 1, "#544636")}
  </pattern>
  <pattern id="gAsfalto" width="26" height="26" patternUnits="userSpaceOnUse">
    <rect width="26" height="26" fill="#3F4144"/>
    ${circ(5, 7, .9, "#4A4D50")}${circ(18, 4, .7, "#494C4F")}${circ(12, 17, 1, "#484B4E")}${circ(22, 21, .8, "#4A4D50")}
  </pattern>
  <pattern id="gCinza" width="30" height="30" patternUnits="userSpaceOnUse">
    <rect width="30" height="30" fill="#514C45"/>
    <ellipse cx="10" cy="12" rx="10" ry="7" fill="#585349" opacity=".7"/>
    <ellipse cx="24" cy="25" rx="8" ry="6" fill="#4A453F" opacity=".7"/>
    ${circ(20, 6, 1.2, "#615B52")}${circ(6, 26, 1, "#615B52")}
  </pattern>

  <pattern id="gEscombro" width="14" height="14" patternUnits="userSpaceOnUse">
    <rect width="14" height="14" fill="#4A443C"/>
    <path d="M1 5 l4 -4 4 4 -4 4z" fill="#5A534A"/>
    <path d="M8 12 l3.5 -3.5 2.5 3.5z" fill="#544D45"/>
    ${circ(12, 3, 1.4, "#5F584E")}${circ(3, 11, 1.2, "#5F584E")}
  </pattern>

  <radialGradient id="gFuro">
    <stop offset="0" stop-color="#000" stop-opacity="1"/>
    <stop offset=".5" stop-color="#000" stop-opacity=".9"/>
    <stop offset="1" stop-color="#000" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="gQuente">
    <stop offset="0" stop-color="#FFB347" stop-opacity=".42"/>
    <stop offset=".55" stop-color="#E8933D" stop-opacity=".16"/>
    <stop offset="1" stop-color="#E8933D" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="gFria">
    <stop offset="0" stop-color="#BFD9E8" stop-opacity=".2"/>
    <stop offset="1" stop-color="#BFD9E8" stop-opacity="0"/>
  </radialGradient>
  <pattern id="grade" width="${U}" height="${U}" patternUnits="userSpaceOnUse">
    <path d="M${U} 0 L0 0 0 ${U}" fill="none" stroke="#000" stroke-width=".7" opacity=".22"/>
  </pattern>
</defs>`;
}

const TEXTURA_EXT = { grama: "url(#gGrama)", cinza: "url(#gCinza)", asfalto: "url(#gAsfalto)", terra: "url(#gTerra)" };
const TEXTURA_PISO = { madeira: "url(#fMadeira)", frio: "url(#fFrio)", queimado: "url(#fQueimado)",
                       pedra: "url(#fPedra)", concreto: "url(#fConcreto)" };

/* ==========================================================================
   MÓVEIS — cada tipo é desenhado como o objeto que representa
   ========================================================================== */

const TIPOS = [
  [/maca/i, "maca"],
  [/cama|colch/i, "cama"],
  [/sof[áa]/i, "sofa"],
  [/poltrona/i, "poltrona"],
  [/cadeira/i, "cadeira"],
  [/geladeira/i, "geladeira"],
  [/fog[ãa]o/i, "fogao"],
  [/pia|tanque/i, "pia"],
  [/privada|vaso/i, "privada"],
  [/arm[áa]rio/i, "armario"],
  [/estante|prateleira|arquivos|livros/i, "estante"],
  [/^tv$|televis/i, "tv"],
  [/balc[ãa]o|bancada/i, "balcao"],
  [/mesa/i, "mesa"],
  [/maquin[áa]rio|esteira|empilhadeira/i, "maquina"],
  [/gaiola/i, "gaiola"],
  [/van|carro/i, "veiculo"],
  [/ca[çc]amba|lixo|cont[êe]iner/i, "cacamba"],
  [/pallets|caixas|engradado|brinquedos|pap[ée]is|m[úu]sica/i, "caixa"]
];

function tipoDoMovel(f) {
  if (f.tipo) return f.tipo;
  const n = f.nome || "";
  for (const [re, t] of TIPOS) if (re.test(n)) return t;
  return "generico";
}

function movelSVG(f) {
  const x = f.x * U, y = f.y * U, w = f.w * U, h = f.h * U;
  const t = tipoDoMovel(f);
  const deitado = w >= h;               // orientação da peça
  const c = (a, b) => (deitado ? a : b);
  let g = "";

  switch (t) {

    case "cama": {
      g += rect(x, y, w, h, P.madeira, P.madeiraEscura, 1.5);
      const m = 1.6;
      g += rect(x + m, y + m, w - m * 2, h - m * 2, P.brancoSujo, "#A7A395", 1);
      // cobertor cobrindo ~60% do lado dos pés
      if (deitado) {
        g += rect(x + w * .38, y + m, w * .62 - m, h - m * 2, "#6F4A50", "#563A3F", 1);
        g += rect(x + m + 1, y + h * .22, w * .2, h * .56, "#EAE6DA", "#B9B4A6", 1.2); // travesseiro
        g += linha(x + w * .55, y + m + 1, x + w * .55, y + h - m - 1, "#5A3D42", .8);
      } else {
        g += rect(x + m, y + h * .38, w - m * 2, h * .62 - m, "#6F4A50", "#563A3F", 1);
        g += rect(x + w * .22, y + m + 1, w * .56, h * .2, "#EAE6DA", "#B9B4A6", 1.2);
        g += linha(x + m + 1, y + h * .55, x + w - m - 1, y + h * .55, "#5A3D42", .8);
      }
      return g;
    }

    case "maca": {
      g += rect(x, y, w, h, P.metalClaro, "#6E747A", 1.4);
      const m = 1.4;
      g += rect(x + m, y + m, w - m * 2, h - m * 2, "#CFD4D2", "#9AA0A0", 1);
      g += deitado ? rect(x + m + 1, y + h * .2, w * .17, h * .6, "#EDEAE0", "#B7B3A6", 1.2)
                   : rect(x + w * .2, y + m + 1, w * .6, h * .17, "#EDEAE0", "#B7B3A6", 1.2);
      g += deitado ? linha(x + w * .62, y + m, x + w * .62, y + h - m, "#A8AEAC", .9)
                   : linha(x + m, y + h * .62, x + w - m, y + h * .62, "#A8AEAC", .9);
      return g;
    }

    case "sofa": {
      g += rect(x, y, w, h, P.tecidoEscuro, "#4A5748", 2);
      const e = 2.4;
      if (deitado) {
        g += rect(x + e, y + e, w - e * 2, h - e * 1.4, P.tecido, "#586A56", 1.6);
        const n = Math.max(2, Math.round(w / 22));
        for (let i = 1; i < n; i++) g += linha(x + (w / n) * i, y + e, x + (w / n) * i, y + h - e * .4, "#5E7059", .9);
      } else {
        g += rect(x + e, y + e, w - e * 1.4, h - e * 2, P.tecido, "#586A56", 1.6);
        const n = Math.max(2, Math.round(h / 22));
        for (let i = 1; i < n; i++) g += linha(x + e, y + (h / n) * i, x + w - e * .4, y + (h / n) * i, "#5E7059", .9);
      }
      return g;
    }

    case "poltrona":
      g += rect(x, y, w, h, P.tecidoEscuro, "#4A5748", 2.4);
      g += rect(x + 2, y + 2, w - 4, h - 3, P.tecido, "#586A56", 1.8);
      return g;

    case "cadeira":
      g += rect(x + w * .12, y + h * .12, w * .76, h * .76, P.madeira, P.madeiraEscura, 1.2);
      g += rect(x, y, w, h * .2, P.madeiraEscura, null, 1);
      return g;

    case "mesa": {
      g += rect(x, y, w, h, P.madeira, P.madeiraEscura, 1.2);
      const passos = Math.max(2, Math.round(c(w, h) / 12));
      for (let i = 1; i < passos; i++) {
        const p = c(x + (w / passos) * i, y + (h / passos) * i);
        g += c(linha(p, y + 1.5, p, y + h - 1.5, P.madeiraEscura, .7, .7),
               linha(x + 1.5, p, x + w - 1.5, p, P.madeiraEscura, .7, .7));
      }
      g += rect(x + 1, y + 1, w - 2, h - 2, "none", "#8B6444");
      return g;
    }

    case "balcao":
      g += rect(x, y, w, h, "#59473A", "#3E3128", 1);
      g += rect(x + .8, y + .8, w - 1.6, h - 1.6, "#6D5946", "#4B3C31", 1);
      return g;

    case "geladeira":
      g += rect(x, y, w, h, P.branco, "#9C988B", 1.6);
      g += linha(x + 1.5, y + h * .42, x + w - 1.5, y + h * .42, "#9C988B", .9);
      g += rect(x + w - 3.6, y + h * .12, 1.8, h * .22, "#A8A497", null, .8);
      return g;

    case "fogao": {
      g += rect(x, y, w, h, "#4E4B46", "#35322E", 1.4);
      const rx = Math.min(w, h) * .19;
      [[.3, .3], [.7, .3], [.3, .7], [.7, .7]].forEach(([a, b]) => {
        g += circ(x + w * a, y + h * b, rx, "#2E2C29", "#6A6660");
        g += circ(x + w * a, y + h * b, rx * .45, "#3D3A36");
      });
      return g;
    }

    case "pia": {
      g += rect(x, y, w, h, P.brancoSujo, "#9C988B", 1.2);
      const bw = w * (deitado ? .5 : .68), bh = h * (deitado ? .68 : .5);
      const bx = x + (w - bw) / 2, by = y + (h - bh) / 2;
      g += rect(bx, by, bw, bh, "#AEAA9C", "#8E8A7E", 1.4);
      g += circ(bx + bw / 2, by + bh / 2, Math.min(bw, bh) * .16, "#7E7A6F");
      g += rect(c(x + w * .5 - 1, x + 1.2), c(y + 1.2, y + h * .5 - 1), c(2, 3.4), c(3.4, 2), "#9AA1A6", null, .8);
      return g;
    }

    case "privada":
      g += `<ellipse cx="${x + w / 2}" cy="${y + h * .58}" rx="${w * .42}" ry="${h * .38}" fill="${P.branco}" stroke="#9C988B" stroke-width=".7"/>`;
      g += `<ellipse cx="${x + w / 2}" cy="${y + h * .58}" rx="${w * .24}" ry="${h * .22}" fill="#A9A598"/>`;
      g += rect(x + w * .22, y, w * .56, h * .26, P.branco, "#9C988B", 1);
      return g;

    case "armario":
      g += rect(x, y, w, h, P.madeira, P.madeiraEscura, 1);
      g += c(linha(x + w / 2, y + 1, x + w / 2, y + h - 1, P.madeiraEscura, .9),
             linha(x + 1, y + h / 2, x + w - 1, y + h / 2, P.madeiraEscura, .9));
      g += circ(x + w / 2 - c(2, 0), y + h / 2 - c(0, 2), .9, "#C9A96E");
      g += circ(x + w / 2 + c(2, 0), y + h / 2 + c(0, 2), .9, "#C9A96E");
      return g;

    case "estante": {
      g += rect(x, y, w, h, P.madeiraEscura, "#382514", 1);
      const n = Math.max(2, Math.round(c(w, h) / 14));
      const cores = ["#7C5A3E", "#8C6B49", "#6B4B33", "#94734F"];
      for (let i = 0; i < n; i++) {
        const a = c(x + (w / n) * i + 1, x + 1.4), b = c(y + 1.4, y + (h / n) * i + 1);
        const aw = c(w / n - 2, w - 2.8), ah = c(h - 2.8, h / n - 2);
        g += rect(a, b, aw, ah, cores[i % 4], "#3E2A18", .6);
      }
      return g;
    }

    case "tv":
      g += rect(x, y, w, h, "#2B2926", "#151412", 1);
      g += rect(x + 1, y + 1, w - 2, h - 2, "#3E4A4C", "#1E2426", .8);
      return g;

    case "maquina": {
      g += rect(x, y, w, h, P.metalEscuro, "#3C4145", 1.4);
      g += rect(x + 2, y + 2, w - 4, h - 4, P.metal, "#4A5054", 1);
      const n = Math.max(2, Math.round(c(w, h) / 16));
      for (let i = 1; i < n; i++) {
        const p = c(x + (w / n) * i, y + (h / n) * i);
        g += c(linha(p, y + 3, p, y + h - 3, "#5F656A", 1), linha(x + 3, p, x + w - 3, p, "#5F656A", 1));
      }
      [[3, 3], [w - 3, 3], [3, h - 3], [w - 3, h - 3]].forEach(([a, b]) => { g += circ(x + a, y + b, .9, "#3C4145"); });
      return g;
    }

    case "gaiola": {
      g += rect(x, y, w, h, "#2E2B27", "#1A1815", 1);
      const n = 4;
      for (let i = 1; i < n; i++) {
        g += linha(x + (w / n) * i, y + 1, x + (w / n) * i, y + h - 1, "#8E9298", 1.1);
        g += linha(x + 1, y + (h / n) * i, x + w - 1, y + (h / n) * i, "#8E9298", 1.1);
      }
      g += rect(x, y, w, h, "none", "#9BA1A6");
      return g;
    }

    case "veiculo": {
      g += rect(x, y, w, h, "#3F4A55", "#252D34", 3);
      g += rect(x + c(w * .58, 2), y + c(2, h * .58), c(w * .34, w - 4), c(h - 4, h * .34), "#5A6875", "#2E373F", 2);
      [[.14, -.06], [.14, 1.06], [.72, -.06], [.72, 1.06]].forEach(([a, b]) => {
        g += rect(x + c(w * a, w * b - 2), y + c(h * b - 2, h * a), c(w * .16, 4), c(4, h * .16), "#1D2124", null, 1);
      });
      return g;
    }

    case "cacamba":
      g += rect(x, y, w, h, "#4A5B4E", "#2C3730", 1);
      g += rect(x + 1.4, y + 1.4, w - 2.8, h - 2.8, "#3B4A3F", "#2C3730", .8);
      return g;

    case "caixa": {
      g += rect(x, y, w, h, "#7E5F3E", "#4E3A25", 1);
      g += linha(x + 1, y + h / 2, x + w - 1, y + h / 2, "#4E3A25", .8);
      g += linha(x + w / 2, y + 1, x + w / 2, y + h - 1, "#4E3A25", .8);
      return g;
    }
  }

  // genérico
  g += rect(x, y, w, h, "#6A655C", "#413D37", 1.2);
  return g;
}

/* ==========================================================================
   OUTRAS FORMAS
   ========================================================================== */

function formaSVG(f, camada) {
  const x = f.x * U, y = f.y * U, w = (f.w || 0) * U, h = (f.h || 0) * U;

  switch (f.t) {

    case "externo":
      if (camada !== 0) return "";
      return rect(x, y, w, h, TEXTURA_EXT[f.textura] || "#4C4A45");

    case "sala":
      if (camada !== 1) return "";
      return rect(x, y, w, h, TEXTURA_PISO[f.piso] || "url(#fFrio)") +
             (f.piso === "queimado" ? rect(x, y, w, h, "url(#fFuligem)") : "");

    case "parede": {
      if (camada !== 3) return "";
      return rect(x, y, w, h, P.parede) +
             rect(x, y, w, Math.min(2, h * .3), P.paredeTopo, null) +
             rect(x, y, w, h, "none", P.paredeSombra);
    }

    case "porta": {
      if (camada !== 3) return "";
      const horiz = w > h;
      const L = horiz ? w : h;
      const cor = f.estado === "quebrada" ? "#6B3A32" : P.madeira;
      let g = "";

      if (f.estado === "quebrada") {
        g += rect(x, y, w, h, "#241F1A");
        const n = 5, dx = horiz ? w / n : 0, dy = horiz ? 0 : h / n;
        for (let i = 0; i < n; i++)
          g += `<path d="M${x + dx * i} ${y + dy * i} l${dx || w} ${dy || h} l${-(dx || w) * .45} ${-(dy || h) * .45}z" fill="${cor}" opacity=".92"/>`;
        return g;
      }

      if (f.estado === "fechada") {
        return rect(x + (horiz ? 0 : h * .18), y + (horiz ? w * .18 : 0),
                    horiz ? w : h * .64, horiz ? w * .64 : h, cor, P.madeiraEscura, .8);
      }

      // vão largo (portão, arco, porta de galpão) não ganha folha: fica só a passagem
      if (L > 20) {
        return horiz
          ? rect(x, y + h * .35, w, h * .3, "#3A342C", null, 1)
          : rect(x + w * .35, y, w * .3, h, "#3A342C", null, 1);
      }

      // porta comum: folha em 90° e arco de abertura
      const hx = x, hy = horiz ? y + h / 2 : y;
      if (horiz) {
        g += rect(hx, hy - L, 1.8, L, cor, P.madeiraEscura, .6);
        g += `<path d="M${hx + 1.8} ${hy - L} A${L} ${L} 0 0 1 ${hx + L} ${hy}" fill="none" stroke="#171410" stroke-width=".8" stroke-dasharray="3 2.4" opacity=".5"/>`;
      } else {
        g += rect(hx - L, hy, L, 1.8, cor, P.madeiraEscura, .6);
        g += `<path d="M${hx - L} ${hy + 1.8} A${L} ${L} 0 0 0 ${hx} ${hy + L}" fill="none" stroke="#171410" stroke-width=".8" stroke-dasharray="3 2.4" opacity=".5"/>`;
      }
      return g;
    }

    case "janela":
      if (camada !== 3) return "";
      return rect(x, y, w, h, "#2E3B3E") +
             rect(x + (w > h ? 0 : w * .28), y + (w > h ? h * .28 : 0), w > h ? w : w * .44, w > h ? h * .44 : h, P.vidro, "#4E6166", .6);

    case "movel":
      if (camada !== 4) return "";
      return `<g filter="url(#fSombraLeve)">${movelSVG(f)}</g>`;

    case "escada": {
      if (camada !== 4) return "";
      let g = "";
      if (f.tipo === "caracol") {
        const cx = x + w / 2, cy = y + h / 2, R = Math.min(w, h) / 2;
        g += circ(cx, cy, R, "#6E6B62", "#494640");
        for (let i = 0; i < 10; i++) {
          const a = (i / 10) * Math.PI * 2;
          g += `<path d="M${cx} ${cy} L${cx + Math.cos(a) * R} ${cy + Math.sin(a) * R} A${R} ${R} 0 0 1 ${cx + Math.cos(a + .55) * R} ${cy + Math.sin(a + .55) * R} Z"
                 fill="${i % 2 ? "#787569" : "#6A675E"}" stroke="#4B483F" stroke-width=".6"/>`;
        }
        g += circ(cx, cy, R * .2, "#4B483F");
      } else {
        const passos = Math.max(3, Math.round((w > h ? w : h) / 11));
        g += rect(x, y, w, h, "#6A675E", "#48453E", 1);
        for (let i = 1; i < passos; i++) {
          const p = w > h ? x + (w / passos) * i : y + (h / passos) * i;
          g += w > h ? linha(p, y + .8, p, y + h - .8, "#4B483F", 1) : linha(x + .8, p, x + w - .8, p, "#4B483F", 1);
        }
      }
      return `<g filter="url(#fSombraLeve)">${g}</g>`;
    }

    case "destroco":
      if (camada !== 2) return "";
      return rect(x, y, w, h, "url(#gEscombro)", "#3A352E", 1);

    case "duto":
      if (camada !== 4) return "";
      return `<g filter="url(#fSombraLeve)">${rect(x, y, w, h, P.metalEscuro, "#33383C", 1)}
              ${rect(x + 1, y + 1, w - 2, h - 2, "#6C7378", null, .8)}</g>`;

    case "sigilo": {
      if (camada !== 2) return "";
      const cx = f.x * U, cy = f.y * U, R = f.r * U;
      let g = `<circle cx="${cx}" cy="${cy}" r="${R + 6}" fill="${P.chama}" opacity=".07"/>
               <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${P.ouro}" stroke-width="1.2" opacity=".9"/>
               <circle cx="${cx}" cy="${cy}" r="${R * .62}" fill="none" stroke="${P.ouro}" stroke-width=".9" opacity=".65"/>`;
      const pts = [];
      for (let i = 0; i < 7; i++) {
        const a = -Math.PI / 2 + (i / 7) * Math.PI * 2;
        pts.push([cx + Math.cos(a) * R * .62, cy + Math.sin(a) * R * .62]);
      }
      for (let i = 0; i < 7; i++) {
        const p = pts[i], q = pts[(i + 3) % 7];
        g += linha(p[0], p[1], q[0], q[1], P.ouro, .8, .6);
      }
      // velas acesas na borda
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2, vx = cx + Math.cos(a) * R, vy = cy + Math.sin(a) * R;
        g += circ(vx, vy, 2.6, P.chama, null) + circ(vx, vy, 1.4, "#FFF0C4");
      }
      return g;
    }

    case "luz":
      return "";

    case "texto": {
      if (camada !== 5) return "";
      const fs = (f.tam || .8) * 8;
      const rot = f.giro ? ` transform="rotate(${f.giro} ${x} ${y})"` : "";
      const peso = (f.tam || 0) >= .95 ? "600" : "500";
      const esp = (f.tam || 0) >= .95 ? ".1em" : ".02em";
      const base = `x="${x}" y="${y}" font-size="${fs.toFixed(1)}" font-weight="${peso}" font-family="var(--sans),sans-serif" letter-spacing="${esp}" text-anchor="middle"${rot}`;
      return `<text ${base} fill="none" stroke="#14110D" stroke-width="${(fs * .26).toFixed(1)}" stroke-linejoin="round" opacity=".85">${escT(f.txt)}</text>
              <text ${base} fill="#F0EDE3">${escT(f.txt)}</text>`;
    }
  }
  return "";
}

/* ==========================================================================
   MONTAGEM
   Camadas: 0 externo · 1 salas · 2 marcas de chão · 3 paredes · 4 móveis ·
   5 textos. Por cima: grade, escuridão com furos de luz e cômodos ocultos.

   Opções:
     grade / rotulos      liga e desliga a malha e os nomes
     luzes                fontes de luz extras (ex.: lanternas dos tokens)
     iluminacao           false desenha tudo claro, ignorando cen.luz
     atenuar              multiplica a escuridão (mestre enxerga mais)
     ocultas              índices de salas escondidas
     modoComodos          salas clicáveis para esconder/revelar (mestre)
     imagemURL            usa uma imagem como mapa no lugar do desenho
   ========================================================================== */

const ESCURIDAO = { claro: 0, penumbra: .5, escuro: .8 };

function coletarLuzes(cen, o) {
  const luzes = [];
  cen.mapa.formas.forEach(f => {
    if (f.t === "luz") luzes.push({ x: f.x * U, y: f.y * U, r: (f.r || 4) * U, tom: f.tom || "quente" });
    if (f.t === "sigilo") {
      const R = f.r * U;
      luzes.push({ x: f.x * U, y: f.y * U, r: R * 1.9, tom: "quente", vela: true });
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2;
        luzes.push({ x: f.x * U + Math.cos(a) * R, y: f.y * U + Math.sin(a) * R, r: U * 1.6, tom: "quente", vela: true });
      }
    }
  });
  (o.luzes || []).forEach(l => luzes.push({ x: l.x * U, y: l.y * U, r: (l.r || 5.5) * U, tom: l.tom || "fria", externa: true }));
  return luzes;
}

function svgMapa(cen, opcoes) {
  const o = opcoes || {};
  const m = cen.mapa;
  const dims = o.dims || { w: m.w, h: m.h };
  const W = dims.w * U, H = dims.h * U;
  const camada = n => m.formas.map(f => formaSVG(f, n)).join("");
  const imagem = o.imagemURL || m.imagem || null;

  const salas = m.formas.filter(f => f.t === "sala");
  const vulto = imagem ? "" : salas.map(f =>
    `<rect x="${f.x * U + 3}" y="${f.y * U + 5}" width="${f.w * U}" height="${f.h * U}" fill="#000" opacity=".22"/>`).join("");

  // ---------- iluminação
  let escuro = "";
  const nivel = o.iluminacao === false ? 0
    : (o.escuridao != null ? o.escuridao : (ESCURIDAO[cen.luz] || 0)) * (o.atenuar || 1);
  const luzes = coletarLuzes(cen, o).filter(l => !imagem || l.externa);
  if (nivel > 0) {
    const furos = luzes.map(l => `<circle cx="${l.x}" cy="${l.y}" r="${l.r}" fill="url(#gFuro)"/>`).join("");
    const brilhos = luzes.map((l, i) =>
      `<circle cx="${l.x}" cy="${l.y}" r="${l.r * .92}" fill="url(#${l.tom === "fria" ? "gFria" : "gQuente"})"${l.vela ? ` class="vela" style="animation-duration:${(1.3 + (i % 5) * .22).toFixed(2)}s"` : ""}/>`).join("");
    escuro = `<mask id="mEscuro"><rect width="${W}" height="${H}" fill="#fff"/>${furos}</mask>
      <rect width="${W}" height="${H}" fill="#05070C" opacity="${nivel}" mask="url(#mEscuro)"/>
      ${brilhos}`;
  }

  // ---------- cômodos ocultos / clicáveis
  const ocultas = o.ocultas || [];
  let veus = "";
  if (!imagem) {
    salas.forEach((f, i) => {
      const sx = f.x * U, sy = f.y * U, sw = f.w * U, sh = f.h * U;
      if (ocultas.indexOf(i) >= 0) {
        veus += o.modoMestre
          ? `<g><rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" fill="#0B0906" opacity=".55"/>
               <rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" fill="none" stroke="#C79A2E" stroke-width="1.4" stroke-dasharray="5 4"/></g>`
          : `<rect x="${sx - 1}" y="${sy - 1}" width="${sw + 2}" height="${sh + 2}" fill="#0B0906"/>`;
      }
      if (o.modoComodos) {
        veus += `<rect data-sala="${i}" x="${sx}" y="${sy}" width="${sw}" height="${sh}" fill="#C79A2E"
                  opacity="${ocultas.indexOf(i) >= 0 ? ".12" : ".06"}" style="cursor:pointer"/>`;
      }
    });
  }

  const corpo = imagem
    ? `<image href="${escT(imagem)}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"/>`
    : `${camada(0)}${vulto}${camada(1)}
       ${camada(2)}
       <g filter="url(#fSombra)">${camada(3)}</g>
       ${camada(4)}`;

  /* width/height explícitos dão ao SVG um tamanho intrínseco. Sem eles um
     <svg> inline só com viewBox cai no default de 100%, e num container
     shrink-to-fit (o palco) container e SVG passam a medir um ao outro —
     a largura resolve para zero e o mapa some. */
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Planta: ${escT(cen.titulo)}">
    <style>
      text{font-family:var(--sans),sans-serif}
      .vela{animation:tremula 1.5s infinite alternate ease-in-out}
      @keyframes tremula{from{opacity:.62}to{opacity:1}}
      @media (prefers-reduced-motion: reduce){.vela{animation:none}}
    </style>
    ${defsMapa()}
    <rect width="100%" height="100%" fill="#2A2823"/>
    ${corpo}
    ${o.grade === false ? "" : `<rect width="100%" height="100%" fill="url(#grade)"/>`}
    ${escuro}
    ${imagem || o.rotulos === false ? "" : camada(5)}
    ${veus}
  </svg>`;
}

if (typeof window !== "undefined") {
  window.svgMapa = svgMapa;
  window.MAPA_U = U;
}
