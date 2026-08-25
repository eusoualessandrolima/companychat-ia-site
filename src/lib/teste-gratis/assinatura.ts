import { createHmac, timingSafeEqual } from "node:crypto";

/* Validação da origem do webhook.
 *
 * A Meta assina o corpo com o App Secret e manda o resultado no cabeçalho
 * `x-hub-signature-256`. Sem conferir isso, qualquer um que descubra a URL
 * marca leads como respondidos e acorda a IA. */

export function assinaturaConfere(
  corpoBruto: string,
  cabecalho: string | null,
  appSecret: string
) {
  if (!cabecalho?.startsWith("sha256=")) return false;

  const esperada = createHmac("sha256", appSecret).update(corpoBruto, "utf8").digest("hex");
  const recebida = cabecalho.slice("sha256=".length);

  const bufEsperada = Buffer.from(esperada, "hex");
  const bufRecebida = Buffer.from(recebida, "hex");
  if (bufEsperada.length !== bufRecebida.length || bufRecebida.length === 0) return false;

  return timingSafeEqual(bufEsperada, bufRecebida);
}

/** Comparação de segredo em texto (token do cron, verify token do webhook)
 *  sem vazar o tamanho pela duração. */
export function segredoConfere(recebido: string | null, esperado: string) {
  if (!recebido) return false;
  const a = Buffer.from(recebido);
  const b = Buffer.from(esperado);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
