import test from "node:test";
import assert from "node:assert/strict";
import { carregar } from "./carregar.mjs";

const { consumir, ipDaRequisicao } = carregar("rate-limit");

function cabecalhos(pares) {
  return new Headers(pares);
}

test("o IP vem do x-real-ip quando o proxy o define", () => {
  assert.equal(
    ipDaRequisicao(cabecalhos({ "x-real-ip": "203.0.113.7", "x-forwarded-for": "1.2.3.4" })),
    "203.0.113.7"
  );
});

test("sem x-real-ip, vale o último item do x-forwarded-for", () => {
  assert.equal(
    ipDaRequisicao(cabecalhos({ "x-forwarded-for": "198.51.100.9" })),
    "198.51.100.9"
  );
  assert.equal(
    ipDaRequisicao(cabecalhos({ "x-forwarded-for": "1.2.3.4, 198.51.100.9" })),
    "198.51.100.9"
  );
});

test("o valor forjado pelo cliente não vence o do proxy", () => {
  /* O atacante manda `x-forwarded-for: <aleatório>`; o Traefik acrescenta o IP
     real no fim. Ler o primeiro item deixaria o limite por IP inútil. */
  const forjados = ["9.9.9.1", "9.9.9.2", "9.9.9.3"];
  const vistos = forjados.map((f) =>
    ipDaRequisicao(cabecalhos({ "x-forwarded-for": `${f}, 198.51.100.9` }))
  );
  assert.deepEqual(vistos, ["198.51.100.9", "198.51.100.9", "198.51.100.9"]);
});

test("cadeia mal formada não vira chave vazia", () => {
  assert.equal(ipDaRequisicao(cabecalhos({ "x-forwarded-for": " , , " })), "desconhecido");
  assert.equal(ipDaRequisicao(cabecalhos({})), "desconhecido");
});

test("o balde libera até o limite e barra o excedente", () => {
  const chave = `teste-${Math.floor(performance.now())}-a`;
  const opcoes = { limite: 3, janelaSegundos: 600 };

  for (let i = 1; i <= 3; i++) {
    assert.equal(consumir(chave, opcoes).permitido, true, `tentativa ${i}`);
  }

  const barrado = consumir(chave, opcoes);
  assert.equal(barrado.permitido, false);
  assert.ok(barrado.esperarSegundos > 0 && barrado.esperarSegundos <= 600);
});

test("chaves diferentes têm baldes independentes", () => {
  const opcoes = { limite: 1, janelaSegundos: 600 };
  const base = Math.floor(performance.now());

  assert.equal(consumir(`teste-${base}-b`, opcoes).permitido, true);
  assert.equal(consumir(`teste-${base}-c`, opcoes).permitido, true);
  assert.equal(consumir(`teste-${base}-b`, opcoes).permitido, false);
});

test("a janela expira e o balde volta a permitir", async () => {
  const chave = `teste-${Math.floor(performance.now())}-d`;
  const opcoes = { limite: 1, janelaSegundos: 0.2 };

  assert.equal(consumir(chave, opcoes).permitido, true);
  assert.equal(consumir(chave, opcoes).permitido, false);

  await new Promise((r) => setTimeout(r, 260));
  assert.equal(consumir(chave, opcoes).permitido, true);
});
