import { NextResponse } from "next/server";
import { listarLeads } from "@/lib/leads";
import { estaAutenticado } from "@/lib/painel";

import type { Lead } from "@/lib/leads";

const COLUNAS: { titulo: string; valor: (lead: Lead) => unknown }[] = [
  { titulo: "Data", valor: (l) => l.criado_em },
  { titulo: "Nome", valor: (l) => l.nome },
  { titulo: "Empresa", valor: (l) => l.empresa },
  { titulo: "WhatsApp", valor: (l) => l.telefone },
  { titulo: "Quem atende", valor: (l) => l.equipe },
  { titulo: "Mensagens por dia", valor: (l) => l.volume },
  { titulo: "Maior problema", valor: (l) => l.dor },
  { titulo: "Etapa", valor: (l) => l.etapa },
  { titulo: "Concluiu", valor: (l) => l.concluido },
  { titulo: "Clicou no WhatsApp", valor: (l) => l.clicou_whatsapp },
  /* Campos que não têm coluna na tabela e viajam em `origem` (jsonb): o
     segmento, que já vinha das LPs, e o restante da candidatura de
     `/10-empresas`. Lead que não tem a chave sai com a célula vazia. */
  { titulo: "E-mail", valor: (l) => l.origem?.email },
  { titulo: "Segmento", valor: (l) => l.origem?.segmento },
  { titulo: "Cidade e estado", valor: (l) => l.origem?.cidade },
  { titulo: "Objetivo com a IA", valor: (l) => l.origem?.objetivo },
  { titulo: "Por que ser selecionada", valor: (l) => l.origem?.motivo },
  { titulo: "Campanha", valor: (l) => l.origem?.campanha ?? l.origem?.utm_campaign },
  { titulo: "Página", valor: (l) => l.origem?.pagina },
];

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
    COLUNAS.map((coluna) => celula(coluna.titulo)).join(","),
    ...leads.map((lead) =>
      COLUNAS.map((coluna) => celula(coluna.valor(lead))).join(",")
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
