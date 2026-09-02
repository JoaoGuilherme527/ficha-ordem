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
  revele cômodo por cômodo conforme os agentes avançam.
- **Dados** — d4 a d100 ou expressão (`2d6+3`). O resultado aparece grande na
  TV por alguns segundos; máximo natural em dourado, 1 natural em vermelho.
- **Pontos de interesse** — os círculos numerados. Clicar abre a pista e os
  testes no painel do mestre **e** revela o número na TV. Clicar de novo esconde.
- **Aviso na tela** — texto grande sobre o mapa, para chamar um teste ou uma
  revelação.
- **Desenho ou imagem** — duas cenas já vêm com battlemap em `mapas/`: o casebre
  (Cena 4) e a fábrica (Cena 7). O botão **Ver desenho / Ver imagem** alterna
  entre as duas vistas, e cada vista guarda os próprios tokens e pontos de
  interesse — mover token na imagem não bagunça o desenho.
- **Calibração de grade** — com imagem ativa, informe quantos quadrados ela tem
  na largura e na altura. Aí o token de 1 metro cai exatamente numa casa da
  grade da imagem. Casebre é 19×14, fábrica 24×17,6.
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
  tudo e voltar não perde a mesa.
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
assets/mesa.css        estilos (mesmos tokens de design do index.html)
assets/mapa.js         renderizador: texturas de piso, paredes e móveis
assets/mesa.js         painel do mestre e palco
assets/cenarios.js     os cenários e a geometria dos mapas
vendor/supabase.js     o bundle que já estava embutido no index.html,
                       agora em arquivo para as duas rotas usarem
```

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
