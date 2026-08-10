import { NextResponse } from "next/server";
import { salvarLead } from "@/lib/leads";

/** Destino opcional além do banco (CRM, n8n). O quiz grava a cada etapa, mas o
 *  webhook só sai nos marcos que mudam alguma coisa lá fora — ver `marcoDoLead`. */
const WEBHOOK = process.env.LEAD_WEBHOOK_URL;
const TOKEN = process.env.LEAD_WEBHOOK_TOKEN;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Corpo = Record<string, unknown>;

function texto(valor: unknown, limite = 120) {
  const limpo = typeof valor === "string" ? valor.trim().slice(0, limite) : "";
  return limpo || null;
}

/** Um lead vira card no CRM quando dá para ligar para ele: nome e um WhatsApp
 *  com DDD. Sem isso é rascunho de digitação, não lead. */
function contatavel(lead: { nome: string | null; telefone_e164: string | null }) {
  return Boolean(lead.telefone_e164) && (lead.nome?.length ?? 0) >= 2;
}

/** Os momentos em que vale avisar o CRM. O quiz manda uma gravação por etapa;
 *  destas, só três mudam o card: ele nascer, o lead terminar o quiz (traz
 *  equipe/volume/dor) e ele abrir a conversa no WhatsApp. A etapa 1 entra
 *  porque é quando o contato fica completo — a linha pode ter nascido antes,
 *  como rascunho, sem telefone. */
function marcoDoLead(
  lead: { etapa: number; concluido: boolean; clicou_whatsapp: boolean },
  inserido: boolean
) {
  return inserido || lead.etapa === 1 || lead.concluido || lead.clicou_whatsapp;
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

  const { gravado, inserido } = await salvarLead(lead);

  if (contatavel(lead) && marcoDoLead(lead, inserido)) {
    await entregarNoWebhook(lead);
  }

  return NextResponse.json({ ok: true, gravado });
}
