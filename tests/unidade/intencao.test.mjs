import test from "node:test";
import assert from "node:assert/strict";
import { carregar } from "./carregar.mjs";

const { lerIntencao, BOTOES } = carregar("teste-gratis/intencao");

test("botão do template decide a intenção", () => {
  assert.equal(lerIntencao({ payload: BOTOES.continuar }), "continuar");
  assert.equal(lerIntencao({ payload: BOTOES.depois }), "depois");
  assert.equal(lerIntencao({ payload: BOTOES.optOut }), "opt_out");
});

test("botão vence o texto quando os dois vêm juntos", () => {
  assert.equal(
    lerIntencao({ payload: BOTOES.optOut, texto: "quero continuar" }),
    "opt_out"
  );
});

test("frases de recusa digitadas viram opt-out, com e sem acento", () => {
  const frases = [
    "parar",
    "PARE",
    "sair",
    "não quero",
    "nao tenho interesse",
    "remover meu número",
    "para de mandar mensagem",
  ];
  for (const frase of frases) {
    assert.equal(lerIntencao({ texto: frase }), "opt_out", frase);
  }
});

test("recusa dentro de frase longa não é opt-out", () => {
  assert.equal(
    lerIntencao({
      texto: "não quero perder mais nenhum lead do meu WhatsApp, como funciona?",
    }),
    "conversa"
  );
});

test("adiamento é reconhecido", () => {
  assert.equal(lerIntencao({ texto: "agora não" }), "depois");
  assert.equal(lerIntencao({ texto: "me chama mais tarde" }), "depois");
});

test("aceite curto é reconhecido", () => {
  assert.equal(lerIntencao({ texto: "quero continuar" }), "continuar");
  assert.equal(lerIntencao({ texto: "sim" }), "continuar");
});

test("resposta comum é conversa, e vai para a IA", () => {
  assert.equal(
    lerIntencao({ texto: "somos 4 vendedores e recebemos umas 80 mensagens por dia" }),
    "conversa"
  );
  assert.equal(lerIntencao({ texto: "" }), "conversa");
  assert.equal(lerIntencao({}), "conversa");
});

/* ─── Contingência: WhatsApp Manager sem campo de payload ───
   Em vários fluxos a interface não expõe o payload de botão de resposta rápida
   e usa o texto visível. Estes casos garantem que o funil continua correto sem
   depender disso, para o template poder ser submetido dos dois jeitos. */

const TEXTOS_DOS_BOTOES = [
  ["Quero continuar", "continuar"],
  ["Agora não", "depois"],
  ["Não tenho interesse", "opt_out"],
];

test("payload igual ao texto visível do botão é entendido", () => {
  for (const [texto, esperado] of TEXTOS_DOS_BOTOES) {
    assert.equal(
      lerIntencao({ payload: texto, texto }),
      esperado,
      `payload "${texto}"`
    );
  }
});

test("sem payload nenhum, o texto do botão decide", () => {
  for (const [texto, esperado] of TEXTOS_DOS_BOTOES) {
    assert.equal(lerIntencao({ texto }), esperado, `texto "${texto}"`);
  }
});

test("texto do botão sem acento e em caixa alta continua valendo", () => {
  assert.equal(lerIntencao({ payload: "NAO TENHO INTERESSE" }), "opt_out");
  assert.equal(lerIntencao({ texto: "AGORA NAO" }), "depois");
  assert.equal(lerIntencao({ payload: "quero continuar " }), "continuar");
});

test("payload desconhecido que não é botão cai na leitura do texto", () => {
  assert.equal(
    lerIntencao({ payload: "btn_1", texto: "não tenho interesse" }),
    "opt_out"
  );
  assert.equal(
    lerIntencao({ payload: "btn_9", texto: "somos 4 vendedores" }),
    "conversa"
  );
});
