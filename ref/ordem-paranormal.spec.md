Especificação Técnica de Regras e Sistema para Ordem Paranormal RPGEsta especificação destina-se a orientar o desenvolvimento de um assistente de inteligência artificial ou sistema de software encarregado de automatizar a criação de personagens, a progressão de NEX (Nível de Exposição Paranormal) e o acompanhamento de sessões (State Tracking) para o jogo Ordem Paranormal RPG (v1.3 / v1.4), mantendo fidelidade absoluta às regras oficiais do livro. As seções 10 a 12 catalogam perícias, trilhas e origens conferidas contra o PDF do livro básico v1.3; as seções 13 e 14 descrevem o modelo multiusuário e os requisitos de interface do aplicativo.
--------------------------------------------------------------------------------
1. Visão Geral e Elementos do Sistema1.1 Elementos ParanormaisO Outro Lado manifesta-se através de cinco entidades/elementos principais que regem as regras de rituais, poderes paranormais e vulnerabilidades das criaturas:Sangue: Entidade do físico, dor, paixão e violência. Oposto de Morte.Morte: Entidade do tempo, decadência, lodo e entropia. Oposto de Sangue.Conhecimento: Entidade da razão, sigilos, percepção e verdade. Oposto de Energia.Energia: Entidade do caos, eletricidade, sorte, mudança e fogo. Oposto de Conhecimento.Medo: O elemento misterioso primordial, que interage com a Membrana e define as ameaças mais extremas e os rituais de 4º Círculo.1.2 A MembranaA barreira invisível que separa a Realidade do Outro Lado. Mecanicamente, o enfraquecimento da Membrana (Intacta, Danificada, Ruída, Arruinada) afeta a dificuldade (DT) de rituais e a facilidade com que manifestações paranormais ocorrem.
--------------------------------------------------------------------------------
2. Modelo de Dados do Agente (Character State Schema)Para fins de programação, o personagem é modelado como um estado JSON composto com as seguintes definições lógicas:{
  "identificacao": {
    "nome": "string",
    "jogador": "string",
    "conceito": "string",
    "origem": "string",
    "classe": "string",
    "trilha": "string",
    "nex": 5,
    "pontos_prestigio": 0,
    "patente": "Recruta",
    "afinidade": "string | null"
  },
  "atributos": {
    "agilidade": 1,
    "forca": 1,
    "intelecto": 1,
    "presenca": 1,
    "vigor": 1
  },
  "caracteristicas_derivadas": {
    "pv_max": "int",
    "pv_atuais": "int",
    "pv_temporarios": 0,
    "pe_max": "int",
    "pe_atuais": "int",
    "pe_temporarios": 0,
    "san_max": "int",
    "san_atuais": "int",
    "defesa_base": "10 + agilidade",
    "defesa_total": "int",
    "esquiva_bonus": "int",
    "bloqueio_bonus": "int",
    "carga_maxima": "forca * 5",
    "limite_pe_turno": "int"
  },
  "pericias": {
    "acrobacia": {"grau": "Leigo", "bonus_treino": 0, "outros": 0},
    "adestramento": {"grau": "Leigo", "bonus_treino": 0, "outros": 0},
    "artes": {"grau": "Leigo", "bonus_treino": 0, "outros": 0},
    "atletismo": {"grau": "Leigo", "bonus_treino": 0, "outros": 0},
    "atualidades": {"grau": "Leigo", "bonus_treino": 0, "outros": 0},
    "ciencias": {"grau": "Leigo", "bonus_treino": 0, "outros": 0},
    "crime": {"grau": "Leigo", "bonus_treino": 0, "outros": 0},
    "diplomacia": {"grau": "Leigo", "bonus_treino": 0, "outros": 0},
    "enganacao": {"grau": "Leigo", "bonus_treino": 0, "outros": 0},
    "fortitude": {"grau": "Leigo", "bonus_treino": 0, "outros": 0},
    "furtividade": {"grau": "Leigo", "bonus_treino": 0, "outros": 0},
    "iniciativa": {"grau": "Leigo", "bonus_treino": 0, "outros": 0},
    "intimidacao": {"grau": "Leigo", "bonus_treino": 0, "outros": 0},
    "intuicao": {"grau": "Leigo", "bonus_treino": 0, "outros": 0},
    "investigacao": {"grau": "Leigo", "bonus_treino": 0, "outros": 0},
    "luta": {"grau": "Leigo", "bonus_treino": 0, "outros": 0},
    "medicina": {"grau": "Leigo", "bonus_treino": 0, "outros": 0},
    "ocultismo": {"grau": "Leigo", "bonus_treino": 0, "outros": 0},
    "percepcao": {"grau": "Leigo", "bonus_treino": 0, "outros": 0},
    "pilotagem": {"grau": "Leigo", "bonus_treino": 0, "outros": 0},
    "pontaria": {"grau": "Leigo", "bonus_treino": 0, "outros": 0},
    "profissao": {"grau": "Leigo", "bonus_treino": 0, "outros": 0},
    "reflexos": {"grau": "Leigo", "bonus_treino": 0, "outros": 0},
    "religiao": {"grau": "Leigo", "bonus_treino": 0, "outros": 0},
    "sobrevivencia": {"grau": "Leigo", "bonus_treino": 0, "outros": 0},
    "tatica": {"grau": "Leigo", "bonus_treino": 0, "outros": 0},
    "tecnologia": {"grau": "Leigo", "bonus_treino": 0, "outros": 0},
    "vontade": {"grau": "Leigo", "bonus_treino": 0, "outros": 0}
  },
  "proficiencias": ["string"],
  "habilidades_classe": [],
  "habilidades_origem": [],
  "poderes_paranormais": [],
  "rituais_conhecidos": [],
  "inventario": {
    "limite_itens_i": 0,
    "limite_itens_ii": 0,
    "limite_itens_iii": 0,
    "limite_itens_iv": 0,
    "itens": []
  },
  "condicoes": []
}

