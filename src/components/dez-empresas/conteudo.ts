import {
  Bot,
  CalendarCheck,
  ClipboardList,
  Clock3,
  Handshake,
  Headset,
  KanbanSquare,
  LineChart,
  MessagesSquare,
  Repeat2,
  Send,
  Sparkles,
  Target,
  UserCheck,
  Workflow,
  type LucideIcon,
} from "lucide-react";

/* Campanha "10 Empresas, 10 Agentes de IA" (`/10-empresas`).
 *
 * Toda a copy mora aqui — inclusive as respostas do FAQ, que descrevem regra
 * comercial. Quando a condição da campanha mudar (número de vagas, escopo do
 * que é gratuito, o que acontece depois), muda este arquivo e nada mais.
 *
 * Duas regras seguidas na redação:
 *   1. Só entra recurso que a CompanyChat já entrega hoje — cada item do bento
 *      e da timeline tem contrapartida no que as LPs e as páginas de produto já
 *      prometem.
 *   2. Nenhum número inventado: não há contador de vagas restantes, prazo de
 *      resposta prometido, preço de referência nem resultado de cliente que não
 *      exista. Em particular, **não há âncora de preço riscado**: o site parou
 *      de publicar valor em 26/08/2026 ("preço sai no diagnóstico, caso a
 *      caso"), e inventar um "de R$ X por R$ 0" contrariaria essa decisão além
 *      de ser número sem lastro. O valor percebido vem do escopo detalhado. */

export const VAGAS = 10;

/** Vire para `true` quando as 10 empresas forem escolhidas.
 *
 *  A regra da campanha é que, encerrada a seleção, a página pare de aceitar
 *  candidatura em vez de continuar coletando gente para uma vaga que não
 *  existe. Com a chave ligada, o formulário dá lugar ao aviso abaixo, os CTAs
 *  somem e quem chegar pelo link antigo é mandado para o caminho comercial
 *  normal — sem tirar a página do ar e sem quebrar o endereço divulgado. */
export const CAMPANHA_ENCERRADA = false;

export const encerramento = {
  badge: "Seleção encerrada",
  titulo: "As 10 empresas desta seleção já foram escolhidas",
  texto:
    "As candidaturas foram analisadas e as empresas selecionadas já receberam contato. Obrigado a todo mundo que se candidatou.",
  complemento:
    "Sua empresa ainda pode ter um Agente de IA no WhatsApp: fale com a gente e veja o caminho que faz sentido para o seu momento.",
  botao: "Falar com a CompanyChat",
  /** Rótulo que os CTAs assumem: prometer candidatura quando a seleção
   *  acabou é levar a pessoa para uma porta fechada. */
  cta: "Ver o resultado da seleção",
};

/** Identificação do lead na integração (`origem` do `/api/lead`). O CRM lê
 *  estas chaves para separar a candidatura dos leads das outras páginas.
 *  **Não mudar sem alinhar do outro lado.** */
export const IDENTIFICACAO = {
  origem: "lp-10-empresas",
  campanha: "10-empresas-10-assistentes",
  tipo: "candidatura",
} as const;

/** Versão do texto de consentimento aceito. Muda **junto** com qualquer
 *  alteração em `formulario.consentimento*` — é ela que permite provar, mais
 *  tarde, qual redação a pessoa leu quando marcou a caixa. Mesmo padrão de
 *  `src/lib/teste-gratis/consentimento.ts`. */
export const CONSENTIMENTO_VERSAO = "2026-08-26";

export const SEO = {
  title: "10 empresas receberão um Agente de IA no WhatsApp | CompanyChat",
  description:
    "Candidate sua empresa para receber a implantação gratuita de um Agente de IA personalizado no WhatsApp pela CompanyChat.",
  ogTitle: "10 Empresas, 10 Agentes de IA",
  ogDescription:
    "Sua empresa pode ser uma das selecionadas para receber um Agente de IA personalizado no WhatsApp.",
};

