import { configIa } from "./config";
import type { LeadTesteGratis } from "./repositorio";

/* Entrega da conversa para a IA da CompanyChat.
 *
 * A IA não vive neste repositório: quem atende o WhatsApp é o agente da
 * plataforma. O que o site faz é passar o bastão com o dossiê do lead, uma vez
 * só, quando a pessoa responde. Sem `IA_HANDOFF_URL` o site apenas registra o
 * evento, e quem estiver no CRM assume a conversa.
 *
 * O dossiê existe para a IA não repetir o que já foi perguntado no
 * formulário. As perguntas que faltam vão nomeadas, na ordem, para o agente
 * não improvisar um interrogatório. */

export type Dossie = ReturnType<typeof montarDossie>;

/** O que ainda falta descobrir na conversa, na ordem. O formulário já
 *  respondeu nome, e-mail, WhatsApp, site e segmento. */
export const PERGUNTAS_PENDENTES = [
  "quantas pessoas atendem hoje pelo WhatsApp",
  "volume de conversas por dia",
  "principal dificuldade no atendimento de hoje",
  "qual solução usa hoje",
] as const;

export function montarDossie(lead: LeadTesteGratis, gatilho: string) {
  return {
    origem: "site/teste-gratis",
    gatilho,
    lead: {
      id: lead.id,
      nome: lead.nome,
      primeiroNome: lead.nome.trim().split(/\s+/)[0],
      email: lead.email,
      whatsapp: lead.whatsapp_e164,
      site: lead.sem_site ? null : lead.site,
      semSite: lead.sem_site,
      segmento: lead.segmento,
      solicitouTesteGratis: true,
      consentimentoEm: lead.consentimento_em,
      consentimentoVersao: lead.consentimento_versao,
    },
    atribuicao: lead.origem,
    conversa: {
      statusAtual: lead.status,
      primeiroContatoEm: lead.follow_up_em,
      respondeuEm: lead.respondeu_em,
      botaoEscolhido: lead.botao_escolhido,
      ultimaResposta: lead.ultima_resposta,
    },
    jaRespondido: ["nome", "email", "whatsapp", "site", "segmento"],
    perguntasPendentes: [...PERGUNTAS_PENDENTES],
  };
}

export type EntregaIa = { entregue: boolean; motivo?: string };

export async function entregarParaIa(
  lead: LeadTesteGratis,
  gatilho: string
): Promise<EntregaIa> {
  const { url, token } = configIa();
  if (!url) return { entregue: false, motivo: "IA_HANDOFF_URL não configurada" };

  try {
    const resposta = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(montarDossie(lead, gatilho)),
      signal: AbortSignal.timeout(10_000),
    });

    if (!resposta.ok) {
      return { entregue: false, motivo: `handoff respondeu ${resposta.status}` };
    }
    return { entregue: true };
  } catch (erro) {
    return { entregue: false, motivo: (erro as Error).message };
  }
}