--------------------------------------------------------------------------------
3. Algoritmo de Criação de Personagem (NEX 5%)Para criar um novo agente novato (NEX 5%), o sistema deve executar a seguinte esteira lógica obrigatoriamente:Passo 1: Geração de AtributosTodos os cinco atributos (Agilidade, Força, Intelecto, Presença, Vigor) começam em 1.O jogador recebe 4 pontos para distribuir livremente entre os atributos.Restrição Inicial: O valor máximo inicial de qualquer atributo é 3.Regra de Redução: O jogador pode reduzir um único atributo inicial para 0 para receber 1 ponto adicional (totalizando 5 pontos para distribuir). Um atributo nunca pode ser reduzido abaixo de 0 na criação de personagem.Passo 2: Escolha de OrigemO jogador escolhe uma das 26 Origens oficiais da Tabela 1.1. Cada origem define compulsoriamente duas perícias treinadas (o que concede bônus de +5 e altera o grau de Leigo para Treinado) e um poder de origem com efeito mecânico ativo ou passivo:Rolo (2d20)OrigemPerícias TreinadasPoder de Origem (Mecânica Exata)2-8AcadêmicoCiências, InvestigaçãoSaber é Poder: Pode gastar 2 PE para receber +5 em um teste usando Intelecto (declarado antes de rolar).9-10Agente de SaúdeIntuição, MedicinaTécnica Medicinal: Sempre que cura um personagem, você adiciona seu Intelecto no total de PV curados.11AmnésicoDuas à escolha do mestreVislumbres do Passado: Uma vez por sessão, pode rolar teste de Intelecto (DT 10) para reconhecer pessoas/lugares. Sucesso concede 1d4 PE temporários.12-13ArtistaArtes, EnganaçãoMagnum Opus: Uma vez por missão, faz um alvo na cena de interação lhe reconhecer; concede +5 em testes de Presença e perícias de Presença contra esse alvo.14-15AtletaAcrobacia, Atletismo110%: Ao fazer teste de perícia usando Força ou Agilidade (exceto Luta/Pontaria), pode gastar 2 PE para receber +5 de bônus.16ChefFortitude, Profissão (cozinheiro)Ingrediente Secreto: Em interlúdios, a ação alimentar-se permite cozinhar prato especial. O bônus concedido é dobrado (ou acumula efeitos).17CriminosoCrime, FurtividadeO Crime Compensa: Ao final de uma missão, escolhe um item encontrado. Na próxima missão ele não conta no limite de itens por patente no inventário.18Cultista ArrependidoOcultismo, ReligiãoTraços do Outro Lado: Começa com um Poder Paranormal à escolha (cumprindo requisitos), mas sua Sanidade Inicial (SAN) é reduzida permanentemente à metade.19DesgarradoFortitude, SobrevivênciaCalejado: O agente recebe +1 PV máximo para cada 5% de NEX cumulativo (retroativo).20EngenheiroProfissão, TecnologiaFerramenta Favorita: Escolhe um item geral (exceto armas); sua Categoria de Prestígio é reduzida em I (mínimo Categoria 0).21ExecutivoDiplomacia, ProfissãoProcesso Otimizado: Durante testes estendidos ou ações de revisar documentos, pode gastar 2 PE para receber +5 no teste de perícia.22-23InvestigadorInvestigação, PercepçãoFaro para Pistas: Uma vez por cena, ao realizar testes para procurar pistas (Investigação), pode gastar 1 PE para receber +5 no teste.24LutadorLuta, ReflexosMão Pesada: Recebe bônus passivo de +2 em rolagens de dano com ataques corpo a corpo.25MagnataDiplomacia, PilotagemPatrocinador da Ordem: Seu Limite de Crédito de Patente é considerado permanentemente um nível acima.26MercenárioIniciativa, IntimidaçãoPosição de Combate: No primeiro turno de uma cena de ação, pode gastar 2 PE para receber uma ação de movimento adicional.27MilitarPontaria, TáticaPara Bellum: Recebe bônus passivo de +2 em rolagens de dano usando qualquer tipo de arma de fogo.28OperárioFortitude, ProfissãoFerramenta de Trabalho: Escolhe uma arma simples/tática que possa servir de ferramenta profissional. Recebe +1 em testes de ataque, dano e margem de ameaça com ela.29-30PolicialPercepção, PontariaPatrulha: Recebe bônus passivo permanente de +2 na Defesa (Defesa total).31ReligiosoReligião, VontadeAcalentar: Recebe +5 em testes de Religião para acalmar. Ao acalmar com sucesso, o alvo recupera 1d6 + Presença de Sanidade.32Servidor PúblicoIntuição, VontadeEspírito Cívico: Ao usar a ação de ajudar, pode gastar 1 PE para aumentar o bônus de teste concedido ao aliado em +2.33Teórico da ConspiraçãoInvestigação, OcultismoEu Já Sabia: Recebe resistência permanente a dano mental igual ao seu valor de Intelecto.34T.I.Investigação, TecnologiaMotor de Busca: Se houver acesso à internet, pode gastar 2 PE para substituir qualquer teste de perícia por um teste de Tecnologia (a critério do mestre).35Trabalhador RuralAdestramento, SobrevivênciaDesbravador: Pode gastar 2 PE para receber +5 em Adestramento ou Sobrevivência. Não sofre penalidade de deslocamento em terreno difícil.36TrambiqueiroCrime, EnganaçãoImpostor: Uma vez por cena, pode gastar 2 PE para substituir o teste de qualquer perícia por um teste de Enganação.37-38UniversitárioAtualidades, InvestigaçãoDedicação: Recebe +1 PE máximo, e +1 PE adicional a cada NEX ímpar (15%, 25%, etc.). Seu limite de PE por turno é aumentado em +1 (em NEX 5% o limite é 2, etc.).39-40VítimaReflexos, VontadeCicatrizes Psicológicas: O agente recebe +1 ponto de Sanidade máxima para cada 5% de NEX cumulativo (retroativo).Nota de Desenvolvimento: Se o jogador receber treinamento em uma perícia de origem que também seja concedida de forma fixa por sua Classe, ele deve obrigatoriamente escolher outra perícia qualquer para se tornar treinado em seu lugar.
--------------------------------------------------------------------------------
Passo 3: Escolha de Classe e Cálculo dos Atributos DerivadosA classe do agente dita sua progressão de Pontos de Vida (PV), Pontos de Esforço (PE), Sanidade (SAN), suas perícias treinadas de classe e suas proficiências iniciais.Classe A: CombatentePV Iniciais: 20 + Vigor (em NEX 5%).PE Iniciais: 2 + Presença (em NEX 5%).Sanidade Inicial: 12.Perícias de Classe:Luta ou Pontaria (escolha de 1).Fortitude ou Reflexos (escolha de 1).Mais uma quantidade de perícias à escolha do jogador igual a 1 + Intelecto.Proficiências: Armas simples, armas táticas e proteções leves.Habilidade de NEX 5%:Ataque Especial: Quando faz um ataque, gasta 2 PE para receber +5 no teste de ataque ou na rolagem de dano (decidido antes da rolagem).Classe B: EspecialistaPV Iniciais: 16 + Vigor (em NEX 5%).PE Iniciais: 3 + Presença (em NEX 5%).Sanidade Inicial: 16.Perícias de Classe:Uma quantidade de perícias livres à sua escolha igual a 7 + Intelecto.Proficiências: Armas simples e proteções leves.Habilidade de NEX 5%:Eclético: Pode gastar 2 PE para realizar um teste de perícia não treinada como se fosse treinado (recebendo o bônus de +5).Perito: Escolhe duas perícias treinadas (exceto Luta e Pontaria). Ao fazer um teste de uma delas, pode gastar 2 PE para rolar e somar +1d6 ao resultado.Classe C: OcultistaPV Iniciais: 12 + Vigor (em NEX 5%).PE Iniciais: 4 + Presença (em NEX 5%).Sanidade Inicial: 20.Perícias de Classe:Ocultismo (Treinada obrigatoriamente).Vontade (Treinada obrigatoriamente).Mais uma quantidade de perícias livres à escolha do jogador igual a 3 + Intelecto.Proficiências: Apenas armas simples. Não possui proficiência com armaduras.Habilidade de NEX 5%:Escolhido pelo Outro Lado: O agente pode conjurar rituais de 1º Círculo. Ele aprende três rituais de 1º Círculo no NEX 5%.
--------------------------------------------------------------------------------
4. Progressão de NEX (Nível de Exposição Paranormal)Sempre que o NEX do personagem aumenta (geralmente em incrementos de 5%), o sistema deve atualizar os valores acumulados e disparar eventos mecânicos específicos conforme a tabela de progressão a seguir:4.1 Tabela de Progressão de NEX e Benefícios MecânicosNEXLimite PE/TurnoCombatenteEspecialistaOcultistaMarcos de Progressão e Habilidades5%1---Ataque Especial / Eclético + Perito / Escolhido pelo Outro Lado10%2+(4 + Vigor) PV, +(2 + Presença) PE, +3 SAN+(3 + Vigor) PV, +(3 + Presença) PE, +4 SAN+(2 + Vigor) PV, +(4 + Presença) PE, +5 SANHabilidade de Trilha (Nível 1)15%3+(4 + Vigor) PV, +(2 + Presença) PE, +3 SAN+(3 + Vigor) PV, +(3 + Presença) PE, +4 SAN+(2 + Vigor) PV, +(4 + Presença) PE, +5 SANPoder de Classe20%4+(4 + Vigor) PV, +(2 + Presença) PE, +3 SAN+(3 + Vigor) PV, +(3 + Presença) PE, +4 SAN+(2 + Vigor) PV, +(4 + Presença) PE, +5 SANAumento de Atributo (+1)25%5+(4 + Vigor) PV, +(2 + Presença) PE, +3 SAN+(3 + Vigor) PV, +(3 + Presença) PE, +4 SAN+(2 + Vigor) PV, +(4 + Presença) PE, +5 SANEscolhidos pelo Outro Lado: Rituais de 2º Círculo (Ocultista)30%6+(4 + Vigor) PV, +(2 + Presença) PE, +3 SAN+(3 + Vigor) PV, +(3 + Presença) PE, +4 SAN+(2 + Vigor) PV, +(4 + Presença) PE, +5 SANPoder de Classe35%7+(4 + Vigor) PV, +(2 + Presença) PE, +3 SAN+(3 + Vigor) PV, +(3 + Presença) PE, +4 SAN+(2 + Vigor) PV, +(4 + Presença) PE, +5 SANGrau de Treinamento / Dano de Artista Marcial aumenta40%8+(4 + Vigor) PV, +(2 + Presença) PE, +3 SAN+(3 + Vigor) PV, +(3 + Presença) PE, +4 SAN+(2 + Vigor) PV, +(4 + Presença) PE, +5 SANHabilidade de Trilha (Nível 2)45%9+(4 + Vigor) PV, +(2 + Presença) PE, +3 SAN+(3 + Vigor) PV, +(3 + Presença) PE, +4 SAN+(2 + Vigor) PV, +(4 + Presença) PE, +5 SANPoder de Classe50%10+(4 + Vigor) PV, +(2 + Presença) PE, +3 SAN+(3 + Vigor) PV, +(3 + Presença) PE, +4 SAN+(2 + Vigor) PV, +(4 + Presença) PE, +5 SANAumento de Atributo (+1), Versatilidade e Afinidade55%11+(4 + Vigor) PV, +(2 + Presença) PE, +3 SAN+(3 + Vigor) PV, +(3 + Presença) PE, +4 SAN+(2 + Vigor) PV, +(4 + Presença) PE, +5 SANEscolhidos pelo Outro Lado: Rituais de 3º Círculo (Ocultista)60%12+(4 + Vigor) PV, +(2 + Presença) PE, +3 SAN+(3 + Vigor) PV, +(3 + Presença) PE, +4 SAN+(2 + Vigor) PV, +(4 + Presença) PE, +5 SANPoder de Classe65%13+(4 + Vigor) PV, +(2 + Presença) PE, +3 SAN+(3 + Vigor) PV, +(3 + Presença) PE, +4 SAN+(2 + Vigor) PV, +(4 + Presença) PE, +5 SANHabilidade de Trilha (Nível 3)70%14+(4 + Vigor) PV, +(2 + Presença) PE, +3 SAN+(3 + Vigor) PV, +(3 + Presença) PE, +4 SAN+(2 + Vigor) PV, +(4 + Presença) PE, +5 SANGrau de Treinamento75%15+(4 + Vigor) PV, +(2 + Presença) PE, +3 SAN+(3 + Vigor) PV, +(3 + Presença) PE, +4 SAN+(2 + Vigor) PV, +(4 + Presença) PE, +5 SANPoder de Classe / Engenhosidade evolui para Expert80%16+(4 + Vigor) PV, +(2 + Presença) PE, +3 SAN+(3 + Vigor) PV, +(3 + Presença) PE, +4 SAN+(2 + Vigor) PV, +(4 + Presença) PE, +5 SANAumento de Atributo (+1)85%17+(4 + Vigor) PV, +(2 + Presença) PE, +3 SAN+(3 + Vigor) PV, +(3 + Presença) PE, +4 SAN+(2 + Vigor) PV, +(4 + Presença) PE, +5 SANEscolhidos pelo Outro Lado: Rituais de 4º Círculo (Ocultista)90%18+(4 + Vigor) PV, +(2 + Presença) PE, +3 SAN+(3 + Vigor) PV, +(3 + Presença) PE, +4 SAN+(2 + Vigor) PV, +(4 + Presença) PE, +5 SANPoder de Classe95%19+(4 + Vigor) PV, +(2 + Presença) PE, +3 SAN+(3 + Vigor) PV, +(3 + Presença) PE, +4 SAN+(2 + Vigor) PV, +(4 + Presença) PE, +5 SANAumento de Atributo (+1)99%20+(4 + Vigor) PV, +(2 + Presença) PE, +3 SAN+(3 + Vigor) PV, +(3 + Presença) PE, +4 SAN+(2 + Vigor) PV, +(4 + Presença) PE, +5 SANHabilidade de Trilha (Nível 4)Regra de Ganho por Atributo: Conforme o livro oficial, cada incremento de NEX concede PV iguais ao valor da classe somado ao Vigor do agente, e PE iguais ao valor da classe somado à Presença. A Sanidade por NEX é fixa e não recebe atributo.
Regra de Ganho Retroativo: Se o atributo Vigor ou Presença for aumentado (ex: através do marco de Aumento de Atributo), os pontos de PV máximo ou PE máximo correspondentes ao modificador devem ser recalculados e adicionados de forma retroativa para todos os níveis (NEX) já alcançados.
--------------------------------------------------------------------------------
4.2 Detalhamento de Marcos de ProgressãoAumento de Atributo (NEX 20%, 50%, 80%, 95%)O jogador escolhe um atributo e aumenta seu valor em +1.Limite: Um atributo não pode ser aumentado além do limite de 5 através deste marco.Grau de Treinamento (NEX 35% e 70%)O jogador pode aumentar o grau de perícias que já estejam pelo menos no nível Treinado. Os modificadores de bônus são:Treinado = +5Veterano = +10 (Liberado a partir de NEX 35%)Expert = +15 (Liberado a partir de NEX 70%)A quantidade de perícias selecionadas para subir de grau varia de acordo com a classe e o Intelecto:Combatente: 2 + Intelecto perícias.Especialista: 5 + Intelecto perícias.Ocultista: 3 + Intelecto perícias.Versatilidade (NEX 50%)O jogador deve escolher uma das opções abaixo:Receber um Poder de Classe adicional da sua própria classe.Adquirir a habilidade de NEX 10% (Nível 1) de outra Trilha da sua própria classe.Afinidade Paranormal (NEX 50%)Ao alcançar 50% de NEX, o agente se conecta ao paranormal por meio de um elemento (Sangue, Morte, Conhecimento ou Energia). Esta escolha é permanente:O agente recebe +2 dados (bônus de +OO) em testes de resistência contra efeitos do elemento escolhido.O agente sofre -2 dados (penalidade de -OO) em testes contra efeitos do elemento opressor (Sangue <-> Morte / Conhecimento <-> Energia).Permite a conjuração de rituais do elemento de afinidade sem componentes ritualísticos.Permite escolher o bônus de Afinidade ao selecionar poderes paranormais do mesmo elemento no futuro.
--------------------------------------------------------------------------------
5. Catálogo de Trilhas por Classe (Habilidades Específicas)5.1 Trilhas do CombatenteTrilha 1: AniquiladorNEX 10% - A Favorita: Escolhe uma arma favorita (ex: Katana). A Categoria de Prestígio dessa arma é reduzida em I (mínimo Categoria 0).NEX 40% - Técnica Secreta: Categoria da favorita reduz em II. Ao atacar, gasta 2 PE para aplicar um dos seguintes efeitos no ataque (pode acumular efeitos gastando +2 PE por efeito):Amplo: O ataque pode atingir um alvo adicional adjacente ao original e sob alcance (usa o mesmo teste).Destruidor: Aumenta o multiplicador de crítico da arma em +1.NEX 65% - Técnica Sublime: Libera novos efeitos para a Técnica Secreta:Letal: Aumenta a margem de ameaça da arma favorita em +2 (pode aplicar duas vezes para bônus de +5).Perfurante: Ignora até 5 pontos de resistência a dano de qualquer tipo do alvo.NEX 99% - Máquina de Matar: Categoria da favorita reduz em III. A favorita recebe +2 de margem de ameaça de forma passiva e seu dano aumenta em +1 dado do mesmo tipo.Trilha 2: Comandante de CampoNEX 10% - Inspirar Confiança: Com uma reação e 2 PE, faz um aliado em alcance curto rolar novamente um teste recém-realizado.NEX 40% - Estrategista: Usa uma ação padrão e gasta 1 PE por aliado direcionado (limite igual ao Intelecto) em alcance curto. No próximo turno, esses aliados ganham uma ação de movimento adicional.NEX 65% - Brecha na Guarda: Uma vez por rodada, se um aliado causar dano em um inimigo em alcance curto, com uma reação e 2 PE o agente permite que outro aliado em alcance curto faça um ataque adicional contra ele. O alcance de Inspirar Confiança e Estrategista aumenta para médio.NEX 99% - Oficial Comandante: Gasta ação padrão e 5 PE para conceder a cada aliado visível em alcance médio uma ação padrão adicional em seus respectivos próximos turnos.Trilha 3: GuerreiroNEX 10% - Técnica Letal: Recebe bônus passivo de +2 na margem de ameaça para todos os ataques corpo a corpo.NEX 40% - Revidar: Ao realizar um bloqueio de ataque com sucesso, com uma reação e 2 PE faz um ataque corpo a corpo contra o agressor.NEX 65% - Força Opressora: Ao acertar ataque corpo a corpo, gasta 1 PE para tentar realizar manobra derrubar ou empurrar como ação livre. Se empurrar, ganha +5 no teste para cada 10 de dano causados. Se derrubar e vencer, pode gastar 1 PE para atacar o alvo caído.NEX 99% - Potência Máxima: Ao usar Ataque Especial corpo a corpo, todos os bônus numéricos do ataque são dobrados (ex: usar 5 PE concede +10 no ataque e +30 no dano).Trilha 4: Operações EspeciaisNEX 10% - Iniciativa Aprimorada: Recebe +5 de bônus em testes de Iniciativa e ganha uma ação de movimento adicional na primeira rodada do combate.NEX 40% - Ataque Extra: Uma vez por rodada, ao fazer a ação agredir, gasta 2 PE para fazer um ataque adicional.NEX 65% - Surto de Adrenalina: Uma vez por rodada, gasta 5 PE para realizar uma ação padrão ou de movimento adicional.NEX 99% - Sempre Alerta: Ganha uma ação padrão adicional no início de cada combate (rodada 1).Trilha 5: Tropa de ChoqueNEX 10% - Casca Grossa: Recebe +1 PV máximo para cada 5% de NEX. Ao bloquear um ataque, soma o valor do seu Vigor na resistência a dano recebida por aquele bloqueio.NEX 40% - Cai Dentro: Se um oponente em alcance curto atacar um aliado, com uma reação e 1 PE força o oponente a fazer teste de Vontade (DT baseada em Vigor). Se falhar, o ataque é redirecionado para o agente.NEX 65% - Duro de Matar: Ao sofrer dano não-paranormal, com uma reação e 2 PE reduz esse dano à metade. No NEX 85%, esta habilidade pode ser ativada contra dano paranormal.NEX 99% - Inquebrável: Enquanto estiver machucado (PV <= 50%), recebe +5 na Defesa e resistência a dano 5. Ao entrar no estado Morrendo, o agente não fica indefeso e pode agir normalmente, mas continua sujeito às regras normais de agonia.
--------------------------------------------------------------------------------
5.2 Trilhas do EspecialistaTrilha 1: Atirador de EliteNEX 10% - Mira de Elite: Recebe proficiência com armas táticas de fogo. Quando faz um teste de Pontaria usando arma de fogo, soma Intelecto no teste de ataque.NEX 40% - Disparo Impactante: Ao atacar com arma de fogo, gasta 2 PE para, em vez de causar dano, realizar uma manobra de combate à distância (derrubar, desarmar, empurrar, quebrar).NEX 65% - Atirar para Matar: A margem de ameaça com armas de fogo aumenta em +2 e o multiplicador de acerto crítico da arma aumenta em +1.NEX 99% - Disparo Letal: Os acertos críticos com armas de fogo causam dano máximo dos dados roláveis, sem a necessidade de jogá-los.Trilha 2: InfiltradorNEX 10% - Ataque Furtivo: Uma vez por rodada, ao atingir um alvo desprevenido ou flanqueado a curto alcance, gasta 1 PE para causar dano extra: +1d6 (NEX 10%), +2d6 (NEX 40%), +3d6 (NEX 65%), +4d6 (NEX 99%).NEX 40% - Gatuno: Recebe bônus passivo de +5 em Atletismo e Crime. Pode se deslocar com velocidade normal ao usar Furtividade para se esconder sem sofrer penalidades.NEX 65% - Assassinar: Com uma ação de movimento e 3 PE, analisa um alvo em alcance curto. Até o fim de seu próximo turno, o primeiro Ataque Furtivo que causar dano dobra os dados de dano extra. O alvo deve fazer um teste de Fortitude (DT baseada em Agilidade) ou cairá inconsciente/morrendo.NEX 99% - Sombra Fugaz: Ao rolar Furtividade após atacar ou chamar atenção, gasta 3 PE para anular a penalidade de -15 (-OOO) no teste.Trilha 3: Médico de CampoRequisito: Ser treinado em Medicina. Requer Kit de Medicina para ativar as habilidades.NEX 10% - Paramédico: Com uma ação padrão e 2 PE, cura 2d10 PV de si ou de aliado adjacente. Pode curar +1d10 PV no NEX 40%, 65% e 99% gastando +1 PE por dado extra.NEX 40% - Equipe de Trauma: Com uma ação padrão e 2 PE, remove qualquer condição negativa (exceto estado Morrendo) de um aliado adjacente.NEX 65% - Resgate: Uma vez por rodada, se estiver sob alcance curto de aliado machucado ou morrendo, pode se deslocar até ele como ação livre. Ao curar ou remover condições do aliado, ambos ganham +5 de Defesa até o próximo turno. Carga de carregar personagens cai pela metade.NEX 99% - Reanimação: Uma vez por cena, usa ação completa e 10 PE para ressuscitar um personagem que tenha morrido na mesma cena (não se aplica a mortes por dano massivo).Trilha 4: NegociadorNEX 10% - Eloquência: Com uma ação completa e 1 PE por alvo em alcance curto, realiza teste de Diplomacia, Enganação ou Intimidação contra a Vontade dos alvos. Sucesso deixa os alvos sob a condição Fascinado enquanto se concentrar.NEX 40% - Discurso Motivador: Com uma ação padrão e 4 PE, concede a si e aos aliados em alcance curto um bônus de +2 (+O) em todos os testes de perícia até o fim da cena. No NEX 65%, o bônus aumenta para +5 (+OO) gastando 8 PE.NEX 65% - Eu Conheço um Cara: Uma vez por missão, ativa contatos para conseguir favores dramáticos (trocar equipamentos, resgate, local seguro).NEX 99% - Truque de Mestre: Gasta 5 PE para simular o efeito exato de qualquer habilidade usada por aliados vista na cena. Deve pagar todos os custos normais da habilidade simulada.Trilha 5: TécnicoNEX 10% - Inventário Otimizado: Soma Intelecto à Força para calcular os espaços de capacidade de carga do inventário.NEX 40% - Remendão: Com uma ação completa e 1 PE, remove a condição Quebrado de um item. Além disso, todos os equipamentos gerais têm suas Categorias reduzidas em I para o agente.NEX 65% - Improvisar: Cria um equipamento funcional temporário. Gasta ação completa, 2 PE básicos, mais 2 PE por categoria do item pretendido. O item desaparece ao final da cena.NEX 99% - Preparado para Tudo: Com ação de movimento e 3 PE por categoria do item, o agente "retira" um item utilitário qualquer (exceto armas) de sua mochila, como se sempre estivesse lá.
--------------------------------------------------------------------------------
5.3 Trilhas do OcultistaTrilha 1: ConduíteNEX 10% - Ampliar Ritual: Ao conjurar ritual, gasta +2 PE para aumentar o alcance do ritual em um passo (Curto -> Médio -> Longo -> Extremo) ou dobrar sua área de efeito.NEX 40% - Acelerar Ritual: Uma vez por rodada, aumenta o custo do ritual em +4 PE para conjurá-lo usando uma ação livre.NEX 65% - Anular Ritual: Se for alvo de ritual, gasta PE igual ao custo pago pelo atacante e faz teste oposto de Ocultismo. Sucesso cancela todos os efeitos do ritual inimigo.NEX 99% - Canalizar o Medo: Aprende o ritual exclusivo Canalizar o Medo.Trilha 2: FlageladorNEX 10% - Poder do Flagelo: Ao conjurar, o ocultista pode converter e pagar o custo de PE gastando seus próprios pontos de vida à taxa de 2 PV por 1 PE. PV gastos dessa forma só são recuperados por descanso.NEX 40% - Abraçar a Dor: Ao sofrer dano não-paranormal, com uma reação e 2 PE reduz esse dano à metade.NEX 65% - Absorver Agonia: Ao reduzir um ou mais alvos a 0 PV com um ritual, recebe PE temporários iguais ao círculo do ritual executado.NEX 99% - Medo Tangível: Aprende o ritual exclusivo Medo Tangível.Trilha 3: GraduadoNEX 10% - Saber Ampliado: Ocultista aprende um ritual de 1º Círculo adicional. Sempre que ganha acesso a um novo círculo de rituais, aprende um ritual extra desse círculo (não contam no limite padrão).NEX 40% - Grimório Ritualístico: Cria um grimório de 1 espaço. Ele armazena uma quantidade de rituais adicionais de 1º ou 2º círculos igual ao Intelecto do agente. Requer empunhar e gastar ação completa folheando para poder conjurar os rituais guardados nele.NEX 65% - Rituais Eficientes: A DT para resistir a todos os rituais do agente aumenta em +5.NEX 99% - Conhecendo o Medo: Aprende o ritual exclusivo Conhecendo o Medo.Trilha 4: IntuitivoNEX 10% - Mente Sã: Recebe resistência paranormal de +5 (+5 em testes de resistência contra efeitos de rituais ou criaturas).NEX 40% - Presença Poderosa: Soma sua Presença ao limite de PE gasto por turno, mas este bônus aplica-se exclusivamente para a conjuração de rituais (não altera DT).NEX 65% - Inabalável: Recebe resistência a dano mental e dano paranormal 10. Se passar em testes de Vontade para reduzir dano à metade, anula completamente o dano sofrido.NEX 99% - Presença do Medo: Aprende o ritual exclusivo Presença do Medo.Trilha 5: Lâmina ParanormalNEX 10% - Lâmina Maldita: Ocultista aprende o ritual Amaldiçoar Arma. Se já o possui, pode gastar +1 PE para reduzir o tempo de execução dele para ação de movimento. Permite usar a perícia Ocultismo no lugar de Luta ou Pontaria para realizar testes de ataque com a arma amaldiçoada.NEX 40% - Gladiador Paranormal: Ao acertar ataque corpo a corpo, recebe 2 PE temporários (máximo acumulável por cena igual ao limite de PE por turno).NEX 65% - Conjuração Marcial: Uma vez por rodada, ao conjurar um ritual como ação padrão, gasta 2 PE para fazer um ataque corpo a corpo como ação livre.NEX 99% - Lâmina do Medo: Aprende o ritual exclusivo Lâmina do Medo.
--------------------------------------------------------------------------------
6. Mecânicas de Teste de Dados e Motor de ResoluçãoO núcleo mecânico do sistema roda sobre testes do dado d20 associados a atributos e modificadores de perícia:6.1 A Rolagem de Atributo (Fórmula Lógica)Para realizar um teste de perícia, o sistema deve ler o atributo-base associado à perícia.O sistema rola uma quantidade de dados d20 igual ao valor do atributo base: $$\text{Dados a rolar} = \text{Valor do Atributo}$$O sistema avalia os dados rolados e seleciona o maior valor individual obtido.Regra de Atributo Zero (Penalidade): Se o atributo base for 0, o sistema deve rolar 2d20 e selecionar obrigatoriamente o pior (menor) valor individual entre eles.Ao dado selecionado, soma-se o bônus de perícia do agente (treinamento + itens + habilidades) para determinar o resultado final.$$\text{Resultado Final} = \text{Dado Selecionado} + \text{Bônus de Perícia}$$def resolver_teste_atributo(valor_atributo, bonus_pericia):
    import random
    if valor_atributo <= 0:
        dado1 = random.randint(1, 20)
        dado2 = random.randint(1, 20)
        dado_selecionado = min(dado1, dado2) # Pior resultado se atributo for 0
    else:
        rolagens = [random.randint(1, 20) for _ in range(valor_atributo)]
        dado_selecionado = max(rolagens) # Melhor resultado se atributo for > 0
    return dado_selecionado + bonus_pericia