/* ─── Hero ──────────────────────────────────────────────────────────────
 *
 * A ordem mudou em 26/08/2026. Antes o `<h1>` era "Atenda seus clientes com
 * mais eficiência e agilidade" — a **mesma frase da `/teste-gratis`** — e a
 * campanha aparecia só num badge de 12px. Numa página cujo argumento inteiro é
 * a escassez, a escassez não pode estar no menor tipo da tela: quem chega pelo
 * anúncio precisa entender em três segundos que são 10 vagas e que a
 * implantação é gratuita. A promessa genérica desceu para o subtítulo. */
export const hero = {
  badge: "Seleção exclusiva • 10 empresas",

  titulo: {
    linha1: "Sua empresa pode receber um",
    destaque: "Agente de IA personalizado",
    linha3: "no WhatsApp",
  },

  /* A faixa que carrega a oferta. Fica logo abaixo do `<h1>`, em superfície
     própria, porque é a informação que decide a candidatura. */
  oferta: {
    principal: "Implantação inicial 100% gratuita",
    complemento: "para apenas 10 empresas selecionadas",
  },

  subtitulo:
    "A CompanyChat vai selecionar 10 empresas para implantar um agente de IA que atende, qualifica, agenda, faz follow-up e organiza as oportunidades no WhatsApp — 24 horas por dia.",

  cta: "Quero candidatar minha empresa",
  microcopy: "Candidatura gratuita • menos de 2 minutos",
  confianca: "Sem compromisso • apenas 10 empresas serão selecionadas",
};

/* A conversa do mock ao lado do hero.
 *
 * Cada balão foi escrito contra o que a plataforma realmente faz: a IA
 * pergunta para qualificar, entende o porte e oferece horário. Ela não promete
 * preço, não fecha negócio e não inventa integração — o mesmo limite que vale
 * para a Jade no WhatsApp de verdade. */
export const conversa = {
  contato: "CompanyChat",
  estado: "online agora",
  rodape: "Conversa ilustrativa",
  baloes: [
    { de: "cliente", texto: "Vocês atendem em Goiânia?" },
    {
      de: "ia",
      texto: "Atendemos sim! Me conta rapidinho: é para a sua empresa ou uso pessoal?",
    },
    { de: "cliente", texto: "Empresa. Somos 4 no atendimento." },
    {
      de: "ia",
      texto:
        "Perfeito. Consigo te mostrar como ficaria no seu WhatsApp. Prefere hoje à tarde ou amanhã de manhã?",
    },
  ],
} as const;

/** Etiquetas que orbitam o telefone no hero. Cada uma nomeia um resultado que
 *  a conversa ao lado produz — não é enfeite solto: "Lead qualificado" é o que
 *  aconteceu no segundo balão, "Reunião agendada" é o quarto. Quatro, e não
 *  oito: o mock precisa continuar sendo o objeto principal da composição. */
export const etiquetasHero = [
  { texto: "Lead qualificado", icone: UserCheck },
  { texto: "Reunião agendada", icone: CalendarCheck },
  { texto: "Atendimento 24h", icone: Clock3 },
  { texto: "CRM atualizado", icone: KanbanSquare },
] as const;

/* ─── Percepção de valor ────────────────────────────────────────────────
 *
 * Seção nova. O diagnóstico era que a página comunicava "é de graça" sem
 * comunicar **o que** é de graça — e gratuidade sem escopo lê como brinde, não
 * como oportunidade. Os sete itens abaixo são exatamente os da entrega, ditos
 * em duas palavras cada: aqui eles servem de inventário (o tamanho da lista é
 * o argumento), e a timeline mais abaixo os explica um a um. */
export const valor = {
  rotulo: "O que sua empresa recebe",
  titulo: "Não é apenas um chatbot pronto",
  texto:
    "As empresas selecionadas recebem uma implantação personalizada para a própria operação: o agente de IA é configurado com os produtos, os serviços, as regras e a linguagem do negócio.",
  itens: [
    "Diagnóstico da operação",
    "Mapeamento das conversas",
    "Configuração do Agente de IA",
    "Personalização para o segmento",
    "Integração com o WhatsApp",
    "Organização no CRM",
    "Acompanhamento inicial",
  ],
  cartao: {
    rotulo: "Investimento para as empresas selecionadas",
    valor: "R$ 0",
    linha: "Implantação inicial 100% gratuita",
    nota: "Automações, integrações ou fluxos adicionais são avaliados separadamente, com escopo e valor apresentados antes de qualquer execução.",
  },
};

