import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/* Acesso ao painel de leads: uma senha só, guardada em variável de ambiente.
   O cookie não carrega a senha — carrega um HMAC dela, então o valor do
   cookie sozinho não revela nada e não vale em outra instalação. */

const SENHA = process.env.PAINEL_LEADS_SENHA;
export const COOKIE = "painel_leads";

export function painelConfigurado() {
  return Boolean(SENHA && SENHA.length >= 6);
}

export function gerarToken() {
  return createHmac("sha256", SENHA as string).update("painel-leads").digest("hex");
}

function iguais(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function senhaConfere(tentativa: string) {
  if (!painelConfigurado()) return false;
  return iguais(tentativa, SENHA as string);
}

export async function estaAutenticado() {
  if (!painelConfigurado()) return false;
  const cookie = (await cookies()).get(COOKIE)?.value;
  if (!cookie) return false;
  return iguais(cookie, gerarToken());
}
