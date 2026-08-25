import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import { carregar } from "./carregar.mjs";

const { escolherProvedor } = carregar("teste-gratis/whatsapp-provedor");

const fetchOriginal = globalThis.fetch;
const ambienteOriginal = { ...process.env };

function comAmbiente(vars) {
  for (const [k, v] of Object.entries(vars)) process.env[k] = v;
}

function respostaDaMeta(status, corpo) {
  globalThis.fetch = async () => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => corpo,
  });
}

afterEach(() => {
  globalThis.fetch = fetchOriginal;
  for (const chave of [
    "WHATSAPP_PROVIDER",
    "WHATSAPP_TOKEN",
    "WHATSAPP_PHONE_NUMBER_ID",
    "WHATSAPP_ENVIO_WEBHOOK_URL",
  ]) {
    if (ambienteOriginal[chave] === undefined) delete process.env[chave];
    else process.env[chave] = ambienteOriginal[chave];
  }
});

const PEDIDO = {
  paraE164: "+5562993054630",
  template: "companychat_teste_gratis_recebido_v1",
  idioma: "pt_BR",
  parametros: ["Ana"],
};

test("sem credencial nenhuma o provedor recusa em vez de fingir envio", async () => {
  delete process.env.WHATSAPP_PROVIDER;
  delete process.env.WHATSAPP_TOKEN;
  delete process.env.WHATSAPP_PHONE_NUMBER_ID;
  delete process.env.WHATSAPP_ENVIO_WEBHOOK_URL;

  const resultado = await escolherProvedor().enviarTemplate(PEDIDO);
  assert.equal(resultado.ok, false);
  assert.equal(resultado.provedor, "nenhum");
  assert.equal(resultado.permanente, true);
});

test("erro 131042 de billing é permanente, sem gastar as cinco tentativas", async () => {
  comAmbiente({
    WHATSAPP_PROVIDER: "cloud-api",
    WHATSAPP_TOKEN: "token-de-teste",
    WHATSAPP_PHONE_NUMBER_ID: "123",
  });
  respostaDaMeta(400, {
    error: {
      code: 131042,
      message: "Business eligibility payment issue",
    },
  });

  const resultado = await escolherProvedor().enviarTemplate(PEDIDO);
  assert.equal(resultado.ok, false);
  assert.equal(resultado.permanente, true);
  assert.ok(resultado.erro.includes("131042"));
});

test("erro temporário da Meta continua sendo retentável", async () => {
  comAmbiente({
    WHATSAPP_PROVIDER: "cloud-api",
    WHATSAPP_TOKEN: "token-de-teste",
    WHATSAPP_PHONE_NUMBER_ID: "123",
  });
  respostaDaMeta(500, { error: { code: 1, message: "instabilidade" } });

  const resultado = await escolherProvedor().enviarTemplate(PEDIDO);
  assert.equal(resultado.ok, false);
  assert.equal(resultado.permanente, false);
});

test("template inexistente é permanente", async () => {
  comAmbiente({
    WHATSAPP_PROVIDER: "cloud-api",
    WHATSAPP_TOKEN: "token-de-teste",
    WHATSAPP_PHONE_NUMBER_ID: "123",
  });
  respostaDaMeta(400, { error: { code: 132001, message: "template not found" } });

  const resultado = await escolherProvedor().enviarTemplate(PEDIDO);
  assert.equal(resultado.permanente, true);
});

test("a mensagem de erro nunca carrega o token", async () => {
  comAmbiente({
    WHATSAPP_PROVIDER: "cloud-api",
    WHATSAPP_TOKEN: "SEGREDO-QUE-NAO-PODE-VAZAR",
    WHATSAPP_PHONE_NUMBER_ID: "123",
  });
  respostaDaMeta(401, { error: { code: 190, message: "Invalid OAuth access token" } });

  const resultado = await escolherProvedor().enviarTemplate(PEDIDO);
  assert.ok(!resultado.erro.includes("SEGREDO-QUE-NAO-PODE-VAZAR"));
});

test("envio bem-sucedido devolve o id da mensagem", async () => {
  comAmbiente({
    WHATSAPP_PROVIDER: "cloud-api",
    WHATSAPP_TOKEN: "token-de-teste",
    WHATSAPP_PHONE_NUMBER_ID: "123",
  });
  respostaDaMeta(200, { messages: [{ id: "wamid.abc" }] });

  const resultado = await escolherProvedor().enviarTemplate(PEDIDO);
  assert.equal(resultado.ok, true);
  assert.equal(resultado.messageId, "wamid.abc");
});
