import test from "node:test";
import assert from "node:assert/strict";
import { carregar } from "./carregar.mjs";

/* A senha entra no ambiente antes do `carregar`, porque o módulo lê
   `process.env.PAINEL_LEADS_SENHA` no topo. Vinte e quatro caracteres para
   passar do mínimo — é o valor de teste, não tem relação com produção. */
process.env.PAINEL_LEADS_SENHA = "senha-de-teste-com-24-ch";

const { MINIMO_SENHA, gerarToken, painelConfigurado, senhaConfere } =
  carregar("painel");

test("o mínimo de senha protege a base: seis caracteres não configuram o painel", () => {
  assert.ok(MINIMO_SENHA >= 20, "o mínimo não pode voltar a ser curto");
});

test("a senha certa confere e a errada não", () => {
  assert.equal(painelConfigurado(), true);
  assert.equal(senhaConfere("senha-de-teste-com-24-ch"), true);
  assert.equal(senhaConfere("senha-de-teste-com-24-cX"), false);
});

test("senha errada de outro comprimento também é recusada, sem lançar", () => {
  // O comparador antes retornava cedo quando os tamanhos diferiam, o que
  // vazava o comprimento da senha por tempo de resposta.
  assert.equal(senhaConfere(""), false);
  assert.equal(senhaConfere("x"), false);
  assert.equal(senhaConfere("senha-de-teste-com-24-ch-e-mais-um-tanto"), false);
});

test("dois logins seguidos produzem tokens diferentes", () => {
  // Antes o token era HMAC de uma constante: sempre o mesmo valor, para
  // sempre. Quem copiasse o cookie uma vez tinha acesso permanente.
  assert.notEqual(gerarToken(), gerarToken());
});

test("o token carrega expiração no futuro e no formato esperado", () => {
  const token = gerarToken();
  const [corpo, assinatura] = token.split(".");

  assert.ok(corpo && assinatura, "token tem corpo e assinatura");

  const payload = JSON.parse(Buffer.from(corpo, "base64url").toString());
  assert.equal(payload.v, 1);
  assert.equal(typeof payload.jti, "string");
  assert.ok(payload.exp > Date.now(), "a expiração está no futuro");
  assert.ok(
    payload.exp <= Date.now() + 13 * 60 * 60 * 1000,
    "a validade não passa de doze horas com folga"
  );
});

test("o token não contém a senha", () => {
  const token = gerarToken();
  assert.ok(!token.includes("senha-de-teste"), "o valor do cookie não revela a senha");
  const corpo = Buffer.from(token.split(".")[0], "base64url").toString();
  assert.ok(!corpo.includes("senha-de-teste"));
});
