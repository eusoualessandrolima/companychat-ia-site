import { BadgeCheck, KeyRound, Megaphone, Headset, type LucideIcon } from "lucide-react";

export type CategoriaId = "utilidade" | "autenticacao" | "marketing" | "servico";

export type Categoria = {
  id: CategoriaId;
  nome: string;
  icon: LucideIcon;
  quandoUsa: string;
  faixa: string;
  /** Preço padrão por mensagem em R$ (aproximado Meta, Brasil). Editável na calculadora. */
  precoPadrao: number;
  gratis?: boolean;
  cor: {
    text: string;
    bg: string;
    barra: string;
    borda: string;
  };
};

/**
 * Valores aproximados da Meta para o Brasil, curados a partir da tabela oficial.
 * Servico é gratuito quando o cliente inicia e você responde dentro da janela de 24h.
 * Preços por mensagem sujeitos a alteração pela Meta.
 */
export const categorias: Categoria[] = [
  {
    id: "utilidade",
    nome: "Utilidade",
    icon: BadgeCheck,
    quandoUsa: "Confirmações, atualização de pedido, recibo, lembrete, suporte pós-venda",
    faixa: "R$ 0,04 a 0,05",
    precoPadrao: 0.05,
    cor: {
      text: "text-primary",
      bg: "bg-primary/10",
      barra: "bg-primary",
      borda: "border-primary/20",
    },
  },
  {
    id: "autenticacao",
    nome: "Autenticação",
    icon: KeyRound,
    quandoUsa: "Código OTP e verificação de identidade em duas etapas",
    faixa: "R$ 0,15 a 0,19",
    precoPadrao: 0.17,
    cor: {
      text: "text-accent-blue",
      bg: "bg-accent-blue/10",
      barra: "bg-accent-blue",
      borda: "border-accent-blue/20",
    },
  },
  {
    id: "marketing",
    nome: "Marketing",
    icon: Megaphone,
    quandoUsa: "Promoção, oferta, reengajamento e divulgação",
    faixa: "R$ 0,31 a 0,63",
    precoPadrao: 0.45,
    cor: {
      text: "text-accent-purple",
      bg: "bg-accent-purple/10",
      barra: "bg-accent-purple",
      borda: "border-accent-purple/20",
    },
  },
  {
    id: "servico",
    nome: "Serviço",
    icon: Headset,
    quandoUsa: "Cliente te chama primeiro e você responde dentro da janela de 24h",
    faixa: "Grátis",
    precoPadrao: 0,
    gratis: true,
    cor: {
      text: "text-accent-amber",
      bg: "bg-accent-amber/10",
      barra: "bg-accent-amber",
      borda: "border-accent-amber/20",
    },
  },
];

export const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
