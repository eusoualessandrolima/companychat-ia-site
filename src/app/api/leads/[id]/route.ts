import { NextResponse } from "next/server";
import { excluirLead } from "@/lib/leads";
import { estaAutenticado } from "@/lib/painel";

/* Segmentos fixos (`csv`, `entrar`) têm precedência sobre este, então a rota
   dinâmica só recebe ids de lead. */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function DELETE(
  _requisicao: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await estaAutenticado())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { id } = await params;

  // O id da coluna é `uuid`: sem esta checagem, um valor qualquer na URL
  // vira erro de cast no Postgres em vez de um 400 honesto.
  if (!UUID.test(id)) {
    return NextResponse.json({ ok: false, erro: "id inválido" }, { status: 400 });
  }

  const excluido = await excluirLead(id);
  if (!excluido) {
    return NextResponse.json(
      { ok: false, erro: "lead não encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true });
}
