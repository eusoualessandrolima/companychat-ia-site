import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import { carregar } from "./carregar.mjs";

const { evento, descarregarPendentes, urlInicial } = carregar("analytics");

/* O módulo só toca em `window` dentro das funções, então dá para montar um
   navegador de mentira antes de cada caso, sem jsdom. */
function montarJanela({ comPixel = false } = {}) {
  const guardado = new Map();
  const chamadas = [];
  const camadaDeDados = [];

  globalThis.window = {
    location: { href: "https://www.companychatia.com.br/" },
    sessionStorage: {
      getItem: (k) => (guardado.has(k) ? guardado.get(k) : null),
      setItem: (k, v) => guardado.set(k, String(v)),
      removeItem: (k) => guardado.delete(k),
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
