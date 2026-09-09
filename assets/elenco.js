/* =========================================================================
   ELENCO — quem tem arte para pôr na mesa
   Monstros e pessoas moram na mesma lista porque a mesa faz a mesma coisa
   com os dois: desenha a arte na moldura do token e, se o mestre pedir,
   joga na TV em tela cheia. O que separa um do outro é só o `tipo`, que o
   painel usa para agrupar o `select`.

   A arte fica em `tokens/`, e o nome do arquivo diz para que ela serve:

     <id>-token.png     a peça que anda pelo mapa        (obrigatória)
     <id>-normal.png    a arte cheia, para a revelação   (opcional)
     <id>-morto.png     a mesma criatura depois de cair  (opcional)

   Sem `-normal`, a revelação usa o próprio token — é o caso da Dra. Ruth,
   do Euclides e do Felipe. Sem `-morto`, o botão de versão morta fica
   desligado.

   `cenas` diz a que cenas a peça pertence, e serve para o `select` marcar
   "(desta cena)" e já vir escolhida. Quem entra posicionado está nos `tokens`
   das cenas, em assets/cenarios.js — e monstro vivo entra sempre com
   `oculto: true`: o mestre já acha a criatura montada no lugar certo, mas a
   TV não desenha nada até ele clicar em "Mostrar na TV". Peça visível
   esperando na planta entregaria a surpresa. Pessoas e corpos entram
   visíveis, porque não há susto a estragar.

   `tam` multiplica o tamanho da peça no mapa. 1 é gente do tamanho de gente.
   ========================================================================= */

const ELENCO = [

  /* ------------------------------- monstros ------------------------------ */
  {
    id: "existido",
    tipo: "monstro",
    nome: "Existido",
    elemento: "conhecimento",
    token:  "/tokens/existido-token.png",
    normal: "/tokens/existido-normal.png",
    morto:  "/tokens/existido-morto.png",
    tam: 1.15,
    cenas: ["m1-c5-porao", "m1-c6-amor"],
    nota: "Gustavo depois do ritual. Cai na Cena 5 e o corpo fica na Cena 6."
  },
  {
    id: "bicho-papao",
    tipo: "monstro",
    nome: "Bicho papão",
    elemento: "conhecimento",
    /* O `-token.png` saiu do repositório; a arte cheia é recortada em fundo
       transparente, então serve de peça no mapa e de revelação na TV. */
    token:  "/tokens/bicho-papao-normal.png",
    normal: "/tokens/bicho-papao-normal.png",
    morto:  "/tokens/bicho-papao-morto.png",
    tam: 2.1,
    cenas: ["m1-c7-fabrica"],
    nota: "Jairo e o filho na mesma carne. Entra só quando o mestre chamar."
  },

  /* ------------------------------- pessoas ------------------------------- */
  {
    id: "felipe",
    tipo: "pessoa",
    nome: "Felipe",
    elemento: "neutro",
    token: "/tokens/Felipe-token.png",
    tam: 1,
    cenas: ["m1-c1-felipe"],
    nota: "Felipe Trindade, pai do Marcelo. Acha que os agentes são do governo."
  },
  {
    id: "dra-ruth",
    tipo: "pessoa",
    nome: "Dra. Ruth",
    elemento: "neutro",
    token: "/tokens/Dra-Ruth-token.png",
    tam: 1,
    cenas: ["m1-c2-consultorio", "m1-c3-revolta"],
    nota: "A pediatra que atendeu as sete crianças. Protegê-la é o objetivo da Cena 3."
  },
  {
    id: "euclides",
    tipo: "pessoa",
    nome: "Euclides",
    elemento: "neutro",
    token: "/tokens/Euclides-token.png",
    tam: 1,
    cenas: ["m1-c2-consultorio", "m1-c3-revolta"],
    nota: "Euclides Salvador, o recepcionista. Barra a porta do consultório até um Diplomacia DT 10 ou Intimidação DT 15."
  }
];

const MONSTROS = ELENCO.filter(e => e.tipo === "monstro");
const PESSOAS  = ELENCO.filter(e => e.tipo === "pessoa");

const elencoPorId = id => ELENCO.find(e => e.id === id) || null;

/* Rede de segurança pelo nome. Serve a dois casos reais: peça que o mestre
   já tinha guardada no `localStorage` antes de a arte existir (o objeto
   salvo não tem o campo `arte`), e peça criada na mão com "Novo token".
   Batizar o token de "Dra. Ruth" basta para ele puxar o retrato dela. */
const elencoPorNome = nome => {
  if (!nome) return null;
  const k = String(nome).trim().toLowerCase();
  return ELENCO.find(e => e.nome.toLowerCase() === k) || null;
};

const elencoDaPeca = t => (t && t.arte ? elencoPorId(t.arte) : elencoPorNome(t && t.nome));

/* Arte da peça no mapa. Pede a versão morta e ela existe? usa. Senão fica
   na normal — assim marcar `morto` em quem não tem arte de morto não quebra
   nada, só não muda o desenho. */
function arteElenco(e, morto) {
  if (!e) return null;
  return (morto && e.morto) || e.token;
}

/* Arte da revelação em tela cheia: `-normal` quando existe, senão o token. */
function arteRevelacao(e) {
  return e ? (e.normal || e.token) : null;
}

const temMorto = e => !!(e && e.morto);

const elencoDaCena = cenId => ELENCO.filter(e => (e.cenas || []).indexOf(cenId) >= 0);

if (typeof window !== "undefined") {
  window.ELENCO = ELENCO;
  window.MONSTROS = MONSTROS;
  window.PESSOAS = PESSOAS;
  window.elencoPorId = elencoPorId;
  window.elencoPorNome = elencoPorNome;
  window.elencoDaPeca = elencoDaPeca;
  window.arteElenco = arteElenco;
  window.arteRevelacao = arteRevelacao;
  window.temMorto = temMorto;
  window.elencoDaCena = elencoDaCena;
}
