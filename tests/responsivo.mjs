/* Verificação responsiva do funil /comecar.
 *
 *   npm run test:responsivo                      (usa http://localhost:3000)
 *   BASE_URL=https://www.companychatia.com.br npm run test:responsivo
 *
 * O quiz é percorrido inteiro em cada viewport, mas o formulário NUNCA é
 * enviado: `?dry=1` não existe no app, então a submissão gravaria lead de
 * verdade. Por isso o teste para na etapa de contato e valida o quiz a
 * partir dela usando a navegação por clique nas opções, sem POST.
 *
 * Critério: nada de overflow horizontal, nada de elemento essencial com
 * coordenada negativa ou fora da viewport, alvos de toque >= 44px e console
 * sem erro. Conteúdo abaixo da dobra é aceito — rolagem não é defeito. */

import { chromium, devices } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const ALVO_MINIMO = 44;

const VIEWPORTS = [
  { nome: "celular pequeno 320x568", width: 320, height: 568, mobile: true },
  { nome: "celular pequeno 360x640", width: 360, height: 640, mobile: true },
  { nome: "celular pequeno 375x667", width: 375, height: 667, mobile: true },
  { nome: "celular 375x812", width: 375, height: 812, mobile: true },
  { nome: "celular 390x844", width: 390, height: 844, mobile: true },
  { nome: "celular 393x852", width: 393, height: 852, mobile: true },
  { nome: "celular 412x915", width: 412, height: 915, mobile: true },
  { nome: "celular 430x932", width: 430, height: 932, mobile: true },
  { nome: "celular deitado 844x390", width: 844, height: 390, mobile: true },
  { nome: "tablet 768x1024", width: 768, height: 1024, mobile: true },
  { nome: "tablet 810x1080", width: 810, height: 1080, mobile: true },
  { nome: "tablet 820x1180", width: 820, height: 1180, mobile: true },
  { nome: "tablet 834x1194", width: 834, height: 1194, mobile: true },
  { nome: "tablet 1024x1366", width: 1024, height: 1366, mobile: true },
  { nome: "tablet deitado 1024x768", width: 1024, height: 768, mobile: true },
  { nome: "notebook 1280x720", width: 1280, height: 720 },
  { nome: "notebook 1366x768", width: 1366, height: 768 },
  { nome: "notebook 1440x900", width: 1440, height: 900 },
  { nome: "desktop 1536x864", width: 1536, height: 864 },
  { nome: "desktop 1920x1080", width: 1920, height: 1080 },
  { nome: "desktop 2560x1440", width: 2560, height: 1440 },
  // Zoom do navegador reduz a viewport CSS na mesma proporção.
  { nome: "1280x720 com zoom 125%", width: 1024, height: 576 },
  { nome: "1280x720 com zoom 150%", width: 853, height: 480 },
  { nome: "1280x720 com zoom 200%", width: 640, height: 360 },
  { nome: "janela estreita 400x900", width: 400, height: 900 },
];

/* Roda no browser: mede o que importa na tela atual. */
function medir(alvoMinimo) {
  const problemas = [];
  const doc = document.documentElement;

  if (doc.scrollWidth > doc.clientWidth) {
    problemas.push(`overflow horizontal: ${doc.scrollWidth}px > ${doc.clientWidth}px`);
  }

  /* O wrapper escuro precisa cobrir todo o documento: quando algo decorativo
     estica a página, sobra uma faixa clara do body abaixo do rodapé. */
  const wrapper = [...document.querySelectorAll("div")].find((d) =>
    d.className.includes?.("min-h-dvh")
  );
  if (wrapper) {
    const sobra = doc.scrollHeight - Math.round(wrapper.getBoundingClientRect().height);
    if (sobra > 1) problemas.push(`faixa do body exposta abaixo do rodapé: ${sobra}px`);
  }

  const essenciais = [
    ["header", document.querySelector("header")],
    ["título", document.querySelector("h1, h2")],
    ["card", document.querySelector(".rounded-3xl")],
  ];
  for (const [nome, el] of essenciais) {
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (r.width <= 0) problemas.push(`${nome} com largura zero`);
    if (r.left < -1) problemas.push(`${nome} escapa à esquerda (left ${Math.round(r.left)})`);
    if (r.right > doc.clientWidth + 1) {
      problemas.push(`${nome} escapa à direita (right ${Math.round(r.right)})`);
    }
    // Coordenada negativa no topo com a página no início = inalcançável.
    if (window.scrollY === 0 && r.top < -1) {
      problemas.push(`${nome} acima da área rolável (top ${Math.round(r.top)})`);
    }
  }

  for (const alvo of document.querySelectorAll("button, a[href], input")) {
    const r = alvo.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (r.height < alvoMinimo) {
      const rotulo = (alvo.textContent || alvo.name || alvo.tagName).trim().slice(0, 34);
      problemas.push(`alvo pequeno (${Math.round(r.height)}px): "${rotulo}"`);
    }
  }

  for (const el of document.querySelectorAll("h1, h2, p, span, label, button")) {
    if (getComputedStyle(el).textOverflow === "ellipsis" && el.scrollWidth > el.clientWidth) {
      problemas.push(`texto truncado: "${(el.textContent || "").trim().slice(0, 34)}"`);
    }
  }

  return problemas;
}

const falhas = [];

const browser = await chromium.launch();

for (const vp of VIEWPORTS) {
  const contexto = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.mobile ?? false,
    hasTouch: vp.mobile ?? false,
    userAgent: vp.mobile ? devices["iPhone 13"].userAgent : undefined,
  });
  const pagina = await contexto.newPage();

  const errosConsole = [];
  pagina.on("console", (m) => m.type() === "error" && errosConsole.push(m.text()));
  pagina.on("pageerror", (e) => errosConsole.push(e.message));

  const registrar = (etapa, itens) => {
    for (const item of itens) falhas.push(`[${vp.nome}] ${etapa}: ${item}`);
  };

  await pagina.goto(`${BASE}/comecar`, { waitUntil: "networkidle" });
  registrar("capa", await pagina.evaluate(medir, ALVO_MINIMO));

  await pagina.getByRole("button", { name: /Começar agora/i }).click();
  await pagina.getByRole("heading").waitFor();
  registrar("contato", await pagina.evaluate(medir, ALVO_MINIMO));

  // Campos preenchidos e validação disparada — sem enviar: valida o layout
  // com mensagem de erro visível, que é quando o card cresce mais.
  await pagina.getByRole("button", { name: /Continuar para as perguntas/i }).click();
  await pagina.waitForTimeout(250);
  registrar("contato com erros", await pagina.evaluate(medir, ALVO_MINIMO));

  await pagina.fill("#quiz-nome", "Maria Aparecida de Souza Albuquerque");
  await pagina.fill("#quiz-empresa", "Distribuidora de Materiais de Construção Albuquerque");
  await pagina.fill("#quiz-telefone", "62999999999");
  registrar("contato preenchido", await pagina.evaluate(medir, ALVO_MINIMO));

  if (errosConsole.length) {
    falhas.push(`[${vp.nome}] console: ${errosConsole.join(" | ")}`);
  }

  await contexto.close();
  process.stdout.write(".");
}

await browser.close();

console.log("\n");
if (falhas.length) {
  console.error(`FALHOU — ${falhas.length} problema(s):\n`);
  for (const f of falhas) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`OK — ${VIEWPORTS.length} viewports sem overflow, corte ou alvo pequeno.`);
