# Rota `/mesa` — cenários 2D na TV

Segunda rota do mesmo projeto. Usa a mesma conexão com o Supabase e a mesma
sessão de login do app das fichas — quem já entrou em `/` não precisa entrar
de novo.

## Como usar na sessão

1. `Win + P` → **Estender**. A TV vira a segunda tela.
2. Abra `/mesa` no notebook e clique em **Abrir tela dos jogadores**.
3. Arraste a janela nova para a TV e aperte `F11`.
4. Monte a cena com a TV ainda na tela de espera. Quando estiver pronto,
   **Revelar cena**.

O notebook fica com os controles, os pontos de interesse e as pistas. A TV
mostra só o mapa, os tokens e a faixa de status.

Na janela da TV a **roda do mouse aproxima o mapa** no ponto onde o cursor
está — dá para mostrar um canto da planta sem trocar de cena. **Duplo clique**
volta a cena inteira, e trocar de cenário também zera o zoom. É zoom só desta
janela: o painel do mestre não muda junto.

## O que a tela do mestre faz

- **Cenários** — 3 genéricos e as 10 cenas de *As Mãos que nos Acolhem*.
- **Tokens** — arraste no mapa; a TV acompanha na hora. Selecione um token e
  clique numa das cores para marcar o elemento. **Lanterna** liga um facho de
  luz no token selecionado.
- **Token com a cara do personagem** — cada jogador envia a imagem na própria
  ficha, na aba Agente: "Token do agente → Enviar imagem…". A imagem entra
  **inteira**: é encaixada dentro de 160×160 mantendo a proporção, com as
  sobras transparentes, e guardada dentro de `ficha.token` junto com o resto da
  ficha — não precisa de bucket de arquivos nem de configuração extra. Costuma
  dar 8 a 15 KB. Fundo transparente (PNG/WebP) fica melhor no mapa.
  No mapa a arte é desenhada por cima da bola, transbordando a moldura: a bola
  marca a casa na grade e continua sendo a alça de arraste, e o anel de vida
  fica por baixo da arte.
  No painel, **Trazer agentes** põe no mapa um token para cada agente do banco,
  já com a foto. Para vincular uma peça que já existe, selecione o token e
  escolha o agente na lista que aparece embaixo do mapa.
- **Anel de vida** — token vinculado a um agente ganha um anel em volta com a
  vida atual: verde enquanto está bem, âmbar abaixo de 25%, vermelho pulsando
  quando o agente está morrendo. Atualiza sozinho quando o jogador mexe na
  ficha pelo celular.
- **Iluminação** — cada cena tem um nível de luz (claro, penumbra, escuro).
  No escuro, só se enxerga o que estiver perto de uma fonte de luz: as velas do
  ritual, o luar entrando pela porta, as lanternas dos agentes. As velas
  tremulam. No painel do mestre a escuridão é atenuada para dar para trabalhar;
  na TV ela vale inteira. O botão **Luz** desliga tudo isso.
- **Cômodos** — ligue o modo e clique numa sala para escondê-la na TV (vira um
  bloco preto). Clique de novo para revelar. É a névoa de guerra da casa:
  revele cômodo por cômodo conforme os agentes avançam. Só funciona no desenho,
  porque depende da geometria das salas; sobre imagem use os **Blocos**.
- **Blocos** — a névoa livre, que funciona nas duas vistas. Ligue **Blocos** e
  arraste no vazio para criar um retângulo preto, no corpo dele para mover, na
  alça do canto para redimensionar. Shift cria um bloco dentro de outro (sem
  isso, um bloco grande não deixaria desenhar nada por cima dele). Para o
  mestre o bloco é translúcido, para os jogadores é preto opaco, e sempre fica
  **por cima dos tokens** — cobre a peça que estiver embaixo. Ficam gravados
  por vista, então trocar de cena e voltar não perde o que você montou.
- **Elenco** — monstros e NPCs com arte, no card **Monstros**. Escolha no
  `select` (agrupado em Monstros e Pessoas, com "(desta cena)" em quem
  pertence à cena aberta) e **Colocar em cena** põe a peça no meio do mapa,
  pronta para arrastar. **Mostrar na TV** apaga o palco inteiro — legenda,
  faixa de agentes, aviso, mapa — e deixa só a arte da criatura no escuro;
  **Voltar para a cena** desfaz. A revelação vale mesmo com a cena ainda
  oculta, que é quando o susto funciona, e continua valendo se você trocar de
  cena por trás dela.
- **Peça oculta** — **Esconder na TV** tira o token da tela dos jogadores sem
  tirar do seu mapa: você vê a peça tracejada e meia-tinta, eles não veem nada
  (nem a luz da lanterna dela). É assim que o existido já vem montado no porão
  e o bicho papão na fábrica, no lugar certo, sem entregar a surpresa. Clique
  de novo para mostrar.