6.2 Testes com Vantagem ou Desvantagem de DadosDeterminados poderes ou circunstâncias adicionam dados de bônus ou penalidades nas rolagens:Bônus de dados (ex: +1d20 ou +O): Rola um dado d20 extra e mantém a lógica de selecionar o maior.Penalidades de dados (ex: -1d20 ou -O): Para cada dado de penalidade, deve-se remover um dado da rolagem antes de avaliar o maior. Se a quantidade de dados cair para 0 ou menos, rolam-se dados extras e escolhe-se o menor.
--------------------------------------------------------------------------------
6.3 Classes de Dificuldade (CD / DT) das HabilidadesSempre que um agente ativa uma habilidade de classe ou ritual que exige um teste de resistência por parte do alvo (ex: Fortitude, Reflexos, Vontade), a Classe de Dificuldade (CD) — também chamada de Dificuldade do Teste (DT) — deve ser calculada de forma dinâmica e automatizada pelo sistema seguindo a regra universal:$$\text{CD / DT} = 10 + \text{Limite de PE por Turno do Agente} + \text{Modificador de Atributo-Chave}$$Limite de PE: Vinculado diretamente ao NEX do agente (conforme Tabela 1.2).Atributo-Chave: Indicado na descrição de cada habilidade ou ritual (ex: Presença para rituais de Ocultista, Vigor para habilidades de Tropa de Choque, Intelecto para habilidades de Especialista).
--------------------------------------------------------------------------------
7. Acompanhamento de Sessão (State Tracking & Session Engine)Durante a sessão de jogo, o sistema deve atualizar dinamicamente as alterações de status dos agentes e sinalizar condições críticas em tempo real:7.1 Estado de Pontos de Vida (PV) e Consequências                        [ PV Máximos ]
                              │
                              ▼
            [ PV > 50% ]  ── Normal
                              │
                              ▼
            [ PV <= 50% ] ── Condição: Machucado
                              │ (Dispara passivas de trilhas e rituais)
                              ▼
            [ PV == 0 ]   ── Condição: Inconsciente e Morrendo
                               (Inicia rolagens de Testes de Agonia)