/* ─── Jornada ───────────────────────────────────────────────────────────
 *
 * Seção nova, quatro passos, para ser entendida em cinco segundos. Horizontal
 * no desktop, vertical no celular. É o resumo mecânico do que o bento detalha
 * logo abaixo — quem só passar o olho sai sabendo o essencial. */
export const jornada = {
  rotulo: "Como funciona na prática",
  titulo: "Do primeiro “oi” até a oportunidade organizada",
  passos: [
    {
      icone: Send,
      titulo: "O cliente chama",
      texto: "Pelo WhatsApp, a qualquer hora do dia ou da noite.",
    },
    {
      icone: Bot,
      titulo: "A IA entende",
      texto: "Identifica a intenção e o contexto da conversa.",
    },
    {
      icone: Workflow,
      titulo: "A IA executa",
      texto: "Responde, qualifica, agenda ou encaminha para uma pessoa.",
    },
    {
      icone: KanbanSquare,
      titulo: "Fica organizado",
      texto: "Cada conversa vira um card no funil, com histórico e etapa.",
    },
  ],
};

/* ─── O que a IA faz ────────────────────────────────────────────────────
 *
 * Eram nove itens numa grade 3×3 mais uma lista de seis — vinte e três bullets
 * entre o hero e o formulário, com ícone repetido entre as listas e um item
 * ("Registrar contatos e etapas no CRM") que dizia o mesmo que outro da lista
 * seguinte ("Organização dos contatos no CRM"). Viraram seis blocos de
 * tamanhos diferentes, e os dois que sobraram entraram como a linha de apoio
 * do fim da seção — nada foi perdido, só parou de competir. */
export const capacidades: {
  rotulo: string;
  titulo: string;
  complemento: string;
  itens: { icone: LucideIcon; titulo: string; texto: string; largo?: boolean }[];
  extras: { icone: LucideIcon; texto: string }[];
} = {
  rotulo: "Possibilidades de automação",
  titulo: "O que o agente de IA pode fazer pela sua empresa",
  complemento:
    "O fluxo será adaptado ao segmento, ao atendimento e aos objetivos da empresa selecionada.",
  itens: [
    {
      icone: Clock3,
      titulo: "Atendimento 24 horas",
      texto:
        "Responde seus clientes mesmo quando sua equipe está offline, no fim de semana e no feriado.",
      largo: true,
    },
    {
      icone: UserCheck,
      titulo: "Qualificação automática",
      texto: "Entende a necessidade do cliente antes de encaminhá-lo.",
    },
    {
      icone: CalendarCheck,
      titulo: "Agendamentos",
      texto: "Identifica a intenção e direciona para reunião ou consulta.",
    },
    {
      icone: Repeat2,
      titulo: "Follow-up inteligente",
      texto: "Retoma oportunidades que poderiam ser esquecidas.",
    },
    {
      icone: KanbanSquare,
      titulo: "CRM organizado",
      texto: "Registra contatos, histórico e etapas automaticamente.",
    },
    {
      icone: Headset,
      titulo: "Atendimento humano quando necessário",
      texto:
        "A IA reconhece quando a conversa deve sair dela e ir para uma pessoa do seu time.",
      largo: true,
    },
  ],
  extras: [
    { icone: MessagesSquare, texto: "Apresentar produtos e serviços" },
    { icone: Handshake, texto: "Auxiliar no suporte e no pós-venda" },
  ],
};

/* ─── A entrega ─────────────────────────────────────────────────────────
 *
 * Oito itens viraram seis passos numerados. As fusões: "personalização para o
 * segmento" + "um fluxo principal de automação" (a personalização É do fluxo),
 * e "integração com o WhatsApp" + "organização no CRM" (acontecem juntas, na
 * ativação). Nenhuma descrição foi cortada. */
