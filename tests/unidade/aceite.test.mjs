import test from "node:test";
import assert from "node:assert/strict";
import { carregar } from "./carregar.mjs";

const { avaliarAceite } = carregar("aceite");

const RELOGIO = () => "2026-08-27T17:00:00.000Z";

const COMPLETO = {
  consentimento: true,
  consentimentoVersao: "lp-2026-08-27",
  consentimentoEm: "2026-08-27T16:59:58.000Z",
};

test("a LP de anúncio grava o aceite que envia", () => {
  const veredito = avaliarAceite("lp", COMPLETO, false, RELOGIO);
  assert.deepEqual(veredito, {
    situacao: "registrado",
    campos: {
      consentimento: "true",
      consentimento_versao: "lp-2026-08-27",
      consentimento_em: "2026-08-27T16:59:58.000Z",
    },
  });
});

test("a candidatura continua sob a mesma regra", () => {
  const { situacao } = avaliarAceite("candidatura", COMPLETO, false, RELOGIO);
  assert.equal(situacao, "registrado");
});

/* A regressão que motivou o arquivo: até 27/08/2026 as LPs não mandavam
   `tipo`, caíam fora da guarda e gravavam lead sem aceite nenhum — com a
   política publicada prometendo o registro. */
test("LP sem aceite é recusada, e não gravada em silêncio", () => {
  for (const corpo of [{}, { consentimento: false }, { consentimento: "true" }]) {
    const { situacao } = avaliarAceite("lp", corpo, false, RELOGIO);
    assert.equal(situacao, "ausente");
  }
});

test("o quiz de /comecar fica de fora: gravar a cada etapa não pode travar", () => {
  for (const tipo of [undefined, "", "quiz"]) {
    const { situacao } = avaliarAceite(tipo, {}, false, RELOGIO);
    assert.equal(situacao, "dispensado");
  }
});

/* Sem esta dispensa, o `sendBeacon` do botão do WhatsApp levaria 422 e a
   medição de "clicou no WhatsApp" desapareceria — sem proteger nada, porque o
   lead já foi consentido no envio. */
test("o reenvio que só marca o clique no WhatsApp não recobra o aceite", () => {
  const { situacao } = avaliarAceite("lp", {}, true, RELOGIO);
  assert.equal(situacao, "dispensado");
});

test("sem data enviada vale a da gravação", () => {
  const veredito = avaliarAceite(
    "lp",
    { consentimento: true, consentimentoVersao: "lp-2026-08-27" },
    false,
    RELOGIO
  );
  assert.equal(veredito.campos.consentimento_em, "2026-08-27T17:00:00.000Z");
});

test("versão e data têm teto e não aceitam lixo", () => {
  const veredito = avaliarAceite(
    "lp",
    {
      consentimento: true,
      consentimentoVersao: "v".repeat(200),
      consentimentoEm: { forjado: true },
    },
    false,
    RELOGIO
  );
  assert.equal(veredito.campos.consentimento_versao.length, 40);
  assert.equal(veredito.campos.consentimento_em, "2026-08-27T17:00:00.000Z");
});
