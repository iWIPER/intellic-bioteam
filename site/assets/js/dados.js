// Gerado a partir dos pareceres lançados no IntelliC v20 R10 (Problema 1).
export const LIMITE = 60;
export const PROBLEMA = "O monitoramento por satélite com alerta precoce é eficaz para reduzir os incêndios florestais na Amazônia?";
export const CRIT = {
  EFI: ["Eficácia", "Reduz a área queimada de forma mensurável"],
  CAU: ["Causa", "Ataca a causa (uso criminoso do fogo)"],
  CUS: ["Custo", "Custo sustentável no longo prazo"],
  ESC: ["Alcance", "Alcança áreas remotas com a logística que existe"],
  SOC: ["Comunidades", "Tem adesão das comunidades locais"],
};
export const ESP = [
  { id: "helena", curto: "Helena", icone: "satellite", nome: "Dra. Helena Monteiro Andrade", handle: "dra.helena.sat",
    papel: "Sensoriamento remoto", papelLongo: "Sensoriamento remoto · perfil INPE", cores: ["#2fbf71", "#3a78d8"],
    frase: "O satélite enxerga a Amazônia inteira todo dia. Nenhuma outra solução tem esse alcance.",
    funcao: "Pesquisadora em sensoriamento remoto e geoprocessamento (perfil tipo INPE)", formacao: "Doutora em Sensoriamento Remoto",
    experiencia: "15 anos analisando focos de calor e área queimada por satélite na Amazônia",
    avalia: "Se o alerta é confiável: precisão, falsos positivos, atraso do dado, nuvem e fumaça cobrindo a imagem.",
    posicao: ["Eu confio no que é medido. O satélite cobre a Amazônia inteira todos os dias, a um custo por quilômetro quadrado que nenhuma patrulha de campo alcança. Em 2026 já vemos queda nos alertas de desmatamento no Pará e em Mato Grosso e nos focos do Acre. Não afirmo que tudo isso seja mérito do alerta, mas é o único instrumento que permite cruzar focos, risco de fogo e seca para mandar fiscalização e brigada antes do pico do El Niño.",
      "Sou honesta sobre os limites: nuvem e fumaça atrapalham a imagem, há atraso entre a passagem do satélite e o alerta, e existem falsos positivos. O alerta só reduz o fogo se virar ação em campo. Sem resposta, é só um mapa bonito."],
    respostas: [["Raimundo", "O risco de fogo e a seca já indicam o perigo antes da chama, então o satélite também antecipa, não só avisa o que já queima."],
      ["Marcos", "Concordo que não ataca a causa sozinho, mas cada alerta vira prova e prioridade para fiscalizar quem usa o fogo ilegalmente."],
      ["Jaci", "O gargalo é de comunicação, não de dado, e o alerta precisa ser levado à aldeia por rádio, celular e agentes locais."]],
    notas: { EFI: [7, 4, "Há queda de alertas e focos em 2026, mas é difícil provar que o alerta sozinho causou isso, e o El Niño pode reverter."],
      CAU: [4, 6, "O satélite detecta o fogo, não impede a pecuária e a grilagem; só pesa se virar fiscalização e punição."],
      CUS: [8, 3, "Dados públicos e cobertura diária por custo baixo; o gasto real está na resposta em campo."],
      ESC: [9, 3, "Cobre toda a Amazônia todo dia; nuvem, fumaça e logística de chegada ao local são os limites."],
      SOC: [5, 6, "O alerta ainda não chega à aldeia e há pouca participação local; é o ponto mais fraco da estratégia."] } },
  { id: "raimundo", curto: "Raimundo", icone: "flame", nome: "Raimundo Tavares Lima", handle: "raimundo.brigada",
    papel: "Chefe de brigada", papelLongo: "Chefe de brigada · perfil PrevFogo/Ibama", cores: ["#ff6a1a", "#d62828"],
    frase: "O satélite me avisa quando já está queimando. Alerta sem gente perto é só um mapa bonito.",
    funcao: "Chefe de brigada de combate a incêndio florestal (perfil Ibama/PrevFogo)", formacao: "Técnico em meio ambiente, brigadista certificado",
    experiencia: "18 temporadas de fogo no sul do Amazonas",
    avalia: "Se dá para agir a tempo depois do alerta: equipe, logística, barco, combustível e acesso ao local.",
    posicao: ["Rapaz, 18 temporadas de fogo no sul do Amazonas me ensinaram: o satélite me avisa quando já está queimando. O sistema é bom, eu não digo que não, ele me mostra onde olhar. Mas alerta sem gente perto é só um mapa bonito.",
      "Entre o aviso chegar e eu ter barco, combustível, brigadista descansado e acesso, na seca o rio baixa, o ramal fecha e o fogo anda mais rápido que a gente. Para funcionar, o alerta tem que vir com base avançada, equipe pré-posicionada antes do pico e fiscalização que alcance quem põe fogo de propósito. Satélite sem brigada é diagnóstico. Com brigada, é tratamento."],
    respostas: [["Helena", "Risco de fogo e seca me ajudam a pré-posicionar equipe, concordo. Mas prever o perigo não apaga nada, e o atraso da imagem come a janela de poucas horas em que dá para segurar o fogo."],
      ["Marcos", "Alerta barato sem brigada e sem fiscalização é economia que vira floresta queimada depois."],
      ["Jaci", "Tem razão: se o alerta não chega na aldeia, quem conhece o território e chega primeiro fica de fora. Eu botava brigadista indígena no rádio e na folha de pagamento."]],
    notas: { EFI: [5, 6, "Quando a brigada chega a tempo, apaga; mas muitas vezes chego com o fogo já grande."],
      CAU: [3, 4, "O alerta mostra o fogo, não quem pôs; só ataca a causa se virar fiscalização."],
      CUS: [6, 5, "Satélite é barato, mas brigada, combustível e base custam toda temporada e a verba oscila."],
      ESC: [3, 3, "Sul do Amazonas na seca: o alerta chega, eu não."],
      SOC: [4, 6, "A comunidade adere se ganhar rádio e brigada local; hoje o alerta não chega na aldeia."] } },
  { id: "marcos", curto: "Marcos", icone: "landmark", nome: "Marcos Albuquerque Ferreira", handle: "marcos.gestao",
    papel: "Gestor público", papelLongo: "Gestor público · Secretaria de Meio Ambiente", cores: ["#d4a017", "#13315c"],
    frase: "O dado é público, o caro é a resposta. E ninguém para de grilar por causa de um ponto no mapa.",
    funcao: "Secretário-adjunto de Meio Ambiente do Estado (gestor público)", formacao: "Administrador público, com especialização em políticas ambientais",
    experiencia: "10 anos em gestão de orçamento e de programas entre órgãos",
    avalia: "Custo, orçamento, base legal, integração entre órgãos e viabilidade política.",
    posicao: ["O satélite é o melhor custo-benefício que o Estado tem: o dado do INPE é público e cobre a Amazônia inteira todo dia. Mas alerta não apaga fogo nem prende grileiro. O que pesa no orçamento é a resposta: brigada pré-posicionada, base avançada, combustível, diárias e fiscalização com respaldo legal.",
      "Eu aprovo a estratégia se o recurso para a resposta vier junto, em convênio entre órgãos e com continuidade além de um mandato. Sem isso, vira painel bonito e floresta queimada. E, com El Niño no segundo semestre, não dá para prometer o que o caixa não cobre."],
    respostas: [["Helena", "Concordo que cada alerta vira prova, mas só se houver fiscal e processo para usá-la; sem isso, é arquivo."],
      ["Raimundo", "Você tem razão: alerta barato sem brigada é falsa economia, e por isso proponho amarrar o orçamento da resposta ao do monitoramento."],
      ["Jaci", "Se o alerta não chega na aldeia, o sistema falha de verdade, e levar o dado até lá (rádio, celular, brigada indígena) precisa constar no orçamento."]],
    notas: { EFI: [7, 4, "Alertas caíram no PA e MT e focos no AC, mas o El Niño pode desfazer o ganho."],
      CAU: [3, 3, "Alerta sozinho não atinge a grilagem; só vira prova se houver fiscalização."],
      CUS: [8, 5, "O dado é barato e público; o custo real e incerto está na resposta de campo."],
      ESC: [7, 5, "O satélite cobre tudo, mas a brigada depende de base, estrada e rio."],
      SOC: [3, 6, "Alerta não chega à aldeia e não tenho dado sobre a adesão local."] } },
  { id: "jaci", curto: "Jaci", icone: "trees", nome: "Jaci Apurinã da Silva", handle: "jaci.territorio",
    papel: "Liderança indígena", papelLongo: "Liderança e brigadista indígena · território", cores: ["#c0392b", "#2f6b3a"],
    frase: "Nós vemos a fumaça antes de qualquer satélite. O alerta chega para quem?",
    funcao: "Liderança e brigadista indígena (território e comunidade)", formacao: "Agente agroflorestal indígena, formada em Manejo Integrado do Fogo",
    experiencia: "Coordena a brigada comunitária da sua terra indígena no sul do Amazonas",
    avalia: "A realidade no território: internet para receber o alerta, confiança da comunidade e conhecimento tradicional do fogo.",
    posicao: ["Não sou contra o satélite. Mas ele enxerga o fogo depois que o fogo começou, e nós vemos a fumaça antes. O alerta só vale se chegar à aldeia: aqui a internet falha, e o que funciona é o rádio. Meu povo cuida do fogo há muito tempo, e esse conhecimento não aparece em nenhuma imagem.",
      "Se a estratégia continuar desenhada longe do território, vira mais um relatório bonito. Quero brigadista indígena com salário, rádio e energia solar na aldeia, e a comunidade decidindo junto como o alerta circula. E lembro: o fogo grande vem da grilagem e da pecuária. Alerta não prende ninguém."],
    respostas: [["Helena", "Concordo que o gargalo é comunicação; então o primeiro investimento é rádio e energia na aldeia, e não mais um satélite."],
      ["Raimundo", "Brigadista indígena no rádio só funciona se o salário vier todo ano, e não só quando sai edital."],
      ["Marcos", "Me mostre onde a comunidade senta à mesa de decisão e de onde vem o dinheiro para o alerta chegar à aldeia; sem isso, é plano de gabinete."]],
    notas: { EFI: [6, 6, "O alerta ajuda a chegar antes do pico, mas só reduz área queimada se houver brigada no local para agir."],
      CAU: [3, 4, "O satélite mostra onde queima, não quem ateou; a grilagem e a pecuária seguem intactas."],
      CUS: [5, 7, "O dado é barato, mas manter brigada paga e rádio no território depende de decisão política."],
      ESC: [4, 5, "O satélite cobre tudo, mas o alerta não chega onde não há sinal, energia nem estrada."],
      SOC: [3, 3, "Sem incluir a comunidade e seu conhecimento do fogo, não há adesão; hoje ela mal é consultada."] } },
];
export const EQUIPE = {
  facilitadores: [
    { slug: "wilk", nome: "Wilk", curto: "Wilk", handle: "wilk.bioteam", papel: "Facilitador", bio: "Organiza a estrutura do estudo para que os especialistas possam opinar." },
    { slug: "gislene", nome: "Gislene", curto: "Gislene", handle: "gislene.bioteam", papel: "Facilitadora", bio: "Organiza a estrutura do estudo para que os especialistas possam opinar." }],
  analistas: [
    { slug: "joseane", nome: "Joseane", curto: "Joseane", handle: "joseane.bioteam", papel: "Analista", bio: "Interpreta o resultado do IntelliC e traduz os números em recomendação." },
    { slug: "hellen", nome: "Hellen", curto: "Hellen", handle: "hellen.bioteam", papel: "Analista", bio: "Interpreta o resultado do IntelliC e traduz os números em recomendação." }],
};
export const CORES = { facilitadores: ["#3a78d8", "#2fbf71"], analistas: ["#d4a017", "#ff7a1a"] };
export const TAREFAS = {
  facilitadores: [["file-text", "Monta o Problema", "Título, descrição, tipo colaborativo e limite de decisão de 60%."],
    ["ruler", "Define a régua", "Cadastra os 5 critérios (EFI, CAU, CUS, ESC, SOC) antes de ver qualquer nota."],
    ["user-plus", "Convida os participantes", "Marca quem é Especialista, Analista e Facilitador."],
    ["traffic-cone", "Libera e acompanha", "Libera o Problema para pareceres e acompanha as pendências até todos responderem."]],
  analistas: [["gauge", "Lê o resultado geral", "Índice de viabilidade (GC), índice de dúvida (GI) e o estado final do Problema."],
    ["puzzle", "Interpreta o Quadrado Mágico", "Mostra onde cada critério caiu: viável, inviável, tendência ou dúvida excessiva."],
    ["scale", "Encontra a divergência", "Aponta em quais critérios os especialistas mais discordam e por quê."],
    ["messages-square", "Traduz em recomendação", "O IntelliC compara e indica; quem decide é a pessoa: seguir, ajustar, esperar ou parar."]],
};
export const STATS = { facilitadores: [["1", "problema"], ["5", "critérios"], ["8", "participantes"]], analistas: [["20", "pareceres"], ["5", "critérios"], ["1", "resultado"]] };
export const LEIT = { EFI: "Helena e Marcos acreditam; Raimundo e Jaci duvidam que a brigada chegue a tempo.",
  CAU: "Todos concordam: alerta não ataca a grilagem. É o critério mais fraco.",
  CUS: "Único positivo: o dado é barato. O custo incerto está na resposta em campo.",
  ESC: "A maior briga: Helena dá 9, Raimundo dá 3. O satélite enxerga, a brigada nem sempre chega.",
  SOC: "O alerta ainda não chega à aldeia: baixa adesão das comunidades." };

