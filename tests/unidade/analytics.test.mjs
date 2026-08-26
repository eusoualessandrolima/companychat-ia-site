import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import { carregar } from "./carregar.mjs";

const { evento, descarregarPendentes, urlInicial, analyticsPermitido } =
  carregar("analytics");

/* O módulo só toca em `window` dentro das funções, então dá para montar um
   navegador de mentira antes de cada caso, sem jsdom.

   `hostname` importa: fora dos domínios de produção o módulo não transmite
   nem enfileira nada — ver os casos de "localhost" no fim do arquivo. */
function montarJanela({
  comPixel = false,
  hostname = "www.companychatia.com.br",
  debug = false,
} = {}) {
  const guardado = new Map();
  const local = new Map(debug ? [["cc_debug_analytics", "true"]] : []);
  const chamadas = [];
  const camadaDeDados = [];

  globalThis.window = {
    location: { href: `https://${hostname}/`, hostname },
    sessionStorage: {
      getItem: (k) => (guardado.has(k) ? guardado.get(k) : null),
      setItem: (k, v) => guardado.set(k, String(v)),
      removeItem: (k) => guardado.delete(k),
    },
    localStorage: {
      getItem: (k) => (local.has(k) ? local.get(k) : null),
      setItem: (k, v) => local.set(k, String(v)),
      removeItem: (k) => local.delete(k),
    },
    dataLayer: camadaDeDados,
    fbq: comPixel ? (...args) => chamadas.push(args) : undefined,
  };

  return { chamadas, camadaDeDados, guardado };
}

afterEach(() => {
  delete globalThis.window;
});

test("com o Pixel na página, o evento vai direto para o fbq", () => {
  const { chamadas, guardado } = montarJanela({ comPixel: true });

  evento("free_trial_cta_clicked", { local: "hero" });

  assert.deepEqual(chamadas, [
    ["trackCustom", "free_trial_cta_clicked", { local: "hero" }],
  ]);
  assert.equal(guardado.has("cc_eventos_pendentes"), false);
});

test("sem o Pixel na página, o evento fica guardado em vez de sumir", () => {
  const { chamadas, guardado } = montarJanela({ comPixel: false });

  evento("free_trial_cta_clicked", { local: "header" });

  assert.equal(chamadas.length, 0);
  assert.deepEqual(JSON.parse(guardado.get("cc_eventos_pendentes")), [
    { nome: "free_trial_cta_clicked", dados: { local: "header" } },
  ]);
});

test("o dataLayer recebe o evento mesmo sem o Pixel", () => {
  const { camadaDeDados } = montarJanela({ comPixel: false });

  evento("free_trial_cta_clicked", { local: "footer" });

  assert.deepEqual(camadaDeDados, [
    { event: "free_trial_cta_clicked", local: "footer" },
  ]);
});

test("o clique guardado na home é entregue ao chegar na página do funil", () => {
  // Página sem Pixel: o clique entra na fila.
  const semPixel = montarJanela({ comPixel: false });
  evento("free_trial_cta_clicked", { local: "header" });
  const fila = semPixel.guardado.get("cc_eventos_pendentes");

  // Mesma sessão, agora numa página com Pixel.
  const comPixel = montarJanela({ comPixel: true });
  comPixel.guardado.set("cc_eventos_pendentes", fila);

  assert.equal(descarregarPendentes(), 1);
  assert.deepEqual(comPixel.chamadas, [
    ["trackCustom", "free_trial_cta_clicked", { local: "header", adiado: true }],
  ]);
});

test("a fila é esvaziada, então recarregar a página não conta o clique de novo", () => {
  const { chamadas, guardado } = montarJanela({ comPixel: true });
  guardado.set(
    "cc_eventos_pendentes",
    JSON.stringify([{ nome: "free_trial_cta_clicked", dados: { local: "hero" } }])
  );

  assert.equal(descarregarPendentes(), 1);
  assert.equal(descarregarPendentes(), 0);
  assert.equal(chamadas.length, 1);
  assert.equal(guardado.has("cc_eventos_pendentes"), false);
});

test("sem o Pixel, descarregar não perde a fila", () => {
  const { guardado } = montarJanela({ comPixel: false });
  const fila = JSON.stringify([
    { nome: "free_trial_cta_clicked", dados: { local: "hero" } },
  ]);
  guardado.set("cc_eventos_pendentes", fila);

  assert.equal(descarregarPendentes(), 0);
  assert.equal(guardado.get("cc_eventos_pendentes"), fila);
});

