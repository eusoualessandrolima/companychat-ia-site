import { NextResponse } from "next/server";
import {
  COOKIE,
  MAX_AGE_COOKIE,
  gerarToken,
  painelConfigurado,
  senhaConfere,
} from "@/lib/painel";
import { consumir, ipDaRequisicao } from "@/lib/rate-limit";

/* Dois baldes, não um.
 *
 * O por IP barra o script que martela de um endereço só. O global existe
 * porque aqui a senha é **uma** para todo mundo: sem ele, distribuir as
 * tentativas por uma botnet contornaria o limite por IP sem esforço, e o que
 * está do outro lado é a base inteira de leads.
 *
 * Trinta tentativas globais em quinze minutos é folgado para o uso real (uma
 * pessoa, entrando de vez em quando) e apertado para força bruta. */
const POR_IP = { limite: 5, janelaSegundos: 900 };
const GLOBAL = { limite: 30, janelaSegundos: 900 };

function bloqueado(esperarSegundos: number) {
  return NextResponse.json(
    { ok: false, erro: "muitas tentativas" },
    { status: 429, headers: { "Retry-After": String(esperarSegundos) } }
  );
}

export async function POST(requisicao: Request) {
  if (!painelConfigurado()) {
    return NextResponse.json(
      { ok: false, erro: "painel sem senha configurada" },
      { status: 503 }
    );
  }

  /* Antes de ler o corpo: a contagem não pode depender de o JSON ser válido,
     senão bastaria mandar lixo para gastar tentativas de graça. */
  const ip = ipDaRequisicao(requisicao.headers);
  const doIp = consumir(`painel-entrar:${ip}`, POR_IP);
  const doTotal = consumir("painel-entrar:global", GLOBAL);
  if (!doIp.permitido || !doTotal.permitido) {
    return bloqueado(Math.max(doIp.esperarSegundos, doTotal.esperarSegundos));
  }

  let senha = "";
  try {
    const corpo = await requisicao.json();
    senha = typeof corpo.senha === "string" ? corpo.senha : "";
  } catch {
    return NextResponse.json({ ok: false, erro: "corpo inválido" }, { status: 400 });
  }

  if (!senhaConfere(senha)) {
    return NextResponse.json({ ok: false, erro: "senha incorreta" }, { status: 401 });
  }

  const resposta = NextResponse.json({ ok: true });
  resposta.cookies.set(COOKIE, gerarToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_COOKIE,
  });
  return resposta;
}

export async function DELETE() {
  const resposta = NextResponse.json({ ok: true });
  /* Os mesmos atributos do cookie original. A remoção casa por nome, domínio e
     path, então funcionaria sem eles — mas divergir aqui é o tipo de detalhe
     que vira bug no dia em que o `path` mudar. */
  resposta.cookies.set(COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return resposta;
}