// O que cada pessoa fez além das tarefas do papel. [ícone, título, descrição]
export const INDIVIDUAL = {
  wilk: [
    ["file-text", "Montou o estudo no IntelliC", "Cadastrou o problema, os 5 critérios, os participantes e liberou para os pareceres."],
    ["bot", "Conduziu os agentes de IA", "Criou os 4 especialistas e levou o debate entre eles até as notas finais."],
    ["sparkles", "Abre e fecha o pitch", "Apresenta a pergunta do estudo e a conclusão para a banca."],
  ],
  gislene: [
    ["ruler", "Revisou a régua", "Conferiu se os 5 critérios estavam claros e se nota alta sempre significava “bom”."],
    ["compass", "Apresenta a estrutura", "No pitch, explica o estudo e a governança com o menor privilégio."],
  ],
  joseane: [
    ["gauge", "Leu o resultado", "Interpretou o −2% e o 0% de dúvida e o que isso significa na prática."],
    ["scale", "Teste de robustez", "Mostra que, trocando os grupos, o resultado oscila mas não chega a 60%."],
    ["target", "Apresenta o resultado", "No pitch, abre a conta de um critério e explica o Quadrado Mágico."],
  ],
  hellen: [
    ["bookmark", "Fontes de pesquisa", "Reuniu os dados do INPE, MapBiomas, Ibama e IPAM que embasam os agentes."],
    ["users", "Perfis dos especialistas", "Ajudou a definir quem seriam os 4 agentes e o que cada um avalia."],
    ["messages-square", "Apresenta o método", "No pitch, explica como os especialistas foram construídos."],
  ],
};

