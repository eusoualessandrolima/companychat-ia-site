import test from "node:test";
import assert from "node:assert/strict";
import { carregar } from "./carregar.mjs";

const { sanitizarOrigem } = carregar("origem");

test("mantém os pares de texto que as páginas enviam", () => {
  assert.deepEqual(
    sanitizarOrigem({
      utm_source: "meta",
      utm_campaign: "10-empresas-10-assistentes",
      pagina: "/10-empresas",
      segmento: "E-commerce",
    }),
    {
      utm_source: "meta",
      utm_campaign: "10-empresas-10-assistentes",
      pagina: "/10-empresas",
      segmento: "E-commerce",
    }
  );
});

test("número e booleano viram texto; objeto e nulo são descartados", () => {
  assert.deepEqual(
    sanitizarOrigem({
      tentativas: 2,
      consentiu: true,
      aninhado: { a: 1 },
      lista: [1, 2],
      vazio: null,
    }),
    { tentativas: "2", consentiu: "true" }
  );
});

test("valor longo é cortado antes de chegar ao banco", () => {
  const { motivo } = sanitizarOrigem({ motivo: "a".repeat(2000) });
  assert.equal(motivo.length, 600);
});

test("o número de chaves tem teto", () => {
  const bruto = {};
  for (let i = 0; i < 100; i++) bruto[`chave${i}`] = `valor${i}`;
  assert.equal(Object.keys(sanitizarOrigem(bruto)).length, 32);
});

test("espaços em branco não viram chave nem valor", () => {
  assert.deepEqual(sanitizarOrigem({ "  ": "x", motivo: "   ", ok: " sim " }), {
    ok: "sim",
  });
});

test("o que não é objeto vira objeto vazio", () => {
  for (const entrada of [null, undefined, "texto", 7, [1, 2]]) {
    assert.deepEqual(sanitizarOrigem(entrada), {});
  }
});
