/* =========================================================================
   CENÁRIOS 2D
   Cada cenário descreve um mapa em unidades de grid (1 unidade ≈ 1 metro).
   O desenho é gerado em SVG por assets/mesa.js — não há imagem externa.

   Formas aceitas em `mapa.formas`:
     {t:"externo",  x,y,w,h, textura:"grama"|"cinza"|"asfalto"|"terra", nome}
     {t:"sala",     x,y,w,h, nome, piso:"madeira"|"frio"|"queimado"|"pedra"}
     {t:"parede",   x,y,w,h}
     {t:"porta",    x,y,w,h, estado:"aberta"|"fechada"|"quebrada"}
     {t:"janela",   x,y,w,h}
     {t:"movel",    x,y,w,h, nome, forma:"rect"|"round", giro}
     {t:"escada",   x,y,w,h, tipo:"reta"|"caracol"}
     {t:"destroco", x,y,w,h}
     {t:"sigilo",   x,y,r}
     {t:"duto",     x,y,w,h}
     {t:"texto",    x,y, txt, tam}

   `pontos` são os pontos de interesse numerados (aparecem na mesa do mestre,
   e no palco só quando o mestre revela).
   `tokens` são as peças iniciais sugeridas.
   ========================================================================= */

const ELEMENTOS = {
  sangue:       { nome: "Sangue",       cor: "#B3202B" },
  morte:        { nome: "Morte",        cor: "#3C7548" },
  conhecimento: { nome: "Conhecimento", cor: "#A87A18" },
  energia:      { nome: "Energia",      cor: "#75449F" },
  medo:         { nome: "Medo",         cor: "#5A5A5A" },
  neutro:       { nome: "Neutro",       cor: "#6B7A72" }
};

