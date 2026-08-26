import test from "node:test";
import assert from "node:assert/strict";
import { carregar } from "./carregar.mjs";

const { corpoGrandeDemais } = carregar("corpo");

function requisicaoCom(cabecalhos) {
  return new Request("https://exemplo.test/api/lead", {
    method: "POST",
    headers: cabecalhos,
  });
}

test("corpo dentro do teto passa", () => {
  assert.equal(corpoGrandeDemais(requisicaoCom({ "content-length": "2048" })), false);
});

test("corpo acima do teto é barrado", () => {
  assert.equal(
    corpoGrandeDemais(requisicaoCom({ "content-length": "10000000" })),
    true
  );
});

test("o teto é configurável por rota", () => {
  const req = requisicaoCom({ "content-length": "100000" });
  // O webhook da Meta manda lote maior que um formulário.
  assert.equal(corpoGrandeDemais(req, 256 * 1024), false);
  assert.equal(corpoGrandeDemais(req, 64 * 1024), true);
});

test("sem content-length não bloqueia: o teto duro é do proxy", () => {
  // Corpo com `Transfer-Encoding: chunked` não declara tamanho. Barrar aqui
  // recusaria requisição legítima; quem vê os bytes de verdade é o Traefik.
  assert.equal(corpoGrandeDemais(requisicaoCom({})), false);
});

test("content-length não numérico não bloqueia nem lança", () => {
  assert.equal(corpoGrandeDemais(requisicaoCom({ "content-length": "abc" })), false);
});