test("a fila tem teto e mantém os cliques mais recentes", () => {
  const { guardado } = montarJanela({ comPixel: false });

  for (let i = 0; i < 15; i++) evento("free_trial_cta_clicked", { local: `cta-${i}` });

  const fila = JSON.parse(guardado.get("cc_eventos_pendentes"));
  assert.equal(fila.length, 10);
  assert.equal(fila[0].dados.local, "cta-5");
  assert.equal(fila.at(-1).dados.local, "cta-14");
});

test("o envio do formulário também dispara o evento padrão Lead", () => {
  const { chamadas } = montarJanela({ comPixel: true });

  evento("free_trial_form_submitted", { segmento: "Odontologia" });

  assert.deepEqual(chamadas, [
    ["trackCustom", "free_trial_form_submitted", { segmento: "Odontologia" }],
    ["track", "Lead"],
  ]);
});

test("fila corrompida no sessionStorage não quebra a página", () => {
  const { guardado, chamadas } = montarJanela({ comPixel: true });
  guardado.set("cc_eventos_pendentes", "{isso não é JSON");

  assert.equal(descarregarPendentes(), 0);
  assert.equal(chamadas.length, 0);
});

test("sessionStorage indisponível não impede o evento nem quebra", () => {
  montarJanela({ comPixel: false });
  globalThis.window.sessionStorage = {
    getItem() {
      throw new Error("bloqueado");
    },
    setItem() {
      throw new Error("bloqueado");
    },
    removeItem() {
      throw new Error("bloqueado");
    },
  };

  assert.doesNotThrow(() => evento("free_trial_cta_clicked", { local: "hero" }));
  assert.equal(urlInicial(), "");
});

test("no servidor nada acontece e nada estoura", () => {
  delete globalThis.window;
  assert.doesNotThrow(() => evento("free_trial_cta_clicked", { local: "hero" }));
  assert.equal(urlInicial(), "");
  assert.equal(descarregarPendentes(), 0);
});

/* ─── Medição só nos domínios de produção ─────────────────────────────
   `npm run start` roda em `production` no localhost, então `NODE_ENV` não
   separa o site real da máquina de quem desenvolve. O host separa. */

test("o apex e o www são domínios de produção", () => {
  for (const hostname of ["companychatia.com.br", "www.companychatia.com.br"]) {
    montarJanela({ hostname });
    assert.equal(analyticsPermitido(), true, hostname);
  }
});

test("localhost, IP local e preview não são produção", () => {
  for (const hostname of [
    "localhost",
    "127.0.0.1",
    "192.168.0.15",
    "companychat-ia-site.vercel.app",
    "companychatia.com.br.evil.test",
  ]) {
    montarJanela({ hostname });
    assert.equal(analyticsPermitido(), false, hostname);
  }
});

test("em localhost o evento não vai ao Pixel nem fica na fila", () => {
  const { chamadas, camadaDeDados, guardado } = montarJanela({
    comPixel: true,
    hostname: "localhost",
  });

  evento("campanha10_form_submitted", { segmento: "E-commerce" });

  assert.deepEqual(chamadas, [], "nada pode ser transmitido");
  assert.deepEqual(camadaDeDados, [], "sem debug, nem o dataLayer é alimentado");
  assert.equal(guardado.has("cc_eventos_pendentes"), false, "e nada fica na fila");
});

test("em localhost o modo de debug alimenta só o dataLayer", () => {
  const { chamadas, camadaDeDados, guardado } = montarJanela({
    comPixel: true,
    hostname: "localhost",
    debug: true,
  });

  evento("campanha10_page_view");

  assert.deepEqual(camadaDeDados, [
    { event: "campanha10_page_view", ambiente_local: true },
  ]);
  assert.deepEqual(chamadas, [], "debug não transmite para a Meta");
  assert.equal(guardado.has("cc_eventos_pendentes"), false);
});

test("fila herdada não é entregue fora de produção", () => {
  const { chamadas, guardado } = montarJanela({
    comPixel: true,
    hostname: "localhost",
  });
  guardado.set(
    "cc_eventos_pendentes",
    JSON.stringify([{ nome: "free_trial_cta_clicked", dados: { local: "hero" } }])
  );

  assert.equal(descarregarPendentes(), 0);
  assert.equal(chamadas.length, 0);
  assert.ok(guardado.has("cc_eventos_pendentes"), "a fila fica intacta");
});

test("o envio da campanha 10 empresas também dispara o Lead padrão", () => {
  const { chamadas } = montarJanela({ comPixel: true });

  evento("campanha10_form_submitted", { segmento: "E-commerce" });

  assert.deepEqual(chamadas, [
    ["trackCustom", "campanha10_form_submitted", { segmento: "E-commerce" }],
    ["track", "Lead"],
  ]);
});