Regras do Estado "Morrendo":O agente fica Inconsciente e Indefeso (exceto se possuir a habilidade Inquebrável de Tropa de Choque).No início de cada um de seus turnos, o agente deve fazer um Teste de Agonia (rolagem pura de d20 sem bônus):Resultado 20: O personagem estabiliza, recupera a consciência com 1 PV e encerra o estado morrendo.Resultado 19 a 10: O personagem continua morrendo e seu estado não se altera.Resultado 9 a 2: O personagem piora. Recebe uma falha. Ao acumular 3 falhas, o personagem morre.Resultado 1: O personagem piora drasticamente (recebe duas falhas de uma vez) ou morre imediatamente caso já possua alguma falha.Dano Massivo: Se o agente sofrer um único golpe de dano que seja igual ou superior à metade de seus PV máximos E esse dano o reduza a 0 PV de uma vez, ele não entra em estado morrendo; ele morre instantaneamente.
--------------------------------------------------------------------------------
7.2 Estado de Sanidade (SAN) e Dano Mental                        [ SAN Máxima ]
                              │
                              ▼
            [ SAN > 0 ]   ── Normal / Perturbado
                              │ (Dano mental subtrai diretamente da SAN)
                              ▼
            [ SAN == 0 ]  ── Condição: Enlouquecendo
                               (Inicia surtos e rolagens na Tabela de Surtos)
