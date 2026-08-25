import { randomUUID } from "node:crypto";
import { pool } from "../postgres";
import { variantesE164 } from "./telefone";
import type { LeadValidado } from "./validacao";

/* Toda a conversa com o Postgres do funil mora aqui. As camadas de cima
   (rotas, fila, webhook) não montam SQL.

   Sem `DATABASE_URL` nada disso roda; quem chama trata o `null`. */

export type StatusLead =
  | "recebido"
  | "agendado"
  | "contatado"
  | "entregue"
  | "respondeu"
  | "qualificado"
  | "convertido"
  | "pausado"
  | "opt_out"
  | "falha_envio";

export type LeadTesteGratis = {
  id: string;
  nome: string;
  email: string;
  whatsapp: string;
  whatsapp_e164: string;
  site: string | null;
  sem_site: boolean;
  segmento: string;
  consentimento_whatsapp: boolean;
  consentimento_em: string | null;
  consentimento_versao: string | null;
  origem: Record<string, string>;
  status: StatusLead;
  follow_up_em: string | null;
  whatsapp_message_id: string | null;
  entregue_em: string | null;
  lido_em: string | null;
  respondeu_em: string | null;
  ultima_resposta: string | null;
  botao_escolhido: string | null;
  criado_em: string;
  atualizado_em: string;
};

export type Job = {
  id: string;
  lead_id: string;
  tipo: string;
  executar_em: string;
  status: "pendente" | "processando" | "concluido" | "falhou";
  tentativas: number;
  max_tentativas: number;
};

const COLUNAS = `id, nome, email, whatsapp, whatsapp_e164, site, sem_site, segmento,
  consentimento_whatsapp, consentimento_em, consentimento_versao, origem, status,
  follow_up_em, whatsapp_message_id, entregue_em, lido_em, respondeu_em,
  ultima_resposta, botao_escolhido, criado_em, atualizado_em`;

export function bancoDisponivel() {
  return pool() !== null;
}

/* ─── Leads ───────────────────────────────────────────── */

/** Solicitação recente do mesmo telefone ou e-mail. É o que impede que dois
 *  envios do formulário virem dois disparos de WhatsApp. */
export async function solicitacaoRecente(
  whatsappE164: string,
  email: string,
  janelaHoras: number
): Promise<LeadTesteGratis | null> {
  const conexao = pool();
  if (!conexao) return null;

  const { rows } = await conexao.query<LeadTesteGratis>(
    `select ${COLUNAS}
       from teste_gratis_leads
      where (whatsapp_e164 = any($1) or lower(email) = $2)
        and criado_em > now() - ($3 || ' hours')::interval
      order by criado_em desc
      limit 1`,
    [variantesE164(whatsappE164), email.toLowerCase(), String(janelaHoras)]
  );

  return rows[0] ?? null;
}

/** Existe pedido de opt-out para este número, de qualquer época. Consentimento
 *  novo no formulário não apaga um "não me chame mais" anterior. */
export async function temOptOut(whatsappE164: string) {
  const conexao = pool();
  if (!conexao) return false;

  const { rows } = await conexao.query<{ total: number }>(
    `select count(*)::int as total
       from teste_gratis_leads
      where whatsapp_e164 = any($1) and status = 'opt_out'`,
    [variantesE164(whatsappE164)]
  );

  return (rows[0]?.total ?? 0) > 0;
}

export async function criarLead(
  lead: LeadValidado,
  status: StatusLead
): Promise<LeadTesteGratis | null> {
  const conexao = pool();
  if (!conexao) return null;

  const { rows } = await conexao.query<LeadTesteGratis>(
    `insert into teste_gratis_leads (
       id, nome, email, whatsapp, whatsapp_e164, site, sem_site, segmento,
       consentimento_whatsapp, consentimento_em, consentimento_versao, origem, status
     )
     values ($1, $2, $3, $4, $5, $6, $7, $8, true, now(), $9, $10, $11)
     returning ${COLUNAS}`,
    [
      randomUUID(),
      lead.nome,
      lead.email,
      lead.whatsapp,
      lead.whatsappE164,
      lead.site,
      lead.semSite,
      lead.segmento,
      lead.consentimentoVersao,
      JSON.stringify(lead.origem),
      status,
    ]
  );

  return rows[0] ?? null;
}

