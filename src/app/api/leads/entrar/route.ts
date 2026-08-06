import { NextResponse } from "next/server";
import { COOKIE, gerarToken, painelConfigurado, senhaConfere } from "@/lib/painel";

const TRINTA_DIAS = 60 * 60 * 24 * 30;

export async function POST(requisicao: Request) {
  if (!painelConfigurado()) {
    return NextResponse.json(
      { ok: false, erro: "painel sem senha configurada" },
      { status: 503 }
    );
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
    maxAge: TRINTA_DIAS,
  });
  return resposta;
}

export async function DELETE() {
  const resposta = NextResponse.json({ ok: true });
  resposta.cookies.set(COOKIE, "", { path: "/", maxAge: 0 });
  return resposta;
}