const CENARIOS = [

  /* ===================================================================
     GENÉRICOS — servem para qualquer missão
     =================================================================== */

  {
    id: "gen-beco",
    grupo: "Genéricos",
    titulo: "Beco sem saída",
    subtitulo: "Perseguição urbana, madrugada",
    elemento: "neutro",
    luz: "penumbra",
    resumo: "Corredor estreito entre dois prédios, terminando em muro alto. Serve para encurralar alguém, para uma emboscada ou para a primeira aparição de uma criatura.",
    mapa: {
      w: 34, h: 18,
      formas: [
        { t: "externo", x: 0, y: 0, w: 34, h: 18, textura: "asfalto" },
        { t: "parede", x: 0, y: 0, w: 34, h: 1.2 },
        { t: "parede", x: 0, y: 16.8, w: 34, h: 1.2 },
        { t: "parede", x: 30, y: 1.2, w: 1.2, h: 15.6 },
        { t: "texto", x: 17, y: 2.6, txt: "prédio comercial — janelas gradeadas", tam: 0.8 },
        { t: "texto", x: 17, y: 15.6, txt: "galpão lateral — sem acesso", tam: 0.8 },
        { t: "movel", x: 24.5, y: 3, w: 3.4, h: 2.2, nome: "caçamba" },
        { t: "movel", x: 21, y: 12.8, w: 2.8, h: 2.1, nome: "lixo" },
        { t: "movel", x: 11.8, y: 13.2, w: 2.6, h: 1.7, nome: "caixas" },
        { t: "movel", x: 14.7, y: 13.8, w: 1.6, h: 1 },
        { t: "escada", x: 27.6, y: 6.4, w: 2, h: 5, tipo: "reta" },
        { t: "texto", x: 24.6, y: 12.4, txt: "escada de incêndio", tam: 0.7 },
        { t: "texto", x: 32.4, y: 9, txt: "muro 4 m", tam: 0.8, giro: -90 },
        { t: "luz", x: 7, y: 4.5, r: 6, tom: "quente" },
        { t: "texto", x: 2.2, y: 9, txt: "rua", tam: 0.9 }
      ]
    },
    /* Beco em imagem, 1723x913 px. Escala medida pelas caçambas (~2 m de
       frente, 160 px) e pelos engradados: ~80 px por metro, o que dá
       21,5 x 11,4 — a proporção do arquivo, senão o `slice` cortaria as
       bordas. A arte já é noturna, então a escuridão entra bem mais leve
       que a "penumbra" do desenho, só para a lanterna ainda valer. */
    imagem: {
      url: "/mapas/beco-sem-saida.png",
      w: 21.5, h: 11.4,
      escuridao: 0.2,
      credito: "battlemap de terceiros — uso na mesa",
      pontos: [
        { n: 1, x: 17.9, y: 5.5, nome: "Escada de incêndio", detalhe: "Único caminho para cima. O primeiro degrau fica a 2,5 m do chão — exige Atletismo ou um apoio." },
        { n: 2, x: 16.1, y: 2.4, nome: "Caçamba", detalhe: "Esconderijo para uma pessoa. Também dá acesso ao topo do muro." },
        { n: 3, x: 14, y: 8.8, nome: "Contêiner", detalhe: "Cobertura leve. Barulhento se empurrado." }
      ],
      tokens: [
        { nome: "Alvo", elemento: "sangue", x: 3.7, y: 5.6 }
      ]
    },
    pontos: [
      { n: 1, x: 28.6, y: 8.8, nome: "Escada de incêndio", detalhe: "Único caminho para cima. O primeiro degrau fica a 2,5 m do chão — exige Atletismo ou um apoio." },
      { n: 2, x: 26, y: 4.2, nome: "Caçamba", detalhe: "Esconderijo para uma pessoa. Também dá acesso ao topo do muro." },
      { n: 3, x: 22.2, y: 13.8, nome: "Contêiner", detalhe: "Cobertura leve. Barulhento se empurrado." }
    ],
    tokens: [
      { nome: "Alvo", elemento: "sangue", x: 26, y: 9 }
    ]
  },

  {
    id: "gen-casa",
    grupo: "Genéricos",
    titulo: "Casa abandonada",
    subtitulo: "Investigação em ambiente fechado",
    elemento: "neutro",
    luz: "escuro",
    resumo: "Planta residencial comum, vazia há anos. Cômodos suficientes para distribuir pistas sem que a cena fique longa demais.",
    mapa: {
      w: 32, h: 22,
      formas: [
        { t: "externo", x: 0, y: 0, w: 32, h: 22, textura: "grama" },
        { t: "sala", x: 4, y: 3, w: 24, h: 16, piso: "madeira" },
        { t: "parede", x: 4, y: 3, w: 24, h: 0.6 },
        { t: "parede", x: 4, y: 18.4, w: 24, h: 0.6 },
        { t: "parede", x: 4, y: 3, w: 0.6, h: 16 },
        { t: "parede", x: 27.4, y: 3, w: 0.6, h: 16 },
        { t: "parede", x: 14, y: 3.6, w: 0.5, h: 7 },
        { t: "parede", x: 14, y: 12.5, w: 0.5, h: 5.9 },
        { t: "parede", x: 14.5, y: 10.4, w: 6, h: 0.5 },
        { t: "parede", x: 21.5, y: 10.4, w: 5.9, h: 0.5 },
        { t: "porta", x: 8.6, y: 18.4, w: 2.4, h: 0.6, estado: "aberta" },
        { t: "porta", x: 14, y: 10.5, w: 0.5, h: 2, estado: "aberta" },
        { t: "porta", x: 20.5, y: 10.4, w: 1, h: 0.5, estado: "aberta" },
        { t: "janela", x: 4, y: 6, w: 0.6, h: 2.4 },
        { t: "janela", x: 27.4, y: 6, w: 0.6, h: 2.4 },
        { t: "janela", x: 27.4, y: 14, w: 0.6, h: 2.4 },
        { t: "luz", x: 5.4, y: 7.2, r: 3.6, tom: "fria" },
        { t: "luz", x: 26, y: 7.2, r: 3.6, tom: "fria" },
        { t: "luz", x: 26, y: 15.2, r: 3.6, tom: "fria" },
        { t: "texto", x: 11.9, y: 4.6, txt: "SALA", tam: 1 },
        { t: "texto", x: 9.3, y: 15, txt: "COZINHA", tam: 1 },
        { t: "texto", x: 22.4, y: 8.6, txt: "QUARTO", tam: 1 },
        { t: "texto", x: 18.4, y: 16.8, txt: "QUARTO 2", tam: 1 },
        { t: "movel", x: 5.4, y: 4.4, w: 3.6, h: 1.4, nome: "sofá" },
        { t: "movel", x: 5.2, y: 12.4, w: 1.6, h: 4.4, nome: "pia" },
        { t: "movel", x: 11.4, y: 12.4, w: 2, h: 2, nome: "fogão" },
        { t: "movel", x: 15.4, y: 4.4, w: 3.2, h: 2.2, nome: "cama" },
        { t: "movel", x: 24, y: 12.4, w: 3.2, h: 2.2, nome: "cama" },
        { t: "movel", x: 24.2, y: 4.4, w: 2.6, h: 1.2, nome: "armário" },
        { t: "escada", x: 5.2, y: 8, w: 4.4, h: 1.8, tipo: "reta" },
        { t: "texto", x: 7.4, y: 7.5, txt: "sótão", tam: 0.75 }
      ]
    },
    /* Casa em imagem, 1508x1043 px. Escala medida pelas camas (~1,9 m de
       comprimento, 145 px) e pela banheira: ~77 px por metro, o que dá
       19,5 x 13,5 e deixa a casa com uns 13,7 x 9,8 m internos. A arte é
       diurna vista de cima, então a escuridão fica em 0,4: escuro o
       bastante para a lanterna dos agentes importar, sem apagar o mapa. */
    imagem: {
      url: "/mapas/casa-abandonada.png",
      w: 19.5, h: 13.5,
      escuridao: 0.4,
      credito: "battlemap de terceiros — uso na mesa",
      pontos: [
        { n: 1, x: 4.9, y: 5, nome: "Alçapão do sótão", detalhe: "Tábuas podres no cômodo dos fundos. Percepção ouve algo se mexendo acima." },
        { n: 2, x: 4.1, y: 8.5, nome: "Pia entupida", detalhe: "Investigação encontra algo que ficou preso no sifão." },
        { n: 3, x: 15.4, y: 2.7, nome: "Armário", detalhe: "Roupas de alguém que saiu com pressa. Documentos no bolso de um casaco." },
        { n: 4, x: 10.2, y: 3.2, nome: "Sob a cama", detalhe: "Marcas recentes no pó — algo foi arrastado para fora daqui." }
      ],
      tokens: []
    },
    pontos: [
      { n: 1, x: 7.4, y: 9, nome: "Escada do sótão", detalhe: "Degraus podres. Percepção ouve algo se mexendo acima." },
      { n: 2, x: 6, y: 14.6, nome: "Pia entupida", detalhe: "Investigação encontra algo que ficou preso no sifão." },
      { n: 3, x: 25.5, y: 5, nome: "Armário", detalhe: "Roupas de alguém que saiu com pressa. Documentos no bolso de um casaco." },
      { n: 4, x: 16.8, y: 5.4, nome: "Sob a cama", detalhe: "Marcas recentes no pó — algo foi arrastado para fora daqui." }
    ],
    tokens: []
  },

  {
    id: "gen-galpao",
    grupo: "Genéricos",
    titulo: "Galpão de cargas",
    subtitulo: "Combate com cobertura e altura",
    elemento: "neutro",
    luz: "claro",
    resumo: "Espaço amplo com prateleiras altas, corredores e um mezanino. Feito para combate: muita cobertura, linhas de visão longas e um andar de cima.",
    mapa: {
      w: 42, h: 26,
      formas: [
        { t: "sala", x: 1, y: 1, w: 40, h: 24, piso: "concreto" },
        { t: "parede", x: 1, y: 1, w: 40, h: 0.8 },
        { t: "parede", x: 1, y: 24.2, w: 40, h: 0.8 },
        { t: "parede", x: 1, y: 1, w: 0.8, h: 24 },
        { t: "parede", x: 40.2, y: 1, w: 0.8, h: 24 },
        { t: "porta", x: 4, y: 24.2, w: 5, h: 0.8, estado: "aberta" },
        { t: "porta", x: 40.2, y: 11, w: 0.8, h: 3, estado: "fechada" },
        { t: "movel", x: 6, y: 4, w: 12, h: 1.6, nome: "prateleira" },
        { t: "movel", x: 6, y: 8.4, w: 12, h: 1.6, nome: "prateleira" },
        { t: "movel", x: 6, y: 12.8, w: 12, h: 1.6, nome: "prateleira" },
        { t: "movel", x: 22, y: 4, w: 12, h: 1.6, nome: "prateleira" },
        { t: "movel", x: 22, y: 8.4, w: 12, h: 1.6, nome: "prateleira" },
        { t: "movel", x: 22, y: 12.8, w: 12, h: 1.6, nome: "prateleira" },
        { t: "movel", x: 30, y: 18.5, w: 4, h: 2.6, nome: "empilhadeira" },
        { t: "movel", x: 6, y: 18.2, w: 3, h: 3, nome: "pallets" },
        { t: "movel", x: 9.4, y: 19, w: 2.4, h: 2.2 },
        { t: "escada", x: 36, y: 17, w: 3.4, h: 6, tipo: "reta" },
        { t: "texto", x: 37.7, y: 15.6, txt: "mezanino", tam: 0.85 },
        { t: "texto", x: 20, y: 22.2, txt: "área de manobra", tam: 0.9 }
      ]
    },
    /* Galpão em imagem, 1607x979 px. Escala medida pelos engradados
       (~1,2 m, 75 px) e conferida nas placas do piso: ~60 px por metro, o
       que dá 26,75 x 16,3 — um galpão de 27 x 16 m. Cena "claro", então
       não leva escuridão. */
    imagem: {
      url: "/mapas/galpao-de-cargas.png",
      w: 26.75, h: 16.3,
      credito: "battlemap de terceiros — uso na mesa",
      pontos: [
        { n: 1, x: 24.4, y: 11.8, nome: "Escada do mezanino", detalhe: "Vantagem de altura sobre todo o galpão. Dois turnos para subir." },
        { n: 2, x: 20.3, y: 11.7, nome: "Contêiner de carga", detalhe: "Cobertura pesada, o único abrigo sólido da área aberta. Empurrar ou abrir faz um barulho que atrai." },
        { n: 3, x: 12.5, y: 5, nome: "Corredor central", detalhe: "Linha de visão limpa de ponta a ponta entre as fileiras de engradados. Quem cruzar fica exposto." }
      ],
      tokens: []
    },
    pontos: [
      { n: 1, x: 37.7, y: 20, nome: "Escada do mezanino", detalhe: "Vantagem de altura sobre todo o galpão. Dois turnos para subir." },
      { n: 2, x: 32, y: 19.8, nome: "Empilhadeira", detalhe: "Cobertura pesada. Pode ser ligada com um teste — barulho atrai." },
      { n: 3, x: 12, y: 10.6, nome: "Corredor central", detalhe: "Linha de visão limpa de ponta a ponta. Quem cruzar fica exposto." }
    ],
    tokens: []
  },

  /* ===================================================================
     MISSÃO 1 — AS MÃOS QUE NOS ACOLHEM
     Mapas construídos a partir dos ambientes descritos no texto da missão.
     Os pontos de interesse seguem os testes indicados na aventura.
     =================================================================== */

  {
    id: "m1-prologo",
    grupo: "Missão 1 — As Mãos que nos Acolhem",
    cena: "Prólogo",
    titulo: "Base da Ordo Realitas",
    subtitulo: "Briefing com Caio Leal",
    elemento: "conhecimento",
    luz: "claro",
    resumo: "Os recrutas esperam no salão até serem chamados. Veríssimo não está — quem passa a missão é Caio Leal, agente experiente encarregado de orientar recrutas. Depois do briefing: arsenal, e a van na garagem.",
    mapa: {
      w: 44, h: 26,
      formas: [
        { t: "externo", x: 0, y: 0, w: 44, h: 7, textura: "terra" },
        { t: "sala", x: 2, y: 8, w: 20, h: 16, piso: "frio" },
        { t: "sala", x: 24, y: 8, w: 18, h: 9, piso: "madeira" },
        { t: "sala", x: 24, y: 18, w: 8, h: 6, piso: "frio" },
        { t: "sala", x: 33, y: 18, w: 9, h: 6, piso: "frio" },
        { t: "parede", x: 2, y: 7.4, w: 40, h: 0.6 },
        { t: "parede", x: 2, y: 23.9, w: 40, h: 0.6 },
        { t: "parede", x: 1.6, y: 7.4, w: 0.6, h: 17 },
        { t: "parede", x: 41.8, y: 7.4, w: 0.6, h: 17 },
        { t: "parede", x: 22.2, y: 7.4, w: 0.5, h: 17 },
        { t: "parede", x: 22.7, y: 17, w: 19.3, h: 0.5 },
        { t: "parede", x: 32.2, y: 17.5, w: 0.5, h: 6.4 },
        { t: "porta", x: 22.2, y: 11, w: 0.5, h: 2.2, estado: "fechada" },
        { t: "porta", x: 27, y: 17, w: 2.2, h: 0.5, estado: "aberta" },
        { t: "porta", x: 36, y: 17, w: 3, h: 0.5, estado: "aberta" },
        { t: "porta", x: 36, y: 23.9, w: 4, h: 0.6, estado: "aberta" },
        { t: "janela", x: 24, y: 7.4, w: 6, h: 0.6 },
        { t: "texto", x: 12, y: 10, txt: "SALÃO DA ORDEM", tam: 1.1 },
        { t: "texto", x: 33, y: 10, txt: "ESCRITÓRIO DE VERÍSSIMO", tam: 1 },
        { t: "texto", x: 28, y: 22.8, txt: "ARSENAL", tam: 1 },
        { t: "texto", x: 37.5, y: 19.4, txt: "GARAGEM", tam: 1 },
        { t: "texto", x: 22, y: 3.4, txt: "recrutas treinando", tam: 0.9 },
        { t: "movel", x: 5, y: 13, w: 4.4, h: 2, nome: "mesa" },
        { t: "movel", x: 11, y: 13, w: 4.4, h: 2, nome: "mesa" },
        { t: "movel", x: 5, y: 17.5, w: 4.4, h: 2, nome: "mesa" },
        { t: "movel", x: 11, y: 17.5, w: 4.4, h: 2, nome: "mesa" },
        { t: "movel", x: 17, y: 13, w: 3, h: 6.5, nome: "arquivos" },
        { t: "movel", x: 31, y: 12, w: 6, h: 2.4, nome: "mesa de Caio" },
        { t: "movel", x: 32.8, y: 14.9, w: 2.6, h: 1.9, nome: "poltrona" },
        { t: "movel", x: 25, y: 19.2, w: 6.4, h: 1.7, nome: "bancada" },
        { t: "movel", x: 35.4, y: 20.6, w: 5.2, h: 2.7, nome: "van" }
      ]
    },
    /* Planta da base em imagem, 965x570 px na horizontal. Calibrada em 30 px
       por metro (medido pelas camas do dormitório, ~1x2 m), o que dá
       32,2 x 19 — a mesma proporção do arquivo, senão o
       `preserveAspectRatio="slice"` cortaria as bordas. O desenho gerado
       continua disponível no botão "Ver desenho". */
    imagem: {
      url: "/mapas/base-ordem.png",
      w: 32.2, h: 19,
      credito: "planta da base — uso na mesa",
      pontos: [
        { n: 1, x: 22.7, y: 8.8, nome: "Mesas do salão", detalhe: "Onde os recrutas esperam. Momento de apresentação dos personagens entre si." },
        { n: 2, x: 21.2, y: 3.1, nome: "Mesa de Caio", detalhe: "Ele espalha os documentos e o mapa de Tronco do Oeste aqui. Entrega o rádio comunicador." },
        { n: 3, x: 9.7, y: 15, nome: "Sala de convivência", detalhe: "Caio se levanta e fala sobre a função da Ordem enquanto os recrutas descansam entre uma coisa e outra." },
        { n: 4, x: 28.5, y: 15.2, nome: "Arsenal", detalhe: "Escolha do equipamento inicial antes de sair." },
        { n: 5, x: 1.1, y: 4.5, nome: "Saída", detalhe: "A van leva o grupo até Tronco do Oeste — poucas horas de viagem, saindo de São Paulo e subindo a serra." }
      ],
      tokens: [
        { nome: "Recrutas", elemento: "neutro", x: 22.7, y: 10.3 },
        { nome: "Caio Leal", elemento: "conhecimento", x: 21.2, y: 4.4 }
      ]
    },
    pontos: [
      { n: 1, x: 8, y: 15.6, nome: "Mesas do salão", detalhe: "Onde os recrutas esperam. Momento de apresentação dos personagens entre si." },
      { n: 2, x: 34, y: 13.4, nome: "Mesa de Caio", detalhe: "Ele espalha os documentos e o mapa de Tronco do Oeste aqui. Entrega o rádio comunicador." },
      { n: 3, x: 27, y: 8.6, nome: "Janela do pátio", detalhe: "Caio se levanta e observa outros recrutas treinando enquanto fala sobre a função da Ordem." },
      { n: 4, x: 28, y: 20.4, nome: "Arsenal", detalhe: "Escolha do equipamento inicial antes de sair." },
      { n: 5, x: 38, y: 21.4, nome: "Van", detalhe: "Leva o grupo até Tronco do Oeste — poucas horas de viagem, saindo de São Paulo e subindo a serra." }
    ],
    tokens: [
      { nome: "Recrutas", elemento: "neutro", x: 8, y: 20 },
      { nome: "Caio Leal", elemento: "conhecimento", x: 30, y: 14 }
    ]
  },

  {
    id: "m1-c1-felipe",
    grupo: "Missão 1 — As Mãos que nos Acolhem",
    cena: "Cena 1",
    titulo: "Casa de Felipe Trindade",
    subtitulo: "Tronco do Oeste — zona industrial",
    elemento: "conhecimento",
    luz: "claro",
    resumo: "Primeira cena de investigação: uma conversa. Felipe é o pai de Marcelo e acredita que os agentes são do governo. A casa tem portão verde aberto e o jardim da frente abandonado, com a grama alta atrapalhando a vista do interior.",
    mapa: {
      w: 34, h: 24,
      formas: [
        { t: "externo", x: 0, y: 0, w: 34, h: 24, textura: "terra" },
        { t: "externo", x: 3, y: 13, w: 28, h: 9, textura: "grama" },
        { t: "parede", x: 3, y: 21.6, w: 9, h: 0.5 },
        { t: "parede", x: 16, y: 21.6, w: 15, h: 0.5 },
        { t: "porta", x: 12, y: 21.6, w: 4, h: 0.5, estado: "aberta" },
        { t: "texto", x: 14, y: 23.2, txt: "portão verde, aberto — jardim de grama alta", tam: 0.85 },
        { t: "sala", x: 4, y: 2.5, w: 26, h: 10.5, piso: "frio" },
        { t: "parede", x: 4, y: 2, w: 26, h: 0.6 },
        { t: "parede", x: 4, y: 12.9, w: 26, h: 0.6 },
        { t: "parede", x: 3.6, y: 2, w: 0.6, h: 11.5 },
        { t: "parede", x: 29.6, y: 2, w: 0.6, h: 11.5 },
        { t: "parede", x: 15.5, y: 2.6, w: 0.5, h: 4.2 },
        { t: "parede", x: 15.5, y: 9.2, w: 0.5, h: 3.7 },
        { t: "parede", x: 22.4, y: 2.6, w: 0.5, h: 4.4 },
        { t: "parede", x: 16, y: 7, w: 6.4, h: 0.5 },
        { t: "porta", x: 12.4, y: 12.9, w: 2.4, h: 0.6, estado: "aberta" },
        { t: "porta", x: 15.5, y: 7.4, w: 0.5, h: 1.6, estado: "aberta" },
        { t: "porta", x: 18.6, y: 7, w: 1.6, h: 0.5, estado: "fechada" },
        { t: "porta", x: 22.4, y: 4.2, w: 0.5, h: 1.8, estado: "fechada" },
        { t: "janela", x: 3.6, y: 5, w: 0.6, h: 2.6 },
        { t: "janela", x: 29.6, y: 4, w: 0.6, h: 2.4 },
        { t: "janela", x: 26, y: 12.9, w: 2.4, h: 0.6 },
        { t: "texto", x: 9.5, y: 4.6, txt: "SALA", tam: 1 },
        { t: "texto", x: 19.2, y: 6.3, txt: "COZINHA", tam: 0.9 },
        { t: "texto", x: 26.2, y: 3.6, txt: "QUARTO", tam: 0.9 },
        { t: "texto", x: 19, y: 10.6, txt: "BANHO", tam: 0.8 },
        { t: "movel", x: 5.4, y: 6.2, w: 4.4, h: 1.6, nome: "sofá" },
        { t: "movel", x: 11.2, y: 6.1, w: 2.6, h: 1.8, nome: "poltrona" },
        { t: "movel", x: 5.4, y: 9.4, w: 5.4, h: 1.2, nome: "estante" },
        { t: "movel", x: 17, y: 2.8, w: 4.6, h: 1.2, nome: "pia" },
        { t: "movel", x: 24, y: 5.4, w: 3.4, h: 2.2, nome: "cama" },
        { t: "movel", x: 26.9, y: 9, w: 2.3, h: 2.6, nome: "armário" }
      ]
    },
    /* Casa de Felipe em imagem, 1464x1074 px. A escala saiu da cama do quarto
       (2,0 x 1,4 m em 107 x 78 px) e fecha com a pia da cozinha e o sofá da
       sala: ~54 px por metro, o que dá 18,5 x 13,6 — a proporção do arquivo,
       senão o `slice` cortaria o quintal cercado. A arte tem o telhado
       removido e o quintal inteiro, que é onde a cena começa. Cena de dia:
       nenhuma escuridão por cima. */
    imagem: {
      url: "/mapas/m1-c1-felipe.png",
      w: 18.5, h: 13.6,
      escuridao: 0,
      credito: "battlemap de terceiros — uso na mesa",
      pontos: [
        { n: 1, x: 7.6, y: 12, nome: "Portão verde", detalhe: "Aberto quando os agentes chegam. Nenhum sinal de arrombamento em lugar nenhum da casa." },
        { n: 2, x: 4.6, y: 4.1, nome: "Sala", detalhe: "Felipe oferece um copo de água e um lugar para sentar. É aqui que acontece o interrogatório." },
        { n: 3, x: 2, y: 5.3, nome: "Estante com o porta-retrato", detalhe: "Foto de Marcelo. Ao sair, Felipe pousa o porta-retrato de cabeça para baixo." },
        { n: 4, x: 13.1, y: 2.9, nome: "Quarto de Marcelo", detalhe: "Sumiu daqui, de madrugada. Felipe deu falta de manhã cedo. Era o aniversário do menino." },
        { n: 5, x: 4.1, y: 7.4, nome: "Caminho para o consultório", detalhe: "Felipe se oferece para levar os agentes até a Dra. Ruth Wendhal — poucos minutos a pé." },
        { n: 6, x: 7.6, y: 9.6, nome: "Jardim da frente", detalhe: "Fora do texto da missão, mas a arte entrega: a grama alta atrapalha a vista do interior. Percepção DT 10 para enxergar alguma coisa da casa antes de entrar." }
      ],
      tokens: [
        { nome: "Felipe", arte: "felipe", elemento: "neutro", x: 5.6, y: 4.3 }
      ]
    },
    pontos: [
      { n: 1, x: 14, y: 21.9, nome: "Portão verde", detalhe: "Aberto quando os agentes chegam. Nenhum sinal de arrombamento em lugar nenhum da casa." },
      { n: 2, x: 8, y: 7, nome: "Sala", detalhe: "Felipe oferece um copo de água e um lugar para sentar. É aqui que acontece o interrogatório." },
      { n: 3, x: 8, y: 10, nome: "Estante com o porta-retrato", detalhe: "Foto de Marcelo. Ao sair, Felipe pousa o porta-retrato de cabeça para baixo." },
      { n: 4, x: 25.7, y: 6.5, nome: "Quarto de Marcelo", detalhe: "Sumiu daqui, de madrugada. Felipe deu falta de manhã cedo. Era o aniversário do menino." },
      { n: 5, x: 17, y: 14.5, nome: "Caminho para o consultório", detalhe: "Felipe se oferece para levar os agentes até a Dra. Ruth Wendhal — poucos minutos a pé." }
    ],
    tokens: [
      { nome: "Felipe", arte: "felipe", elemento: "neutro", x: 11, y: 8 }
    ]
  },

  {
    id: "m1-c2-consultorio",
    grupo: "Missão 1 — As Mãos que nos Acolhem",
    cena: "Cena 2",
    titulo: "Consultório Pediátrico Wendhal",
    subtitulo: "Os sete prontuários",
    elemento: "conhecimento",
    luz: "claro",
    resumo: "Euclides Salvador recebe os agentes na recepção e resiste a deixá-los entrar. Dentro, a Dra. Ruth atendeu todas as sete crianças antes de sumirem — e guarda os prontuários numa pasta escondida sob a própria cadeira.",
    mapa: {
      w: 32, h: 22,
      formas: [
        { t: "externo", x: 0, y: 0, w: 32, h: 22, textura: "terra" },
        { t: "parede", x: 2, y: 19.4, w: 9, h: 0.5 },
        { t: "parede", x: 15, y: 19.4, w: 15, h: 0.5 },
        { t: "porta", x: 11, y: 19.4, w: 4, h: 0.5, estado: "aberta" },
        { t: "texto", x: 13, y: 21, txt: "placa: Consultório Pediátrico Wendhal", tam: 0.8 },
        { t: "externo", x: 2, y: 15.5, w: 28, h: 3.9, textura: "grama" },
        { t: "sala", x: 3, y: 2.5, w: 26, h: 13, piso: "frio" },
        { t: "parede", x: 3, y: 2, w: 26, h: 0.6 },
        { t: "parede", x: 3, y: 15.4, w: 26, h: 0.6 },
        { t: "parede", x: 2.6, y: 2, w: 0.6, h: 14 },
        { t: "parede", x: 28.6, y: 2, w: 0.6, h: 14 },
        { t: "parede", x: 14.5, y: 2.6, w: 0.5, h: 5.2 },
        { t: "parede", x: 14.5, y: 10.4, w: 0.5, h: 5 },
        { t: "porta", x: 12, y: 15.4, w: 2.6, h: 0.6, estado: "aberta" },
        { t: "porta", x: 14.5, y: 7.8, w: 0.5, h: 2.6, estado: "fechada", id: "porta-consultorio" },
        { t: "janela", x: 2.6, y: 5, w: 0.6, h: 3 },
        { t: "janela", x: 28.6, y: 5, w: 0.6, h: 3 },
        { t: "texto", x: 8.6, y: 4, txt: "RECEPÇÃO", tam: 1 },
        { t: "texto", x: 20.6, y: 4, txt: "CONSULTÓRIO", tam: 1 },
        { t: "movel", x: 4.4, y: 6.4, w: 5.6, h: 1.6, nome: "balcão de Euclides" },
        { t: "movel", x: 6.2, y: 8.4, w: 1.6, h: 1.4, nome: "cadeira" },
        { t: "movel", x: 4.4, y: 11.6, w: 8, h: 1.2, nome: "cadeiras de espera" },
        { t: "movel", x: 19, y: 6.4, w: 6, h: 2, nome: "mesa da Dra. Ruth" },
        { t: "movel", x: 21.4, y: 9, w: 1.8, h: 1.6, nome: "cadeira" },
        { t: "movel", x: 24.5, y: 11.4, w: 3.4, h: 2.2, nome: "maca" },
        { t: "movel", x: 16.3, y: 11.9, w: 2.7, h: 1.9, nome: "brinquedos" },
        { t: "movel", x: 26.1, y: 3.2, w: 2.3, h: 3, nome: "armário" }
      ]
    },
    /* Consultório em imagem, 2550x1664 px. Escala pela maca (1,9 x 0,7 m em
       230 x 90 px) e conferida no notebook, na cadeira de escritório e na
       folha da porta: ~123,5 px por metro, o que dá 8,1 x 5,28 — a proporção
       do arquivo, senão o `slice` cortaria o jardim da frente. A arte tem só
       dois ambientes: o da esquerda, com o balcão em L e o notebook, é a
       recepção de Euclides; o da direita, com o armário e a maca, é o
       consultório da Dra. Ruth. A porta de madeira fechada no meio do divisor
       é exatamente a passagem que Euclides não quer liberar. Cena de dia e
       arte já bem acesa: nenhuma escuridão por cima. */
    imagem: {
      url: "/mapas/m1-c2-consultorio.jpg",
      w: 8.1, h: 5.28,
      escuridao: 0,
      credito: "battlemap de terceiros — uso na mesa",
      pontos: [
        { n: 1, x: 2.5, y: 1.6, nome: "Computador de Euclides", detalhe: "Percepção DT 10: ele está lendo um blog sobre um incêndio ocorrido na cidade há pouco mais de um ano. Chegando perto, dá para ler a matéria inteira." },
        { n: 2, x: 3.7, y: 1.9, nome: "Porta do consultório", detalhe: "Fechada na arte. Euclides só libera a passagem com Diplomacia DT 10 ou Intimidação DT 15." },
        { n: 3, x: 5.2, y: 0.8, nome: "Sete prontuários", detalhe: "Ciência DT 10, Medicina DT 10 e Ocultismo DT 15 tiram leituras diferentes. Ocultismo aponta traços de Conhecimento: aprendizado súbito e vozes em sonhos." },
        { n: 4, x: 5.33, y: 1.45, nome: "Pasta sob a cadeira", detalhe: "Onde a Dra. Ruth guarda os prontuários das sete crianças que atendeu antes de sumirem. Na arte, é a cadeira em frente à mesa do fundo." },
        { n: 5, x: 4, y: 3.4, nome: "Caixa de brinquedos de madeira", detalhe: "Organizada no canto da sala. O consultório é simples, mas limpo e bem cuidado." },
        { n: 6, x: 6.4, y: 3.1, nome: "Maca", detalhe: "Fora do texto da missão, mas a arte entrega: é onde as sete crianças foram examinadas. Medicina DT 10 no lençol acha fios de cabelo de mais de uma criança — a maca não foi trocada desde os últimos atendimentos." }
      ],
      tokens: [
        { nome: "Euclides", arte: "euclides", elemento: "neutro", x: 2.6, y: 0.95 },
        { nome: "Dra. Ruth", arte: "dra-ruth", elemento: "neutro", x: 6, y: 2.3 }
      ]
    },
    pontos: [
      { n: 1, x: 7.2, y: 7.2, nome: "Computador de Euclides", detalhe: "Percepção DT 10: ele está lendo um blog sobre um incêndio ocorrido na cidade há pouco mais de um ano. Chegando perto, dá para ler a matéria inteira." },
      { n: 2, x: 14.7, y: 9, nome: "Porta do consultório", detalhe: "Euclides só libera a passagem com Diplomacia DT 10 ou Intimidação DT 15." },
      { n: 3, x: 22, y: 7.4, nome: "Sete prontuários", detalhe: "Ciência DT 10, Medicina DT 10 e Ocultismo DT 15 tiram leituras diferentes. Ocultismo aponta traços de Conhecimento: aprendizado súbito e vozes em sonhos." },
      { n: 4, x: 22.3, y: 9.8, nome: "Pasta sob a cadeira", detalhe: "Onde a Dra. Ruth guarda os prontuários das sete crianças que atendeu antes de sumirem." },
      { n: 5, x: 17, y: 14.2, nome: "Caixa de brinquedos de madeira", detalhe: "Organizada no canto da sala. O consultório é simples, mas limpo e bem cuidado." }
    ],
    tokens: [
      { nome: "Euclides", arte: "euclides", elemento: "neutro", x: 7, y: 9.2 },
      { nome: "Dra. Ruth", arte: "dra-ruth", elemento: "neutro", x: 22, y: 9.8 }
    ]
  },

  {
    id: "m1-c3-revolta",
    grupo: "Missão 1 — As Mãos que nos Acolhem",
    cena: "Cena 3",
    titulo: "Revolta Parental",
    subtitulo: "Cena de ação — 3 rodadas",
    elemento: "sangue",
    luz: "claro",
    resumo: "Mesmo consultório, agora com a porta arrombada. Um grupo de pais armados invade culpando a doutora. Objetivo: protegê-la por 3 rodadas. A cada rodada sem sucesso em Conter os ânimos, todos sofrem 1d4 de dano não letal.",
    mapa: {
      w: 32, h: 22,
      formas: [
        { t: "externo", x: 0, y: 0, w: 32, h: 22, textura: "terra" },
        { t: "externo", x: 2, y: 15.5, w: 28, h: 3.9, textura: "grama" },
        { t: "sala", x: 3, y: 2.5, w: 26, h: 13, piso: "frio" },
        { t: "parede", x: 3, y: 2, w: 26, h: 0.6 },
        { t: "parede", x: 3, y: 15.4, w: 26, h: 0.6 },
        { t: "parede", x: 2.6, y: 2, w: 0.6, h: 14 },
        { t: "parede", x: 28.6, y: 2, w: 0.6, h: 14 },
        { t: "parede", x: 14.5, y: 2.6, w: 0.5, h: 5.2 },
        { t: "parede", x: 14.5, y: 10.4, w: 0.5, h: 5 },
        { t: "porta", x: 12, y: 15.4, w: 2.6, h: 0.6, estado: "aberta" },
        { t: "porta", x: 14.5, y: 7.8, w: 0.5, h: 2.6, estado: "quebrada" },
        { t: "destroco", x: 15.4, y: 8.2, w: 1.8, h: 1.8 },
        { t: "janela", x: 2.6, y: 5, w: 0.6, h: 3 },
        { t: "janela", x: 28.6, y: 5, w: 0.6, h: 3 },
        { t: "texto", x: 8.6, y: 4, txt: "RECEPÇÃO", tam: 1 },
        { t: "texto", x: 22, y: 4, txt: "CONSULTÓRIO", tam: 1 },
        { t: "movel", x: 4.4, y: 6.4, w: 5.6, h: 1.6, nome: "balcão" },
        { t: "movel", x: 4.4, y: 11.6, w: 8, h: 1.2, nome: "cadeiras" },
        { t: "movel", x: 19, y: 6.4, w: 6, h: 2, nome: "mesa" },
        { t: "movel", x: 24.5, y: 11.4, w: 3.4, h: 2.2, nome: "maca" },
        { t: "movel", x: 16.2, y: 12.4, w: 2.7, h: 1.9, nome: "brinquedos" },
        { t: "texto", x: 19.8, y: 14.6, txt: "a doutora corre para trás da mesa", tam: 0.72 }
      ]
    },
    /* Mesmo arquivo-base da Cena 2, mesma planta e mesmo tamanho (2550x1664
       px), então a grade é idêntica: 8,1 x 5,28. A diferença é o estado —
       a porta da rua saiu das dobradiças e caiu no jardim, a porta do
       consultório virou lascas espalhadas pelo divisor e a janela da esquerda
       está estilhaçada. Dá para alternar entre as duas cenas na mesa e a
       arte conta a passagem do tempo sozinha. Cena de dia: nenhuma escuridão
       por cima. */
    imagem: {
      url: "/mapas/m1-c3-revolta.jpg",
      w: 8.1, h: 5.28,
      escuridao: 0,
      credito: "battlemap de terceiros — uso na mesa",
      pontos: [
        { n: 1, x: 3.78, y: 2.16, nome: "Porta rompida", detalhe: "Estouro de madeira anuncia a entrada da turba. É por aqui que os pais entram — as lascas espalhadas pelo divisor são o que sobrou dela." },
        { n: 2, x: 5.4, y: 1.6, nome: "Atrás da mesa", detalhe: "Posição da Dra. Ruth durante toda a cena. Protegê-la por 3 rodadas é o objetivo." },
        { n: 3, x: 4.5, y: 2.1, nome: "Linha de contenção", detalhe: "Conter os ânimos funciona como Procurar Pistas: Diplomacia para apelar à razão, Luta para a força bruta. Usos criativos de itens valem +5 a critério do mestre." },
        { n: 4, x: 2.07, y: 4.05, nome: "Porta da rua arrombada", detalhe: "Fora do texto da missão, mas a arte entrega: a folha saiu das dobradiças e caiu no jardim. Ninguém sai por aqui sem pisar em madeira quebrada — Furtividade DT 15 para tentar." },
        { n: 5, x: 1.13, y: 2.12, nome: "Janela estilhaçada", detalhe: "Fora do texto da missão: vidro no chão da recepção. Rota de fuga alternativa, com 1 de dano para quem passar sem cuidado." }
      ],
      tokens: [
        { nome: "Turba", elemento: "sangue", x: 3.1, y: 2.2 },
        { nome: "Dra. Ruth", arte: "dra-ruth", elemento: "neutro", x: 5.6, y: 1.75 },
        { nome: "Euclides", arte: "euclides", elemento: "neutro", x: 2.6, y: 3.2 }
      ]
    },
    pontos: [
      { n: 1, x: 15.4, y: 9.2, nome: "Porta rompida", detalhe: "Estouro de madeira anuncia a entrada da turba. É por aqui que os pais entram." },
      { n: 2, x: 21, y: 8.8, nome: "Atrás da mesa", detalhe: "Posição da Dra. Ruth durante toda a cena. Protegê-la por 3 rodadas é o objetivo." },
      { n: 3, x: 18, y: 11.6, nome: "Linha de contenção", detalhe: "Conter os ânimos funciona como Procurar Pistas: Diplomacia para apelar à razão, Luta para a força bruta. Usos criativos de itens valem +5 a critério do mestre." }
    ],
    tokens: [
      { nome: "Turba", elemento: "sangue", x: 13, y: 9 },
      { nome: "Dra. Ruth", arte: "dra-ruth", elemento: "neutro", x: 21.5, y: 8.6 },
      { nome: "Euclides", arte: "euclides", elemento: "neutro", x: 12, y: 12 }
    ]
  },

  {
    id: "m1-c4-casebre",
    grupo: "Missão 1 — As Mãos que nos Acolhem",
    cena: "Cena 4",
    titulo: "O casebre de Gustavo",
    subtitulo: "Cena de investigação — urgência muito baixa (6 rodadas)",
    elemento: "conhecimento",
    luz: "penumbra",
    resumo: "A casa que pertencia a Jairo, ocupada por Gustavo Magalhães desde o sumiço do filho. Pintura rachada, pátio tomado por grama alta, portão arrebentado e enferrujado. O vidro da porta está quebrado — dá para abrir por dentro pelo buraco, e não há outros sinais de arrombamento.",
    mapa: {
      w: 30, h: 22,
      formas: [
        { t: "externo", x: 0, y: 0, w: 30, h: 22, textura: "terra" },
        { t: "externo", x: 2, y: 14.5, w: 26, h: 5.5, textura: "grama" },
        { t: "parede", x: 2, y: 19.6, w: 8, h: 0.5 },
        { t: "parede", x: 14, y: 19.6, w: 14, h: 0.5 },
        { t: "porta", x: 10, y: 19.6, w: 4, h: 0.5, estado: "quebrada" },
        { t: "texto", x: 12, y: 21.2, txt: "portão arrebentado — pátio de grama alta", tam: 0.78 },
        { t: "sala", x: 3, y: 2.5, w: 24, h: 12, piso: "frio" },
        { t: "parede", x: 3, y: 2, w: 24, h: 0.6 },
        { t: "parede", x: 3, y: 14.4, w: 24, h: 0.6 },
        { t: "parede", x: 2.6, y: 2, w: 0.6, h: 13 },
        { t: "parede", x: 26.6, y: 2, w: 0.6, h: 13 },
        { t: "parede", x: 11.5, y: 2.6, w: 0.5, h: 6.4 },
        { t: "parede", x: 3.2, y: 9, w: 8.8, h: 0.5 },
        { t: "porta", x: 12.6, y: 14.4, w: 2.4, h: 0.6, estado: "quebrada", id: "porta-vidro" },
        { t: "porta", x: 11.5, y: 5.4, w: 0.5, h: 2, estado: "aberta" },
        { t: "porta", x: 7, y: 9, w: 1.8, h: 0.5, estado: "aberta" },
        { t: "janela", x: 26.6, y: 5, w: 0.6, h: 2.6 },
        { t: "janela", x: 2.6, y: 4, w: 0.6, h: 2 },
        { t: "texto", x: 7.4, y: 3.8, txt: "COZINHA", tam: 0.95 },
        { t: "texto", x: 7.4, y: 13.9, txt: "ÁREA DE SERVIÇO", tam: 0.85 },
        { t: "texto", x: 19.4, y: 8.8, txt: "SALA / QUARTO", tam: 0.95 },
        { t: "movel", x: 3.6, y: 4.6, w: 1.8, h: 2.4, nome: "geladeira" },
        { t: "movel", x: 8.4, y: 6.6, w: 3, h: 1.2, nome: "pia" },
        { t: "movel", x: 9.2, y: 5.1, w: 1.4, h: 1.2, nome: "cadeira" },
        { t: "movel", x: 3.6, y: 10.4, w: 2.4, h: 1.6, nome: "tanque" },
        { t: "movel", x: 9.6, y: 10.2, w: 1.4, h: 1.4, nome: "privada", forma: "round" },
        { t: "texto", x: 4.9, y: 9.9, txt: "varal", tam: 0.72 },
        { t: "movel", x: 21.4, y: 3.4, w: 4.4, h: 2.6, nome: "cama", id: "cama" },
        { t: "movel", x: 14.4, y: 3.4, w: 1.6, h: 4, nome: "balcão" },
        { t: "movel", x: 17.4, y: 10.4, w: 3.2, h: 2.1, nome: "mesa" },
        { t: "movel", x: 20.9, y: 10.6, w: 1.9, h: 1.4, nome: "TV" },
        { t: "texto", x: 22.2, y: 7.3, txt: "alçapão sob a cama", tam: 0.72 }
      ]
    },
    imagem: {
      /* Casebre em imagem, 1195x896 px. Escala ~198 px por metro, medida em
         três objetos que convergiram: a privada (0,38 x 0,7 m), a pia da
         cozinha (0,5 x 0,9 m) e o vão da porta dos fundos (0,8 m). Dá uma
         casa de 6 x 4,5 m — apertado, que é o que a arte mostra. */
      url: "/mapas/casebre.png",
      w: 6.04, h: 4.53,
      escuridao: 0.25,
      credito: "battlemap de terceiros — uso na mesa",
      pontos: [
        { n: 1, x: 0.76, y: 2.31, nome: "Geladeira", detalhe: "Tomada por fotos presas com ímãs. Investigação DT 15 identifica Gustavo, a esposa e um menino de 5 ou 6 anos — e uma foto das costas marcadas de Jônata. Medicina DT 15 bate as manchas com os prontuários. Intuição DT 10 percebe a distância entre o casal. Percepção DT 10 sente o cheiro: a comida apodreceu." },
        { n: 2, x: 5.36, y: 2.43, nome: "Móvel da televisão", detalhe: "Papéis acumulados em volta. Percepção DT 10: não sobra espaço para escrever e não há um lápis sequer. Investigação DT 10: contas e documentos endereçados a Jairo Braga, nenhum aberto. Ciência DT 10: a TV está na tomada mas não liga — a tela sai. Ocultismo DT 15: as marcas por dentro são sigilos de Conhecimento ligados a rituais de transformação." },
        { n: 3, x: 2.88, y: 0.93, nome: "Banheiro", detalhe: "A pia, o varal improvisado e a privada. Investigação ou Percepção DT 15 acha ataduras e pomadas no meio da bagunça. Medicina DT 10: são pomadas para queimadura." },
        { n: 4, x: 4.77, y: 3.72, nome: "Cama", detalhe: "Investigação ou Percepção DT 15 nota o alçapão embaixo. Atletismo DT 10 move a cama, mas o alçapão está trancado. Crime DT 15 destranca; falhar aumenta o grau de urgência em 1. Arrombar acorda o que está lá embaixo." },
        { n: 5, x: 2.88, y: 4.24, nome: "Porta de entrada", detalhe: "Vidro quebrado, abre por dentro pelo buraco. Nenhum outro sinal de arrombamento." },
        { n: 6, x: 2.99, y: 0.31, nome: "Lâmpada do teto", detalhe: "A única luz da casa, pendurada num fio sobre o banheiro. Acender ilumina os cômodos e estala alto no silêncio: aumente o grau de urgência em 1 se usarem." }
      ],
      tokens: []
    },
    pontos: [
      { n: 1, x: 4.5, y: 5.8, nome: "Geladeira", detalhe: "Tomada por fotos presas com ímãs. Investigação DT 15 identifica Gustavo, a esposa e um menino de 5 ou 6 anos — e uma foto das costas marcadas de Jônata. Medicina DT 15 bate as manchas com os prontuários. Intuição DT 10 percebe a distância entre o casal. Percepção DT 10 sente o cheiro: a comida apodreceu." },
      { n: 2, x: 18.9, y: 11.4, nome: "Mesa da televisão", detalhe: "Papéis acumulados em volta. Percepção DT 10: não sobra espaço para escrever e não há um lápis sequer. Investigação DT 10: contas e documentos endereçados a Jairo Braga, nenhum aberto. Ciência DT 10: a TV está na tomada mas não liga — a tela sai. Ocultismo DT 15: as marcas por dentro são sigilos de Conhecimento ligados a rituais de transformação." },
      { n: 3, x: 4.8, y: 11.2, nome: "Área de serviço", detalhe: "Espaço apertado, roupa no varal acima do tanque, vaso sem tampa. Investigação ou Percepção DT 15 acha ataduras e pomadas dentro do tanque. Medicina DT 10: são pomadas para queimadura." },
      { n: 4, x: 23.6, y: 4.7, nome: "Cama de ferro", detalhe: "Investigação ou Percepção DT 15 nota o alçapão embaixo. Atletismo DT 10 move a cama, mas o alçapão está trancado. Crime DT 15 destranca; falhar aumenta o grau de urgência em 1. Arrombar acorda o que está lá embaixo." },
      { n: 5, x: 13.8, y: 14.7, nome: "Porta de entrada", detalhe: "Vidro quebrado, abre por dentro pelo buraco. Nenhum outro sinal de arrombamento." }
    ],
    tokens: []
  },

  {
    id: "m1-c5-porao",
    grupo: "Missão 1 — As Mãos que nos Acolhem",
    cena: "Cena 5",
    titulo: "Sozinho no Escuro",
    subtitulo: "Combate contra o existido",
    elemento: "conhecimento",
    luz: "escuro",
    resumo: "O alçapão abre para uma escadaria em caracol de degraus de pedra, descendo até uma porta de madeira entreaberta com luz de chamas. A sala subterrânea foi ornamentada como um templo ao filho de Gustavo: velas formando um sigilo e, no centro, a criatura de costas, olhando fixamente a foto de Jônata.",
    mapa: {
      w: 24, h: 20,
      formas: [
        { t: "sala", x: 2, y: 2, w: 20, h: 16, piso: "pedra" },
        { t: "parede", x: 1.4, y: 1.4, w: 21.2, h: 0.6 },
        { t: "parede", x: 1.4, y: 18, w: 21.2, h: 0.6 },
        { t: "parede", x: 1.4, y: 1.4, w: 0.6, h: 17.2 },
        { t: "parede", x: 22, y: 1.4, w: 0.6, h: 17.2 },
        { t: "parede", x: 8.5, y: 1.4, w: 0.5, h: 6 },
        { t: "parede", x: 8.5, y: 10.5, w: 0.5, h: 8.1 },
        { t: "porta", x: 8.5, y: 7.4, w: 0.5, h: 3.1, estado: "aberta", id: "porta-madeira" },
        { t: "escada", x: 3.4, y: 4.6, w: 4.4, h: 4.4, tipo: "caracol" },
        { t: "texto", x: 5.6, y: 3.2, txt: "alçapão", tam: 0.85 },
        { t: "texto", x: 6.1, y: 10.7, txt: "escada em caracol", tam: 0.7 },
        { t: "texto", x: 9.9, y: 9, txt: "porta entreaberta", tam: 0.66, giro: -90 },
        { t: "sigilo", x: 15.5, y: 9.8, r: 5 },
        { t: "movel", x: 19.6, y: 3.2, w: 2, h: 1.2, nome: "mesa" },
        { t: "movel", x: 19.4, y: 15.1, w: 2.2, h: 1.4, nome: "livros" },
        { t: "texto", x: 15.5, y: 3.4, txt: "foto de Jônata", tam: 0.8 },
        { t: "texto", x: 15.5, y: 17, txt: "CÔMODO RITUALÍSTICO", tam: 0.9 }
      ]
    },
    /* Cômodo ritualístico em imagem, 1536x1024 px. Escala pela estante do
       fundo (~2 m em 140 px) e conferida nos engradados e nas velas: ~71 px
       por metro, o que dá 14 x 9,33 — a proporção do arquivo, senão o `slice`
       cortaria a escada em caracol. A arte já tem a escadaria no cômodo da
       esquerda, a porta entreaberta no meio e o sigilo aceso no centro, então
       a escuridão entra leve e as velas viram luzes de verdade — a lanterna
       dos agentes ainda importa nos cantos. */
    imagem: {
      url: "/mapas/m1-c5-porao.png",
      w: 14, h: 9.33,
      escuridao: 0.28,
      credito: "battlemap de terceiros — uso na mesa",
      pontos: [
        { n: 1, x: 2.3, y: 3.1, nome: "Escadaria", detalhe: "Se os agentes fizerem muito barulho, não conseguirem abrir o alçapão ou desistirem, a criatura sobe e ataca — o alçapão explode em pedaços." },
        { n: 2, x: 8.5, y: 4.5, nome: "Círculo de velas", detalhe: "As velas estão distribuídas de modo a formar um sigilo paranormal. No centro, a criatura de costas." },
        { n: 3, x: 8.7, y: 1.1, nome: "Foto de Jônata", detalhe: "É para ela que o existido olha fixamente quando os agentes descem." },
        { n: 4, x: 5.9, y: 6.6, nome: "Presença Perturbadora", detalhe: "Na primeira rodada, antes de qualquer um agir: teste de Vontade. Falhar custa 1d6 de dano mental, metade se passar. Só vale na primeira rodada ou no primeiro encontro com a criatura." },
        { n: 5, x: 4.2, y: 5.3, nome: "Porta entreaberta", detalhe: "Separa a escadaria do cômodo ritualístico. É por essa fresta que sai a luz de chamas. Furtividade para descer sem abrir de vez." },
        { n: 6, x: 6.6, y: 1, nome: "Estante e altar", detalhe: "Fora do texto da missão, mas útil: Ocultismo DT 15 nos livros e no estandarte do fundo confirma que o sigilo é de Conhecimento, ligado a rituais de transformação — a mesma linha das marcas na TV do casebre." }
      ],
      tokens: [{ nome: "Existido", arte: "existido", oculto: true, elemento: "conhecimento", x: 8.5, y: 4.5 }],
      luzes: [
        { x: 8.5, y: 4.5, r: 3.6, tom: "quente" },
        { x: 1.5, y: 4.5, r: 3.2, tom: "quente" },
        { x: 5.2, y: 1.8, r: 2.6, tom: "quente" },
        { x: 11, y: 1.2, r: 2.8, tom: "quente" },
        { x: 12.4, y: 4.8, r: 3, tom: "quente" },
        { x: 5.4, y: 7.2, r: 2.4, tom: "quente" },
        { x: 11.4, y: 7.6, r: 2.6, tom: "quente" }
      ]
    },
    pontos: [
      { n: 1, x: 5.6, y: 6.8, nome: "Escadaria", detalhe: "Se os agentes fizerem muito barulho, não conseguirem abrir o alçapão ou desistirem, a criatura sobe e ataca — o alçapão explode em pedaços." },
      { n: 2, x: 15.5, y: 9.8, nome: "Círculo de velas", detalhe: "As velas estão distribuídas de modo a formar um sigilo paranormal. No centro, a criatura de costas." },
      { n: 3, x: 15.5, y: 4.6, nome: "Foto de Jônata", detalhe: "É para ela que o existido olha fixamente quando os agentes descem." },
      { n: 4, x: 12, y: 12.6, nome: "Presença Perturbadora", detalhe: "Na primeira rodada, antes de qualquer um agir: teste de Vontade. Falhar custa 1d6 de dano mental, metade se passar. Só vale na primeira rodada ou no primeiro encontro com a criatura." }
    ],
    tokens: [{ nome: "Existido", arte: "existido", oculto: true, elemento: "conhecimento", x: 15.5, y: 9.8 }]
  },

  {
    id: "m1-c6-amor",
    grupo: "Missão 1 — As Mãos que nos Acolhem",
    cena: "Cena 6",
    titulo: "Amor Profano",
    subtitulo: "Investigação — urgência muito baixa (6 rodadas)",
    elemento: "conhecimento",
    luz: "escuro",
    resumo: "Com o existido derrotado, sobra o cômodo secreto para vasculhar. As velas estão organizadas como adoração à imagem de Jônata, e papéis e livros se acumulam perto de uma mesa.",
    mapa: {
      w: 24, h: 20,
      formas: [
        { t: "sala", x: 2, y: 2, w: 20, h: 16, piso: "pedra" },
        { t: "parede", x: 1.4, y: 1.4, w: 21.2, h: 0.6 },
        { t: "parede", x: 1.4, y: 18, w: 21.2, h: 0.6 },
        { t: "parede", x: 1.4, y: 1.4, w: 0.6, h: 17.2 },
        { t: "parede", x: 22, y: 1.4, w: 0.6, h: 17.2 },
        { t: "parede", x: 8.5, y: 1.4, w: 0.5, h: 6 },
        { t: "parede", x: 8.5, y: 10.5, w: 0.5, h: 8.1 },
        { t: "porta", x: 8.5, y: 7.4, w: 0.5, h: 3.1, estado: "aberta" },
        { t: "escada", x: 3.4, y: 4.6, w: 4.4, h: 4.4, tipo: "caracol" },
        { t: "sigilo", x: 14.6, y: 9.8, r: 4.6 },
        { t: "movel", x: 17.8, y: 4.2, w: 3.2, h: 2.1, nome: "mesa" },
        { t: "movel", x: 21.2, y: 4.4, w: 1.9, h: 1.4, nome: "TV" },
        { t: "movel", x: 18.8, y: 13.6, w: 2.7, h: 1.5, nome: "papéis" },
        { t: "movel", x: 11.8, y: 14.9, w: 2.2, h: 1.4, nome: "música" },
        { t: "texto", x: 14.6, y: 3.4, txt: "foto de Jônata", tam: 0.8 },
        { t: "texto", x: 14.6, y: 17.2, txt: "as velas formam o símbolo de adoração", tam: 0.7 }
      ]
    },
    /* É o mesmo cômodo da Cena 5 — mesma planta 24 x 20 no desenho, mesma
       escada em caracol, mesma porta, mesmo sigilo — só num momento
       diferente: o existido já caiu e agora é vasculhar. Então reusa o mesmo
       arquivo e a mesma grade (14 x 9,33), com os pontos remapeados para o
       que esta cena procura. Só as velas continuam acesas, e é por isso que
       a lanterna dos agentes ainda importa nos cantos. */
    imagem: {
      url: "/mapas/m1-c5-porao.png",
      w: 14, h: 9.33,
      escuridao: 0.28,
      credito: "battlemap de terceiros — uso na mesa",
      pontos: [
        { n: 1, x: 8.5, y: 4.5, nome: "Velas e símbolos", detalhe: "Ocultismo DT 15: é um ritual de transformação, feito para ajudar a enfraquecer a Membrana. Investigação DT 10 acha a caixa de música que toca cantigas de ninar — ativada com ação de movimento, ocupa 1 espaço." },
        { n: 2, x: 10.4, y: 1.5, nome: "Mesa e documentos", detalhe: "Atualidades DT 10: tudo se refere ao incêndio da fábrica em 21/02/2021 — as mesmas informações do post de blog." },
        { n: 3, x: 11.2, y: 7.4, nome: "Diário rasgado", detalhe: "Investigação DT 15: anotações rasgadas que precisam ser organizadas. Gustavo e Jairo estavam no incêndio; Gustavo sobreviveu queimado; os trabalhadores temiam pelos filhos que visitavam a fábrica; Gustavo sabia dos livros ocultistas de Jairo e veio atrás de algo que trouxesse o filho de volta." },
        { n: 4, x: 5.8, y: 7.3, nome: "Caixa de música", detalhe: "Toca cantigas de ninar. Item aproveitável pelos agentes." },
        { n: 5, x: 8.7, y: 1.1, nome: "Foto de Jônata", detalhe: "O centro da adoração: é para ela que as velas apontam e para ela que a criatura olhava. Intuição DT 10 fecha a conta — quem montou isso não estava caçando as crianças, estava cuidando de uma." },
        { n: 6, x: 2.3, y: 3.1, nome: "Escadaria", detalhe: "A saída. Vale lembrar da urgência: são 6 rodadas de investigação antes de a cena fechar." }
      ],
      tokens: [{ nome: "Existido", arte: "existido", morto: true, elemento: "conhecimento", x: 8.5, y: 4.5 }],
      luzes: [
        { x: 8.5, y: 4.5, r: 3.6, tom: "quente" },
        { x: 1.5, y: 4.5, r: 3.2, tom: "quente" },
        { x: 5.2, y: 1.8, r: 2.6, tom: "quente" },
        { x: 11, y: 1.2, r: 2.8, tom: "quente" },
        { x: 12.4, y: 4.8, r: 3, tom: "quente" },
        { x: 5.4, y: 7.2, r: 2.4, tom: "quente" },
        { x: 11.4, y: 7.6, r: 2.6, tom: "quente" }
      ]
    },
    pontos: [
      { n: 1, x: 14.6, y: 9.8, nome: "Velas e símbolos", detalhe: "Ocultismo DT 15: é um ritual de transformação, feito para ajudar a enfraquecer a Membrana. Investigação DT 10 acha a caixa de música que toca cantigas de ninar — ativada com ação de movimento, ocupa 1 espaço." },
      { n: 2, x: 20, y: 5.2, nome: "Mesa e documentos", detalhe: "Atualidades DT 10: tudo se refere ao incêndio da fábrica em 21/02/2021 — as mesmas informações do post de blog." },
      { n: 3, x: 20.1, y: 14.3, nome: "Diário rasgado", detalhe: "Investigação DT 15: anotações rasgadas que precisam ser organizadas. Gustavo e Jairo estavam no incêndio; Gustavo sobreviveu queimado; os trabalhadores temiam pelos filhos que visitavam a fábrica; Gustavo sabia dos livros ocultistas de Jairo e veio atrás de algo que trouxesse o filho de volta." },
      { n: 4, x: 12.9, y: 15.7, nome: "Caixa de música", detalhe: "Toca cantigas de ninar. Item aproveitável pelos agentes." }
    ],
    tokens: [{ nome: "Existido", arte: "existido", morto: true, elemento: "conhecimento", x: 14.6, y: 9.8 }]
  },

  {
    id: "m1-interludio",
    grupo: "Missão 1 — As Mãos que nos Acolhem",
    cena: "Interlúdio",
    titulo: "Pousada Vale Floresta",
    subtitulo: "O Dilema",
    elemento: "neutro",
    luz: "claro",
    resumo: "A única pousada da cidade. Os agentes podem passar a noite aqui para descansar e recuperar forças antes de decidir: encerrar a missão chamando Caio, ou seguir sozinhos até a fábrica.",
    mapa: {
      w: 30, h: 18,
      formas: [
        { t: "externo", x: 0, y: 0, w: 30, h: 18, textura: "grama" },
        { t: "sala", x: 3, y: 3, w: 24, h: 12, piso: "madeira" },
        { t: "parede", x: 3, y: 2.5, w: 24, h: 0.6 },
        { t: "parede", x: 3, y: 14.9, w: 24, h: 0.6 },
        { t: "parede", x: 2.6, y: 2.5, w: 0.6, h: 13 },
        { t: "parede", x: 26.6, y: 2.5, w: 0.6, h: 13 },
        { t: "parede", x: 12, y: 3.1, w: 0.5, h: 11.8 },
        { t: "parede", x: 12.5, y: 8.8, w: 14.1, h: 0.5 },
        { t: "parede", x: 19.4, y: 3.1, w: 0.5, h: 5.7 },
        { t: "parede", x: 19.4, y: 9.3, w: 0.5, h: 5.6 },
        { t: "porta", x: 6.4, y: 14.9, w: 2.6, h: 0.6, estado: "aberta" },
        { t: "porta", x: 12, y: 5.4, w: 0.5, h: 1.6, estado: "fechada" },
        { t: "porta", x: 12, y: 11.4, w: 0.5, h: 1.6, estado: "fechada" },
        { t: "porta", x: 20.6, y: 8.8, w: 1.6, h: 0.5, estado: "fechada" },
        { t: "texto", x: 7.4, y: 5, txt: "RECEPÇÃO", tam: 0.95 },
        { t: "texto", x: 7.4, y: 11.4, txt: "SALA COMUM", tam: 0.9 },
        { t: "texto", x: 15.8, y: 5.4, txt: "QUARTO 1", tam: 0.85 },
        { t: "texto", x: 23, y: 5.4, txt: "QUARTO 2", tam: 0.85 },
        { t: "texto", x: 15.8, y: 14.1, txt: "QUARTO 3", tam: 0.85 },
        { t: "texto", x: 23, y: 14.1, txt: "QUARTO 4", tam: 0.85 },
        { t: "movel", x: 4.2, y: 6.4, w: 4.4, h: 1.4, nome: "balcão" },
        { t: "movel", x: 4.2, y: 12.4, w: 4, h: 1.4, nome: "sofá" },
        { t: "movel", x: 13.4, y: 6.4, w: 2.8, h: 1.8, nome: "cama" },
        { t: "movel", x: 21, y: 6.4, w: 2.8, h: 1.8, nome: "cama" },
        { t: "movel", x: 13.4, y: 10.2, w: 2.8, h: 1.8, nome: "cama" },
        { t: "movel", x: 21, y: 10.2, w: 2.8, h: 1.8, nome: "cama" }
      ]
    },
    /* Pousada em imagem, 1392x1130 px. Escala pelas camas (2,15 x 1,35 m em
       117 x 75 px) e conferida na porta dupla da frente (1,35 m em 76 px):
       ~56 px por metro, o que dá 17,9 x 14,53 — a proporção do arquivo, senão
       o `slice` cortaria a varanda de entrada. A arte tem oito quartos de uma
       cama cada em duas fileiras, o salão de estar à esquerda, os banheiros à
       direita e a escada de entrada embaixo. Interlúdio de descanso: nenhuma
       escuridão por cima. */
    imagem: {
      url: "/mapas/m1-interludio-pousada.png",
      w: 17.9, h: 14.53,
      escuridao: 0,
      credito: "battlemap de terceiros — uso na mesa",
      pontos: [
        { n: 1, x: 3.6, y: 3.6, nome: "Recepção", detalhe: "Ponto de encontro do grupo. Boa hora para revisitar o caso antes de decidir." },
        { n: 2, x: 2.2, y: 8.5, nome: "Sala comum", detalhe: "Ações de interlúdio: descanso e recuperação antes da fábrica." },
        { n: 3, x: 3.7, y: 5.6, nome: "A decisão", detalhe: "Chamar Caio encerra a missão e pula direto para o Epílogo. Seguir investigando leva à fábrica abandonada." },
        { n: 4, x: 8.6, y: 3.7, nome: "Os quartos", detalhe: "Oito quartos, uma cama em cada. Divida o grupo como quiserem — quem dormir sozinho é quem o mestre pode usar para um pesadelo antes da fábrica." },
        { n: 5, x: 2.4, y: 11.6, nome: "Varanda da frente", detalhe: "Onde os agentes chegam. O lampião aceso é a única luz do lado de fora — quem ficar de vigia passa a noite aqui." }
      ],
      tokens: []
    },
    pontos: [
      { n: 1, x: 6.4, y: 7.2, nome: "Recepção", detalhe: "Ponto de encontro do grupo. Boa hora para revisitar o caso antes de decidir." },
      { n: 2, x: 6.2, y: 13.2, nome: "Sala comum", detalhe: "Ações de interlúdio: descanso e recuperação antes da fábrica." },
      { n: 3, x: 17, y: 8, nome: "A decisão", detalhe: "Chamar Caio encerra a missão e pula direto para o Epílogo. Seguir investigando leva à fábrica abandonada." }
    ],
    tokens: []
  },

  {
    id: "m1-c7-fabrica",
    grupo: "Missão 1 — As Mãos que nos Acolhem",
    cena: "Cena 7",
    titulo: "A fábrica abandonada",
    subtitulo: "Combate contra o bicho papão enfraquecido",
    elemento: "conhecimento",
    luz: "escuro",
    resumo: "Paredes comprometidas e estrutura queimada pelo incêndio do ano passado. As portas serviram para isolar os cômodos e transformá-los em fornos, o que comprometeu o prédio inteiro. A porta frontal está entreaberta e dá numa enorme sala — o andar principal, com o maquinário ainda no chão, tomado pelas cinzas do que virou pó.",
    mapa: {
      w: 50, h: 30,
      formas: [
        { t: "externo", x: 0, y: 0, w: 50, h: 30, textura: "cinza" },
        { t: "sala", x: 3, y: 3, w: 44, h: 24, piso: "queimado" },
        { t: "parede", x: 2.4, y: 2.4, w: 45.2, h: 0.7 },
        { t: "parede", x: 2.4, y: 26.9, w: 45.2, h: 0.7 },
        { t: "parede", x: 2.4, y: 2.4, w: 0.7, h: 25.2 },
        { t: "parede", x: 46.9, y: 2.4, w: 0.7, h: 25.2 },
        { t: "destroco", x: 2.4, y: 8, w: 0.9, h: 5.4 },
        { t: "destroco", x: 32.5, y: 26.9, w: 6.4, h: 0.9 },
        { t: "porta", x: 22, y: 26.9, w: 4, h: 0.7, estado: "aberta", id: "porta-frontal" },
        { t: "luz", x: 24, y: 26.5, r: 6, tom: "fria" },
        { t: "luz", x: 2.8, y: 10.7, r: 4.5, tom: "fria" },
        { t: "texto", x: 24, y: 29, txt: "porta frontal entreaberta", tam: 0.9 },
        { t: "parede", x: 3.1, y: 9.4, w: 12, h: 0.6 },
        { t: "parede", x: 14.5, y: 3.1, w: 0.6, h: 6.5 },
        { t: "porta", x: 8, y: 9.4, w: 2.2, h: 0.6, estado: "fechada" },
        { t: "texto", x: 8.6, y: 6, txt: "CÔMODO ISOLADO", tam: 0.82 },
        { t: "texto", x: 8.6, y: 7.4, txt: "virou forno", tam: 0.72 },
        { t: "parede", x: 31.5, y: 3.1, w: 0.6, h: 6.5 },
        { t: "parede", x: 32.1, y: 9.4, w: 14.8, h: 0.6 },
        { t: "porta", x: 38, y: 9.4, w: 2.2, h: 0.6, estado: "fechada" },
        { t: "texto", x: 39.4, y: 6, txt: "CÔMODO ISOLADO", tam: 0.82 },
        { t: "texto", x: 39.4, y: 7.4, txt: "virou forno", tam: 0.72 },
        { t: "parede", x: 3.1, y: 19.6, w: 9.4, h: 0.6 },
        { t: "parede", x: 12.5, y: 19.6, w: 0.6, h: 7.3 },
        { t: "porta", x: 12.5, y: 23, w: 0.6, h: 2.2, estado: "quebrada" },
        { t: "texto", x: 7.6, y: 25.9, txt: "ESCRITÓRIO", tam: 0.85 },
        { t: "movel", x: 5, y: 21.2, w: 3.4, h: 1.4, nome: "mesa" },
        { t: "destroco", x: 9.4, y: 21.6, w: 2.4, h: 2.4 },
        { t: "movel", x: 18, y: 12.6, w: 5.6, h: 3.4, nome: "maquinário" },
        { t: "movel", x: 27, y: 12.6, w: 5.6, h: 3.4, nome: "maquinário" },
        { t: "movel", x: 18, y: 18.4, w: 5.6, h: 3.4, nome: "maquinário" },
        { t: "movel", x: 27, y: 18.4, w: 5.6, h: 3.4, nome: "maquinário" },
        { t: "movel", x: 36.4, y: 13.4, w: 3.4, h: 8, nome: "esteira" },
        { t: "destroco", x: 41, y: 21.6, w: 5, h: 4 },
        { t: "destroco", x: 15.4, y: 4.6, w: 4, h: 3.4 },
        { t: "duto", x: 43.2, y: 11.6, w: 3.6, h: 1.2 },
        { t: "texto", x: 40.6, y: 12.7, txt: "dutos de ar", tam: 0.78 },
        { t: "texto", x: 25, y: 23.2, txt: "ANDAR PRINCIPAL — cinzas cobrem tudo", tam: 0.95 }
      ]
    },
    imagem: {
      url: "/mapas/m1-c7-fabrica.png",
      w: 24, h: 17.6,
      escuridao: 0.6,
      credito: "battlemap de terceiros — uso na mesa",
      pontos: [
        { n: 1, x: 4.9, y: 11.5, nome: "Entrada", detalhe: "Os agentes cruzam o pátio das caçambas e entram por aqui. Tudo calmo — até demais. O barulho vem como se uma multidão corresse na direção deles, e por um segundo se vê só um par de olhos dourados no escuro." },
        { n: 2, x: 13, y: 7.4, nome: "Esteiras e maquinário", detalhe: "Cobertura no meio do salão. Enferrujado e coberto pelo que sobrou do incêndio." },
        { n: 3, x: 19.5, y: 3.2, nome: "Escritório de vidro", detalhe: "Vidraça estilhaçada, cadeira caída. Documentos da fábrica, se você quiser adiantar parte do que está no diário." },
        { n: 4, x: 22.8, y: 2, nome: "Passarela e dutos", detalhe: "A passarela suspensa dá altura à criatura. É pela boca de duto no fim dela que ela leva as crianças — os agentes são grandes demais para passar e precisam seguir os dutos por fora." },
        { n: 5, x: 11, y: 10, nome: "Presença Perturbadora", detalhe: "Vontade DT 15 na primeira rodada, antes de qualquer um agir. Falha custa 2d6 de dano mental, metade se passar." }
      ],
      tokens: [{ nome: "Bicho papão", arte: "bicho-papao", oculto: true, elemento: "conhecimento", x: 15, y: 4.4 }],
      luzes: [
        { x: 5.4, y: 7, r: 7 }, { x: 5.4, y: 11.5, r: 6 }, { x: 5.4, y: 16.3, r: 6 },
        { x: 19.5, y: 4.4, r: 7 }, { x: 22.5, y: 1.6, r: 5 }
      ]
    },
    pontos: [
      { n: 1, x: 24, y: 26, nome: "Entrada", detalhe: "A porta frontal entreaberta dá direto no andar principal. Tudo calmo — até demais. O barulho vem como se uma multidão corresse na direção dos agentes, e por um segundo se vê só um par de olhos dourados no escuro." },
      { n: 2, x: 25, y: 15.6, nome: "Maquinário", detalhe: "Cobertura no meio do salão. Tomado pelas cinzas dos objetos reduzidos a pó." },
      { n: 3, x: 44.5, y: 12.2, nome: "Dutos de ar", detalhe: "Por onde a criatura leva as crianças. Os agentes são grandes demais para passar — é preciso seguir os dutos por fora." },
      { n: 4, x: 25, y: 10.6, nome: "Presença Perturbadora", detalhe: "Vontade DT 15 na primeira rodada. Falha custa 2d6 de dano mental, metade se passar." },
      { n: 5, x: 20, y: 8, nome: "Lembrete de mesa", detalhe: "Vale lembrar aos jogadores que dá para recordar informações sobre criaturas com Ocultismo — e que a investigação já lhes deu pistas sobre essa." }
    ],
    tokens: [{ nome: "Bicho papão", arte: "bicho-papao", oculto: true, elemento: "conhecimento", x: 34, y: 12.6 }]
  },

  {
    id: "m1-c8-ninho",
    grupo: "Missão 1 — As Mãos que nos Acolhem",
    cena: "Cena 8",
    titulo: "O ninho",
    subtitulo: "As crianças",
    elemento: "conhecimento",
    luz: "escuro",
    resumo: "Seguindo os dutos por fora, a caminhada é longa e passa por uma série de locais apertados. No fim, uma sala parcialmente desabada com seis crianças em gaiolas — as dos prontuários, exceto Jônata. Em cima de uma mesa, os papéis que a criatura arrumava durante o dia.",
    mapa: {
      w: 32, h: 20,
      formas: [
        { t: "externo", x: 0, y: 0, w: 32, h: 20, textura: "cinza" },
        { t: "duto", x: 1, y: 8.4, w: 7, h: 1.4 },
        { t: "texto", x: 5.2, y: 7.3, txt: "saída dos dutos", tam: 0.78 },
        { t: "sala", x: 8, y: 4, w: 5, h: 11, piso: "queimado" },
        { t: "parede", x: 7.6, y: 3.6, w: 5.8, h: 0.5 },
        { t: "parede", x: 7.6, y: 14.6, w: 5.8, h: 0.5 },
        { t: "parede", x: 7.6, y: 3.6, w: 0.5, h: 5 },
        { t: "parede", x: 7.6, y: 9.8, w: 0.5, h: 5.3 },
        { t: "texto", x: 10.5, y: 12.6, txt: "corredor apertado", tam: 0.72, giro: -90 },
        { t: "sala", x: 13, y: 2.5, w: 16, h: 15, piso: "queimado" },
        { t: "parede", x: 12.9, y: 2, w: 16.6, h: 0.6 },
        { t: "parede", x: 12.9, y: 17.1, w: 16.6, h: 0.6 },
        { t: "parede", x: 29, y: 2, w: 0.6, h: 15.7 },
        { t: "parede", x: 12.9, y: 2, w: 0.5, h: 3.2 },
        { t: "parede", x: 12.9, y: 12.6, w: 0.5, h: 5.1 },
        { t: "destroco", x: 22.4, y: 2.6, w: 6.4, h: 4.6 },
        { t: "destroco", x: 13.4, y: 15, w: 3.6, h: 2 },
        { t: "luz", x: 25.6, y: 4.8, r: 6.5, tom: "fria" },
        { t: "texto", x: 25.6, y: 8.5, txt: "teto desabado", tam: 0.78 },
        { t: "movel", x: 15, y: 8, w: 1.9, h: 1.9, nome: "gaiola", forma: "rect" },
        { t: "movel", x: 17.6, y: 8, w: 1.9, h: 1.9, nome: "gaiola" },
        { t: "movel", x: 20.2, y: 8, w: 1.9, h: 1.9, nome: "gaiola" },
        { t: "movel", x: 15, y: 10.8, w: 1.9, h: 1.9, nome: "gaiola" },
        { t: "movel", x: 17.6, y: 10.8, w: 1.9, h: 1.9, nome: "gaiola" },
        { t: "movel", x: 20.2, y: 10.8, w: 1.9, h: 1.9, nome: "gaiola" },
        { t: "movel", x: 24.4, y: 10.4, w: 3.4, h: 2, nome: "mesa" },
        { t: "texto", x: 21.4, y: 14.2, txt: "SALA PARCIALMENTE DESABADA", tam: 0.88 }
      ]
    },
    /* Ninho em imagem, 1491x1055 px. Escala pelas próprias gaiolas (as seis
       têm 85 px de lado e o desenho as trata como 1,9 m) e conferida na
       largura do corredor de pedra a oeste (~2 m): ~46,5 px por metro, o que
       dá 21,5 x 15,2 — a proporção do arquivo, senão o `slice` cortaria o
       corredor de acesso. A arte já traz as seis gaiolas em 3 x 2, o
       desabamento a nordeste e os destroços onde a criatura empilha os
       papéis. Escuridão leve — a arte já é quase preta — com a luz fria
       entrando pelo teto desabado. */
    imagem: {
      url: "/mapas/m1-c8-ninho.png",
      w: 21.5, h: 15.2,
      escuridao: 0.22,
      credito: "battlemap de terceiros — uso na mesa",
      pontos: [
        { n: 1, x: 11.8, y: 7.5, nome: "As seis gaiolas", detalhe: "As crianças dos prontuários, menos Jônata Magalhães. Estão assustadas e começam a chorar — uma delas manda as outras pararem, porque a criatura fica irritada com gritos." },
        { n: 2, x: 17, y: 10.3, nome: "Papéis sobre os destroços", detalhe: "Entradas de um diário sem identificação, empilhadas na madeira quebrada. Jairo não morreu no incêndio: ficou preso nos escombros, com medo constante de que o filho tivesse morrido nas chamas. Ele ouvia algo se aproximando, pedindo ajuda." },
        { n: 3, x: 17.2, y: 11.8, nome: "As duas consciências", detalhe: "Jairo viu o próprio filho no bicho papão e passou a cuidar dele. Começou a se confundir com a criatura, a ponto de não separar mais os dois no diário. As marcas nas costas das crianças são as mãos dele, e aparecem algum tempo antes do ataque." },
        { n: 4, x: 2.6, y: 6.9, nome: "Corredor de acesso", detalhe: "Caminho apertado desde a saída dos dutos, ~2 m de largura. Boa hora para tensão antes da revelação." },
        { n: 5, x: 15.4, y: 12.25, nome: "Mancha de sangue", detalhe: "Fora do texto da missão, mas a arte entrega: Medicina DT 15 diz que é humano, antigo e de mais de uma pessoa. Não é de nenhuma das seis crianças — são de antes." },
        { n: 6, x: 17.6, y: 3.2, nome: "Teto desabado", detalhe: "A única luz do lugar entra por aqui. Escalar os escombros exige Atletismo DT 15 e é a saída mais rápida com as crianças — mas faz barulho." }
      ],
      tokens: [],
      luzes: [{ x: 17.6, y: 3.2, r: 6 }]
    },
    pontos: [
      { n: 1, x: 18.5, y: 9.4, nome: "As seis gaiolas", detalhe: "As crianças dos prontuários, menos Jônata Magalhães. Estão assustadas e começam a chorar — uma delas manda as outras pararem, porque a criatura fica irritada com gritos." },
      { n: 2, x: 26, y: 11.4, nome: "Papéis sobre a mesa", detalhe: "Entradas de um diário sem identificação. Jairo não morreu no incêndio: ficou preso nos escombros, com medo constante de que o filho tivesse morrido nas chamas. Ele ouvia algo se aproximando, pedindo ajuda." },
      { n: 3, x: 26, y: 13.4, nome: "As duas consciências", detalhe: "Jairo viu o próprio filho no bicho papão e passou a cuidar dele. Começou a se confundir com a criatura, a ponto de não separar mais os dois no diário. As marcas nas costas das crianças são as mãos dele, e aparecem algum tempo antes do ataque." },
      { n: 4, x: 10.5, y: 9.4, nome: "Corredor de acesso", detalhe: "Caminho apertado desde a saída dos dutos. Boa hora para tensão antes da revelação." }
    ],
    tokens: []
  }
];

if (typeof window !== "undefined") {
  window.CENARIOS = CENARIOS;
  window.ELEMENTOS = ELEMENTOS;
}
