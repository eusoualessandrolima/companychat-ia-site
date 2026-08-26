import {
  Bot,
  CalendarCheck,
  ClipboardList,
  Clock3,
  Handshake,
  Headset,
  KanbanSquare,
  LifeBuoy,
  LineChart,
  MessagesSquare,
  Repeat2,
  ShoppingBag,
  Sparkles,
  Target,
  UserCheck,
  Workflow,
  type LucideIcon,
} from "lucide-react";

/* Campanha "10 Empresas, 10 Assistentes de IA" (`/10-empresas`).
 *
 * Toda a copy mora aqui — inclusive as respostas do FAQ, que descrevem regra
 * comercial. Quando a condição da campanha mudar (número de vagas, escopo do
 * que é gratuito, o que acontece depois), muda este arquivo e nada mais.
 *
 * Duas regras seguidas na redação:
 *   1. Só entra recurso que a CompanyChat já entrega hoje — cada item de
 *      "o que a IA poderá fazer" e de "o que será entregue" tem contrapartida
 *      no que as LPs e as páginas de produto já prometem.
 *   2. Nenhum número inventado: não há contador de vagas restantes, prazo de
 *      resposta prometido nem resultado de cliente que não exista. */

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
    "Sua empresa ainda pode ter um Assistente de IA no WhatsApp: fale com a gente e veja o caminho que faz sentido para o seu momento.",
  botao: "Falar com a CompanyChat",
  /** Rótulo que os CTAs assumem: prometer candidatura quando a seleção
   *  acabou é levar a pessoa para uma porta fechada. */
  cta: "Ver o resultado da seleção",
};

/** Identificação do lead na integração (`origem` do `/api/lead`). O CRM lê
 *  estas chaves para separar a candidatura dos leads das outras páginas. */
export const IDENTIFICACAO = {
  origem: "lp-10-empresas",
  campanha: "10-empresas-10-assistentes",
  tipo: "candidatura",
} as const;

export const SEO = {
  title: "10 empresas receberão um Assistente de IA no WhatsApp | CompanyChat",
  description:
    "Candidate sua empresa para receber a implantação gratuita de um Assistente de IA personalizado no WhatsApp pela CompanyChat.",
  ogTitle: "10 Empresas, 10 Assistentes de IA",
  ogDescription:
    "Sua empresa pode ser uma das selecionadas para receber um Assistente de IA personalizado no WhatsApp.",
};

export const hero = {
  badge: "Seleção exclusiva • Apenas 10 empresas",

  /* Duas linhas: a ação e o ganho. O degradê da marca fica na segunda, que é
     onde está o benefício, e não no verbo. As duas metades têm largura
     parecida, então no celular nenhuma palavra sobra órfã numa linha. */
  titulo: {
    linha1: "Atenda seus clientes com",
    destaque: "mais eficiência e agilidade",
  },

  subtitulo:
    "A CompanyChat vai selecionar 10 empresas para receber gratuitamente a implantação inicial de um Assistente de IA personalizado no WhatsApp, capaz de atender, qualificar e acompanhar clientes 24 horas por dia.",
  /* Rótulo curto de propósito: em 320px "Quero candidatar minha empresa"
     ocupava duas linhas e esticava o botão para 80px. */
  cta: "Quero participar da seleção",
  microcopy: "Candidatura gratuita • Leva menos de 2 minutos",
};

export const capacidades: {
  titulo: string;
  complemento: string;
  itens: { icone: LucideIcon; texto: string }[];
} = {
  titulo: "Veja como a IA pode ajudar sua empresa",
  complemento:
    "O fluxo será adaptado ao segmento, ao atendimento e aos objetivos da empresa selecionada.",
  itens: [
    { icone: Clock3, texto: "Atender clientes 24 horas por dia" },
    { icone: MessagesSquare, texto: "Responder dúvidas automaticamente" },
    { icone: UserCheck, texto: "Qualificar novos leads" },
    { icone: ShoppingBag, texto: "Apresentar produtos e serviços" },
    { icone: CalendarCheck, texto: "Agendar reuniões ou consultas" },
    { icone: Repeat2, texto: "Fazer follow-up de oportunidades" },
    { icone: LifeBuoy, texto: "Auxiliar no suporte e pós-venda" },
    { icone: Headset, texto: "Direcionar a conversa para um atendente humano" },
    { icone: KanbanSquare, texto: "Registrar contatos e etapas no CRM" },
  ],
};