Regras de Perda de Razão (SAN == 0):Ao cair para 0 de Sanidade, o agente entra em estado Enlouquecendo. Ele fica sob a condição Pasmo por 1 rodada.O jogador deve rolar um dado d20 na Tabela de Efeitos de Loucura para definir o surto de insanidade que acomete o personagem (paralisia, alucinações, amnésia, etc.).Se o agente sofrer dano mental adicional enquanto estiver com 0 SAN, esse dano é deduzido diretamente de seus Pontos de Vida (PV).Certas habilidades ou rituais custam perda de Sanidade Permanente. O sistema deve atualizar a SAN máxima do agente e nunca permitir que ela seja recuperada além do novo limite reduzido.
--------------------------------------------------------------------------------
7.3 Condições e Aplicação de Modificadores DinâmicosO sistema deve monitorar as condições aplicadas ao personagem e alterar seus atributos e defesas automaticamente:Desprevenido: Personagem sofre -5 na Defesa e não pode realizar reações físicas.Caído: Sofre penalidade de -2 dados (-OO) em testes de ataque corpo a corpo. Recebe -5 na Defesa contra ataques corpo a corpo, mas ganha +5 na Defesa contra ataques à distância.Abalado: Personagem sofre penalidade de -1 dado (-O) em todos os seus testes de perícia e atributos.Apavorado: Fica sob descontrole mental e deve gastar todas as suas ações para fugir da fonte de medo. Sofre -2 dados (-OO) em testes.Agarrado: Fica desprevenido e imóvel. Sofre -1 dado (-O) em testes de ataque e só pode atacar usando armas leves.Fatigado: Não pode correr ou dar carga. Sofre -1 dado (-O) em testes de Força, Agilidade e Vigor.Exausto: Sofre as mesmas penalidades de fatigado, mas duplicadas para -2 dados (-OO) nos testes correspondentes.
--------------------------------------------------------------------------------
8. Estrutura do Inventário, Capacidade de Carga e Patentes8.1 Capacidade de Carga (Espaços)Por padrão, o total de espaços que um agente pode carregar é calculado por: $$\text{Espaços de Carga} = \text{Força} \times 5$$Se o agente possuir o poder Inventário Otimizado (Técnico), a fórmula torna-se: $$\text{Espaços de Carga} = (\text{Força} + \text{Intelecto}) \times 5$$Itens Pesados: Proteções leves, armas de duas mãos e malas pesadas ocupam 2 espaços cada. Proteções pesadas ocupam 5 espaços. Itens comuns ocupam 1 espaço. Itens miúdos ocupam 0 espaços (limite de carga geral). Itens extremamente pesados ou volumosos, como uma pessoa (um agente inconsciente, por exemplo), ocupam 10 espaços. Recipientes cuja única função seja carregar outro item (um coldre, por exemplo) não ocupam espaço próprio; recipientes com benefício próprio, como uma bandoleira, ocupam espaço conforme a descrição.Força 0: o limite não é 0 e sim 2 espaços.Sobrecarga: ultrapassar o limite deixa o agente sobrecarregado — –5 na Defesa, –5 em todos os testes de perícia marcados com penalidade de carga (Acrobacia, Crime e Furtividade, além do uso natação de Atletismo) e deslocamento reduzido em 3m. O limite absoluto é o dobro da capacidade: um agente com Força 2 carrega até 10 espaços sem penalidade, até 20 sobrecarregado, e nunca mais que 20.
--------------------------------------------------------------------------------
8.2 Patentes, Limite de Categoria e CréditoA patente do agente limita a quantidade de itens especiais que a Ordem disponibiliza no início de cada missão:PatentePontos de Prestígio (PP)Limite de CréditoCategoria ICategoria IICategoria IIICategoria IVRecruta0 a 19 PPBaixo2 itens---Operador20 a 49 PPMédio3 itens1 item--Agente Especial50 a 99 PPMédio3 itens2 itens1 item-Oficial de Operações100 a 199 PPAlto3 itens3 itens2 itens1 itemAgente de Elite200+ PPIlimitado3 itens3 itens3 itens2 itensMecânica de Validação de Categoria: Itens sem categoria (Categoria 0) podem ser selecionados de forma ilimitada, respeitando apenas o limite de espaços de carga do inventário. Cada modificação ou maldição aplicada a uma arma, proteção ou acessório aumenta a Categoria do item em +1 cumulativo.
--------------------------------------------------------------------------------
9. Catálogo de Armas, Munições e ModificaçõesO sistema de combate e acompanhamento deve validar os ataques com base nas estatísticas das armas:9.1 Catálogo de Armas Oficiais (Tabela 3.3)ArmaCategoriaDanoCríticoAlcanceTipo de DanoEspaçoPropriedades / NotasFaca01d419CurtoCorte1Arma ágil, arremessável.Punhal01d4x3-Perfuração1Arma ágil, usada por cultistas.Bastão01d6x2-Impacto1Usada com uma mão.Machete01d619-Corte1Usada com uma mão.Lança01d6x2CurtoPerfuração1Pode ser arremessada.Cajado01d6x2-Impacto2Usada com duas mãos, arma ágil.Arco01d6x3MédioPerfuração2Arma de disparo, duas mãos.Besta01d819MédioPerfuração2Arma de disparo, duas mãos.PistolaI1d1218CurtoBalístico1Arma de fogo leve.RevólverI2d619/x3CurtoBalístico1Arma de fogo leve.Fuzil de CaçaI2d819/x3MédioBalístico2Arma de fogo, duas mãos.SubmetralhadoraI2d619/x3CurtoBalístico1Arma automática.EspingardaI4d6x3CurtoBalístico2Dano cai pela metade em alcance médio.Fuzil de AssaltoII2d1019/x3MédioBalístico2Arma automática.Fuzil PrecisãoIII2d1019/x3LongoBalístico2+5 de margem de ameaça ao mirar (se veterano).KatanaI1d1019-Corte2Arma ágil. Uma mão se for veterano em Luta.MotosserraI3d6x2-Corte2Role dado extra se rolar 6 no dano. -1 dado em testes.
--------------------------------------------------------------------------------
9.2 Catálogo de Modificações Oficiais (Tabela 3.5)Cada modificação aplicada a um item aumenta sua Categoria de Prestígio em +1 (ex: Katana Categoria I + Certeira = Katana Categoria II).Modificações de Armas Brancas / Disparo:Certeira: +2 nos testes de ataque.Cruel: +2 em rolagens de dano.Discreta: +5 em testes de Crime para ocultar; reduz em 1 o espaço ocupado.Perigosa: Aumenta a margem de ameaça da arma em +2.Tática: Permite sacar/guardar a arma como uma ação livre.Modificações de Armas de Fogo:Alongada: +2 nos testes de ataque.Calibre Grosso: Aumenta o dano em +1 dado do mesmo tipo (ex: 2d6 -> 3d6).Compensador: Anula a penalidade de ataque por disparar rajadas com armas automáticas.Ferrolho Automático: A arma se torna automática.Mira Laser: Aumenta a margem de ameaça em +2.Mira Telescópica: Aumenta a categoria de alcance da arma em um passo e viabiliza Ataque Furtivo em qualquer alcance.Silenciador: Reduz em 2 dados a penalidade de Furtividade para se esconder após realizar um disparo.Modificações de Munição:Dum Dum: Aumenta o multiplicador de crítico em +1 (ex: x3 -> x4).Explosiva: Disparos causam dano extra de +2d6 de impacto.
--------------------------------------------------------------------------------

