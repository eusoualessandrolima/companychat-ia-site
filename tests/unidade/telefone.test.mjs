import test from "node:test";
import assert from "node:assert/strict";
import { carregar } from "./carregar.mjs";

const { normalizarWhatsapp, variantesE164, chaveComparacao, mascarar } = carregar(
  "teste-gratis/telefone"
);

test("normaliza número brasileiro digitado com máscara", () => {
  assert.deepEqual(normalizarWhatsapp("(62) 99305-4630"), {
    ok: true,
    e164: "+5562993054630",
  });
});

test("aceita o número já com código do país, com e sem o mais", () => {
  assert.deepEqual(normalizarWhatsapp("+55 (62) 99305-4630"), {
    ok: true,
    e164: "+5562993054630",
  });
  assert.deepEqual(normalizarWhatsapp("5562993054630"), {
    ok: true,
    e164: "+5562993054630",
  });
});

test("acrescenta o nono dígito quando o celular vem com oito", () => {
  assert.deepEqual(normalizarWhatsapp("(62) 9305-4630"), {
    ok: true,
    e164: "+5562993054630",
  });
});

test("preserva número internacional sem inventar o 55", () => {
  assert.deepEqual(normalizarWhatsapp("+1 415 555 0123"), {
    ok: true,
    e164: "+14155550123",
  });
  assert.deepEqual(normalizarWhatsapp("+351 912 345 678"), {
    ok: true,
    e164: "+351912345678",
  });
});

test("recusa entrada inválida", () => {
  for (const entrada of ["", "abc", "99999", "(20) 99999-9999", "+5562993054630123456"]) {
    assert.equal(normalizarWhatsapp(entrada).ok, false, `deveria recusar: ${entrada}`);
  }
});

test("recusa fixo, que não recebe WhatsApp", () => {
  assert.equal(normalizarWhatsapp("(62) 3232-3232").ok, false);
});

test("recusa valor que não é texto", () => {
  assert.equal(normalizarWhatsapp(undefined).ok, false);
  assert.equal(normalizarWhatsapp(5562993054630).ok, false);
});

test("variantes cobrem o wa_id brasileiro sem o nono dígito", () => {
  const comNove = variantesE164("+5562993054630");
  assert.ok(comNove.includes("+5562993054630"));
  assert.ok(comNove.includes("+556293054630"));

  const semNove = variantesE164("556293054630");
  assert.ok(semNove.includes("+5562993054630"));
});

test("chave de comparação ignora o nono dígito no Brasil e preserva o resto", () => {
  assert.equal(chaveComparacao("+5562993054630"), "556293054630");
  assert.equal(chaveComparacao("+14155550123"), "14155550123");
});

test("máscara de log revela só os quatro últimos dígitos", () => {
  assert.equal(mascarar("+5562993054630"), "*********4630");
  assert.equal(mascarar("+12"), "****");
});
