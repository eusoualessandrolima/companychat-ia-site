import test from "node:test";
import assert from "node:assert/strict";
import { carregar } from "./carregar.mjs";

const {
  atrasoFollowUpSegundos,
  backoffSegundos,
  ATRASO_MINIMO_SEGUNDOS,
  ATRASO_MAXIMO_SEGUNDOS,
} = carregar("teste-gratis/config");

test("atraso padrão é o mínimo de 180 segundos", () => {
  assert.equal(atrasoFollowUpSegundos(undefined), 180);
  assert.equal(ATRASO_MINIMO_SEGUNDOS, 180);
  assert.equal(ATRASO_MAXIMO_SEGUNDOS, 300);
});

test("atraso configurado dentro da faixa é respeitado", () => {
  assert.equal(atrasoFollowUpSegundos("240"), 240);
  assert.equal(atrasoFollowUpSegundos("300"), 300);
});

test("atraso fora da faixa é preso nos limites", () => {
  assert.equal(atrasoFollowUpSegundos("5"), 180);
  assert.equal(atrasoFollowUpSegundos("3600"), 300);
});

test("atraso inválido cai no padrão em vez de virar NaN", () => {
  assert.equal(atrasoFollowUpSegundos("agora"), 180);
  assert.equal(atrasoFollowUpSegundos(""), 180);
});

test("backoff cresce em dobro e para em trinta minutos", () => {
  assert.deepEqual(
    [1, 2, 3, 4, 5].map(backoffSegundos),
    [30, 60, 120, 240, 480]
  );
  assert.equal(backoffSegundos(20), 1800);
});