10. Catálogo de Perícias (Capítulo 2 do livro básico)

10.1 Motor de Teste de Perícia

O teste de perícia é o teste de atributo descrito em 6.1 acrescido do bônus de perícia. Sequência canônica que o sistema deve executar: (1) o jogador declara a ação; (2) o mestre define qual perícia se aplica e uma DT; (3) rola-se 1d20 por ponto no atributo-base da perícia — mais dados de bônus, menos dados de penalidade, conforme 6.2 — e mantém-se o **maior** resultado (com atributo-base 0, rolam-se 2d20 e mantém-se o **menor**); (4) soma-se o bônus de perícia ao dado selecionado; (5) resultado igual ou maior que a DT é sucesso.

Bônus por grau de treinamento (o único componente do bônus além de itens e habilidades):

| Grau | Bônus | Liberação |
| --- | --- | --- |
| Destreinado (Leigo) | +0 | Estado inicial de toda perícia |
| Treinado | +5 | Concedido por origem, classe, Intelecto e pelo poder Treinamento em Perícia |
| Veterano | +10 | A partir do NEX 35%, elevando uma perícia já treinada |
| Expert | +15 | A partir do NEX 70%, elevando uma perícia já veterana |

Três marcadores modificam o uso de uma perícia e devem ser validados pelo sistema:

- **Somente treinada.** A perícia não pode ser usada com grau Destreinado. Alguns *usos* individuais também exigem grau mínimo (treinado, veterano ou expert), indicado na tabela 10.3. A habilidade Eclético (Especialista) permite gastar 2 PE para tratar uma perícia não treinada como treinada, contornando a restrição.
- **Penalidade de carga.** O teste sofre a penalidade de carga total do agente (ver 8.1). Vale para Acrobacia, Crime e Furtividade, e ainda para o uso *natação* de Atletismo, que sofre penalidade de carga apesar de Atletismo não ser marcada.
- **Kit de perícia.** O uso exige ferramentas. Sem o kit apropriado o teste ainda pode ser feito, com **–5**.

Escolha do mestre: a critério do mestre um teste pode usar um atributo diferente do atributo-base (por exemplo, uma Diplomacia que dependa de conhecimento de legislação pode ser testada com Intelecto). O sistema deve permitir sobrescrever o atributo de um teste pontual sem alterar o cadastro da perícia.

--------------------------------------------------------------------------------

10.2 Tabela 2.1 — Atributo-base e Marcadores

Esta é a tabela normativa. Divergências entre implementação e esta tabela são bug. Atenção a dois pontos historicamente errados: **Medicina não é somente treinada** (exige apenas kit) e **Adestramento, Artes, Crime e Religião são somente treinadas**.

| Perícia | Atributo-base | Somente treinada | Carga | Kit |
| --- | --- | --- | --- | --- |
| Acrobacia | Agilidade | — | Sim | — |
| Adestramento | Presença | Sim | — | — |
| Artes | Presença | Sim | — | — |
| Atletismo | Força | — | — | — |
| Atualidades | Intelecto | — | — | — |
| Ciências | Intelecto | Sim | — | — |
| Crime | Agilidade | Sim | Sim | Sim |
| Diplomacia | Presença | — | — | — |
| Enganação | Presença | — | — | Sim |
| Fortitude | Vigor | — | — | — |
| Furtividade | Agilidade | — | Sim | — |
| Iniciativa | Agilidade | — | — | — |
| Intimidação | Presença | — | — | — |
| Intuição | Presença | — | — | — |
| Investigação | Intelecto | — | — | — |
| Luta | Força | — | — | — |
| Medicina | Intelecto | — | — | Sim |
| Ocultismo | Intelecto | Sim | — | — |
| Percepção | Presença | — | — | — |
| Pilotagem | Agilidade | Sim | — | — |
| Pontaria | Agilidade | — | — | — |
| Profissão | Intelecto | Sim | — | — |
| Reflexos | Agilidade | — | — | — |
| Religião | Presença | Sim | — | — |
| Sobrevivência | Intelecto | — | — | — |
| Tática | Intelecto | Sim | — | — |
| Tecnologia | Intelecto | Sim | — | Sim |
| Vontade | Presença | — | — | — |

--------------------------------------------------------------------------------

10.3 Usos de Perícia (DTs, requisitos de grau e custo de ação)

Formato: **Uso** — requisito de grau / DT / custo de ação — efeito mecânico. Perícias sem usos nomeados resolvem-se por um único teste contra a DT indicada na descrição.

**Acrobacia (Agi, carga).** Proezas acrobáticas.
- *Amortecer Queda* — veterano, DT 15, reação — reduz o dano da queda em 1d6, +1d6 a cada 5 pontos acima da DT; zerando o dano, cai de pé.
- *Equilíbrio* — um teste por ação de movimento — DT 10 piso escorregadio, 15 superfície estreita, 20 superfície muito estreita. Sucesso avança metade do deslocamento; falha não avança; falha por 5+ derruba. Pode sofrer –1d20 para avançar o deslocamento total. Enquanto se equilibra fica desprevenido e, ao sofrer dano, refaz o teste ou cai.
- *Escapar* — ação completa — DT = teste de Agilidade de quem amarrou +10 (cordas) ou 30 (algemas).
- *Levantar-se Rapidamente* — treinado, DT 20 — consome a ação de movimento; sucesso converte o levantar em ação livre, falha mantém caído.
- *Passar por Espaço Apertado* — treinado, DT 25, ação completa — avança metade do deslocamento.
- *Passar por Inimigo* — parte do movimento — teste oposto ao melhor entre Acrobacia, Iniciativa e Luta do oponente. O espaço conta como terreno difícil.

**Adestramento (Pre, somente treinada).** Lidar com animais.
- *Acalmar Animal* — DT 25, ação completa.
- *Cavalgar* — parte do movimento — montar como ação livre exige DT 20 (falha por 5+ derruba); obstáculos pequenos/terreno ruim DT 15, obstáculos grandes/terreno muito ruim DT 20; falhar derruba e causa 1d6 de dano.
- *Galopar* — ação completa — avança (deslocamento da montaria + resultado do teste) quadrados de 1,5m, só em linha reta e fora de terreno difícil.
- *Manejar Animal* — DT 15, ação de movimento — permite usar Adestramento como Pilotagem para veículos de tração animal.

**Artes (Pre, somente treinada).** Expressão artística.
- *Impressionar* — minutos a horas — oposto pela Vontade do alvo; sucesso dá +2 em testes de perícia originalmente baseados em Presença contra ele na cena, falha impõe –2 e proíbe nova tentativa na cena. Contra uma plateia, um único teste com o melhor bônus.

**Atletismo (For).** Façanhas atléticas.
- *Corrida* — ação completa — avança (deslocamento + resultado) quadrados de 1,5m, só em linha reta e fora de terreno difícil; suporta um número de rodadas igual ao Vigor, depois exige Fortitude DT 5 (+5 cumulativo) por rodada ou fica fatigado.
- *Escalar* — ação de movimento — DT 10 apoios para pés e mãos, 15 portão ou árvore, 20 muro com reentrâncias, 25 parede lisa. Sucesso avança metade do deslocamento; falha por 5+ derruba. Pode sofrer –1d20 para avançar o deslocamento total. Fica desprevenido; ao sofrer dano refaz o teste ou cai. Segurar um ser que cai: DT da superfície +5; falha por 5+ derruba os dois.
- *Natação* — ação de movimento por rodada, **sofre penalidade de carga** — DT 10 água calma, 15 agitada, 20+ tempestuosa. Falha por 5+ submerge. Submerso, prende a respiração por rodadas iguais ao Vigor; depois, Fortitude DT 5 (+5 cumulativo) por rodada ou se afoga (reduzido a 0 PV e morrendo).
- *Saltar* — parte do movimento — salto longo DT 5 por quadrado de 1,5m; salto em altura DT 15 por quadrado. Sem 6m de impulso, DT +5.

**Atualidades (Int).** Conhecimentos gerais. DT 15 informação comum, 20 específica, 25 quase desconhecida.

**Ciências (Int, somente treinada).** Campos científicos. Questão simples não exige teste; complexa DT 20; campo experimental DT 30.

**Crime (Agi, somente treinada, carga, kit).** Atividades ilícitas.
- *Arrombar* — kit, ação completa — DT 20 fechadura comum, 25 reforçada, 30 avançada.
- *Furto* — DT 20, ação padrão — a vítima tem direito a Percepção contra DT igual ao resultado do teste de Crime e percebe a tentativa mesmo que ela falhe.
- *Ocultar* — ação padrão — oposto pela Percepção de quem possa ver; quem revista recebe +10.
- *Sabotar* — veterano, kit, 1d4+1 ações completas — DT 20 ação simples, 30 ação complexa; falha por 5+ produz um resultado enganoso. Pode sofrer –1d20 para fazê-lo em uma ação completa.

