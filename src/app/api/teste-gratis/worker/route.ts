import { NextResponse } from "next/server";
import { segredoConfere } from "@/lib/teste-gratis/assinatura";
import { tokenDoWorker } from "@/lib/teste-gratis/config";
import { processarFila } from "@/lib/teste-gratis/fila";

/* Gatilho da fila de follow-up.
 *
 * Chamado por cron (Scheduled Task do Coolify) a cada minuto:
 *   curl -fsS -X POST https://www.companychatia.com.br/api/teste-gratis/worker \
 *        -H "Authorization: Bearer $TESTE_GRATIS_WORKER_TOKEN"
 *
 * Rodar duas vezes ao mesmo tempo é seguro: a reivindicação dos jobs usa
 * `for update skip locked`, então cada job sai para um processo só. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function autorizado(requisicao: Request) {
  const esperado = tokenDoWorker();
  if (!esperado) return false;

  const cabecalho = requisicao.headers.get("authorization");
  const recebido = cabecalho?.startsWith("Bearer ")
    ? cabecalho.slice("Bearer ".length)
    : requisicao.headers.get("x-worker-token");

  return segredoConfere(recebido, esperado);
}

export async function POST(requisicao: Request) {
  if (!tokenDoWorker()) {
    return NextResponse.json(
      { ok: false, erro: "worker não configurado" },
      { status: 503 }
    );
  }

  if (!autorizado(requisicao)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const resumo = await processarFila();
    return NextResponse.json({ ok: true, ...resumo });
  } catch (erro) {
    console.error("Falha ao processar a fila de teste grátis:", erro);
    return NextResponse.json({ ok: false, erro: "falha ao processar" }, { status: 500 });
  }
}
