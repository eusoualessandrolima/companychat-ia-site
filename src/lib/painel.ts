import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/* Acesso ao painel de leads: uma senha só, guardada em variável de ambiente.
   O cookie não carrega a senha — carrega um token assinado com ela, então o
   valor do cookie sozinho não revela nada e não vale em outra instalação. */

const SENHA = process.env.PAINEL_LEADS_SENHA;
export const COOKIE = "painel_leads";

/** Mínimo de caracteres da senha do painel.
 *
 *  Vinte, e não seis, porque esta é a única barreira entre a internet e a base
 *  de leads inteira — nome, empresa, telefone, e-mail e texto livre de quem
 *  preencheu o quiz. É uma senha só, compartilhada e digitada raramente: cabe
 *  num gerenciador de senhas sem atrito.
 *
 *  Abaixo disto o painel se recusa a funcionar e mostra o aviso de senha não
 *  configurada. Recusar é o comportamento certo: um painel de PII protegido por
 *  seis caracteres é um painel aberto com etapa extra. */
export const MINIMO_SENHA = 20;

/** Validade do token de sessão. O cookie carrega o mesmo prazo, mas quem decide
 *  é a verificação no servidor: cookie expirado o navegador descarta sozinho,
 *  cookie copiado para outro lugar continuaria valendo se a validade não
 *  estivesse assinada dentro dele. */
const VALIDADE_HORAS = 12;

export function painelConfigurado() {
  return Boolean(SENHA && SENHA.length >= MINIMO_SENHA);
}

/** A senha como chave de assinatura, com o invariante no código em vez de num
 *  comentário: `gerarToken` é exportada e um chamador novo poderia esquecer o
 *  `painelConfigurado()` antes. */
function segredo(): string {
  if (!SENHA || SENHA.length < MINIMO_SENHA) {
    throw new Error(
      `PAINEL_LEADS_SENHA ausente ou com menos de ${MINIMO_SENHA} caracteres`
    );
  }
  return SENHA;
}

function assinar(corpo: string) {
  return createHmac("sha256", segredo()).update(corpo).digest("base64url");
}

/** Token de sessão: payload em base64url + assinatura.
 *
 *  O payload carrega a expiração e um identificador único por login. O `jti`
 *  não é consultado em lugar nenhum hoje — ele existe para dois logins seguidos
 *  não produzirem o mesmo valor, o que antes tornava o cookie um bearer eterno:
 *  quem copiasse o valor uma vez tinha acesso para sempre, e a única revogação
 *  possível era trocar a senha e republicar. */
export function gerarToken() {
  const payload = JSON.stringify({
    v: 1,
    exp: Date.now() + VALIDADE_HORAS * 60 * 60 * 1000,
    jti: randomUUID(),
  });
  const corpo = Buffer.from(payload).toString("base64url");
  return `${corpo}.${assinar(corpo)}`;
}

export const MAX_AGE_COOKIE = VALIDADE_HORAS * 60 * 60;

/** Comparação em tempo constante que não vaza o comprimento.
 *
 *  O `timingSafeEqual` exige buffers do mesmo tamanho, e retornar cedo quando
 *  os tamanhos diferem é ordens de grandeza mais rápido que a comparação —
 *  mensurável, em tese, por quem cronometra as respostas. Comparar o resumo
 *  SHA-256 de cada lado resolve: dois blocos de 32 bytes, sempre. */
function iguais(a: string, b: string) {
  const ha = createHmac("sha256", "comparacao").update(a).digest();
  const hb = createHmac("sha256", "comparacao").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function senhaConfere(tentativa: string) {
  if (!painelConfigurado()) return false;
  return iguais(tentativa, SENHA as string);
}

export async function estaAutenticado() {
  if (!painelConfigurado()) return false;

  const cookie = (await cookies()).get(COOKIE)?.value;
  if (!cookie) return false;

  const separador = cookie.lastIndexOf(".");
  if (separador <= 0) return false;

  const corpo = cookie.slice(0, separador);
  const assinatura = cookie.slice(separador + 1);
  if (!iguais(assinatura, assinar(corpo))) return false;

  try {
    const { exp } = JSON.parse(Buffer.from(corpo, "base64url").toString());
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}
