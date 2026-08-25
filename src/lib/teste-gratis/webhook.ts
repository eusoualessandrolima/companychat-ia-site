import { lerIntencao, type Intencao } from "./intencao";
import { entregarParaIa } from "./ia";
import {
  buscarLeadPorMensagem,
  buscarLeadPorTelefone,
  encerrarAutomacao,
  marcarEntregue,
  marcarFalhaEnvio,
  marcarLido,
  marcarResposta,
  registrarEvento,
  type LeadTesteGratis,
} from "./repositorio";

/* Tradução do webhook do provedor para o que o funil entende.
 *
 * O formato de entrada é o da WhatsApp Cloud API (`entry[].changes[].value`),
 * que é o mesmo que a plataforma da CompanyChat repassa. Duas coisas chegam
 * por aqui: `statuses` (enviada, entregue, lida, falhou) e `messages` (o que a
 * pessoa respondeu).
 *
 * As dependências entram por parâmetro para o processamento ser testável sem
 * banco e sem rede. */

export type Dependencias = {
  buscarLeadPorMensagem: typeof buscarLeadPorMensagem;
  buscarLeadPorTelefone: typeof buscarLeadPorTelefone;
  registrarEvento: typeof registrarEvento;
  marcarEntregue: typeof marcarEntregue;
  marcarLido: typeof marcarLido;
  marcarFalhaEnvio: typeof marcarFalhaEnvio;
  marcarResposta: typeof marcarResposta;
  encerrarAutomacao: typeof encerrarAutomacao;
  entregarParaIa: typeof entregarParaIa;
};

export const dependenciasPadrao: Dependencias = {
  buscarLeadPorMensagem,
  buscarLeadPorTelefone,
  registrarEvento,
  marcarEntregue,
  marcarLido,
  marcarFalhaEnvio,
  marcarResposta,
  encerrarAutomacao,
  entregarParaIa,
};

type Status = {
  id?: string;
  status?: string;
  recipient_id?: string;
  errors?: { code?: number; title?: string; message?: string }[];
};

type Mensagem = {
  id?: string;
  from?: string;
  type?: string;
  text?: { body?: string };
  button?: { payload?: string; text?: string };
  interactive?: {
    type?: string;
    button_reply?: { id?: string; title?: string };
    list_reply?: { id?: string; title?: string };
  };
};

type Valor = {
  metadata?: { display_phone_number?: string; phone_number_id?: string };
  statuses?: Status[];
  messages?: Mensagem[];
};

export type ResumoWebhook = {
  statusProcessados: number;
  mensagensProcessadas: number;
  duplicados: number;
  semLead: number;
};

export function extrairValores(corpo: unknown): Valor[] {
  const raiz = corpo as { entry?: { changes?: { value?: Valor }[] }[] } | undefined;
  if (!raiz?.entry) return [];

  return raiz.entry
    .flatMap((entrada) => entrada.changes ?? [])
    .map((mudanca) => mudanca.value)
    .filter((valor): valor is Valor => Boolean(valor));
}

export async function processarWebhook(
  corpo: unknown,
  deps: Dependencias = dependenciasPadrao
): Promise<ResumoWebhook> {
  const resumo: ResumoWebhook = {
    statusProcessados: 0,
    mensagensProcessadas: 0,
    duplicados: 0,
    semLead: 0,
  };

  for (const valor of extrairValores(corpo)) {
    for (const status of valor.statuses ?? []) {
      await processarStatus(status, resumo, deps);
    }
    for (const mensagem of valor.messages ?? []) {
      await processarMensagem(mensagem, valor, resumo, deps);
    }
  }

  return resumo;
}

/* Os eventos de status usam o mesmo nome combinado com o analytics do site,
   para o funil ser lido de ponta a ponta com um vocabulário só. */
const EVENTO_POR_STATUS: Record<string, string> = {
  sent: "whatsapp_message_sent",
  delivered: "whatsapp_message_delivered",
  read: "whatsapp_message_read",
  failed: "whatsapp_message_failed",
};

