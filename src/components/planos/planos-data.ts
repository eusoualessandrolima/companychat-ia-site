import { Bot, LayoutGrid, Rocket, Building2, type LucideIcon } from "lucide-react";

export type Grupo = {
  titulo: string;
  icon: LucideIcon;
  itens: string[];
};

export type Plano = {
  id: string;
  nome: string;
  chamada: string;
  preco: string;
  periodo?: string;
  precoNota: string;
  destaque: boolean;
  badge?: string;
  cta: string;
  grupos: Grupo[];
  nota?: { titulo: string; texto: string };
  rodape: string;
  /** Versão curta usada na seção de planos da home. */
  resumo: string[];
};

/** Fonte única dos planos. Atualizar aqui quando o comercial mudar valores ou escopo. */
export const planos: Plano[] = [
  {
    id: "pro",
    nome: "CompanyChat IA Pro",
    chamada: "Para quem já atende no WhatsApp e não quer mais perder cliente por demora na resposta.",
    preco: "R$ 497",
    periodo: "/mês",
    precoNota: "Implantação e treinamento inclusos, sem taxa de setup.",
    destaque: true,
    badge: "Mais escolhido",
    cta: "Começar com o Pro",
    grupos: [
      {
        titulo: "O assistente de IA faz",
        icon: Bot,
        itens: [
          "Atende seus clientes automaticamente, 24 horas por dia",
          "Fala com 1, 10 ou 100 clientes ao mesmo tempo",
          "Tira dúvidas de produtos, serviços, endereço, horário e localização",
          "Qualifica o cliente e identifica oportunidade de venda",
          "Entende texto, áudio, arquivo e imagem",
          "Compreende a intenção real da conversa",
        ],
      },
      {
        titulo: "Incluso na plataforma",
        icon: LayoutGrid,
        itens: [
          "1 número de WhatsApp conectado",
          "Atendentes ilimitados",
          "CRM com visão Kanban",
          "Painel de relatórios",
          "Chat interno da equipe",
          "Agendamento de mensagens",
          "Respostas rápidas compartilhadas",
          "Integrações via Webhook e API",
        ],
      },
      {
        titulo: "Implantação inclusa",
        icon: Rocket,
        itens: [
          "Diagnóstico do seu atendimento",
          "Treinamento do assistente com o seu material",
          "Testes junto com você antes de ir ao ar",
          "No ar em até 7 dias",
          "Sem contrato de fidelidade",
        ],
      },
    ],
    rodape: "O custo das mensagens é cobrado pela Meta e vem à parte.",
    resumo: [
      "Assistente de IA atendendo 24 horas por dia",
      "CRM com visão Kanban e atendentes ilimitados",
      "1 número de WhatsApp conectado",
      "Implantação e treinamento inclusos",
      "No ar em até 7 dias, sem fidelidade",
    ],
  },
  {
    id: "sob-medida",
    nome: "Sob medida",
    chamada: "Para operações com várias unidades, mais de um número ou sistema próprio para integrar.",
    preco: "Sob consulta",
    precoNota: "Escopo e valor definidos no diagnóstico, sem compromisso.",
    destaque: false,
    cta: "Falar com um especialista",
    grupos: [
      {
        titulo: "Tudo do Pro, e mais",
        icon: Building2,
        itens: [
          "Mais de um número de WhatsApp conectado",
          "Vários assistentes, cada um com a sua função",
          "Integração com o seu ERP ou sistema interno",
          "Volume alto de conversas por mês",
          "Fluxo desenhado para o seu processo",
          "Acompanhamento dedicado depois da implantação",
        ],
      },
      {
        titulo: "Como o seu plano é definido",
        icon: Rocket,
        itens: [
          "Diagnóstico da sua operação, sem custo",
          "Proposta com escopo e valor fechados antes de começar",
          "Implantação e treinamento no mesmo padrão do Pro",
        ],
      },
    ],
    nota: {
      titulo: "Quem costuma pedir esse plano",
      texto:
        "Redes com várias lojas, franquias, clínicas com mais de uma unidade e operações que atendem em times separados, cada um com o seu número.",
    },
    rodape: "Conte como funciona a sua operação e a gente monta a proposta.",
    resumo: [
      "Mais de um número de WhatsApp",
      "Vários assistentes, cada um com a sua função",
      "Integração com o seu ERP ou sistema interno",
      "Fluxo desenhado para o seu processo",
    ],
  },
];
