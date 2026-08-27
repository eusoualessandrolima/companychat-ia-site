import { after } from "next/server";
import { NextResponse } from "next/server";
import { avaliarAceite } from "@/lib/aceite";
import { salvarLead } from "@/lib/leads";
import { sanitizarOrigem } from "@/lib/origem";
import { consumir, ipDaRequisicao } from "@/lib/rate-limit";
import { corpoGrandeDemais, respostaCorpoGrande } from "@/lib/corpo";

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

/* Limite folgado de propósito: o quiz de `/comecar` grava a cada etapa e um
   preenchimento legítimo faz seis chamadas, mais o clique no WhatsApp. Trinta
   em dez minutos cobre isso com margem — e continua barrando o script que
   enche a tabela e transforma o site em amplificador de POSTs para o CRM. */
const LIMITE_POR_IP = { limite: 30, janelaSegundos: 600 };

export async function POST(requisicao: Request) {
  if (corpoGrandeDemais(requisicao)) return respostaCorpoGrande();

  /* Antes de ler o corpo: a contagem não pode depender de o JSON ser válido. */
  const ip = ipDaRequisicao(requisicao.headers);
  const veredito = consumir(`lead:${ip}`, LIMITE_POR_IP);
  if (!veredito.permitido) {
    return NextResponse.json(
      { ok: false, erro: "muitas tentativas" },
      { status: 429, headers: { "Retry-After": String(veredito.esperarSegundos) } }
    );
  }

  let corpo: Corpo;
  try {
    corpo = await requisicao.json();
  } catch {
    return NextResponse.json({ ok: false, erro: "corpo inválido" }, { status: 400 });
  }

  /* Isca: campo que nenhuma pessoa vê e nenhum formulário do site preenche.
     Robô que preenche tudo o que encontra cai aqui. A resposta é `ok: true`
     para o robô não descobrir que foi barrado e voltar variando o corpo — o
     mesmo desenho que `/api/teste-gratis` já usa. */
  if (typeof corpo.empresaWebsite === "string" && corpo.empresaWebsite.trim()) {
    return NextResponse.json({ ok: true, gravado: false, entregue: false });
  }

  const id = typeof corpo.id === "string" && UUID.test(corpo.id) ? corpo.id : null;
  if (!id) {
    return NextResponse.json({ ok: false, erro: "id inválido" }, { status: 422 });
  }

  const telefone = texto(corpo.telefone, 20);
  const digitos = telefone?.replace(/\D/g, "") ?? "";

  const origem = sanitizarOrigem(corpo.origem);

  /* Prova do consentimento (LGPD). A regra e o histórico moram em
   * `src/lib/aceite.ts`, onde os testes de unidade alcançam.
   *
   * O aceite vai dentro de `origem` (que é `jsonb`) e não em colunas novas: não
   * exige migração no banco de produção, aparece no painel e no CSV, e é
   * reversível. Quando houver janela para migrar, o par certo são colunas
   * próprias, como em `teste_gratis` (`consentimento_em`, `_versao`). */
  const aceite = avaliarAceite(
    origem.tipo,
    corpo,
    corpo.clicouWhatsapp === true
  );

  if (aceite.situacao === "ausente") {
    return NextResponse.json(
      { ok: false, erro: "consentimento obrigatório" },
      { status: 422 }
    );
  }

  if (aceite.situacao === "registrado") Object.assign(origem, aceite.campos);

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
    origem,
  };

  const { gravado, inserido } = await salvarLead(lead);

  /* O webhook do CRM é um fetch de até 8s, e a conexão do banco fica presa
     enquanto ele acontece — com uma pool de 5, é assim que uma lentidão no
     n8n vira lentidão no site inteiro.
   *
   * Mas ele não pode sair do caminho da resposta sempre: quando o banco falha,
   * o webhook é o único lugar de onde o lead pode ser recuperado, e é isso que
   * o campo `entregue` informa ao formulário. Daí a divisão:
   *
   * - banco gravou  → `entregue` já é verdade, o webhook vai para o `after()`
   *                   e a pessoa não espera por ele;
   * - banco falhou  → esperamos a resposta do webhook, porque é ela que decide
   *                   entre "recebemos" e "tente de novo". */
  let noWebhook = false;
  const vaiParaOCrm = contatavel(lead) && marcoDoLead(lead, inserido);

  if (vaiParaOCrm) {
    if (gravado) after(() => entregarNoWebhook(lead));
    else noWebhook = await entregarNoWebhook(lead);
  }

  /* `entregue`: o lead chegou a algum lugar de onde dá para recuperá-lo — o
     banco ou o webhook. Sem isto, banco fora do ar significava um "Candidatura
     recebida!" na tela e o lead no vazio: `salvarLead` engole o erro e devolve
     `ok`, que é o certo para o quiz (grava a cada etapa e não pode travar a
     navegação), mas péssimo para quem acabou de escrever dez campos.

     Campo novo e aditivo: o quiz e as LPs só olham `ok`, e para eles nada muda. */
  return NextResponse.json({ ok: true, gravado, entregue: gravado || noWebhook });
}
