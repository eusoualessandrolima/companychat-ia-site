import {
  atrasoFollowUpSegundos,
  envioWhatsappLigado,
  janelaDeduplicacaoHoras,
} from "./config";
import { mascarar } from "./telefone";
import {
  agendarFollowUp,
  bancoDisponivel,
  criarLead,
  marcarAgendado,
  registrarEvento,
  solicitacaoRecente,
  temOptOut,
  type LeadTesteGratis,
} from "./repositorio";
import type { LeadValidado } from "./validacao";

/* Regra de negócio da captação: o que acontece entre o formulário válido e o
   follow-up agendado. A rota HTTP só traduz isso para JSON. */

export type ResultadoCaptacao = {
  gravado: boolean;
  duplicado: boolean;
  agendado: boolean;
  optOut: boolean;
  followUpEm: string | null;
  leadId: string | null;
};

export async function registrarSolicitacao(
  lead: LeadValidado
): Promise<ResultadoCaptacao> {
  const base: ResultadoCaptacao = {
    gravado: false,
    duplicado: false,
    agendado: false,
    optOut: false,
    followUpEm: null,
    leadId: null,
  };

  /* Sem banco a página continua funcionando e a pessoa vê a confirmação: é o
     mesmo contrato do quiz. O que se perde é o follow-up, e o log diz isso. */
  if (!bancoDisponivel()) {
    console.warn("Teste grátis: DATABASE_URL ausente, solicitação não persistida");
    return base;
  }

  /* Opt-out antigo vence consentimento novo no formulário. Quem pediu para não
     ser mais chamado precisa ser destravado por uma pessoa, não por um
     checkbox marcado de novo. */
  if (await temOptOut(lead.whatsappE164)) {
    const registro = await criarLead(lead, "opt_out");
    await registrarEvento("free_trial_form_submitted", {
      leadId: registro?.id,
      dados: { bloqueado: "opt_out" },
    });
    return { ...base, gravado: Boolean(registro), optOut: true, leadId: registro?.id ?? null };
  }

  const recente = await solicitacaoRecente(
    lead.whatsappE164,
    lead.email,
    janelaDeduplicacaoHoras()
  );

  if (recente) {
    await registrarEvento("free_trial_form_submitted", {
      leadId: recente.id,
      dados: { duplicado: true },
    });
    return {
      ...base,
      gravado: true,
      duplicado: true,
      leadId: recente.id,
      followUpEm: recente.follow_up_em,
      agendado: Boolean(recente.follow_up_em),
    };
  }

  const registro = await criarLead(lead, "recebido");
  if (!registro) return base;

  await registrarEvento("free_trial_form_submitted", { leadId: registro.id });

  /* Modo somente captação: o lead é gravado e vai para o CRM, mas nenhum job
     nasce. Barrar aqui, e não na hora de enviar, é o que garante que ligar a
     chave depois não dispare de uma vez a fila inteira de quem se cadastrou
     enquanto ela estava desligada. */
  if (!envioWhatsappLigado()) {
    await registrarEvento("free_trial_captacao_sem_envio", {
      leadId: registro.id,
      dados: { motivo: "FREE_TRIAL_WHATSAPP_ENABLED desligado" },
    });
    await avisarCrm(registro);

    return {
      gravado: true,
      duplicado: false,
      agendado: false,
      optOut: false,
      followUpEm: null,
      leadId: registro.id,
    };
  }

  const followUpEm = new Date(Date.now() + atrasoFollowUpSegundos() * 1000);
  const agendado = await agendarFollowUp(registro.id, followUpEm);

  if (agendado) {
    await marcarAgendado(registro.id, followUpEm);
    await registrarEvento("whatsapp_followup_scheduled", {
      leadId: registro.id,
      dados: {
        followUpEm: followUpEm.toISOString(),
        atrasoSegundos: atrasoFollowUpSegundos(),
      },
    });
  }

  await avisarCrm(registro);

  return {
    gravado: true,
    duplicado: false,
    agendado,
    optOut: false,
    followUpEm: followUpEm.toISOString(),
    leadId: registro.id,
  };
}

/** Mesmo webhook que o quiz já usa (`LEAD_WEBHOOK_URL`), para o lead nascer no
 *  CRM Kanban junto com os outros. Falhar aqui não invalida a captação: o lead
 *  já está no banco e o follow-up já está agendado. */
async function avisarCrm(lead: LeadTesteGratis) {
  const url = process.env.LEAD_WEBHOOK_URL?.trim();
  if (!url) return;

  const token = process.env.LEAD_WEBHOOK_TOKEN?.trim();

  try {
    const resposta = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        id: lead.id,
        nome: lead.nome,
        empresa: null,
        telefone: lead.whatsapp,
        telefone_e164: lead.whatsapp_e164.replace(/\D/g, ""),
        etapa: 1,
        concluido: true,
        origem: {
          ...lead.origem,
          funil: "teste-gratis",
          segmento: lead.segmento,
          email: lead.email,
          site: lead.site ?? (lead.sem_site ? "não possui" : ""),
        },
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!resposta.ok) {
      console.error(`Webhook de lead respondeu ${resposta.status}`);
    }
  } catch (erro) {
    console.error(
      `Falha ao entregar lead de teste grátis no CRM (${mascarar(lead.whatsapp_e164)}):`,
      erro
    );
  }
}