export const entrega: {
  rotulo: string;
  titulo: string;
  cta: string;
  subtitulo: string;
  nota: string;
  itens: { icone: LucideIcon; titulo: string; descricao: string }[];
} = {
  rotulo: "A entrega",
  titulo: "O que será entregue para as empresas selecionadas",
  cta: "Quero candidatar minha empresa",
  subtitulo:
    "A implantação gratuita de um fluxo principal de automação: atendimento, qualificação, vendas, agendamento, follow-up ou suporte, conforme o caso da sua empresa.",
  nota: "Automações, integrações ou fluxos adicionais são avaliados separadamente, com escopo e valor apresentados antes de qualquer execução.",
  itens: [
    {
      icone: ClipboardList,
      titulo: "Diagnóstico do atendimento atual",
      descricao:
        "Como a empresa atende hoje: canais, horários e onde as conversas se perdem.",
    },
    {
      icone: MessagesSquare,
      titulo: "Mapeamento das principais conversas",
      descricao:
        "As perguntas que mais se repetem e os caminhos que levam ao fechamento.",
    },
    {
      icone: Bot,
      titulo: "Configuração do Agente de IA",
      descricao:
        "O agente de IA treinado com as informações do negócio: produtos, serviços, prazos e regras.",
    },
    {
      icone: Sparkles,
      titulo: "Personalização e fluxo principal",
      descricao:
        "Linguagem e critérios ajustados ao segmento, com cada etapa definida: o que a IA resolve sozinha e o que vai para uma pessoa.",
    },
    {
      icone: Workflow,
      titulo: "Integração com o WhatsApp e CRM",
      descricao:
        "A operação rodando no WhatsApp, planejada conforme a viabilidade técnica, com cada conversa virando um card no funil.",
    },
    {
      icone: LineChart,
      titulo: "Acompanhamento inicial da operação",
      descricao:
        "Nosso time acompanha o começo da operação e ajusta o que for necessário.",
    },
  ],
};

/* ─── Como funciona a seleção ───────────────────────────────────────────
 *
 * Seção nova, para responder antes de o formulário perguntar. Os três passos
 * saem das `condicoes` (que continuam abaixo, alimentando a Jade): a análise
 * não é automática, e todo mundo recebe retorno. */
export const selecao = {
  rotulo: "O processo",
  titulo: "Como funciona a seleção",
  passos: [
    {
      titulo: "Candidate sua empresa",
      texto: "O formulário leva menos de 2 minutos e é gratuito.",
    },
    {
      titulo: "Analisamos sua operação",
      texto:
        "A seleção não é automática: avaliamos o perfil, a demanda de atendimento e a disponibilidade para participar do projeto.",
    },
    {
      titulo: "Entramos em contato",
      texto:
        "As empresas escolhidas recebem as orientações para a implantação. Todas as candidaturas recebem retorno, selecionadas ou não.",
    },
  ],
  nota: "Enviar uma candidatura não gera nenhuma cobrança ou compromisso.",
};

/* ─── Perfil ────────────────────────────────────────────────────────────
 *
 * Era uma lista de seis com um aviso de exclusão no fim. Virou duas colunas:
 * a coluna da direita é o que faz a página parecer seleção, e não cadastro —
 * dizer para quem não é aumenta o valor de estar dentro. Nenhum critério novo
 * foi inventado: os quatro da direita saem de `perfil.exclusao` e de
 * `condicoes` (disponibilidade para participar e dar feedback). */
export const perfil = {
  rotulo: "Perfil da seleção",
  titulo: "Esta seleção é para a sua empresa?",
  positivos: {
    titulo: "É para sua empresa se…",
    itens: [
      "Recebe clientes ou leads pelo WhatsApp",
      "Demora para responder em alguns horários",
      "Perde oportunidades por falta de follow-up",
      "Tem tarefas repetitivas no atendimento",
      "Quer usar Inteligência Artificial de maneira prática",
      "Pode colaborar com feedback durante o projeto",
    ],
  },
  negativos: {
    titulo: "Talvez não seja o momento se…",
    itens: [
      "Não tem uma operação de atendimento ativa",
      "Procura apenas um número de WhatsApp gratuito",
      "Não pretende participar da implantação",
      "Não pode dar feedback durante o projeto",
    ],
  },
};