- **Versão morta** — selecione uma peça do elenco no mapa e, se houver arte
  `-morto` na pasta, o botão **Versão morta** troca o desenho (e deixa a peça
  acinzentada). O corpo do existido na Cena 6 já entra assim.
- **Dados** — d4 a d100 ou expressão (`2d6+3`). O resultado aparece grande na
  TV por alguns segundos; máximo natural em dourado, 1 natural em vermelho.
- **Pontos de interesse** — os círculos numerados. Clicar abre a pista e os
  testes no painel do mestre **e** revela o número na TV. Clicar de novo esconde.
- **Aviso na tela** — texto grande sobre o mapa, para chamar um teste ou uma
  revelação.
- **Desenho ou imagem** — todas as treze cenas já vêm com battlemap em
  `mapas/`. O botão **Ver desenho / Ver imagem** alterna entre as duas vistas,
  e cada vista guarda os próprios tokens e pontos de interesse — mover token na
  imagem não bagunça o desenho.
- **Cenas que dividem o mesmo cômodo** — três pares reaproveitam arte, porque
  são o mesmo lugar em momentos diferentes. Consultório (Cena 2) e Revolta
  Parental (Cena 3) são a mesma planta em dois arquivos: no segundo a porta da
  rua saiu das dobradiças, a porta interna virou lascas e a janela está
  estilhaçada. Sozinho no Escuro (Cena 5) e Amor Profano (Cena 6) apontam para
  o **mesmo arquivo**, com pontos de interesse diferentes — na 5 são a criatura
  e o teste de Presença Perturbadora, na 6 são os documentos e a caixa de
  música.
- **Calibração de grade** — com imagem ativa, informe quantos quadrados ela tem
  na largura e na altura. Aí o token de 1 metro cai exatamente numa casa da
  grade da imagem. O que já vem calibrado:

  | cena | imagem | grade |
  | --- | --- | --- |
  | Beco sem saída | `beco-sem-saida.png` | 21,5 × 11,4 |
  | Casa abandonada | `casa-abandonada.png` | 19,5 × 13,5 |
  | Galpão de cargas | `galpao-de-cargas.png` | 26,75 × 16,3 |
  | Prólogo — Base | `base-ordem.png` | 32,2 × 19 |
  | Cena 1 — Casa de Felipe | `m1-c1-felipe.png` | 18,5 × 13,6 |
  | Cena 2 — Consultório | `m1-c2-consultorio.jpg` | 8,1 × 5,28 |
  | Cena 3 — Revolta Parental | `m1-c3-revolta.jpg` | 8,1 × 5,28 |
  | Cena 4 — Casebre | `m1-c4-casebre.jpg` | 19 × 14 |
  | Cena 5 — Sozinho no Escuro | `m1-c5-porao.png` | 14 × 9,33 |
  | Cena 6 — Amor Profano | `m1-c5-porao.png` (o mesmo) | 14 × 9,33 |
  | Interlúdio — Pousada | `m1-interludio-pousada.png` | 17,9 × 14,53 |
  | Cena 7 — Fábrica | `m1-c7-fabrica.jpg` | 24 × 17,6 |
  | Cena 8 — Ninho | `m1-c8-ninho.png` | 21,5 × 15,2 |

  A grade de cada imagem **tem que respeitar a proporção do arquivo**: o mapa é
  desenhado com `preserveAspectRatio="slice"`, então uma proporção errada corta
  as bordas da arte. Os comentários em `assets/cenarios.js` registram de onde
  saiu a escala de cada uma (cama, porta, gaiola — algum objeto de tamanho
  conhecido na própria arte).
- **Enviar imagem** — "Enviar imagem…" troca o desenho pela imagem
  que você escolher em qualquer cena, sem mexer no repositório.
  Tokens, luz e grade continuam funcionando por cima. A imagem viaja para a
  janela da TV pela mesma sincronia, mas fica só em memória: ao recarregar a
  página é preciso enviá-la de novo (o nome fica anotado para lembrar). Para
  mapa permanente, salve o arquivo no repositório e aponte `imagem:` na cena em
  `assets/cenarios.js`.
- **Agentes e rolagens** — vêm das tabelas `agentes` e `rolagens`. Se o jogador
  perder vida no celular, a barra na TV muda.

## Sincronia

Duas camadas:

- Entre as duas janelas (notebook ↔ TV): `BroadcastChannel`, mesma origem,
  sem servidor. O estado da cena também fica no `localStorage`, então fechar
  tudo e voltar não perde a mesa — vale para posição de token, peça oculta,
  versão morta, blocos, cômodos escondidos e calibração de grade. O estado tem
  um número de versão: quando o conjunto de tokens padrão das cenas muda, as
  peças guardadas são descartadas na primeira carga para não ressuscitar
  tokens que saíram do repositório. O resto do estado sobrevive.