**Diplomacia (Pre).** Lábia e argumentação.
- *Acalmar* — treinado, DT 20, ação padrão — estabiliza um personagem adjacente que esteja enlouquecendo, deixando-o com Sanidade 1; DT +5 por vez já acalmado na cena.
- *Mudar Atitude* — 1 minuto — oposto pela Vontade; sucesso move 1 categoria, +10 move até 2, falha por 5+ move 1 categoria na direção oposta. Uma vez por dia por pessoa. Pode sofrer –2d20 para fazê-lo em ação completa.
- *Persuasão* — DT 20, 1 minuto ou mais — pedido custoso –5; pedido perigoso –10 ou falha automática.
- Categorias de atitude: Prestativo (+5 em persuasão), Amistoso, Indiferente (padrão), Inamistoso (–5), Hostil (falha automática em persuasão).

**Enganação (Pre, kit para disfarce).** Blefes e trapaças.
- *Disfarce* — treinado, kit, ao menos 10 minutos — oposto pela Percepção; quem conhece a pessoa imitada recebe +10.
- *Falsificação* — veterano — oposto pela Percepção de quem examina; documento complexo ou com assinatura/carimbo específico impõe –2d20.
- *Fintar* — treinado, ação padrão — oposto pelos Reflexos de um ser em alcance curto; sucesso deixa o alvo desprevenido contra o próximo ataque até o fim do próximo turno.
- *Insinuação* — DT 20 — falha por 5+ transmite mensagem errada; terceiros podem captar com Intuição oposta.
- *Intriga* — DT 20 (30 se muito improvável), ao menos um dia — rastrear a fonte exige Investigação contra DT igual ao resultado da intriga.
- *Mentir* — oposto pela Intuição da vítima; mentira muito implausível impõe –2d20.

**Fortitude (Vig).** Teste de resistência contra efeitos de vitalidade (doenças, venenos); DT definida pelo efeito. Também sustenta fôlego: DT 5 (+5 por teste anterior).

**Furtividade (Agi, carga).** Discrição.
- *Esconder-se* — ação livre no fim do turno — oposto pela Percepção; quem falhar não o percebe (camuflagem total). Ter se movido impõe –1d20 (evitável movendo-se até metade do deslocamento); ter atacado ou feito ação chamativa impõe –3d20.
- *Seguir* — oposto pela Percepção do alvo — –5 em local sem esconderijos ou movimento; alvo precavido recebe +5. Falha faz o alvo perceber na metade do caminho.

**Iniciativa (Agi).** Teste no início da cena de ação; a ordem de turnos é decrescente pelos resultados.

**Intimidação (Pre).** Todos os usos são efeitos de medo.
- *Assustar* — treinado, ação padrão — oposto pela Vontade em alcance curto; sucesso deixa abalado pelo resto da cena (não cumulativo); +10 deixa apavorado por 1 rodada e então abalado.
- *Coagir* — 1 minuto ou mais — oposto pela Vontade de alvo adjacente; ordem perigosa ou contrária à natureza dele concede +5 ou sucesso automático na resistência. Deixa a pessoa hostil.

**Intuição (Pre).** Empatia e sexto sentido.
- *Perceber Mentira* — oposto ao teste de Enganação.
- *Pressentimento* — treinado, DT 20 — indica apenas que há algo anormal; a causa exige Investigação.

**Investigação (Int).** Pistas e informações.
- *Interrogar* — de 1 hora a 1 dia — informação geral sem teste, restrita DT 20, confidencial DT 30.
- *Procurar* — de 1 ação completa a 1 dia — DT 15 item discreto, 20 escondido, 30 muito bem escondido.

**Luta (For).** Ataque corpo a corpo; DT = Defesa do alvo.

**Medicina (Int, kit).** Ferimentos, doenças e venenos. Exige kit (–5 sem ele) e sofre –1d20 quando usada em si mesmo.
- *Primeiros Socorros* — DT 20, ação padrão — remove morrendo e inconsciente de um adjacente, deixando-o com 1 PV; DT +5 por vez já estabilizado na cena.
- *Cuidados Prolongados* — veterano, DT 20, ação de interlúdio — trata até 1 ser por ponto de Intelecto; os tratados recuperam o dobro de PV pela ação dormir neste interlúdio.
- *Necropsia* — treinado, DT 20, 10 minutos — causa e momento da morte; causa rara ou extraordinária DT +10.
- *Tratamento* — treinado, ação completa — teste contra a DT da doença/veneno; sucesso dá +5 no próximo teste de Fortitude da vítima contra o efeito.

**Ocultismo (Int, somente treinada).** Estudo do paranormal. Ser treinado não implica conjurar rituais.
- *Identificar Criatura* — ação completa — DT igual à DT para resistir à Presença Perturbadora da criatura; revela 1 característica, +1 a cada 5 pontos acima da DT; falha por 5+ produz conclusão errada.
- *Identificar Item Amaldiçoado* — DT 20, ação de interlúdio — pode sofrer –2d20 para fazê-lo em ação completa.
- *Identificar Ritual* — DT 10 +5 por círculo, reação — identifica o ritual pelos gestos, palavras e componentes.
- *Informação* — questão simples sem teste, complexa DT 20, mistério DT 30.

**Percepção (Pre).** Sentidos.
- *Observar* — DT 15 a 30 conforme a discrição do alvo; contra algo escondido, DT = resultado do teste de Furtividade ou Crime usado para esconder. Ler lábios DT 20.
- *Ouvir* — conversa casual próxima DT 0; sussurro DT 15; do outro lado de uma porta DT +5; dormindo –2d20 (sucesso acorda). Perceber ser invisível: DT 20 ou Furtividade dele +10, o que for maior — as penalidades por lutar sem ver permanecem.

**Pilotagem (Agi, somente treinada).** Veículos terrestres e aquáticos; 1 ação de movimento por turno. Situação comum sem teste; ruim DT 15 por turno; terrível DT 25 por turno. **Veterano** libera veículos aéreos.

**Pontaria (Agi).** Ataque à distância; DT = Defesa do alvo.

**Profissão (Int, somente treinada).** Profissão específica definida com o mestre.
- *Rendimentos* — passivo — o agente começa cada missão com 1 item adicional além dos fornecidos pela Ordem: categoria I se treinado, II se veterano, III se expert. Esse item soma-se ao limite de categoria da patente (ver 8.2).

**Reflexos (Agi).** Teste de resistência contra efeitos de reação rápida (armadilhas, explosões); DT definida pelo efeito. Também resiste a fintas.

**Religião (Pre, somente treinada).** Teologia e religiões.
- *Acalmar* — DT 20 — usa Religião no lugar de Diplomacia para acalmar quem esteja enlouquecendo.
- *Informação* — DT 10 simples, 20 complexa, 30 mistério.
- *Rito* — veterano, DT 20 — cerimônia religiosa.

**Sobrevivência (Int).** Regiões selvagens.
- *Acampamento* — treinado — DT 15 campo aberto, 20 mata fechada, 25 região extrema; região árida ou clima ruim impõe –5 cumulativo. Sucesso libera as ações de interlúdio alimentar-se e dormir ao relento para o grupo.
- *Identificar Animal* — treinado, DT 20, ação completa — como identificar criatura (Ocultismo).
- *Orientar-se* — 1 teste por dia — DT pelo terreno (como acampamento); sucesso avança o deslocamento normal, falha metade, falha por 5+ perde o dia. Em grupo escolhe-se um guia; testes concorrentes são rolados em segredo e os jogadores escolhem o guia antes de ver os resultados.
- *Rastrear* — treinado, 1 teste por dia — DT 15 grupo grande ou solo macio, 20 solo comum, 25 solo duro; visibilidade ou clima ruim impõe –1d20. Deslocamento reduzido à metade; DT +1 por dia desde a criação dos rastros.

**Tática (Int, somente treinada).** Educação militar.
- *Analisar Terreno* — DT 20, ação de movimento — revela uma vantagem do campo (cobertura, camuflagem, terreno elevado).
- *Plano de Ação* — veterano, DT 20, ação padrão — +5 na Iniciativa de um aliado em alcance médio; se isso o colocar acima do conjurador e ele ainda não tiver agido na rodada, age imediatamente após o turno dele e mantém a nova ordem nas rodadas seguintes.

**Tecnologia (Int, somente treinada, kit para operar dispositivo).** Eletrônica e informática avançada; usos cotidianos não exigem treinamento nem teste.
- *Falsificação* — veterano — como Enganação, mas só para documentos eletrônicos.
- *Hackear* — 1d4+1 ações completas — DT 15 computador pessoal, 20 rede profissional, 25 grande servidor corporativo/governamental/militar. Pode sofrer –1d20 para fazê-lo em ação completa. Falha bloqueia novas tentativas até obter informação nova; falha por 5+ permite rastreamento pelos administradores.
- *Localizar Arquivo* — 1 ação completa e DT 15 (computador pessoal), 1d4+1 ações completas e DT 20 (rede pequena), 1d6+2 ações completas e DT 25 (rede corporativa ou governamental). Só vale para sistemas privados; informação pública na internet usa Investigação.
- *Operar Dispositivo* — kit, 1d4+1 ações completas — DT 15 aparelho comum, 20 equipamento profissional, 25 sistema protegido. Pode sofrer –1d20 para fazê-lo em ação completa.

**Vontade (Pre).** Teste de resistência contra efeitos que exigem determinação (intimidação, rituais mentais); DT definida pelo efeito. Também usada para conjurar rituais em condições adversas.

--------------------------------------------------------------------------------

