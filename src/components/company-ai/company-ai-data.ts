import { Bot, Compass, KanbanSquare, MonitorCog, Workflow, type LucideIcon } from "lucide-react";

/** Frente em destaque: vem antes de qualquer construção. */
export const consultoria = {
  icon: Compass,
  nome: "Consultoria em IA",
  resumo: "Antes de construir, alguém precisa dizer onde a IA cabe e onde ela só atrapalharia.",
  desc: "A gente olha a sua operação por dentro e aponta onde a inteligência artificial resolve de verdade, onde ela só criaria trabalho e em que ordem vale mexer. Você sai com um plano, não com uma promessa.",
  exemplos: [
    "Mapeamento do que se repete na sua operação hoje",
    "Onde a IA resolve e onde ela não vale o esforço",
    "Ordem de prioridade pelo retorno mais rápido",
    "Plano de implantação, com ou sem a gente executando",
  ],
};

export type Construcao = {
  icon: LucideIcon;
  nome: string;
  /** Frase curta usada na seção da home */
  resumo: string;
  /** Texto completo usado na página /company-ai */
  desc: string;
  exemplos: string[];
  text: string;
  bg: string;
  bar: string;
};

/** O que a Company AI desenvolve sob medida. Fonte única para a seção da
    home e para a página /company-ai. */
export const construcoes: Construcao[] = [
  {
    icon: Bot,
    nome: "Atendente inteligente no WhatsApp",
    resumo: "Responde na hora, entende o cliente e só chama uma pessoa quando o caso pede.",
    desc: "Um assistente treinado com o material do seu negócio, que responde na hora, entende o que o cliente quer e passa a conversa para uma pessoa do time quando o caso pede.",
    exemplos: [
      "Tira dúvidas e qualifica quem chega",
      "Agenda, confirma e lembra o cliente",
      "Passa o bastão para o time no momento certo",
    ],
    text: "text-primary",
    bg: "bg-primary/10",
    bar: "from-primary to-[#00d4a0]",
  },
  {
    icon: MonitorCog,
    nome: "Sistema personalizado",
    resumo: "Feito para o seu processo, em vez de um pacote genérico que você contorna.",
    desc: "Um sistema construído em cima do processo que a sua empresa já tem, em vez de um pacote pronto que obriga todo mundo a trabalhar de um jeito diferente.",
    exemplos: [
      "Telas e campos com o vocabulário da sua operação",
      "Regras e permissões por área ou por pessoa",
      "Conectado às ferramentas que você já usa",
    ],
    text: "text-accent-blue",
    bg: "bg-accent-blue/10",
    bar: "from-accent-blue to-[#00d4ff]",
  },
  {
    icon: KanbanSquare,
    nome: "CRM sob medida",
    resumo: "Um funil com as etapas que a sua equipe usa de verdade, não as do template.",
    desc: "Um funil desenhado do jeito que a sua equipe vende de verdade, com as etapas, os campos e os alertas que fazem sentido para o seu ciclo, e não os de um template.",
    exemplos: [
      "Etapas que espelham a sua venda",
      "Histórico e conversa no mesmo lugar",
      "Visão de quem está parado e há quanto tempo",
    ],
    text: "text-accent-amber",
    bg: "bg-accent-amber/10",
    bar: "from-accent-amber to-[#fbbf24]",
  },
  {
    icon: Workflow,
    nome: "Automação de processos",
    resumo: "O que hoje consome horas da equipe passa a rodar em minutos, sozinho.",
    desc: "Aquela tarefa repetitiva que hoje consome horas da sua equipe passa a rodar em minutos, sem depender de alguém lembrar de fazer.",
    exemplos: [
      "Relatório e planilha que se atualizam sozinhos",
      "Cobrança, follow-up e aviso automáticos",
      "Dados que circulam entre sistemas sem digitação",
    ],
    text: "text-accent-purple",
    bg: "bg-accent-purple/10",
    bar: "from-accent-purple to-[#d480ff]",
  },
];
