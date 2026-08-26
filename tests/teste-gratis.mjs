/* Verificação do funil de teste grátis no navegador: navegação dos CTAs,
 * comportamento do formulário e responsividade da página.
 *
 *   npm run test:teste-gratis                        (usa http://localhost:3000)
 *   BASE_URL=http://localhost:3005 npm run test:teste-gratis
 *
 * Nenhum lead real é criado: a chamada a `/api/teste-gratis` é interceptada e
 * respondida pelo próprio teste. Qualquer POST que escape da interceptação
 * reprova a execução.
 *
 * Rode contra o build de produção (`npx next start -p 3005`). O servidor de
 * desenvolvimento recompila na primeira visita e derruba a medição. */

import { chromium, devices } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const ALVO_MINIMO = 44;

const VIEWPORTS = [
  { nome: "celular 320x568", width: 320, height: 568, mobile: true },
  { nome: "celular 375x667", width: 375, height: 667, mobile: true },
  { nome: "celular 390x844", width: 390, height: 844, mobile: true },
  { nome: "celular 430x932", width: 430, height: 932, mobile: true },
  { nome: "tablet 768x1024", width: 768, height: 1024, mobile: true },
  { nome: "tablet 1024x1366", width: 1024, height: 1366, mobile: true },
  { nome: "notebook 1280x720", width: 1280, height: 720 },
  { nome: "notebook 1440x900", width: 1440, height: 900 },
  { nome: "desktop 1920x1080", width: 1920, height: 1080 },
  { nome: "zoom 200% (640x360)", width: 640, height: 360 },
];

/* Roda no navegador. Mesmos critérios do teste do quiz: nada de rolagem
   lateral, nada essencial fora da viewport, alvo de toque >= 44px. */
function medir(alvoMinimo) {
  const problemas = [];
  const doc = document.documentElement;

  if (doc.scrollWidth > doc.clientWidth) {
    problemas.push(`overflow horizontal: ${doc.scrollWidth}px > ${doc.clientWidth}px`);
  }

  const essenciais = [
    ["h1", document.querySelector("h1")],
    ["formulário", document.querySelector("form")],
    ["botão de envio", document.querySelector('button[type="submit"]')],
  ];

  for (const [nome, el] of essenciais) {
    if (!el) {
      problemas.push(`${nome} não encontrado`);
      continue;
    }
    const r = el.getBoundingClientRect();
    if (r.width <= 0) problemas.push(`${nome} com largura zero`);
    if (r.left < -1) problemas.push(`${nome} escapa à esquerda (${Math.round(r.left)})`);
    if (r.right > doc.clientWidth + 1) {
      problemas.push(`${nome} escapa à direita (${Math.round(r.right)})`);
    }
  }

  /* Controles do formulário, não links dentro de texto corrido: a WCAG 2.5.8
     dispensa do alvo mínimo o link que está no meio de uma frase, e o campo
     isca fica fora da tela e fora da tabulação. */
  for (const alvo of document.querySelectorAll(
    'form button, form select, form input:not([type="checkbox"]):not([tabindex="-1"])'
  )) {
    const r = alvo.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (r.height < alvoMinimo) {
      const rotulo = (alvo.textContent || alvo.name || alvo.tagName).trim().slice(0, 34);
      problemas.push(`alvo pequeno (${Math.round(r.height)}px): "${rotulo}"`);
    }
  }

  return problemas;
}

const falhas = [];
const registrar = (contexto, itens) => {
  for (const item of itens) falhas.push(`[${contexto}] ${item}`);
};

const browser = await chromium.launch();

/* ─── 1. Os CTAs comerciais levam ao funil ───────────── */

const CTAS = [
  { pagina: "/", rotulo: /^Teste grátis$/, onde: "home / header" },
  { pagina: "/", rotulo: /Quero testar grátis/, onde: "home / hero" },
  { pagina: "/", rotulo: /Quero o CRM Kanban/, onde: "home / CRM Kanban" },
  { pagina: "/", rotulo: /Começar com o Pro/, onde: "home / plano Pro" },
  { pagina: "/planos", rotulo: /^Teste grátis$/, onde: "planos / header" },
  { pagina: "/planos", rotulo: /Começar com o Pro/, onde: "planos / plano Pro" },
  { pagina: "/planos", rotulo: /Quero testar grátis/, onde: "planos / CTA final" },
  { pagina: "/assistente-ia", rotulo: /Quero meu assistente/, onde: "assistente-ia / hero" },
  { pagina: "/assistente-ia", rotulo: /Quero testar grátis/, onde: "assistente-ia / CTA final" },
  { pagina: "/api-oficial", rotulo: /Quero implementar com a CompanyChat/, onde: "api-oficial / calculadora" },
  { pagina: "/api-oficial", rotulo: /Quero testar grátis/, onde: "api-oficial / CTA final" },
  { pagina: "/disparos", rotulo: /Quero disparar em massa/, onde: "disparos / hero" },
  { pagina: "/disparos", rotulo: /Quero testar grátis/, onde: "disparos / CTA final" },
];

