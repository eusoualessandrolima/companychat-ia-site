import { NextResponse } from "next/server";
import { salvarLead } from "@/lib/leads";
import { sanitizarOrigem } from "@/lib/origem";

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

/** Devolve se o lead realmente chegou do outro lado — é metade da resposta
 *  `entregue`, que a candidatura de `/10-empresas` usa para não anunciar
 *  sucesso quando nada foi guardado. */
async function entregarNoWebhook(lead: Record<string, unknown>) {
  if (!WEBHOOK) return false;

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
      return false;
    }

    return true;
  } catch (erro) {
    console.error("Falha ao entregar lead no webhook:", erro);
    return false;
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
    /* 400 e não os 80 de antes: no quiz a dor é escolha de lista, mas na
       candidatura de `/10-empresas` a pessoa descreve o problema do
       atendimento com as próprias palavras, e cortar em 80 caracteres
       decapitava justamente a informação que decide a seleção. */
    dor: texto(corpo.dor, 400),
    etapa: typeof corpo.etapa === "number" ? Math.min(Math.max(corpo.etapa, 0), 99) : 0,
    concluido: corpo.concluido === true,
    clicou_whatsapp: corpo.clicouWhatsapp === true,
    origem: sanitizarOrigem(corpo.origem),
  };

  const { gravado, inserido } = await salvarLead(lead);

  let noWebhook = false;
  if (contatavel(lead) && marcoDoLead(lead, inserido)) {
    noWebhook = await entregarNoWebhook(lead);
  }

  /* `entregue`: o lead chegou a algum lugar de onde dá para recuperá-lo — o
     banco ou o webhook. Sem isto, banco fora do ar significava um "Candidatura
     recebida!" na tela e o lead no vazio: `salvarLead` engole o erro e devolve
     `ok`, que é o certo para o quiz (grava a cada etapa e não pode travar a
     navegação), mas péssimo para quem acabou de escrever dez campos.

     Campo novo e aditivo: o quiz e as LPs só olham `ok`, e para eles nada muda. */
  return NextResponse.json({ ok: true, gravado, entregue: gravado || noWebhook });
}