export const entrega: {
  titulo: string;
  cta: string;
  subtitulo: string;
  nota: string;
  itens: { icone: LucideIcon; titulo: string; descricao: string }[];
} = {
  titulo: "O que será entregue para as empresas selecionadas",
  /* Estava escrito direto no componente. Vive aqui pelo mesmo motivo do resto
     da copy — e usa o rótulo curto, que cabe numa linha em 320px. */
  cta: "Quero participar da seleção",
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
      titulo: "Configuração do Assistente de IA",
      descricao:
        "O assistente treinado com as informações do negócio: produtos, serviços, prazos e regras.",
    },
    {
      icone: Sparkles,
      titulo: "Personalização para o segmento da empresa",
      descricao:
        "Linguagem, exemplos e critérios ajustados ao segmento em que a empresa atua.",
    },
    {
      icone: Workflow,
      titulo: "Um fluxo principal de automação",
      descricao:
        "Atendimento, qualificação, vendas, agendamento, follow-up ou suporte: cada etapa definida, com o que a IA resolve sozinha e o que vai para uma pessoa.",
    },
    {
      icone: MessagesSquare,
      titulo: "Integração com o WhatsApp",
      descricao:
        "A operação rodando no WhatsApp, planejada conforme a viabilidade técnica de cada empresa.",
    },
    {
      icone: KanbanSquare,
      titulo: "Organização dos contatos no CRM",
      descricao: "Cada conversa vira um card no funil, com histórico e etapa.",
    },
    {
      icone: LineChart,
      titulo: "Acompanhamento inicial da operação",
      descricao:
        "Nosso time acompanha o começo da operação e ajusta o que for necessário.",
    },
  ],
};

/* ─── Fora da página desde 2026-08-26 ───────────────────────────────────
 *
 * `motivo` e `faq` deixaram de ser renderizados: as duas seções saíram da LP
 * a pedido do dono. Os textos continuam aqui porque são a fonte das respostas
 * da Jade (`docs/jade-campanha-10-empresas.md`) — ela responde no WhatsApp o
 * que a página não explica mais. Apagar daqui faria a base do agente e o site
 * divergirem, que é o problema que este arquivo existe para evitar.
 * Para trazer qualquer uma de volta, basta voltar a seção em `Campanha.tsx`. */

export const motivo = {
  titulo: "Uma oportunidade ganha-ganha",
  icone: Handshake,
  texto:
    "Queremos acompanhar empresas reais utilizando a CompanyChat em diferentes segmentos. As empresas selecionadas recebem uma implantação personalizada, enquanto nosso time acompanha a operação para identificar melhorias, validar novos fluxos e gerar aprendizados para a evolução da plataforma.",
  aviso:
    "A seleção não é automática. As candidaturas serão analisadas de acordo com o perfil, a demanda de atendimento e a disponibilidade da empresa para participar do projeto.",
};

export const perfil = {
  titulo: "Essa oportunidade é para empresas que:",
  itens: [
    "Recebem clientes ou leads pelo WhatsApp",
    "Perdem oportunidades por demora no atendimento",
    "Precisam organizar melhor as conversas",
    "Querem automatizar tarefas repetitivas",
    "Possuem interesse real em utilizar Inteligência Artificial",
    "Podem colaborar com feedback durante o projeto",
  ],
  exclusao:
    "Esta seleção não é indicada para quem procura apenas um número de WhatsApp gratuito ou não possui uma operação real para testar.",
};

/* As condições que valem para quem se candidata.
 *
 * Estavam no FAQ, que saiu da página. Sem elas, a pessoa preenchia dez campos
 * sem saber por quanto tempo a inscrição fica aberta, o que exatamente é
 * gratuito nem o que acontece depois. Voltam aqui em lista curta, ao lado do
 * formulário, que é onde a decisão acontece, e não em acordeão.
 *
 * Mesmo texto das respostas que a Jade dá no WhatsApp
 * (`docs/jade-campanha-10-empresas.md`): se um mudar, o outro muda junto. */
export const condicoes = {
  titulo: "Condições da seleção",
  itens: [
    "A candidatura é gratuita e não gera compromisso.",
    "As inscrições ficam abertas por 30 dias após a publicação, ou até as 10 empresas serem selecionadas.",
    "A seleção não é automática: analisamos o perfil, a demanda de atendimento e a disponibilidade para participar do projeto.",
    "O que é gratuito: a implantação de um fluxo principal de automação, com diagnóstico, configuração do assistente, integração disponível, organização no CRM e acompanhamento inicial.",
    "Automações, integrações ou fluxos adicionais são avaliados separadamente, com escopo e valor apresentados antes de qualquer execução.",
    "A participação não cria contratação automática. O período inicial são os 30 primeiros dias após a ativação da operação, e continuar depois é opcional, com as condições apresentadas previamente.",
    "Todas as candidaturas recebem retorno pelo WhatsApp ou e-mail informados, selecionadas ou não.",
  ],
};