/* O caminho humano e os canais com contexto não podem ter sido arrastados para
   o funil: a IA precisa ter para onde transferir, e a mensagem por segmento
   qualifica melhor que o formulário. */
const FORA_DO_FUNIL = [
  { pagina: "/", rotulo: /Chamar no WhatsApp/, onde: "home / contato, falar agora" },
  { pagina: "/", rotulo: /Não achei meu segmento/, onde: "home / nichos" },
  { pagina: "/company-ai", rotulo: /Falar sobre o meu projeto/, onde: "company-ai / CTA final" },
];

const contextoDesktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });

for (const cta of CTAS) {
  const pagina = await contextoDesktop.newPage();
  await pagina.goto(`${BASE}${cta.pagina}`, { waitUntil: "domcontentloaded" });

  const botao = pagina.getByRole("link", { name: cta.rotulo }).first();
  const destino = await botao.getAttribute("href").catch(() => null);

  if (!destino) {
    falhas.push(`[${cta.onde}] CTA não encontrado`);
  } else if (!destino.startsWith("/teste-gratis")) {
    falhas.push(`[${cta.onde}] CTA aponta para ${destino}`);
  }

  await pagina.close();
  process.stdout.write(".");
}

for (const cta of FORA_DO_FUNIL) {
  const pagina = await contextoDesktop.newPage();
  await pagina.goto(`${BASE}${cta.pagina}`, { waitUntil: "domcontentloaded" });

  const destino = await pagina
    .getByRole("link", { name: cta.rotulo })
    .first()
    .getAttribute("href")
    .catch(() => null);

  if (!destino?.includes("wa.me")) {
    falhas.push(`[${cta.onde}] deveria continuar no WhatsApp, mas aponta para ${destino}`);
  }

  await pagina.close();
  process.stdout.write(".");
}

/* O botão de suporte e o de login não podem ter sido arrastados para o funil. */
{
  const pagina = await contextoDesktop.newPage();
  await pagina.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });

  const login = await pagina
    .getByRole("link", { name: /Fazer Login/ })
    .first()
    .getAttribute("href");
  if (!login || login.includes("teste-gratis")) {
    falhas.push(`[home / login] destino inesperado: ${login}`);
  }

  const suporte = await pagina
    .getByRole("link", { name: /suporte pelo WhatsApp/i })
    .first()
    .getAttribute("href");
  if (!suporte?.includes("wa.me")) {
    falhas.push(`[home / suporte] destino inesperado: ${suporte}`);
  }

  await pagina.close();
  process.stdout.write(".");
}

await contextoDesktop.close();

/* ─── 2. O clique do CTA da home chega ao Pixel do funil ─
   A home não carrega o Pixel de propósito (ver src/lib/analytics.ts). O evento
   fica na sessão e é entregue ao chegar em /teste-gratis.

   Ressalva desde 2026-08-25: medição só existe nos domínios de produção. Este
   teste roda em localhost, então o esperado aqui é o **silêncio** — nem Pixel,
   nem fila, nem requisição para a Meta. A entrega da fila continua coberta em
   `tests/unidade/analytics.test.mjs`, que simula o host de produção. */
{
  const contexto = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pagina = await contexto.newPage();

  // A biblioteca da Meta não é baixada no teste; o trecho embutido pelo
  // MetaPixel já define o `fbq`, que enfileira as chamadas em `fbq.queue`.
  await pagina.route("**/connect.facebook.net/**", (rota) => rota.abort());
  await pagina.route("**/facebook.com/tr**", (rota) => rota.abort());

  await pagina.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });

  const naHome = await pagina.evaluate(() => typeof window.fbq === "function");
  if (naHome) {
    falhas.push("[analytics] a home passou a carregar o Pixel, o que amplia o rastreamento");
  }

  await pagina.getByRole("link", { name: /^Teste grátis$/ }).first().click();
  await pagina.waitForURL(/\/teste-gratis/);

  const guardadoNoClique = await pagina.evaluate(() => {
    const bruto = window.sessionStorage.getItem("cc_eventos_pendentes");
    return bruto ? JSON.parse(bruto) : null;
  });

  const temPixelNoFunil = await pagina.evaluate(() => typeof window.fbq === "function");

  const ehProducao = await pagina.evaluate(() =>
    ["companychatia.com.br", "www.companychatia.com.br"].includes(location.hostname)
  );

  if (temPixelNoFunil) {
    // Com Pixel: a fila é descarregada e o evento aparece na fila do fbq.
    await pagina
      .waitForFunction(
        () =>
          (window.fbq?.queue ?? []).some(
            (c) => c[0] === "trackCustom" && c[1] === "free_trial_cta_clicked"
          ),
        undefined,
        { timeout: 12_000 }
      )
      .catch(() => {
        falhas.push("[analytics] o clique guardado não chegou ao Pixel em /teste-gratis");
      });

    const sobrou = await pagina.evaluate(() =>
      window.sessionStorage.getItem("cc_eventos_pendentes")
    );
    if (sobrou) falhas.push("[analytics] a fila não foi esvaziada após a entrega");
  } else if (ehProducao) {
    // Produção sem Pixel no build: o evento não pode simplesmente sumir.
    if (!guardadoNoClique?.some((e) => e.nome === "free_trial_cta_clicked")) {
      falhas.push("[analytics] sem Pixel no build, o clique do CTA não ficou guardado");
    }
  } else {
    // Fora de produção: nada pode ser guardado, porque guardar vira entrega
    // assim que a mesma sessão abrir uma página com Pixel.
    if (guardadoNoClique) {
      falhas.push(
        `[analytics] evento enfileirado fora de produção: ${JSON.stringify(guardadoNoClique)}`
      );
    }
    if (temPixelNoFunil) {
      falhas.push("[analytics] o Pixel foi carregado fora dos domínios de produção");
    }
  }

  await contexto.close();
  process.stdout.write(".");
}

