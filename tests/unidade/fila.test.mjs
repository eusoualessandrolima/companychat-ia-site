import test from "node:test";
import assert from "node:assert/strict";
import { carregar } from "./carregar.mjs";

const { processarFila, motivoParaNaoEnviar } = carregar("teste-gratis/fila");

/* A chave geral do envio nasce desligada (ver `modo-captacao.test.mjs`). Este
   arquivo testa o que acontece com ela ligada; sem esta linha, tudo aqui
   passaria por engano, porque a fila nem chegaria a olhar os jobs. */
process.env.FREE_TRIAL_WHATSAPP_ENABLED = "true";

const LEAD = {
  id: "lead-1",
  nome: "Ana Souza",
  email: "ana@empresa.com.br",
  whatsapp: "(62) 99305-4630",
  whatsapp_e164: "+5562993054630",
  site: null,
  sem_site: true,
  segmento: "Odontologia",
  consentimento_whatsapp: true,
  consentimento_em: "2026-08-25T12:00:00Z",
  consentimento_versao: "teste-gratis-2026-08-v1",
  origem: {},
  status: "agendado",
  follow_up_em: "2026-08-25T12:03:00Z",
  whatsapp_message_id: null,
  entregue_em: null,
  lido_em: null,
  respondeu_em: null,
  ultima_resposta: null,
  botao_escolhido: null,
  criado_em: "2026-08-25T12:00:00Z",
  atualizado_em: "2026-08-25T12:00:00Z",
};

const JOB = {
  id: "1",
  lead_id: "lead-1",
  tipo: "followup_whatsapp",
  executar_em: "2026-08-25T12:03:00Z",
  status: "processando",
  tentativas: 1,
  max_tentativas: 5,
};

function fakeDeps({ lead = LEAD, jobs = [JOB] } = {}) {
  const chamadas = { concluidos: [], adiados: [], enviados: [], falhas: [], eventos: [] };

  return {
    chamadas,
    deps: {
      bancoDisponivel: () => true,
      async reivindicarJobs() {
        return jobs;
      },
      async buscarLead() {
        return lead;
      },
      async concluirJob(id) {
        chamadas.concluidos.push(id);
      },
      async adiarOuFalharJob(job, erro, espera, opcoes = {}) {
        const desistiu = Boolean(opcoes.definitivo) || job.tentativas >= job.max_tentativas;
        chamadas.adiados.push({ erro, espera, desistiu });
        return { desistiu };
      },
      async marcarEnviado(id, messageId) {
        chamadas.enviados.push([id, messageId]);
      },
      async marcarFalhaEnvio(id) {
        chamadas.falhas.push(id);
      },
      async registrarEvento(evento) {
        chamadas.eventos.push(evento);
        return true;
      },
    },
  };
}

function provedorFalso(resposta, registro = []) {
  return {
    nome: "falso",
    async enviarTemplate(pedido) {
      registro.push(pedido);
      return resposta;
    },
  };
}

test("job vencido dispara o template e conclui", async () => {
  const { deps, chamadas } = fakeDeps();
  const enviados = [];

  const resumo = await processarFila(
    10,
    provedorFalso({ ok: true, messageId: "wamid.9", provedor: "falso" }, enviados),
    deps
  );

  assert.equal(resumo.enviados, 1);
  assert.equal(enviados.length, 1);
  assert.equal(enviados[0].paraE164, "+5562993054630");
  assert.deepEqual(enviados[0].parametros, ["Ana"]);
  assert.deepEqual(chamadas.enviados, [["lead-1", "wamid.9"]]);
  assert.deepEqual(chamadas.concluidos, ["1"]);
  assert.ok(chamadas.eventos.includes("whatsapp_message_sent"));
});

test("lead sem consentimento nunca recebe mensagem", async () => {
  const { deps, chamadas } = fakeDeps({
    lead: { ...LEAD, consentimento_whatsapp: false },
  });
  const enviados = [];

  const resumo = await processarFila(10, provedorFalso({ ok: true }, enviados), deps);

  assert.equal(resumo.ignorados, 1);
  assert.equal(enviados.length, 0);
  assert.deepEqual(chamadas.concluidos, ["1"]);
});

test("lead em opt-out ou pausado não recebe mensagem", async () => {
  for (const status of ["opt_out", "pausado"]) {
    const { deps } = fakeDeps({ lead: { ...LEAD, status } });
    const enviados = [];
    const resumo = await processarFila(10, provedorFalso({ ok: true }, enviados), deps);

    assert.equal(resumo.ignorados, 1, status);
    assert.equal(enviados.length, 0, status);
  }
});

test("job reivindicado de novo não reenvia quando já existe mensagem", async () => {
  const { deps, chamadas } = fakeDeps({
    lead: { ...LEAD, whatsapp_message_id: "wamid.ja-enviada" },
  });
  const enviados = [];

  const resumo = await processarFila(10, provedorFalso({ ok: true }, enviados), deps);

  assert.equal(resumo.ignorados, 1);
  assert.equal(enviados.length, 0);
  assert.deepEqual(chamadas.concluidos, ["1"]);
});

test("falha temporária adia com backoff e mantém o job na fila", async () => {
  const { deps, chamadas } = fakeDeps();

  const resumo = await processarFila(
    10,
    provedorFalso({ ok: false, erro: "Meta 500", permanente: false, provedor: "falso" }),
    deps
  );

  assert.equal(resumo.adiados, 1);
  assert.equal(chamadas.adiados[0].desistiu, false);
  assert.equal(chamadas.adiados[0].espera, 30);
  assert.equal(chamadas.falhas.length, 0);
});

test("falha permanente encerra o job na primeira tentativa", async () => {
  const { deps, chamadas } = fakeDeps();

  const resumo = await processarFila(
    10,
    provedorFalso({
      ok: false,
      erro: "Meta 400 (132001): template não existe",
      permanente: true,
      provedor: "falso",
    }),
    deps
  );

  assert.equal(resumo.falhas, 1);
  assert.equal(chamadas.adiados[0].desistiu, true);
  assert.deepEqual(chamadas.falhas, ["lead-1"]);
  assert.ok(chamadas.eventos.includes("free_trial_whatsapp_send_error"));
});

test("última tentativa vira falha definitiva", async () => {
  const { deps, chamadas } = fakeDeps({
    jobs: [{ ...JOB, tentativas: 5, max_tentativas: 5 }],
  });

  const resumo = await processarFila(
    10,
    provedorFalso({ ok: false, erro: "timeout", permanente: false, provedor: "falso" }),
    deps
  );

  assert.equal(resumo.falhas, 1);
  assert.deepEqual(chamadas.falhas, ["lead-1"]);
});

test("sem banco a rodada não faz nada", async () => {
  const { deps } = fakeDeps();
  deps.bancoDisponivel = () => false;
  const enviados = [];

  const resumo = await processarFila(10, provedorFalso({ ok: true }, enviados), deps);

  assert.deepEqual(resumo, {
    reivindicados: 0,
    enviados: 0,
    adiados: 0,
    falhas: 0,
    ignorados: 0,
  });
  assert.equal(enviados.length, 0);
});

test("motivo de bloqueio é explícito", () => {
  assert.equal(motivoParaNaoEnviar(LEAD), null);
  assert.equal(
    motivoParaNaoEnviar({ ...LEAD, consentimento_whatsapp: false }),
    "sem consentimento"
  );
  assert.equal(motivoParaNaoEnviar({ ...LEAD, status: "opt_out" }), "opt-out");
  assert.equal(motivoParaNaoEnviar({ ...LEAD, status: "pausado" }), "pausado");
});
