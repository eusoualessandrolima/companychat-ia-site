/* Saneamento do objeto `origem` que acompanha cada lead.
 *
 * A coluna `leads_site.origem` é `jsonb` e recebe o que o navegador manda:
 * UTMs, referrer, página e, na candidatura de `/10-empresas`, também as
 * respostas abertas do formulário. Sem teto, um POST forjado grava um
 * documento arbitrário no banco e o painel passa a renderizar o que ele quiser.
 *
 * Nada de aninhamento: as páginas sempre enviaram pares chave-valor rasos, e é
 * isso que o painel e o CRM leem. Valor que não for texto simples é descartado
 * em vez de virar "[object Object]" no card. */

const MAXIMO_CHAVES = 32;
const MAXIMO_CHAVE = 64;
const MAXIMO_VALOR = 600;

export function sanitizarOrigem(bruto: unknown): Record<string, string> {
  if (!bruto || typeof bruto !== "object" || Array.isArray(bruto)) return {};

  const limpo: Record<string, string> = {};

  for (const [chave, valor] of Object.entries(bruto as Record<string, unknown>)) {
    if (Object.keys(limpo).length >= MAXIMO_CHAVES) break;

    const nome = chave.trim().slice(0, MAXIMO_CHAVE);
    if (!nome) continue;

    let texto: string;
    if (typeof valor === "string") texto = valor;
    else if (typeof valor === "number" && Number.isFinite(valor)) texto = String(valor);
    else if (typeof valor === "boolean") texto = String(valor);
    else continue;

    const conteudo = texto.trim().slice(0, MAXIMO_VALOR);
    if (conteudo) limpo[nome] = conteudo;
  }

  return limpo;
}