11. Catálogo de Trilhas — Correções e Texto de Apresentação

O catálogo mecânico das trilhas está na seção 5. Esta seção registra o texto de conceito que o livro traz antes dos poderes de cada trilha e, principalmente, as divergências encontradas ao conferir a implementação contra o livro básico (páginas 27, 30-31 e 34-35).

11.1 Correções normativas

**Atirador de Elite estava com os poderes fora de ordem e com textos trocados.** A sequência correta é:

| NEX | Poder | Efeito |
| --- | --- | --- |
| 10% | Mira de Elite | Proficiência com armas de fogo que usam **balas longas**; soma o Intelecto nas **rolagens de dano** com essas armas (não no teste de ataque) |
| 40% | Disparo Letal | Ao usar a ação mirar, gaste 1 PE para +2 de margem de ameaça no próximo ataque, até o fim do próximo turno |
| 65% | Disparo Impactante | Ao atacar com arma de fogo, gaste 2 PE para, em vez de dano, executar derrubar, desarmar, empurrar ou quebrar |
| 99% | Atirar para Matar | Acerto crítico com arma de fogo causa dano máximo, sem rolar dados |

O efeito "+2 de margem de ameaça e +1 no multiplicador de crítico", que circulava atribuído a Atirar para Matar, **não existe no livro**.

Outras divergências corrigidas:

- **Brecha na Guarda** (Comandante de Campo, 65%): o ataque adicional pode ser seu **ou** de outro aliado em alcance curto.
- **Cai Dentro** (Tropa de Choque, 40%): só funciona se você puder ser efetivamente atacado e estiver no alcance do ataque; um oponente que passe no teste de Vontade fica imune a este poder até o fim da cena.
- **Eloquência** (Negociador, 10%): a concentração é uma ação padrão por rodada; alvo hostil ou em combate recebe +5 na resistência e tem direito a um novo teste por rodada; quem passar fica imune por um dia.
- **Médico de Campo**: o pré-requisito é da **trilha**, não do poder Paramédico. Para escolher a trilha é preciso ser treinado em Medicina; para usar as habilidades dela, possuir um kit de medicina.
- **Vislumbres do Passado** (Amnésico): além de 1d4 PE temporários, o sucesso concede, a critério do mestre, uma informação útil.
- **Ingrediente Secreto** (Chef): quem fez a ação alimentar-se recebe o benefício de **dois pratos**; o mesmo benefício escolhido duas vezes acumula efeitos.

11.2 Conceito de cada trilha

Combatente — **Aniquilador**: treinado para abater alvos com eficiência e velocidade. **Comandante de Campo**: coordena e auxilia os companheiros, tomando decisões rápidas. **Guerreiro**: transformou o próprio corpo em arma, com golpes corpo a corpo tão poderosos quanto uma bala. **Operações Especiais**: ações calculadas, antevendo os movimentos inimigos e se posicionando melhor. **Tropa de Choque**: treinou o corpo para resistir a traumas e se coloca entre os aliados e o perigo.

Especialista — **Atirador de Elite**: neutraliza ameaças de longe, tratando a arma como ferramenta de precisão. **Infiltrador**: supera barreiras de defesa e neutraliza alvos desprevenidos sem alarde. **Médico de Campo**: primeiros socorros e emergência, acostumado ao caos do campo de batalha. **Negociador**: influencia pessoas por lábia ou intimidação. **Técnico**: mantém e repara o equipamento do time, improvisa ferramentas e sabota as dos inimigos.

Ocultista — **Conduíte**: domina alcance e velocidade de conjuração e passa a interferir nos rituais alheios. **Flagelador**: converte dor em poder para os rituais. **Graduado**: conjurador versátil, conhece mais rituais e os torna mais difíceis de resistir. **Intuitivo**: preparou a mente para resistir ao Outro Lado e expandir os próprios limites. **Lâmina Paranormal**: usa o paranormal como arma, mesclando conjuração e combate.

--------------------------------------------------------------------------------

12. Catálogo de Origens — Texto de Apresentação

As 26 origens, suas perícias e seus poderes estão na Tabela 1.1 (seção 3, Passo 2). O livro acompanha cada uma de um parágrafo de conceito, propositalmente vago: serve como ponto de partida e pode ser usado como está ou detalhado à vontade. O sistema deve exibir esse texto junto da origem na criação e na ficha, sem tratá-lo como regra.

Resumo por origem: **Acadêmico** pesquisador ou professor cujos estudos tocaram o misterioso · **Agente de Saúde** profissional da saúde surpreendido pelo paranormal no trabalho · **Amnésico** perdeu a memória; a Ordem é a única família que conhece · **Artista** ator, músico ou escritor cuja obra tem um lado sombrio · **Atleta** competidor cujo desempenho pode ter origem paranormal · **Chef** cozinheiro cuja comida de algum modo o envolveu com o Outro Lado · **Criminoso** vida fora da lei; a Ordem preferiu recrutar a combater · **Cultista Arrependido** ex-membro de um culto, ainda sob desconfiança · **Desgarrado** vivia fora das normas sociais e endureceu com isso · **Engenheiro** inventor que criou um dispositivo paranormal · **Executivo** trocou a burocracia corporativa por missões após descobrir demais · **Investigador** perito forense, federal ou detetive particular · **Lutador** artes marciais ou briga de rua · **Magnata** fortuna ou patrimônio ligado, de algum modo, ao oculto · **Mercenário** soldado de aluguel · **Militar** serviu numa força militar e é perito em armas de fogo · **Operário** emprego braçal e visão pragmática confrontada pelo paranormal · **Policial** segurança pública que sobreviveu a um caso paranormal · **Religioso** devoto ou sacerdote que auxilia em problemas espirituais · **Servidor Público** viu o governo local envolvido com cultos · **Teórico da Conspiração** investigou conspirações até esbarrar no real · **T.I.** profissional de sistemas cuja curiosidade chamou atenção · **Trabalhador Rural** vida no campo, onde as histórias se provaram verdadeiras · **Trambiqueiro** vivia de golpes até enganar a pessoa errada · **Universitário** achou algo que não devia no campus · **Vítima** sobreviveu a um encontro traumático e decidiu lutar.

--------------------------------------------------------------------------------

13. Modelo Multiusuário, Papéis e Visibilidade

O aplicativo é multiusuário, com autenticação via Google (Supabase Auth) e três tabelas: `perfis`, `agentes` e `rolagens`.

13.1 Papéis

- **Jogador** (padrão): cria e edita as próprias fichas. **Não pode ver nem abrir a ficha de outro usuário.**
- **Mestre** (`perfis.mestre = true`): vê e edita qualquer ficha da mesa e tem acesso ao painel de usuários.

13.2 Regra de visibilidade

A listagem de agentes é filtrada por dono para jogadores e completa para o mestre, e a abertura de ficha é recusada quando o agente não é do usuário. **Isso é apenas a camada de interface.** A tela é montada a partir do que o banco devolve, então a regra precisa existir na policy de RLS, caso contrário qualquer pessoa com o console do navegador lê a tabela inteira:

```sql
-- leitura de agentes: dono ou mestre
using (
  dono = auth.uid()
  or exists (select 1 from perfis p where p.id = auth.uid() and p.mestre)
)
```

13.3 Presença

`perfis.ultimo_acesso` (`timestamptz`) é carimbado a cada login. A escrita é best-effort: se a coluna não existir, o erro é ignorado para não derrubar o login, o painel do mestre cai para a última atualização de ficha como aproximação de atividade e exibe a migração necessária:

```sql
alter table perfis add column ultimo_acesso timestamptz;
```

Apenas `ultimo_acesso` conta como presença. Horário derivado de edição de ficha é exibido como atividade, nunca como "online" — o Supabase não expõe ao cliente a lista de sessões ativas, e fingir que expõe seria enganoso.

13.4 Painel de usuários (mestre)

Lista cada usuário que já entrou no app com avatar, nome, e-mail, papel, indicador de atividade e as fichas que possui (classe, NEX, trilha, PV/PE/SAN, última atualização), ordenados por presença e depois por número de fichas. Sinaliza usuários sem ficha e agentes cujo `dono` não existe mais em `perfis`.

--------------------------------------------------------------------------------

14. Requisitos de Interface

14.1 Reatividade ao NEX

O NEX é o eixo da ficha: alterá-lo deve recalcular imediatamente PV, PE e SAN máximos, limite de PE por turno, DT base, círculo de rituais, graus de treinamento liberados (veterano em 35%, expert em 70%), pontos e teto de atributo, liberação de afinidade (50%) e quais poderes de trilha estão ativos. A interface deve tornar isso visível, e não apenas recalcular em silêncio: a faixa atual, o que ela concede, o que a próxima concede e a lista de escolhas ainda pendentes naquela faixa.

Marcos de círculo de ritual (NEX 25%, 55% e 85%) valem apenas para ocultistas; para as demais classes a faixa não concede nada e deve ser apresentada como tal.

14.2 Responsividade

O conteúdo largo — tabelas de armas, de progressão, de perícias — precisa rolar dentro do próprio contêiner, nunca empurrar a página. Em grid, isso exige `minmax(0, 1fr)` nas colunas e `min-width: 0` nos contêineres: com `1fr`, o piso da coluna é o `min-content` do conteúdo, e uma tabela larga estoura a largura da página inteira. Critério de aceite: em 390px de largura, nenhuma aba pode produzir rolagem horizontal no documento.