- Entre os celulares e a TV: Supabase. A rota tenta `postgres_changes` em
  `agentes` e `rolagens`; se o Realtime não estiver habilitado no projeto, ela
  cai sozinha para uma consulta a cada 10 segundos. O indicador no topo mostra
  qual dos dois está valendo.

Para ligar o Realtime e ganhar a atualização instantânea:

```sql
alter publication supabase_realtime add table public.agentes;
alter publication supabase_realtime add table public.rolagens;
```

## Arquivos

```
mesa.html              a rota
mapas/                 battlemaps das cenas que têm imagem
tokens/                arte de monstros e NPCs
ref/                   material de origem (o PDF de Casos Paranormais)
assets/mesa.css        estilos (mesmos tokens de design do index.html)
assets/mapa.js         renderizador: texturas de piso, paredes e móveis
assets/mesa.js         painel do mestre e palco
assets/cenarios.js     os cenários e a geometria dos mapas
assets/elenco.js       catálogo de monstros e NPCs que têm arte
vendor/supabase.js     o bundle que já estava embutido no index.html,
                       agora em arquivo para as duas rotas usarem
```

### Como a pasta `tokens/` é lida

O nome do arquivo é o contrato — `assets/elenco.js` aponta para ele:

```
<id>-token.png     a peça que anda pelo mapa        obrigatória
<id>-normal.png    a arte cheia da revelação        opcional
<id>-morto.png     a criatura depois de cair        opcional
```

Sem `-normal`, **Mostrar na TV** usa o próprio token (é o caso do bicho papão e
da Dra. Ruth). Sem `-morto`, o botão de versão morta fica desligado. Para somar
alguém, salve a arte com esse padrão e acrescente uma entrada em
`assets/elenco.js` com `id`, `tipo` (`monstro` ou `pessoa`), `nome`, `elemento`,
os caminhos, o `tam` (multiplicador do tamanho da peça no mapa) e as `cenas` a
que pertence. Quem entra posicionado está nos `tokens` da cena, em
`assets/cenarios.js` — monstro vivo sempre com `oculto: true`.

O que já está catalogado: **Existido** (com `-normal` e `-morto`), **Bicho
papão**, **Felipe** e **Dra. Ruth**. Os nomes e elementos batem com o bloco de
criaturas do PDF em `ref/`.

Se uma peça não tiver `arte`, a mesa tenta casar pelo **nome** do token com o
catálogo. É a rede que faz um token chamado "Dra. Ruth" — criado na mão, ou
guardado no `localStorage` antes de a arte existir — puxar o retrato dela
sozinho. Quando mesmo assim a cena ficar com peça velha, **Repor todas as
cenas** joga fora as peças guardadas e remonta pelo repositório; blocos,
cômodos escondidos e calibração ficam.

## Mudanças no `index.html`

1. Dois atalhos para a mesa, **visíveis só para quem é mestre**: o link **Mesa**
   no cabeçalho e o botão **Abrir mesa** na tela de listagem de agentes, ao lado
   de "Atualizar". Ambos abrem em aba nova, para a lista de fichas continuar de
   pé. Quem controla é `aplicarAcessoMesa()`, chamada em `mostrar()` e em
   `renderLista()` — os dois momentos em que o perfil já veio do banco.
2. `payload()` agora grava `sessao.max` com PV, PE e Sanidade máximos. Sem isso
   a rota `/mesa` teria que recalcular origem, trilha e afinidade só para
   desenhar as barras.
3. Fichas salvas antes disso não têm o campo, e na mesa apareciam com `—` no
   lugar da vida. `completarMaximos()` resolve sozinho: a tela de listagem já
   calcula os máximos para desenhar os cards, então grava o que faltava na
   primeira vez que a lista abre. Roda uma vez por ficha, não repete se o
   banco recusar e só mexe em quem está sem o campo.

O bundle do Supabase continua embutido no `index.html` — nada foi removido de lá.

## Novos cenários

Em `assets/cenarios.js`. Cada mapa é uma lista de formas em unidades de grid
(1 unidade ≈ 1 metro). O cabeçalho do arquivo lista os tipos de forma aceitos.

Quem desenha é o `assets/mapa.js`: piso com textura (madeira, ladrilho, pedra,
concreto, concreto queimado), parede com espessura e sombra projetada, porta
com folha e arco de abertura, e móvel desenhado peça por peça — cama com
travesseiro e cobertor, fogão com quatro bocas, pia com cuba e torneira,
estante com livros, gaiola com grades, maquinário industrial.

O tipo do móvel sai do próprio nome (`nome: "geladeira"` vira uma geladeira).
Para forçar outro desenho, declare `tipo:` na forma. Os tipos disponíveis estão
na constante `TIPOS`.

Não há imagem externa: tudo é gerado, então o mapa escala sem perder nitidez em
qualquer TV. Os botões **Grade** e **Rótulos** ligam e desligam a malha de 1 m
e os nomes dos cômodos, e a TV acompanha.
