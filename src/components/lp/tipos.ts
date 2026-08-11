import type { LucideIcon } from "lucide-react";

/** Conteúdo completo de uma LP de nicho. Toda copy mora aqui: os componentes
 *  em `src/components/lp/` só dão forma. Nova LP = novo arquivo em
 *  `conteudos/` + rota em `src/app/lp-{nicho}/page.tsx`. */
export type LPConteudo = {
  /** Rota da LP, usada no link canônico e nos registros de lead. */
  slug: string;

  selo: { icone: LucideIcon; texto: string };

  hero: {
    inicio: string;
    /** Parte do título que recebe o gradiente da marca. */
    destaque: string;
    descricao: string;
    cta: string;
  };

  problema: {
    rotulo: string;
    titulo: string;
    /** Continuação do título em cor apagada. */
    tituloSuave: string;
    descricao: string;
    itens: { icone: LucideIcon; titulo: string; consequencia: string }[];
  };

  calculadora: {
    titulo: string;
    descricao: string;
    rotuloContatos: string;
    rotuloConv1: string;
    rotuloConv2: string;
    rotuloTicket: string;
    /** Substantivos usados na frase do ganho: "com X% de {nomeConv1} e Y% de {nomeConv2}". */
    nomeConv1: string;
    nomeConv2: string;
    padrao: { contatos: number; conv1: number; conv2: number; ticket: number };
    possivel: { conv1: number; conv2: number };
  };

  mecanismo: {
    titulo: string;
    etapas: { fase: string; icone: LucideIcon; titulo: string; descricao: string }[];
  };

  provas: {
    titulo: string;
    itens: {
      indice: string;
      tipo: string;
      icone: LucideIcon;
      titulo: string;
      descricao: string;
      artefato: string;
    }[];
  };

  nichos: {
    rotulo: string;
    titulo: string;
    itens: string[];
  };

  comparacao: {
    titulo: string;
    tituloAntes: string;
    antes: string[];
    depois: string[];
  };

  oferta: {
    badge: string;
    titulo: string;
    descricao: string;
    bullets: string[];
  };

  form: {
    rotuloEmpresa: string;
    exemploEmpresa: string;
    rotuloSegmento: string;
    /** Última opção do select, para quem não se encaixa na lista. */
    outroSegmento: string;
    /** Como o campo aparece na mensagem do WhatsApp (ex.: "Empresa", "Escritório"). */
    waRotuloEmpresa: string;
    /** Complemento da tela de sucesso: "...como se fosse {sucessoComo}". */
    sucessoComo: string;
  };

  faq: { titulo: string; itens: { pergunta: string; resposta: string }[] };

  ctaFinal: { titulo: string; descricao: string };
};