/* ─── Quem está por trás ────────────────────────────────────────────────
 *
 * Bloco de confiança sem número inventado. A prova aqui é verificável pelo
 * próprio visitante: a IA que a campanha oferece é a mesma que atende o
 * WhatsApp comercial da CompanyChat. Sem convite para ir conversar lá, porém —
 * a página tem um objetivo só, e o WhatsApp continua no rodapé para quem
 * procurar.
 *
 * ⚠️ Estrutura preparada para receber métricas reais (empresas atendidas,
 * automações no ar, volume de atendimentos). Enquanto não houver dado
 * apurado, `metricas` fica vazio e o componente não renderiza a faixa.
 * **Não preencher com estimativa.** */
export const provaEmpresa = {
  rotulo: "Quem está por trás",
  titulo: "Tecnologia desenvolvida pela CompanyChat",
  texto:
    "A CompanyChat é uma plataforma brasileira de atendimento no WhatsApp com Inteligência Artificial, feita para pequenas e médias empresas: agente de IA, CRM em funil, múltiplos atendentes e integração com a API Oficial.",
  destaque:
    "A mesma tecnologia atende o WhatsApp comercial da CompanyChat hoje.",
  metricas: [] as { numero: string; rotulo: string }[],
};

/* ─── Fora da página, mantido para a base da Jade ───────────────────────
 *
 * `motivo` e `condicoes` não são renderizados: as duas seções saíram da LP a
 * pedido do dono em 26/08/2026. Os textos continuam aqui porque são a fonte
 * das respostas da Jade (`docs/jade-campanha-10-empresas.md`) — ela responde no
 * WhatsApp o que a página não explica. Apagar daqui faria a base do agente e o
 * site divergirem, que é o problema que este arquivo existe para evitar. */

export const motivo = {
  titulo: "Uma oportunidade ganha-ganha",
  icone: Handshake,
  texto:
    "Queremos acompanhar empresas reais utilizando a CompanyChat em diferentes segmentos. As empresas selecionadas recebem uma implantação personalizada, enquanto nosso time acompanha a operação para identificar melhorias, validar novos fluxos e gerar aprendizados para a evolução da plataforma.",
  aviso:
    "A seleção não é automática. As candidaturas serão analisadas de acordo com o perfil, a demanda de atendimento e a disponibilidade da empresa para participar do projeto.",
};

/* As condições que valem para quem se candidata. Fonte das respostas da Jade;
 * se um mudar, o outro muda junto. */
export const condicoes = {
  titulo: "Condições da seleção",
  itens: [
    "A candidatura é gratuita e não gera compromisso.",
    "As inscrições ficam abertas por 30 dias após a publicação, ou até as 10 empresas serem selecionadas.",
    "A seleção não é automática: analisamos o perfil, a demanda de atendimento e a disponibilidade para participar do projeto.",
    "O que é gratuito: a implantação de um fluxo principal de automação, com diagnóstico, configuração do agente de IA, integração disponível, organização no CRM e acompanhamento inicial.",
    "Automações, integrações ou fluxos adicionais são avaliados separadamente, com escopo e valor apresentados antes de qualquer execução.",
    "A participação não cria contratação automática. O período inicial são os 30 primeiros dias após a ativação da operação, e continuar depois é opcional, com as condições apresentadas previamente.",
    "Todas as candidaturas recebem retorno pelo WhatsApp informado, selecionadas ou não.",
  ],
};

