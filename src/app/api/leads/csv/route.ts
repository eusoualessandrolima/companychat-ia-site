import { NextResponse } from "next/server";
import { listarLeads } from "@/lib/leads";
import { estaAutenticado } from "@/lib/painel";

const COLUNAS = [
  ["criado_em", "Data"],
  ["nome", "Nome"],
  ["empresa", "Empresa"],
  ["telefone", "WhatsApp"],
  ["equipe", "Quem atende"],
  ["volume", "Mensagens por dia"],
  ["dor", "Maior problema"],
  ["etapa", "Etapa"],
  ["concluido", "Concluiu"],
  ["clicou_whatsapp", "Clicou no WhatsApp"],
] as const;

/** Escapa para CSV e neutraliza fórmulas: um lead com nome `=CMD()` não
 *  pode virar execução quando o arquivo abrir no Excel. */
function celula(valor: unknown) {
  let texto: string;
  if (valor === null || valor === undefined) texto = "";
  // O driver do Postgres devolve `timestamptz` como Date: sem isto a
  // planilha receberia "Thu Aug 06 2026 08:57:03 GMT-0300".
  else if (valor instanceof Date) {
    texto = valor.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } else texto = String(valor);

  if (/^[=+\-@\t\r]/.test(texto)) texto = `'${texto}`;
  return `"${texto.replace(/"/g, '""')}"`;
}

export async function GET() {
  if (!(await estaAutenticado())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const leads = await listarLeads(5000);
  const linhas = [
    COLUNAS.map(([, titulo]) => celula(titulo)).join(","),
    ...leads.map((lead) =>
      COLUNAS.map(([chave]) => celula(lead[chave as keyof typeof lead])).join(",")
    ),
  ];

  const hoje = new Date().toISOString().slice(0, 10);
  // BOM na frente para o Excel abrir os acentos corretamente.
  return new NextResponse(`﻿${linhas.join("\n")}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${hoje}.csv"`,
    },
  });
}
