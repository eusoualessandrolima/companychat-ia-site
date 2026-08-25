import { CONSENTIMENTO_VERSAO } from "./consentimento";
import { normalizarWhatsapp } from "./telefone";

/* Validação e saneamento do formulário, do lado do servidor.
   O formulário valida antes por cortesia; aqui é onde vale. */

export type EntradaFormulario = Record<string, unknown>;

export type LeadValidado = {
  nome: string;
  email: string;
  whatsapp: string;
  whatsappE164: string;
  site: string | null;
  semSite: boolean;
  segmento: string;
  consentimentoWhatsapp: true;
  consentimentoVersao: string;
  origem: Record<string, string>;
};

export type Resultado =
  | { ok: true; lead: LeadValidado }
  | { ok: false; erros: Record<string, string> };

/** Campos de origem aceitos. Lista fechada de propósito: sem isto, qualquer
 *  chave enviada pelo cliente vira coluna no jsonb do lead. */
export const CAMPOS_ORIGEM = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
  "gclid",
  "fbclid",
  "msclkid",
  "url_inicial",
  "url_conversao",
  "referrer",
  "pagina",
] as const;

const LIMITE_ORIGEM = 500;

function limpar(valor: unknown, limite: number) {
  if (typeof valor !== "string") return "";
  return (
    valor
      // Caracteres de controle viram lixo em CSV e em log estruturado.
      .replace(/[\u0000-\u001f\u007f]/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim()
      .slice(0, limite)
  );
}

/* Proposital: valida a forma, não a existência. Endereço com acento, `+` ou
   subdomínio passa; sem arroba, com espaço ou sem ponto no domínio, não. */
const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

function normalizarSite(bruto: string) {
  if (!bruto) return null;
  const comEsquema = /^https?:\/\//i.test(bruto) ? bruto : `https://${bruto}`;
  try {
    const url = new URL(comEsquema);
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function validarFormulario(corpo: EntradaFormulario): Resultado {
  const erros: Record<string, string> = {};

  const nome = limpar(corpo.nome, 120);
  if (nome.length < 2) erros.nome = "Informe o seu nome completo";
  else if (!nome.includes(" ")) erros.nome = "Informe o nome e o sobrenome";

  const email = limpar(corpo.email, 160).toLowerCase();
  if (!email) erros.email = "Informe o seu e-mail profissional";
  else if (!EMAIL.test(email)) erros.email = "E-mail inválido";

  const whatsapp = limpar(corpo.whatsapp, 30);
  const telefone = normalizarWhatsapp(whatsapp);
  if (!telefone.ok) erros.whatsapp = telefone.motivo;

  const semSite = corpo.semSite === true;
  const siteBruto = limpar(corpo.site, 200);
  const site = semSite ? null : normalizarSite(siteBruto);
  if (!semSite && siteBruto && !site) {
    erros.site = "Endereço de site inválido";
  }

  const segmentoBruto = limpar(corpo.segmento, 80);
  const outroSegmento = limpar(corpo.outroSegmento, 80);
  const segmento =
    segmentoBruto === "Outro" && outroSegmento ? outroSegmento : segmentoBruto;
  if (!segmento) erros.segmento = "Escolha o seu segmento";
  else if (segmentoBruto === "Outro" && !outroSegmento) {
    erros.outroSegmento = "Descreva o seu segmento";
  }

  /* O consentimento é a base do disparo. Sem ele não há lead a criar: nada de
     gravar "para contatar depois quando ele aceitar". */
  if (corpo.consentimentoWhatsapp !== true) {
    erros.consentimentoWhatsapp =
      "É preciso concordar em receber o contato pelo WhatsApp";
  }

  if (Object.keys(erros).length > 0 || !telefone.ok) {
    return { ok: false, erros };
  }

  return {
    ok: true,
    lead: {
      nome,
      email,
      whatsapp,
      whatsappE164: telefone.e164,
      site,
      semSite,
      segmento,
      consentimentoWhatsapp: true,
      consentimentoVersao: CONSENTIMENTO_VERSAO,
      origem: extrairOrigem(corpo.origem),
    },
  };
}

export function extrairOrigem(bruto: unknown): Record<string, string> {
  if (!bruto || typeof bruto !== "object") return {};
  const entrada = bruto as Record<string, unknown>;
  const saida: Record<string, string> = {};

  for (const campo of CAMPOS_ORIGEM) {
    const valor = limpar(entrada[campo], LIMITE_ORIGEM);
    if (valor) saida[campo] = valor;
  }

  return saida;
}

/** Campo isca. Preenchido só por robô, que preenche tudo o que encontra.
 *  Some da tela por CSS e fica fora da ordem de tabulação. */
export function caiuNaIsca(corpo: EntradaFormulario) {
  return typeof corpo.empresaWebsite === "string" && corpo.empresaWebsite.trim() !== "";
}