// Tipo de cada fonte, usado na aba Fontes.
export const TIPO_FONTE = {
  "INPE · Programa Queimadas": "Órgãos públicos", "INPE · satélite de referência": "Órgãos públicos", "INPE · dados de 2024": "Órgãos públicos",
  "INPE · julho de 2024": "Órgãos públicos", "Ibama · Prevfogo": "Órgãos públicos", "Presidente do Ibama": "Órgãos públicos",
  "Prevfogo · mais de 30 anos": "Órgãos públicos", "Ibama · brigadistas Yanomami": "Órgãos públicos", "Fundo Amazônia · BNDES": "Órgãos públicos",
  "Câmara dos Deputados · Comissão de Meio Ambiente": "Órgãos públicos", "Embrapa": "Órgãos públicos",
  "Lei 14.944/2024": "Legislação",
  "Revista CERNE · UFLA, 2012": "Pesquisa científica", "Pesquisa da UFRRJ com o BDQueimadas": "Pesquisa científica",
  "MapBiomas Fogo": "Pesquisa científica", "IPAM · florestas públicas não destinadas": "Pesquisa científica",
};

// Fontes públicas que embasam a posição de cada agente. Cada item: [quem publicou, o que diz, link].
export const FONTES = {
  helena: {
    intro: "A Helena só fala do que dá para medir. O que ela usou:",
    itens: [
      ["INPE · Programa Queimadas", "Um foco de calor é registrado quando o satélite vê mais de 47 °C numa área de pelo menos 900 m². O dado sai uns 20 minutos depois da passagem do satélite.",
        "https://dataserver-coids.inpe.br/queimadas/queimadas/Publicacoes-Impacto/material3os/2011_Gontijo_etal_Deteccao_XVSBSR_DE3os.pdf"],
      ["INPE · satélite de referência", "Desde agosto de 2007 a série histórica usa o mesmo satélite (AQUA). É isso que permite comparar um ano com o outro sem trapaça.",
        "https://dataserver-coids.inpe.br/queimadas/queimadas/Publicacoes-Impacto/documentos/principio_fisico_detecta_queimadas.pdf"],
      ["INPE · dados de 2024", "Até o começo de dezembro de 2024 a Amazônia teve 137.538 focos, o maior número em 17 anos. Só 2007 foi pior. O bioma concentrou 50,6% dos focos do país.",
        "https://portalamazonia.com/meio-ambiente/amazonia-maior-numero-de-queimadas-17-anos/"],
      ["Revista CERNE · UFLA, 2012", "O limite que ela admite: num estudo de validação dos focos do INPE, só cerca de 26% das cicatrizes de queimada foram detectadas. O sistema falha nas áreas menores que 100 ha.",
        "https://www.redalyc.org/articulo.oa?id=74423522019"],
      ["Pesquisa da UFRRJ com o BDQueimadas", "Contar focos não é medir área queimada. O foco mostra onde e por quanto tempo o fogo aparece, não o tamanho do estrago.",
        "https://rima.ufrrj.br/jspui/handle/20.500.14407/21185"],
    ],
  },
  raimundo: {
    intro: "O Raimundo fala de campo. Os números que sustentam o que ele diz:",
    itens: [
      ["Ibama · Prevfogo", "Em junho de 2024 o Prevfogo abriu contratação de 1.803 brigadistas. Por ano entram em média 50 brigadas indígenas em cerca de 40 terras indígenas; para 2024 estavam previstas 57.",
        "https://static.aosfatos.org/media/cke_uploads/2024/06/24/brigadistas-do-ibama-no-xingu-1.pdf"],
      ["INPE · julho de 2024", "Foram 11.434 focos na Amazônia em julho, contra uma média histórica de 6.164. Primeira vez desde 2005 que julho passou de 10 mil. É a seca chegando antes da brigada.",
        "https://ihu.unisinos.br/641957-brasil-incendiado-pais-viveu-o-pior-julho-em-registros-de-incendio-em-quase-duas-decadas"],
      ["MapBiomas Fogo", "Cerca de 30 milhões de hectares queimaram no Brasil em 2024, 62% acima da média. Só de floresta foram 7,7 milhões de hectares. Fogo em floresta é o mais difícil de segurar.",
        "https://brasil.mapbiomas.org/wp-content/uploads/sites/4/2025/06/Fact_Fogo_colecao4.pdf"],
      ["Lei 14.944/2024", "A política nacional manda incentivar a criação e o treinamento de brigadas e prevê um cadastro nacional de brigadas florestais.",
        "https://www.migalhas.com.br/quentes/412492/lei-que-define-regras-para-uso-de-fogo-em-areas-rurais-e-sancionada"],
    ],
  },
  marcos: {
    intro: "O Marcos olha orçamento, lei e quem paga a conta. As referências dele:",
    itens: [
      ["Fundo Amazônia · BNDES", "Em novembro de 2023 o teto por estado subiu de R$ 35 milhões para R$ 45 milhões: R$ 405 milhões para os nove estados da Amazônia Legal, com projetos apresentados pelos Corpos de Bombeiros.",
        "https://agenciagov.ebc.com.br/noticias/202311/fundo-amazonia-amplia-para-r-405-milhoes-apoio-aos-estados-contra-incendios-florestais"],
      ["Lei 14.944/2024", "Sancionada em 31 de julho de 2024, criou a Política Nacional de Manejo Integrado do Fogo e mexeu no Código Florestal e na Lei de Crimes Ambientais. O comitê nacional tem pelo menos um terço de sociedade civil.",
        "https://www.migalhas.com.br/quentes/412492/lei-que-define-regras-para-uso-de-fogo-em-areas-rurais-e-sancionada"],
      ["IPAM · florestas públicas não destinadas", "Em 2019, 20% dos focos de calor da Amazônia estavam em florestas públicas sem destinação, sinal forte de grilagem. E cerca de 75% do que é desmatado nelas vira pasto.",
        "https://www.ecycle.com.br/florestas-publicas-nao-destinadas-na-amazonia-sao-alvos-de-grilagem/"],
      ["MapBiomas Fogo", "De 1985 a 2024, pastagem responde por 53,2% da área queimada na Amazônia. O fogo grande tem dono e tem motivo econômico.",
        "https://brasil.mapbiomas.org/wp-content/uploads/sites/4/2025/06/Fact_Fogo_colecao4.pdf"],
      ["Câmara dos Deputados · Comissão de Meio Ambiente", "Audiência de 13 de agosto de 2024 sobre integrar União, estados e municípios contra desmatamento, queimadas, fumaça e seca no Amazonas.",
        "https://www2.camara.leg.br/atividade-legislativa/comissoes/comissoes-permanentes/cmads/apresentacoes-em-eventos/apresentacoes-de-convidados-em-eventos-de-2024/13-08-2024-integrar-esforcos-entre-os-diferentes-entes-federados-no-combate-ao-desmatamento-as-queimadas-a-fumaca-toxica-e-a-estiagem-dos-rios-no-amazonas/andre-lima/view"],
    ],
  },
  jaci: {
    intro: "A Jaci fala do território. O que mostra que ela não está sozinha:",
    itens: [
      ["Lei 14.944/2024", "A lei reconhece o papel do fogo nos ecossistemas e manda respeitar os saberes tradicionais. Permite o fogo na roça de subsistência de indígenas, quilombolas e comunidades tradicionais, e coloca os povos indígenas na gestão da política.",
        "https://semil.sp.gov.br/educacaoambiental/prateleira-ambiental/politica-nacional-de-manejo-integrado-do-fogo/"],
      ["Presidente do Ibama", "Segundo o Ibama, metade dos brigadistas federais contratados (Ibama e ICMBio) são indígenas e 20% são quilombolas.",
        "https://www.bahianoticias.com.br/noticia/296418-presidente-do-ibama-diz-que-estrutura-de-guerra-para-combater-incendios-tem-maioria-de-indigenas-e-quilombolas"],
      ["Prevfogo · mais de 30 anos", "O conhecimento indígena sobre manejo do fogo é usado pelo Prevfogo há mais de três décadas.",
        "https://portalamazonia.com/meio-ambiente/conhecimento-indigena-no-manejo-de-fogo-e-destaque-na-atuacao-do-prevfogo-ha-mais-de-30-anos/"],
      ["Ibama · brigadistas Yanomami", "Brigadistas Yanomami de diferentes povos foram treinados para prevenir e combater incêndios dentro do próprio território.",
        "https://portalamazonia.com/meio-ambiente/brigadistas-yanomami-combate-incendios/"],
      ["Embrapa", "A Embrapa defende que o manejo do fogo é possível e funciona, posição que o governo endossou com a lei de 2024.",
        "https://forbes.com.br/forbes-agro/2024/08/manejo-do-fogo-embrapa-diz-que-e-possivel-e-governo-endossa-com-lei/"],
    ],
  },
};

