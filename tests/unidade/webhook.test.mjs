import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { carregar } from "./carregar.mjs";

const { processarWebhook } = carregar("teste-gratis/webhook");
const { BOTOES } = carregar("teste-gratis/intencao");
const { assinaturaConfere } = carregar("teste-gratis/assinatura");

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
  status: "contatado",
  follow_up_em: null,
  whatsapp_message_id: "wamid.1",
  entregue_em: null,
  lido_em: null,
  respondeu_em: null,
  ultima_resposta: null,
  botao_escolhido: null,
  criado_em: "2026-08-25T12:00:00Z",
  atualizado_em: "2026-08-25T12:00:00Z",
};

/** Repositório de mentira: guarda as chamadas e simula a deduplicação por
 *  chave, que no banco é um índice único. */
function fakeDeps({ lead = LEAD, entregaIa = { entregue: true } } = {}) {
  const chamadas = { eventos: [], marcas: [], encerrados: [], handoffs: [] };
  const chavesVistas = new Set();

  return {
    chamadas,
    deps: {
      async buscarLeadPorMensagem(id) {
        return lead && lead.whatsapp_message_id === id ? lead : null;
      },
      async buscarLeadPorTelefone(bruto) {
        if (!lead) return null;
        const digitos = bruto.replace(/\D/g, "");
        return lead.whatsapp_e164.replace(/\D/g, "").includes(digitos.slice(-8))
          ? lead
          : null;
      },
      async registrarEvento(evento, { chave } = {}) {
        if (chave && chavesVistas.has(chave)) return false;
        if (chave) chavesVistas.add(chave);
        chamadas.eventos.push(evento);
        return true;
      },
      async marcarEntregue(id) {
        chamadas.marcas.push(["entregue", id]);
      },
      async marcarLido(id) {
        chamadas.marcas.push(["lido", id]);
      },
      async marcarFalhaEnvio(id) {
        chamadas.marcas.push(["falha", id]);
      },
      async marcarResposta(id, conteudo) {
        chamadas.marcas.push(["resposta", id, conteudo]);
      },
      async encerrarAutomacao(id, status) {
        chamadas.encerrados.push([id, status]);
      },
      async entregarParaIa(l, gatilho) {
        chamadas.handoffs.push([l.id, gatilho]);
        return entregaIa;
      },
    },
  };
}

function eventoDeStatus(status, id = "wamid.1") {
  return {
    entry: [
      {
        changes: [
          {
            value: {
              metadata: { display_phone_number: "556493054630" },
              statuses: [{ id, status, recipient_id: "556293054630" }],
            },
          },
        ],
      },
    ],
  };
}

function eventoDeMensagem(mensagem) {
  return {
    entry: [
      {
        changes: [
          {
            value: {
              metadata: { display_phone_number: "556493054630" },
              messages: [{ id: "msg-1", from: "556293054630", ...mensagem }],
            },
          },
        ],
      },
    ],
  };
}

test("status de entrega e leitura atualizam o lead", async () => {
  const { deps, chamadas } = fakeDeps();

  await processarWebhook(eventoDeStatus("delivered"), deps);
  await processarWebhook(eventoDeStatus("read", "wamid.1"), deps);

  assert.deepEqual(chamadas.marcas, [
    ["entregue", "lead-1"],
    ["lido", "lead-1"],
  ]);
  assert.deepEqual(chamadas.eventos, [
    "whatsapp_message_delivered",
    "whatsapp_message_read",
  ]);
});

test("status falho marca falha de envio", async () => {
  const { deps, chamadas } = fakeDeps();
  await processarWebhook(eventoDeStatus("failed"), deps);
  assert.deepEqual(chamadas.marcas, [["falha", "lead-1"]]);
});

test("evento reentregue pelo provedor não conta duas vezes", async () => {
  const { deps, chamadas } = fakeDeps();

  const lote = eventoDeStatus("delivered");
  const primeiro = await processarWebhook(lote, deps);
  const segundo = await processarWebhook(lote, deps);

  assert.equal(primeiro.statusProcessados, 1);
  assert.equal(segundo.statusProcessados, 0);
  assert.equal(segundo.duplicados, 1);
  assert.equal(chamadas.marcas.length, 1);
});