export const formulario = {
  titulo: "Candidate sua empresa",
  subtitulo:
    "Preencha as informações abaixo. Nossa equipe analisará a candidatura e responderá pelo WhatsApp informado, selecionada ou não.",
  botao: "Enviar minha candidatura",
  botaoEnviando: "Enviando a sua candidatura",
  microcopy:
    "A candidatura não garante a seleção. Apenas 10 empresas serão escolhidas.",
  seguranca:
    "Seus dados serão utilizados apenas para analisar a candidatura e para o contato da CompanyChat.",

  /* Rótulos das duas etapas. Duas, e não três: numa landing de anúncio curta,
     um wizard longo anuncia "isto vai demorar" antes de a pessoa ver o fim. A
     divisão aqui é só de interface — o envio continua sendo um POST único, com
     o mesmo `id` de lead do começo ao fim. */
  etapas: [
    { titulo: "Sobre você", descricao: "Para sabermos com quem falar" },
    { titulo: "Sobre sua operação", descricao: "Para avaliarmos a candidatura" },
  ],

  /* Rótulos dos campos.
     Na etapa 1 são substantivos, porque nome e telefone se explicam sozinhos.
     Na etapa 2 são perguntas: ali a pessoa está contando sobre a operação
     dela, e "Contatos por mês" soava como célula de planilha. */
  campos: {
    nome: "Nome completo",
    empresa: "Nome da empresa",
    telefone: "WhatsApp com DDD",
    telefoneAjuda: "É por aqui que respondemos a sua candidatura.",
    segmento: "Qual é o segmento da sua empresa?",
    volume: "Quantos contatos você recebe por mês?",
    objetivos: "O que você quer que a IA faça?",
    objetivosAjuda: "Marque quantas opções quiser.",
  },
  avancar: "Continuar",
  voltar: "Voltar",
  progresso: (atual: number, total: number) => `Etapa ${atual} de ${total}`,

  consentimentoAntes:
    "Concordo que meus dados sejam utilizados pela CompanyChat para analisar minha candidatura e entrar em contato comigo, conforme a",
  consentimentoLink: "Política de Privacidade",
  consentimentoDepois: ".",
  sucesso: {
    titulo: "Candidatura recebida!",
    mensagem:
      "Obrigado pelo interesse em participar. Nossa equipe irá analisar as informações e responder pelo WhatsApp informado, tanto quem for selecionado quanto quem não for.",
    complemento:
      "Enquanto isso, você pode conhecer a IA da CompanyChat funcionando no WhatsApp.",
    botao: "Testar a IA no WhatsApp",
  },
};

export const OUTRO_SEGMENTO = "Outro segmento";

export const SEGMENTOS = [
  "Comércio e lojas",
  "E-commerce",
  "Restaurantes e delivery",
  "Imobiliárias",
  "Clínicas e saúde",
  "Escolas e cursos",
  "Advocacia",
  "Seguros",
  "Agências de marketing",
  "Contabilidade",
  "Oficinas mecânicas",
  "Salões de beleza e barbearias",
  "Energia solar",
  "Construção e reformas",
  "Turismo e viagens",
  "Pet shops",
  "Tecnologia e software",
  "Indústria",
  "Serviços em geral",
];

export const VOLUMES = [
  "Até 50 por mês",
  "De 51 a 200",
  "De 201 a 500",
  "De 501 a 1.000",
  "Mais de 1.000",
  "Ainda não sei",
];

/* Múltipla escolha desde 26/08/2026, e não mais um `<select>` de uma opção só.
   A operação de uma empresa raramente tem um objetivo isolado — quem quer
   qualificar lead quase sempre quer agendar também — e obrigar a escolher um
   jogava fora justamente o que ajuda a entender o caso na hora de selecionar.
   "Outro" saiu: sem campo aberto ao lado, ele não informava nada. */
export const OBJETIVOS = [
  "Atender clientes",
  "Qualificar leads",
  "Vender produtos ou serviços",
  "Agendar reuniões ou consultas",
  "Fazer follow-up",
  "Suporte e pós-venda",
  "Organizar as conversas no CRM",
];

/* Regra comercial da campanha, aprovada em 2026-08-25. Duas fronteiras que a
   redação não pode cruzar: nada de "gratuito para sempre" (o que é gratuito é a
   implantação inicial, dentro do escopo definido) e nada de prometer integração
   ou recurso que ainda não exista — o que está fora do escopo é tratado à
   parte, não antecipado aqui.

   ⚠️ **Fora da página desde 26/08/2026** — a segunda saída na mesma semana,
   por decisão do dono. O FAQ chegou a voltar no redesign e saiu de novo junto
   com o CTA final: a página termina no formulário. Este bloco continua aqui
   porque é a fonte das respostas da Jade
   (`docs/jade-campanha-10-empresas.md`), que responde no WhatsApp o que a
   página não explica mais. Apagar daqui faria a base do agente e o site
   divergirem — o problema que este arquivo existe para evitar. Para trazer de
   volta, basta um `<SecaoFaq />` em `Campanha.tsx`.

   Duas perguntas novas entraram no redesign e permanecem, ambas ancoradas em
   capacidade que já existe: a IA direcionar a conversa para uma pessoa, e a
   configuração ser planejada conforme a viabilidade técnica de cada empresa.

   ⚠️ Duas perguntas do briefing NÃO entraram, por falta de fonte:
   "quanto tempo leva a implantação" (não há prazo definido em lugar nenhum do
   projeto) e "preciso trocar meu número" (depende da via de integração, que é
   decidida caso a caso). Responder qualquer uma seria inventar regra
   comercial. Quando houver definição, elas entram aqui. */
