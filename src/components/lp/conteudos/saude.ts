import {
  AlarmClock,
  Bot,
  CalendarCheck,
  CalendarX2,
  ClipboardList,
  Headset,
  KanbanSquare,
  MessagesSquare,
  Moon,
  Repeat2,
  Sparkles,
  Stethoscope,
  UserCheck,
} from "lucide-react";
import type { LPConteudo } from "@/components/lp/tipos";

/** LP Saúde: clínicas e negócios de saúde e bem-estar. Copy validada na
 *  antiga /comecar2 (2026-08-11). */
export const saude: LPConteudo = {
  slug: "/lp-saude",

  selo: {
    icone: Stethoscope,
    texto: "Para clínicas e negócios de saúde e bem-estar",
  },

  hero: {
    inicio: "Pare de perder pacientes",
    destaque: "no WhatsApp",
    descricao:
      "A CompanyChat IA responde em segundos, qualifica o paciente, agenda e confirma consultas, 24 horas por dia, inclusive quando a sua clínica está fechada.",
    cta: "Quero ver a IA atendendo",
  },

  problema: {
    rotulo: "O vazamento silencioso",
    titulo: "Sua clínica não precisa de mais pacientes.",
    tituloSuave: "Precisa parar de perder os que já chamam.",
    descricao:
      "Quem procura uma clínica no WhatsApp está pronto para agendar. O que decide é a velocidade e a constância da resposta. É exatamente aí que o atendimento manual vaza.",
    itens: [
      {
        icone: Moon,
        titulo: "O paciente chama às 21h",
        consequencia:
          "Sem resposta na hora, ele agenda com quem respondeu primeiro na manhã seguinte.",
      },
      {
        icone: AlarmClock,
        titulo: "A resposta demora horas",
        consequencia:
          "Cada hora no vácuo esfria o interesse. Saúde é decisão por impulso de cuidado.",
      },
      {
        icone: CalendarX2,
        titulo: "Falta sem aviso",
        consequencia:
          "Sem confirmação de véspera, o horário vago vira prejuízo que ninguém recupera.",
      },
      {
        icone: Repeat2,
        titulo: "Equipe repetindo o básico",
        consequencia:
          "Preço, convênio e endereço o dia inteiro, enquanto quem está na clínica espera atenção.",
      },
    ],
  },

  calculadora: {
    titulo: "Quanto a demora está custando por mês?",
    descricao:
      "Coloque os números da sua clínica e veja uma estimativa do que fica na mesa quando contatos não viram agendamento e agendamentos não viram comparecimento.",
    rotuloContatos: "Contatos no WhatsApp por mês",
    rotuloConv1: "% que agenda",
    rotuloConv2: "% que comparece",
    rotuloTicket: "Ticket médio (R$)",
    nomeConv1: "agendamento",
    nomeConv2: "comparecimento",
    padrao: { contatos: 200, conv1: 30, conv2: 70, ticket: 250 },
    possivel: { conv1: 45, conv2: 85 },
  },

  mecanismo: {
    titulo:
      "Do “oi” ao horário confirmado, sem ninguém da sua equipe no teclado",
    etapas: [
      {
        fase: "Entrada",
        icone: MessagesSquare,
        titulo: "O paciente chama no WhatsApp",
        descricao:
          "A IA responde em segundos, de madrugada, no domingo e no feriado.",
      },
      {
        fase: "Entendimento",
        icone: Bot,
        titulo: "Entende texto, áudio e foto",
        descricao: "O paciente fala do jeito dele; a IA pergunta só o que falta.",
      },
      {
        fase: "Qualificação",
        icone: UserCheck,
        titulo: "Qualifica a conversa",
        descricao:
          "Procedimento, convênio e urgência, antes de ocupar a sua equipe.",
      },
      {
        fase: "Agendamento",
        icone: CalendarCheck,
        titulo: "Agenda e confirma",
        descricao:
          "Marca o horário e envia lembrete de véspera para reduzir faltas.",
      },
      {
        fase: "Registro",
        icone: KanbanSquare,
        titulo: "Registra tudo no CRM",
        descricao:
          "Cada conversa vira um card no funil: ninguém some sem deixar rastro.",
      },
      {
        fase: "Transbordo",
        icone: Headset,
        titulo: "Chama um humano quando precisa",
        descricao: "Caso delicado ou fora do escopo vai direto para a sua equipe.",
      },
    ],
  },

  provas: {
    titulo: "Autoridade se demonstra trabalhando, não prometendo",
    itens: [
      {
        indice: "01",
        tipo: "Diagnóstico",
        icone: ClipboardList,
        titulo: "Mapa do seu atendimento",
        descricao:
          "Antes de ativar, mapeamos como a sua clínica atende hoje: canais, horários, perguntas repetidas e onde os pacientes desistem.",
        artefato: "Diagnóstico do fluxo de atendimento",
      },
      {
        indice: "02",
        tipo: "Método",
        icone: Stethoscope,
        titulo: "Funil de agendamento",
        descricao:
          "Responder, qualificar, agendar, confirmar e recuperar: cada etapa com dono e registrada no CRM, em vez de conversa solta no celular.",
        artefato: "Fluxo aplicado ao seu segmento",
      },
      {
        indice: "03",
        tipo: "Execução",
        icone: Sparkles,
        titulo: "A IA atendendo de verdade",
        descricao:
          "O WhatsApp oficial da CompanyChat IA é atendido pela mesma IA que você vai contratar. É a demonstração mais honesta que existe.",
        artefato: "Teste ao vivo no fim desta página",
      },
    ],
  },

  nichos: {
    rotulo: "Feita para o seu segmento",
    titulo: "Da recepção da clínica ao balcão da farmácia",
    itens: [
      "Clínicas odontológicas",
      "Médicos especialistas",
      "Psicólogos",
      "Nutricionistas",
      "Academias",
      "Fisioterapeutas",
      "Spas",
      "Clínicas de estética",
      "Veterinários",
      "Farmácias",
      "Laboratórios",
      "Clínicas de terapia",
      "Hospitais",
      "Clínicas de cirurgia plástica",
      "Nutrologistas",
      "Personal trainers",
      "Yoga e meditação",
      "Quiropraxistas",
      "Clínicas de acne",
      "Massoterapeutas",
    ],
  },

  comparacao: {
    titulo: "O mesmo WhatsApp, duas operações diferentes",
    tituloAntes: "Atendimento manual",
    antes: [
      "Resposta só em horário comercial",
      "Agenda com buracos por falta e esquecimento",
      "Conversas perdidas no celular de cada um",
      "Equipe presa em pergunta repetida",
    ],
    depois: [
      "Resposta em segundos, 24 horas por dia",
      "Confirmação e lembrete automáticos",
      "Todo contato registrado no CRM",
      "Equipe focada em quem está na clínica",
    ],
  },

  oferta: {
    badge: "Implantação e treinamento inclusos",
    titulo: "Veja a IA atendendo como se já fosse a sua clínica",
    descricao:
      "Preencha ao lado e fale com a nossa IA no WhatsApp. Ela já chega sabendo o seu segmento, e você sente na pele o que o seu paciente sentiria.",
    bullets: [
      "Demonstração ao vivo com a IA no seu WhatsApp",
      "Diagnóstico do seu atendimento atual",
      "Proposta com escopo e valor fechados",
      "Sem compromisso e sem taxa de setup",
    ],
  },

  form: {
    rotuloEmpresa: "Qual é o nome da clínica ou negócio?",
    exemploEmpresa: "Ex.: Clínica Modelo",
    rotuloSegmento: "Qual é o seu segmento?",
    outroSegmento: "Outro segmento de saúde",
    waRotuloEmpresa: "Clínica/negócio",
    sucessoComo: "um paciente da sua clínica",
  },

  faq: {
    titulo: "O que toda clínica pergunta antes",
    itens: [
      {
        pergunta: "Serve para o meu segmento?",
        resposta:
          "A IA é treinada com as informações do seu negócio: procedimentos, convênios, horários e regras. Atendemos clínicas odontológicas, médicas, de estética, psicólogos, veterinários, academias, laboratórios e outros negócios de saúde e bem-estar.",
      },
      {
        pergunta: "E se a IA não souber responder?",
        resposta:
          "Ela transfere a conversa para a sua equipe na hora, com todo o histórico. Casos delicados, urgências e o que fugir do escopo nunca ficam presos na automação.",
      },
      {
        pergunta: "A IA entende áudio e foto?",
        resposta:
          "Sim. O paciente pode mandar áudio, foto ou documento, e a IA entende e responde de acordo. É importante em saúde, onde muita gente prefere falar a digitar.",
      },
      {
        pergunta: "A IA dá orientação clínica ao paciente?",
        resposta:
          "Não. A IA cuida do atendimento administrativo: informações, qualificação, agendamento, confirmação e follow-up. Ela não faz diagnóstico, não prescreve e não interpreta exames. Questões clínicas, sensíveis ou urgentes são encaminhadas para a sua equipe e para os profissionais habilitados.",
      },
      {
        pergunta: "Quanto custa?",
        resposta:
          "Os planos começam em R$ 497 por mês, com implantação e treinamento inclusos e sem taxa de setup. Projetos maiores têm proposta sob medida, com escopo e valor fechados antes de começar.",
      },
      {
        pergunta: "Como começo?",
        resposta:
          "Preencha o formulário desta página. Você conversa com a nossa IA no WhatsApp, vê como ela atende na prática e depois fazemos o diagnóstico do seu atendimento, sem compromisso.",
      },
    ],
  },

  ctaFinal: {
    titulo: "Enquanto você lê isto, tem paciente esperando resposta",
    descricao:
      "Leva menos de um minuto para preencher, e a demonstração acontece no seu próprio WhatsApp, sem compromisso.",
  },
};