test("resposta do lead aciona a IA uma vez só", async () => {
  const { deps, chamadas } = fakeDeps();

  const lote = eventoDeMensagem({ type: "text", text: { body: "Quantas mensagens?" } });
  await processarWebhook(lote, deps);
  await processarWebhook(lote, deps);

  assert.deepEqual(chamadas.handoffs, [["lead-1", "conversa"]]);
});

test("botão Agora não pausa o lead sem acionar a IA", async () => {
  const { deps, chamadas } = fakeDeps();

  await processarWebhook(
    eventoDeMensagem({
      type: "button",
      button: { payload: BOTOES.depois, text: "Agora não" },
    }),
    deps
  );

  assert.deepEqual(chamadas.encerrados, [["lead-1", "pausado"]]);
  assert.equal(chamadas.handoffs.length, 0);
});

test("botão Não tenho interesse gera opt-out e para a automação", async () => {
  const { deps, chamadas } = fakeDeps();

  await processarWebhook(
    eventoDeMensagem({
      type: "button",
      button: { payload: BOTOES.optOut, text: "Não tenho interesse" },
    }),
    deps
  );

  assert.deepEqual(chamadas.encerrados, [["lead-1", "opt_out"]]);
  assert.equal(chamadas.handoffs.length, 0);
  assert.ok(chamadas.eventos.includes("free_trial_opt_out"));
});

test("botão Quero continuar entrega a conversa para a IA", async () => {
  const { deps, chamadas } = fakeDeps();

  await processarWebhook(
    eventoDeMensagem({
      type: "button",
      button: { payload: BOTOES.continuar, text: "Quero continuar" },
    }),
    deps
  );

  assert.deepEqual(chamadas.handoffs, [["lead-1", "continuar"]]);
});

test("lead em opt-out não volta ao fluxo por mandar mensagem", async () => {
  const { deps, chamadas } = fakeDeps({ lead: { ...LEAD, status: "opt_out" } });

  await processarWebhook(
    eventoDeMensagem({ type: "text", text: { body: "oi" } }),
    deps
  );

  assert.equal(chamadas.handoffs.length, 0);
  assert.equal(chamadas.encerrados.length, 0);
});

test("mensagem do próprio número da empresa é ignorada, sem laço com a IA", async () => {
  const { deps, chamadas } = fakeDeps();

  await processarWebhook(
    {
      entry: [
        {
          changes: [
            {
              value: {
                metadata: { display_phone_number: "556493054630" },
                messages: [
                  { id: "msg-eco", from: "556493054630", type: "text", text: { body: "oi" } },
                ],
              },
            },
          ],
        },
      ],
    },
    deps
  );

  assert.equal(chamadas.handoffs.length, 0);
  assert.equal(chamadas.marcas.length, 0);
});

test("evento de número desconhecido não quebra o processamento", async () => {
  const { deps } = fakeDeps({ lead: null });
  const resumo = await processarWebhook(
    eventoDeMensagem({ type: "text", text: { body: "oi" } }),
    deps
  );
  assert.equal(resumo.semLead, 1);
});

test("corpo fora do formato esperado devolve resumo vazio", async () => {
  const { deps } = fakeDeps();
  assert.deepEqual(await processarWebhook({}, deps), {
    statusProcessados: 0,
    mensagensProcessadas: 0,
    duplicados: 0,
    semLead: 0,
  });
  assert.equal((await processarWebhook(null, deps)).statusProcessados, 0);
});

test("assinatura do webhook só aceita o HMAC correto", () => {
  const corpo = JSON.stringify({ entry: [] });
  const segredo = "segredo-de-teste";
  const valida =`sha256=${createHmac("sha256", segredo).update(corpo, "utf8").digest("hex")}`;

  assert.equal(assinaturaConfere(corpo, valida, segredo), true);
  assert.equal(assinaturaConfere(corpo, valida, "outro-segredo"), false);
  assert.equal(assinaturaConfere(`${corpo} `, valida, segredo), false);
  assert.equal(assinaturaConfere(corpo, null, segredo), false);
  assert.equal(assinaturaConfere(corpo, "sha256=abc", segredo), false);
});