export async function buscarLead(id: string): Promise<LeadTesteGratis | null> {
  const conexao = pool();
  if (!conexao) return null;

  const { rows } = await conexao.query<LeadTesteGratis>(
    `select ${COLUNAS} from teste_gratis_leads where id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

export async function buscarLeadPorMensagem(
  messageId: string
): Promise<LeadTesteGratis | null> {
  const conexao = pool();
  if (!conexao) return null;

  const { rows } = await conexao.query<LeadTesteGratis>(
    `select ${COLUNAS} from teste_gratis_leads where whatsapp_message_id = $1`,
    [messageId]
  );
  return rows[0] ?? null;
}

/** Lead mais recente com este número, em qualquer grafia E.164. */
export async function buscarLeadPorTelefone(
  bruto: string
): Promise<LeadTesteGratis | null> {
  const conexao = pool();
  if (!conexao) return null;

  const variantes = variantesE164(bruto);
  if (variantes.length === 0) return null;

  const { rows } = await conexao.query<LeadTesteGratis>(
    `select ${COLUNAS}
       from teste_gratis_leads
      where whatsapp_e164 = any($1)
      order by criado_em desc
      limit 1`,
    [variantes]
  );
  return rows[0] ?? null;
}

/* A ordem importa: o webhook chega fora de ordem com frequência (o `read`
   pode bater antes do `delivered`), e um status atrasado não pode empurrar o
   lead para trás. */
const PESO: Record<StatusLead, number> = {
  recebido: 0,
  agendado: 1,
  falha_envio: 2,
  contatado: 3,
  entregue: 4,
  respondeu: 5,
  qualificado: 6,
  convertido: 7,
  pausado: 8,
  opt_out: 9,
};

/** Avança o status só quando o novo pesa mais. `pausado` e `opt_out` são
 *  terminais para a automação e nunca são desfeitos por evento de entrega.
 *
 *  A lista de status que não podem ser sobrescritos vai na própria consulta
 *  para a decisão acontecer sob o mesmo lock da linha: dois eventos do webhook
 *  chegando juntos não se atropelam. */
export async function avancarStatus(leadId: string, novo: StatusLead) {
  const conexao = pool();
  if (!conexao) return;

  const inferiores = (Object.keys(PESO) as StatusLead[]).filter(
    (status) => PESO[status] < PESO[novo]
  );
  if (inferiores.length === 0) return;

  await conexao.query(
    `update teste_gratis_leads
        set status = $2, atualizado_em = now()
      where id = $1 and status = any($3)`,
    [leadId, novo, inferiores]
  );
}

export async function marcarAgendado(leadId: string, followUpEm: Date) {
  const conexao = pool();
  if (!conexao) return;
  await conexao.query(
    `update teste_gratis_leads
        set status = case when status = 'recebido' then 'agendado' else status end,
            follow_up_em = $2,
            atualizado_em = now()
      where id = $1`,
    [leadId, followUpEm.toISOString()]
  );
}

export async function marcarEnviado(leadId: string, messageId: string | null) {
  const conexao = pool();
  if (!conexao) return;
  await conexao.query(
    `update teste_gratis_leads
        set whatsapp_message_id = coalesce($2, whatsapp_message_id),
            status = case
                       when status in ('recebido', 'agendado', 'falha_envio')
                         then 'contatado'
                       else status
                     end,
            atualizado_em = now()
      where id = $1`,
    [leadId, messageId]
  );
}

export async function marcarFalhaEnvio(leadId: string) {
  await avancarStatus(leadId, "falha_envio");
}

export async function marcarEntregue(leadId: string) {
  const conexao = pool();
  if (!conexao) return;
  await conexao.query(
    `update teste_gratis_leads
        set entregue_em = coalesce(entregue_em, now()), atualizado_em = now()
      where id = $1`,
    [leadId]
  );
  await avancarStatus(leadId, "entregue");
}

export async function marcarLido(leadId: string) {
  const conexao = pool();
  if (!conexao) return;
  await conexao.query(
    `update teste_gratis_leads
        set lido_em = coalesce(lido_em, now()), atualizado_em = now()
      where id = $1`,
    [leadId]
  );
}

export async function marcarResposta(
  leadId: string,
  { texto, botao }: { texto?: string | null; botao?: string | null }
) {
  const conexao = pool();
  if (!conexao) return;
  await conexao.query(
    `update teste_gratis_leads
        set respondeu_em = coalesce(respondeu_em, now()),
            ultima_resposta = coalesce($2, ultima_resposta),
            botao_escolhido = coalesce($3, botao_escolhido),
            atualizado_em = now()
      where id = $1`,
    [leadId, texto ?? null, botao ?? null]
  );
  await avancarStatus(leadId, "respondeu");
}

/** Encerra a automação: cancela o job pendente e trava o status. */
export async function encerrarAutomacao(leadId: string, status: "pausado" | "opt_out") {
  const conexao = pool();
  if (!conexao) return;

  await conexao.query(
    `update teste_gratis_leads set status = $2, atualizado_em = now() where id = $1`,
    [leadId, status]
  );
  await conexao.query(
    `update teste_gratis_jobs
        set status = 'concluido',
            ultimo_erro = $2,
            atualizado_em = now()
      where lead_id = $1 and status in ('pendente', 'processando')`,
    [leadId, `automação encerrada: ${status}`]
  );
}

/* ─── Fila ────────────────────────────────────────────── */

/** Cria o job de follow-up. O índice único `(lead_id, tipo)` faz o segundo
 *  agendamento do mesmo lead não existir: idempotência no banco, não no if. */
export async function agendarFollowUp(leadId: string, executarEm: Date) {
  const conexao = pool();
  if (!conexao) return false;

  const { rowCount } = await conexao.query(
    `insert into teste_gratis_jobs (lead_id, tipo, executar_em)
     values ($1, 'followup_whatsapp', $2)
     on conflict (lead_id, tipo) do nothing`,
    [leadId, executarEm.toISOString()]
  );

  return (rowCount ?? 0) > 0;
}

/** Reivindica jobs vencidos. `for update skip locked` é o que permite dois
 *  processos (cron e tique interno, ou dois containers) varrerem a fila ao
 *  mesmo tempo sem enviar a mesma mensagem duas vezes. */
export async function reivindicarJobs(limite: number, minutosTravaMorta = 10) {
  const conexao = pool();
  if (!conexao) return [];

  const { rows } = await conexao.query<Job>(
    `with escolhidos as (
       select id
         from teste_gratis_jobs
        where executar_em <= now()
          and (
            status = 'pendente'
            or (status = 'processando'
                and travado_em < now() - ($2 || ' minutes')::interval)
          )
        order by executar_em
        limit $1
        for update skip locked
     )
     update teste_gratis_jobs j
        set status = 'processando',
            tentativas = j.tentativas + 1,
            travado_em = now(),
            atualizado_em = now()
       from escolhidos e
      where j.id = e.id
      returning j.id::text, j.lead_id, j.tipo, j.executar_em, j.status,
                j.tentativas, j.max_tentativas`,
    [limite, String(minutosTravaMorta)]
  );

  return rows;
}

export async function concluirJob(jobId: string) {
  const conexao = pool();
  if (!conexao) return;
  await conexao.query(
    `update teste_gratis_jobs
        set status = 'concluido', travado_em = null, ultimo_erro = null,
            atualizado_em = now()
      where id = $1`,
    [jobId]
  );
}

/** Devolve o job à fila com espera, ou o encerra como falha definitiva quando
 *  o limite de tentativas acabou (ou quando o erro não melhora com insistência,
 *  como número inválido e template inexistente). */
export async function adiarOuFalharJob(
  job: Job,
  erro: string,
  esperaSegundos: number,
  { definitivo = false }: { definitivo?: boolean } = {}
) {
  const conexao = pool();
  if (!conexao) return { desistiu: definitivo };

  const desistiu = definitivo || job.tentativas >= job.max_tentativas;

  await conexao.query(
    `update teste_gratis_jobs
        set status = $2,
            executar_em = case when $2 = 'pendente'
                               then now() + ($3 || ' seconds')::interval
                               else executar_em end,
            travado_em = null,
            ultimo_erro = $4,
            atualizado_em = now()
      where id = $1`,
    [job.id, desistiu ? "falhou" : "pendente", String(esperaSegundos), erro.slice(0, 500)]
  );

  return { desistiu };
}

/* ─── Eventos ─────────────────────────────────────────── */

/** Grava o evento e devolve `false` quando ele já tinha sido gravado.
 *  É assim que o webhook deduplica reentrega do provedor.
 *
 *  O `where chave is not null` no `on conflict` não é enfeite: o índice único
 *  é parcial, e o Postgres só o reconhece na inferência do conflito quando o
 *  predicado do índice aparece aqui também. Sem ele, todo insert estoura com
 *  "there is no unique or exclusion constraint matching the ON CONFLICT
 *  specification" — e como o erro é engolido logo abaixo, o funil pararia de
 *  gravar evento nenhum e o webhook processaria reentrega como se fosse nova.
 *  Foi o que o teste contra Postgres de verdade pegou. */
export async function registrarEvento(
  evento: string,
  {
    leadId,
    chave,
    dados,
  }: { leadId?: string | null; chave?: string | null; dados?: Record<string, unknown> } = {}
) {
  const conexao = pool();
  if (!conexao) return true;

  try {
    const { rowCount } = await conexao.query(
      `insert into teste_gratis_eventos (lead_id, evento, chave, dados)
       values ($1, $2, $3, $4)
       on conflict (chave) where chave is not null do nothing`,
      [leadId ?? null, evento, chave ?? null, JSON.stringify(dados ?? {})]
    );
    return (rowCount ?? 0) > 0;
  } catch (erro) {
    /* Devolve `true` de propósito: sem gravação não há como saber se o evento
       é repetido, e processar duas vezes uma resposta é menos grave do que
       engolir a primeira. O log é o alarme, e o `TRILHA DE EVENTOS` no texto
       facilita achar isso: quando ele aparece, a deduplicação está fora do ar. */
    console.error(`TRILHA DE EVENTOS indisponível ao gravar ${evento}:`, erro);
    return true;
  }
}