export const faq = {
  rotulo: "Dúvidas",
  titulo: "Perguntas sobre a seleção",
  itens: [
    {
      pergunta: "A implantação é realmente gratuita?",
      resposta:
        "É. Para as 10 empresas selecionadas, a implantação de um fluxo principal de automação não tem custo — e a candidatura também não gera cobrança nem compromisso.",
    },
    {
      pergunta: "O que exatamente é gratuito?",
      resposta:
        "A implantação de um fluxo principal de automação: atendimento, qualificação, vendas, agendamento, follow-up ou suporte, conforme o caso da empresa. Junto vêm o diagnóstico do atendimento, a configuração do agente de IA, a personalização para o segmento, a integração disponível, a organização dos contatos no CRM e o acompanhamento inicial da operação.",
    },
    {
      pergunta: "E o que fica fora desse escopo?",
      resposta:
        "Automações, integrações ou fluxos adicionais além do fluxo principal são avaliados separadamente, com escopo e valor apresentados antes de qualquer execução. Nada é cobrado por surpresa.",
    },
    {
      pergunta: "Existe mensalidade depois da implantação?",
      resposta:
        "A participação não cria contratação automática. O período inicial são os 30 primeiros dias após a ativação da operação; depois disso, continuar é opcional, e as condições e os valores são apresentados previamente para a empresa decidir.",
    },
    {
      pergunta: "A IA substitui meus atendentes?",
      resposta:
        "Não. Ela cuida do que se repete — responder as dúvidas de sempre, qualificar quem chega, agendar e fazer follow-up — e reconhece quando a conversa deve sair dela e ir para uma pessoa do seu time. O atendimento humano continua, com menos ruído e mais contexto.",
    },
    {
      pergunta: "A IA funciona no WhatsApp da minha empresa?",
      resposta:
        "Sim. A configuração é planejada de acordo com a operação e com a viabilidade técnica de cada empresa selecionada, usando as integrações já disponíveis na plataforma. Esse é um dos pontos definidos no diagnóstico.",
    },
    {
      pergunta: "Como as empresas serão selecionadas?",
      resposta:
        "A seleção não é automática: analisamos o perfil, a demanda de atendimento e a disponibilidade da empresa para participar do projeto. Serão escolhidas apenas 10.",
    },
    {
      pergunta: "Até quando dá para se candidatar?",
      resposta:
        "A campanha fica aberta por 30 dias após a publicação ou até que as 10 empresas sejam selecionadas, o que acontecer primeiro.",
    },
    {
      pergunta: "E se minha empresa não for selecionada?",
      resposta:
        "Todas as candidaturas recebem retorno. Quem não for selecionado é avisado pelo WhatsApp informado no formulário, depois do encerramento da seleção.",
    },
  ],
};

/** Fechamento da página. **Fora do ar desde 26/08/2026**, junto com o FAQ: a
 *  landing termina no formulário. Mantido aqui pelo mesmo motivo do FAQ — é
 *  copy aprovada, e trazer de volta é um `<SecaoFechamento />` em
 *  `Campanha.tsx`. */
export const ctaFinal = {
  icone: Target,
  titulo:
    "Enquanto sua equipe está offline, seus clientes continuam chegando",
  texto:
    "Sua empresa pode ser uma das 10 selecionadas para receber uma implantação personalizada da CompanyChat.",
  botao: "Quero participar da seleção",
  microcopy: "Candidatura gratuita e sem compromisso.",
};

/** Âncora única da página: todo CTA leva ao formulário. */
export const ANCORA_FORMULARIO = "candidatura";