export const formulario = {
  titulo: "Candidate sua empresa",
  subtitulo:
    "Preencha as informações abaixo. Nossa equipe analisará a candidatura e responderá pelo WhatsApp ou e-mail informados, selecionada ou não.",
  botao: "Enviar minha candidatura",
  botaoEnviando: "Enviando a sua candidatura",
  microcopy:
    "A candidatura não garante a seleção. Apenas 10 empresas serão escolhidas.",
  consentimentoAntes:
    "Concordo que meus dados sejam utilizados pela CompanyChat para analisar minha candidatura e entrar em contato comigo, conforme a",
  consentimentoLink: "Política de Privacidade",
  consentimentoDepois: ".",
  sucesso: {
    titulo: "Candidatura recebida!",
    mensagem:
      "Obrigado pelo interesse em participar. Nossa equipe irá analisar as informações e responder pelo WhatsApp ou e-mail informados, tanto quem for selecionado quanto quem não for.",
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

export const OBJETIVOS = [
  "Atender clientes",
  "Qualificar leads",
  "Vender produtos ou serviços",
  "Agendar reuniões ou consultas",
  "Fazer follow-up",
  "Suporte e pós-venda",
  "Outro",
];

/* Regra comercial da campanha, aprovada em 2026-08-25. Duas fronteiras que a
   redação não pode cruzar: nada de "gratuito para sempre" (o que é gratuito é a
   implantação inicial, dentro do escopo definido) e nada de prometer integração
   ou recurso que ainda não exista — o que está fora do escopo é tratado à
   parte, não antecipado aqui. */
export const faq = {
  titulo: "Perguntas sobre a seleção",
  itens: [
    {
      pergunta: "A candidatura é gratuita?",
      resposta:
        "Sim. Não existe cobrança para enviar a candidatura, e candidatar-se não gera nenhum compromisso.",
    },
    {
      pergunta: "Todas as empresas serão selecionadas?",
      resposta:
        "Não. Serão selecionadas apenas 10 empresas. A seleção não é automática: analisamos o perfil, a demanda de atendimento e a disponibilidade da empresa para participar do projeto.",
    },
    {
      pergunta: "O que exatamente é gratuito?",
      resposta:
        "A implantação de um fluxo principal de automação: atendimento, qualificação, vendas, agendamento, follow-up ou suporte, conforme o caso da empresa. Junto vêm o diagnóstico do atendimento, a configuração do assistente, a personalização para o segmento, a integração disponível, a organização dos contatos no CRM e o acompanhamento inicial da operação.",
    },
    {
      pergunta: "E o que fica fora desse escopo?",
      resposta:
        "Automações, integrações ou fluxos adicionais além do fluxo principal são avaliados separadamente, com escopo e valor apresentados antes de qualquer execução. Nada é cobrado por surpresa.",
    },
    {
      pergunta: "Até quando dá para se candidatar?",
      resposta:
        "A campanha fica aberta por 30 dias após a publicação ou até que as 10 empresas sejam selecionadas, o que acontecer primeiro.",
    },
    {
      pergunta: "A empresa terá que contratar depois?",
      resposta:
        "Não. A participação não cria contratação automática. O período inicial são os 30 primeiros dias após a ativação da operação; depois disso, continuar é opcional, e as condições e os valores são apresentados previamente para a empresa decidir.",
    },
    {
      pergunta: "A IA funciona no WhatsApp da empresa?",
      resposta:
        "Sim. A configuração é planejada de acordo com a operação e com a viabilidade técnica de cada empresa selecionada, usando as integrações já disponíveis na plataforma.",
    },
    {
      pergunta: "E se minha empresa não for selecionada?",
      resposta:
        "Todas as candidaturas recebem retorno. Quem não for selecionado é avisado pelo WhatsApp ou pelo e-mail informados no formulário, depois do encerramento da seleção.",
    },
  ],
};

export const ctaFinal = {
  icone: Target,
  titulo:
    "Seu WhatsApp pode atender, qualificar e acompanhar clientes mesmo quando sua empresa está fechada",
  texto:
    "Candidate-se para participar da seleção das 10 empresas que receberão uma implantação personalizada da CompanyChat.",
  botao: "Quero participar da seleção",
  microcopy: "Candidatura gratuita e sem compromisso.",
};

/** Âncora única da página: todo CTA leva ao formulário. */
export const ANCORA_FORMULARIO = "candidatura";