/* ─── 3. Formulário: validação, consentimento e envio ── */
{
  const contexto = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pagina = await contexto.newPage();

  let chamadasApi = 0;
  await pagina.route("**/api/teste-gratis", async (rota) => {
    chamadasApi += 1;
    await rota.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, duplicado: false, agendado: true }),
    });
  });

  await pagina.goto(`${BASE}/teste-gratis`, { waitUntil: "domcontentloaded" });

  // Envio vazio: erros na tela e nenhuma requisição.
  await pagina.getByRole("button", { name: /Quero testar grátis/ }).click();
  await pagina.waitForTimeout(200);

  if ((await pagina.getByRole("alert").count()) === 0) {
    falhas.push("[formulário] envio vazio não mostrou erro");
  }
  if (chamadasApi !== 0) {
    falhas.push(`[formulário] envio vazio chamou a API ${chamadasApi} vez(es)`);
  }

  // Tudo preenchido, menos o consentimento: continua sem enviar.
  await pagina.fill("#tg-nome", "Ana Souza");
  await pagina.fill("#tg-email", "ana@suaempresa.com.br");
  await pagina.fill("#tg-whatsapp", "62993054630");
  await pagina.selectOption("#tg-segmento", { index: 1 });
  await pagina.getByRole("button", { name: /Quero testar grátis/ }).click();
  await pagina.waitForTimeout(200);

  if (chamadasApi !== 0) {
    falhas.push("[formulário] enviou sem consentimento marcado");
  }
  if (await pagina.isChecked("#tg-consentimentoWhatsapp")) {
    falhas.push("[formulário] consentimento começou marcado");
  }

  // Campo condicional de segmento.
  await pagina.selectOption("#tg-segmento", "Outro");
  if ((await pagina.locator("#tg-outroSegmento").count()) !== 1) {
    falhas.push("[formulário] campo de outro segmento não apareceu");
  }
  await pagina.selectOption("#tg-segmento", { index: 1 });

  // Com consentimento: envia uma vez só, mesmo com duplo clique.
  await pagina.check("#tg-consentimentoWhatsapp");
  const botao = pagina.getByRole("button", { name: /Quero testar grátis/ });
  await botao.click();
  await botao.click({ force: true }).catch(() => {});
  await pagina.getByText(/Solicitação recebida/).waitFor({ timeout: 5000 });

  if (chamadasApi !== 1) {
    falhas.push(`[formulário] duplo clique gerou ${chamadasApi} envio(s)`);
  }

  await contexto.close();
  process.stdout.write(".");
}

/* ─── 4. Responsividade da página ────────────────────── */

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

  await pagina.goto(`${BASE}/teste-gratis`, { waitUntil: "networkidle" });
  registrar(vp.nome, await pagina.evaluate(medir, ALVO_MINIMO));

  // O card cresce mais com as mensagens de erro à mostra.
  await pagina.getByRole("button", { name: /Quero testar grátis/ }).click();
  await pagina.waitForTimeout(200);
  registrar(`${vp.nome} com erros`, await pagina.evaluate(medir, ALVO_MINIMO));

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
console.log(
  `OK — ${CTAS.length} CTAs no funil, ${FORA_DO_FUNIL.length} canais preservados, evento de clique entregue, formulário validado e ${VIEWPORTS.length} viewports limpos.`
);
