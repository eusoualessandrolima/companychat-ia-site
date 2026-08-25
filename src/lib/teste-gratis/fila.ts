import { backoffSegundos, configWhatsApp, envioWhatsappLigado } from "./config";
import { mascarar } from "./telefone";
import {
  adiarOuFalharJob,
  bancoDisponivel,
  buscarLead,
  concluirJob,
  marcarEnviado,
  marcarFalhaEnvio,
  registrarEvento,
  reivindicarJobs,
  type Job,
  type LeadTesteGratis,
} from "./repositorio";
import { escolherProvedor, type Provedor } from "./whatsapp-provedor";

/* Processamento da fila de follow-up.
 *
 * O job é agendado na captação e vive no banco. Ninguém segura a requisição
 * HTTP esperando três minutos: `setTimeout` dentro de rota morre no primeiro
 * redeploy, e o site roda em container que reinicia a cada publicação.
 *
 * Quem chama este processamento é a rota `/api/teste-gratis/worker`, disparada
 * por cron, e opcionalmente o tique interno de `instrumentation.ts`. Os dois
 * podem rodar ao mesmo tempo sem duplicar envio: a reivindicação usa
 * `for update skip locked`.
 *
 * O acesso ao banco entra por parâmetro para as regras de envio serem
 * testáveis sem Postgres e sem rede. */

export type Dependencias = {
  bancoDisponivel: typeof bancoDisponivel;
  reivindicarJobs: typeof reivindicarJobs;
  buscarLead: typeof buscarLead;
  concluirJob: typeof concluirJob;
  adiarOuFalharJob: typeof adiarOuFalharJob;
  marcarEnviado: typeof marcarEnviado;
  marcarFalhaEnvio: typeof marcarFalhaEnvio;
  registrarEvento: typeof registrarEvento;
};

export const dependenciasPadrao: Dependencias = {
  bancoDisponivel,
  reivindicarJobs,
  buscarLead,
  concluirJob,
  adiarOuFalharJob,
  marcarEnviado,
  marcarFalhaEnvio,
  registrarEvento,
};

export type ResumoDaRodada = {
  reivindicados: number;
  enviados: number;
  adiados: number;
  falhas: number;
  ignorados: number;
  /** `true` quando a rodada nem chegou a olhar a fila por causa da chave
   *  geral. O worker responde isso para o cron não parecer saudável quando na
   *  verdade o envio está desligado. */
  envioDesligado?: boolean;
};

const LIMITE_POR_RODADA = 20;

export async function processarFila(
  limite = LIMITE_POR_RODADA,
  provedor: Provedor = escolherProvedor(),
  deps: Dependencias = dependenciasPadrao
): Promise<ResumoDaRodada> {
  const resumo: ResumoDaRodada = {
    reivindicados: 0,
    enviados: 0,
    adiados: 0,
    falhas: 0,
    ignorados: 0,
  };

  if (!deps.bancoDisponivel()) return resumo;

  /* Segunda trava, de propósito redundante com a da captação: se um job entrou
     na fila antes de a chave ser desligada, ou se alguém a desligou no meio de
     um incidente, nada sai. Não reivindica nem mexe em tentativa, então religar
     retoma exatamente de onde parou. */
  if (!envioWhatsappLigado()) return { ...resumo, envioDesligado: true };

  const jobs = await deps.reivindicarJobs(limite);
  resumo.reivindicados = jobs.length;

  for (const job of jobs) {
    const resultado = await processarJob(job, provedor, deps);
    resumo[resultado] += 1;
  }

  return resumo;
}

type Desfecho = "enviados" | "adiados" | "falhas" | "ignorados";

async function processarJob(
  job: Job,
  provedor: Provedor,
  deps: Dependencias
): Promise<Desfecho> {
  const lead = await deps.buscarLead(job.lead_id);

  if (!lead) {
    await deps.concluirJob(job.id);
    return "ignorados";
  }

  const bloqueio = motivoParaNaoEnviar(lead);
  if (bloqueio) {
    await deps.concluirJob(job.id);
    await deps.registrarEvento("whatsapp_followup_ignorado", {
      leadId: lead.id,
      dados: { motivo: bloqueio },
    });
    return "ignorados";
  }

  /* Já existe mensagem enviada para este lead: o job foi reivindicado duas
     vezes (trava morta, retentativa depois de timeout). Encerra sem reenviar. */
  if (lead.whatsapp_message_id) {
    await deps.concluirJob(job.id);
    return "ignorados";
  }

  const config = configWhatsApp();
  const envio = await provedor.enviarTemplate({
    paraE164: lead.whatsapp_e164,
    template: config.template,
    idioma: config.idioma,
    parametros: [lead.nome.trim().split(/\s+/)[0]],
  });

  if (envio.ok) {
    await deps.marcarEnviado(lead.id, envio.messageId);
    await deps.concluirJob(job.id);
    await deps.registrarEvento("whatsapp_message_sent", {
      leadId: lead.id,
      chave: envio.messageId ? `enviada:${envio.messageId}` : null,
      dados: {
        provedor: envio.provedor,
        template: config.template,
        messageId: envio.messageId,
        tentativa: job.tentativas,
      },
    });
    return "enviados";
  }

  const { desistiu: encerrado } = await deps.adiarOuFalharJob(
    job,
    envio.erro,
    backoffSegundos(job.tentativas),
    { definitivo: envio.permanente }
  );

  if (encerrado) await deps.marcarFalhaEnvio(lead.id);

  await deps.registrarEvento("free_trial_whatsapp_send_error", {
    leadId: lead.id,
    dados: {
      provedor: envio.provedor,
      erro: envio.erro,
      permanente: envio.permanente,
      tentativa: job.tentativas,
      // Nunca o número inteiro em log técnico.
      destino: mascarar(lead.whatsapp_e164),
      definitivo: encerrado,
    },
  });

  return encerrado ? "falhas" : "adiados";
}

/** Motivos para o disparo não sair. O consentimento é conferido de novo aqui,
 *  e não só na captação: entre agendar e enviar a pessoa pode ter pedido para
 *  parar. */
export function motivoParaNaoEnviar(lead: LeadTesteGratis): string | null {
  if (!lead.consentimento_whatsapp) return "sem consentimento";
  if (lead.status === "opt_out") return "opt-out";
  if (lead.status === "pausado") return "pausado";
  return null;
}
