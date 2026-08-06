import { NextResponse } from "next/server";
import { salvarLead } from "@/lib/leads";

/** Destino opcional além do banco (n8n, CRM). Só dispara quando o lead
 *  termina o quiz — não faz sentido notificar a cada pergunta. */
const WEBHOOK = process.env.LEAD_WEBHOOK_URL;
const TOKEN = process.env.LEAD_WEBHOOK_TOKEN;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Corpo = Record<string, unknown>;

function texto(valor: unknown, limite = 120) {
  const limpo = typeof valor === "string" ? valor.trim().slice(0, limite) : "";
  return limpo || null;
}

async function entregarNoWebhook(lead: Record<string, unknown>) {
  if (!WEBHOOK) return;

  try {
    const resposta = await fetch(WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(8000),
    });

    if (!resposta.ok) {
      console.error(`Webhook de lead respondeu ${resposta.status}`);
    }
  } catch (erro) {
    console.error("Falha ao entregar lead no webhook:", erro);
  }
}

export async function POST(requisicao: Request) {
  let corpo: Corpo;
  try {
    corpo = await requisicao.json();
  } catch {
    return NextResponse.json({ ok: false, erro: "corpo inválido" }, { status: 400 });
  }

  const id = typeof corpo.id === "string" && UUID.test(corpo.id) ? corpo.id : null;
  if (!id) {
    return NextResponse.json({ ok: false, erro: "id inválido" }, { status: 422 });
  }

  const telefone = texto(corpo.telefone, 20);
  const digitos = telefone?.replace(/\D/g, "") ?? "";

  const lead = {
    id,
    nome: texto(corpo.nome),
    empresa: texto(corpo.empresa),
    telefone,
    telefone_e164: digitos.length >= 10 ? `55${digitos}` : null,
    equipe: texto(corpo.equipe, 40),
    volume: texto(corpo.volume, 40),
    dor: texto(corpo.dor, 80),
    etapa: typeof corpo.etapa === "number" ? Math.min(Math.max(corpo.etapa, 0), 99) : 0,
    concluido: corpo.concluido === true,
    clicou_whatsapp: corpo.clicouWhatsapp === true,
    origem:
      corpo.origem && typeof corpo.origem === "object"
        ? (corpo.origem as Record<string, unknown>)
        : {},
  };

  const { gravado } = await salvarLead(lead);

  // O webhook recebe o lead completo uma vez só, quando o quiz termina.
  if (lead.concluido && corpo.clicouWhatsapp !== true) {
    await entregarNoWebhook(lead);
  }

  return NextResponse.json({ ok: true, gravado });
}