async function processarStatus(
  status: Status,
  resumo: ResumoWebhook,
  deps: Dependencias
) {
  if (!status.id || !status.status) return;

  const lead =
    (await deps.buscarLeadPorMensagem(status.id)) ??
    (status.recipient_id ? await deps.buscarLeadPorTelefone(status.recipient_id) : null);

  if (!lead) {
    resumo.semLead += 1;
    return;
  }

  const evento = EVENTO_POR_STATUS[status.status];
  if (!evento) return;

  /* A chave junta id da mensagem e status: a Meta reentrega o mesmo evento
     quando não recebe 200 a tempo, e sem isto o funil contaria duas leituras. */
  const inedito = await deps.registrarEvento(evento, {
    leadId: lead.id,
    chave: `status:${status.id}:${status.status}`,
    dados: { status: status.status, erros: status.errors ?? [] },
  });

  if (!inedito) {
    resumo.duplicados += 1;
    return;
  }

  resumo.statusProcessados += 1;

  if (status.status === "delivered") await deps.marcarEntregue(lead.id);
  else if (status.status === "read") await deps.marcarLido(lead.id);
  else if (status.status === "failed") await deps.marcarFalhaEnvio(lead.id);
}

async function processarMensagem(
  mensagem: Mensagem,
  valor: Valor,
  resumo: ResumoWebhook,
  deps: Dependencias
) {
  if (!mensagem.id || !mensagem.from) return;

  /* Eco: a própria mensagem da empresa volta no webhook em algumas
     configurações. Tratá-la como resposta acordaria a IA sozinha, e a IA
     responderia ao próprio agente num laço. */
  const nossoNumero = valor.metadata?.display_phone_number?.replace(/\D/g, "");
  if (nossoNumero && mensagem.from.replace(/\D/g, "") === nossoNumero) return;

  const lead = await deps.buscarLeadPorTelefone(mensagem.from);
  if (!lead) {
    resumo.semLead += 1;
    return;
  }

  const inedito = await deps.registrarEvento("whatsapp_lead_replied", {
    leadId: lead.id,
    chave: `msg:${mensagem.id}`,
    dados: { tipo: mensagem.type ?? "desconhecido" },
  });

  if (!inedito) {
    resumo.duplicados += 1;
    return;
  }

  resumo.mensagensProcessadas += 1;

  const { texto, payload, rotuloBotao } = lerConteudo(mensagem);
  const intencao = lerIntencao({ payload, texto });

  await deps.marcarResposta(lead.id, { texto, botao: rotuloBotao ?? payload ?? null });

  /* Quem já pediu para parar não volta ao fluxo por ter mandado mensagem.
     Sair do opt-out é decisão de gente, não de webhook. */
  if (lead.status === "opt_out") return;

  await aplicarIntencao(intencao, lead, deps);
}

function lerConteudo(mensagem: Mensagem) {
  const respostaBotao =
    mensagem.interactive?.button_reply ?? mensagem.interactive?.list_reply;

  return {
    texto: mensagem.text?.body ?? mensagem.button?.text ?? respostaBotao?.title ?? null,
    // Template com botão de resposta rápida chega em `button.payload`;
    // botão interativo chega em `interactive.button_reply.id`.
    payload: mensagem.button?.payload ?? respostaBotao?.id ?? null,
    rotuloBotao: mensagem.button?.text ?? respostaBotao?.title ?? null,
  };
}

async function aplicarIntencao(
  intencao: Intencao,
  lead: LeadTesteGratis,
  deps: Dependencias
) {
  if (intencao === "opt_out") {
    await deps.encerrarAutomacao(lead.id, "opt_out");
    await deps.registrarEvento("free_trial_opt_out", { leadId: lead.id });
    return;
  }

  if (intencao === "depois") {
    await deps.encerrarAutomacao(lead.id, "pausado");
    await deps.registrarEvento("free_trial_paused", { leadId: lead.id });
    return;
  }

  /* "Quero continuar" e qualquer resposta livre acordam a IA. A regra do
     produto é só uma: a IA nunca fala antes de a pessoa falar. */
  const entrega = await deps.entregarParaIa(lead, intencao);
  await deps.registrarEvento("free_trial_ia_handoff", {
    leadId: lead.id,
    dados: { intencao, entregue: entrega.entregue, motivo: entrega.motivo ?? null },
  });
}
