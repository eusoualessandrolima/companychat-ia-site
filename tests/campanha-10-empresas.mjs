/* Verificação da campanha "10 Empresas, 10 Assistentes de IA" (`/10-empresas`)
 * no navegador: metadados, CTAs, validação e envio do formulário, o que sai na
 * integração, responsividade e ausência de erro no console.
 *
 *   npm run test:campanha10                        (usa http://localhost:3000)
 *   BASE_URL=http://localhost:3005 npm run test:campanha10
 *
 * Nenhum lead real é criado: a chamada a `/api/lead` é interceptada e
 * respondida pelo próprio teste, que confere o corpo do envio. As quatro LPs
 * existentes são abertas no fim para garantir que nada nelas foi afetado.
 *
 * Rode contra o build de produção (`npx next start -p 3005`). O servidor de
 * desenvolvimento recompila na primeira visita e derruba a medição. */

import { chromium, devices } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const ROTA = "/10-empresas?utm_source=meta&utm_campaign=selecao10&utm_medium=cpc";

/* Rodar esta suíte contra o site publicado é legítimo (auditoria pós-deploy),
   mas lá o Pixel é carregado de verdade — e um `Lead` de teste vira conversão
   falsa na conta de anúncios. Já aconteceu uma vez.

   Em produção, então, o `fbq` é substituído por um stub que registra e não
   transmite, e a expectativa se inverte: o que se verifica é que o Pixel FOI
   injetado (o gate de domínio deixou passar), não que ele sumiu. */
const EM_PRODUCAO = /companychatia\.com\.br/.test(BASE);

const STUB_DO_PIXEL = `(() => {
  Object.defineProperty(window, 'fbq', {
    configurable: true,
    set() {},
    get() { const s = () => {}; s.queue = []; s.loaded = true; s.version = '2.0'; s.callMethod = s; return s; },
  });
})();`;

let falhas = 0;
function relatar(ok, texto) {
  console.log(`${ok ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m"} ${texto}`);
  if (!ok) falhas++;
}

/** Abre a página com o console vigiado e a API de leads interceptada. */
async function abrir(navegador, opcoes, rota = ROTA) {
  const contexto = await navegador.newContext(opcoes);
  if (EM_PRODUCAO) await contexto.addInitScript(STUB_DO_PIXEL);
  const pagina = await contexto.newPage();
  const erros = [];
  const envios = [];
  const paraAMeta = [];

  pagina.on("console", (m) => m.type() === "error" && erros.push(m.text()));
  pagina.on("pageerror", (e) => erros.push(String(e)));

  /* O teste roda em localhost, que não é domínio de produção: nem o script do
     Pixel nem um único evento podem sair daqui para a Meta. */
  pagina.on("request", (r) => {
    if (/facebook\.(net|com)|fbcdn/.test(r.url())) paraAMeta.push(r.url().slice(0, 60));
  });

  await pagina.route("**/api/lead", async (rota_) => {
    const corpo = rota_.request().postData();
    if (corpo) envios.push(JSON.parse(corpo));
    await rota_.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, gravado: true, entregue: true }),
    });
  });

  await pagina.goto(`${BASE}${rota}`, { waitUntil: "networkidle" });
  return { contexto, pagina, erros, envios, paraAMeta };
}

function rolagemLateral(pagina) {
  return pagina.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
}

const navegador = await chromium.launch();

/* ─── Desktop: metadados, estrutura e acessibilidade ─── */
{
  const { contexto, pagina, erros, paraAMeta } = await abrir(navegador, {
    viewport: { width: 1440, height: 900 },
  });

  const titulo = await pagina.title();
  relatar(titulo.startsWith("10 empresas receberão"), `title: ${titulo}`);

  const og = await pagina.getAttribute('meta[property="og:title"]', "content");
  relatar(og === "10 Empresas, 10 Assistentes de IA", `og:title: ${og}`);

  const ogImagem = await pagina.getAttribute('meta[property="og:image"]', "content");
  relatar(Boolean(ogImagem), `og:image padrão do site: ${ogImagem}`);

  const canonico = await pagina.getAttribute('link[rel="canonical"]', "href");
  relatar(canonico?.endsWith("/10-empresas"), `canonical: ${canonico}`);

  const robots = await pagina.getAttribute('meta[name="robots"]', "content");
  relatar(robots?.includes("noindex"), `campanha temporária em noindex: ${robots}`);

  // Sitemap listando URL bloqueada é contradição: a rota tem de ficar fora.
  const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
  relatar(!sitemap.includes("/10-empresas"), "fora do sitemap.xml");
  relatar(sitemap.includes("/teste-gratis"), "o resto do sitemap segue intacto");

  /* Fora dos domínios de produção o `MetaPixel` não injeta nada: nem script,
     nem preconnect. Em produção o Pixel é o global do site — a campanha é
     separada pelos eventos `campanha10_*`, sem um segundo Pixel só dela. */
  const pixels = await pagina.evaluate(() => [
    ...new Set(
      [...document.querySelectorAll("script")]
        .map((s) => s.textContent ?? "")
        .map((t) => t.match(/fbq\('init','([^']+)'\)/)?.[1])
        .filter(Boolean)
    ),
  ]);
  if (EM_PRODUCAO) {
    relatar(
      pixels.length === 1,
      `Pixel do site injetado, como esperado em produção (${pixels.join(", ") || "nenhum"})`
    );
  } else {
    relatar(pixels.length === 0, `nenhum Pixel injetado fora de produção (${pixels.join(", ") || "nenhum"})`);
    const fbqExiste = await pagina.evaluate(() => typeof window.fbq);
    relatar(fbqExiste === "undefined", `\`fbq\` nem existe nesta página (${fbqExiste})`);
  }

  relatar((await pagina.locator("h1").count()) === 1, "um único h1");
  relatar((await pagina.locator("nav").count()) === 0, "sem menu de navegação");

  const ctas = await pagina.locator('a[href="#candidatura"]').count();
  relatar(ctas >= 4, `${ctas} CTAs levam ao formulário`);

  const politica = await pagina.locator('a[href="/privacidade"]').count();
  relatar(politica >= 2, `Política de Privacidade vinculada (${politica} links)`);

  const semRotulo = await pagina.evaluate(() =>
    [...document.querySelectorAll("form input, form select, form textarea")]
      .filter((campo) => campo.type !== "hidden")
      .filter((campo) => !document.querySelector(`label[for="${campo.id}"]`))
      .map((campo) => campo.id || campo.name)
  );
  relatar(semRotulo.length === 0, `todos os campos com label${semRotulo.length ? `: falta em ${semRotulo}` : ""}`);

  relatar((await rolagemLateral(pagina)) <= 0, "sem rolagem lateral no desktop");
  relatar(erros.length === 0, `console limpo no desktop${erros.length ? `: ${erros.join(" | ")}` : ""}`);
  relatar(
    EM_PRODUCAO ? true : paraAMeta.length === 0,
    EM_PRODUCAO
      ? "medição ativa em produção; o Pixel está neutralizado por stub nesta auditoria"
      : `nenhuma requisição para a Meta no carregamento (${paraAMeta.join(", ") || "zero"})`
  );

  await contexto.close();
}

/* ─── Celular: validação, envio e integração ─────────── */
{
  const { contexto, pagina, erros, envios, paraAMeta } = await abrir(
    navegador,
    devices["iPhone 13"]
  );

  relatar((await rolagemLateral(pagina)) <= 0, "sem rolagem lateral no celular");

  await pagina.locator('a[href="#candidatura"]').first().click();
  await pagina.waitForTimeout(900);
  relatar(await pagina.locator("#candidatura form").isVisible(), "o CTA leva ao formulário");

  await pagina.locator('button[type="submit"]').click();
  await pagina.waitForTimeout(400);
  relatar(
    (await pagina.locator('[role="alert"]').count()) >= 5,
    "o envio vazio mostra o erro em cada campo"
  );
  relatar(envios.length === 0, "formulário inválido não chama a API");

  await pagina.fill("#c10-telefone", "62999998888");
  const telefone = await pagina.inputValue("#c10-telefone");
  relatar(telefone === "(62) 99999-8888", `máscara de telefone: ${telefone}`);

  await pagina.fill("#c10-email", "ana@empresa");
  await pagina.locator('button[type="submit"]').click();
  await pagina.waitForTimeout(300);
  relatar(
    (await pagina.locator("#erro-c10-email").count()) === 1,
    "e-mail sem domínio completo é recusado"
  );

  await pagina.fill("#c10-nome", "Ana Souza");
  await pagina.fill("#c10-empresa", "Empresa Modelo");
  await pagina.fill("#c10-email", "ana@empresamodelo.com.br");
  await pagina.selectOption("#c10-segmento", "E-commerce");
  await pagina.fill("#c10-cidade", "Goiânia, GO");
  await pagina.selectOption("#c10-volume", "De 201 a 500");
  await pagina.fill("#c10-problema", "Demoramos horas para responder e perdemos orçamento.");
  await pagina.selectOption("#c10-objetivo", "Qualificar leads");
  await pagina.fill("#c10-motivo", "Temos volume real e queremos testar a IA na operação.");
  await pagina.check("#c10-consentimento");
  await pagina.locator('button[type="submit"]').click();

  await pagina.waitForSelector("text=Candidatura recebida!", { timeout: 10_000 });
  relatar(true, "a confirmação aparece sem recarregar a página");

  const envio = envios.at(-1) ?? {};
  const origem = envio.origem ?? {};
  relatar(envios.length === 1, `um único envio à API (${envios.length})`);
  relatar(envio.nome === "Ana Souza" && envio.empresa === "Empresa Modelo", "nome e empresa");
  relatar(envio.telefone === "(62) 99999-8888", `telefone: ${envio.telefone}`);
  relatar(envio.volume === "De 201 a 500", `volume: ${envio.volume}`);
  relatar(String(envio.dor).includes("Demoramos horas"), "problema do atendimento em `dor`");
  relatar(envio.concluido === true && envio.etapa === 1, "marcado como concluído");
  relatar(origem.origem === "lp-10-empresas", `origem: ${origem.origem}`);
  relatar(origem.campanha === "10-empresas-10-assistentes", `campanha: ${origem.campanha}`);
  relatar(origem.tipo === "candidatura", `tipo: ${origem.tipo}`);
  relatar(
    origem.utm_source === "meta" &&
      origem.utm_campaign === "selecao10" &&
      origem.utm_medium === "cpc",
    "UTMs capturadas"
  );
  relatar(origem.pagina === "/10-empresas", `página de origem: ${origem.pagina}`);
  relatar(Boolean(origem.enviado_em), `data e hora da candidatura: ${origem.enviado_em}`);
  relatar(
    Boolean(origem.email && origem.cidade && origem.objetivo && origem.motivo),
    "e-mail, cidade, objetivo e motivo preservados"
  );

  const zap = await pagina.locator('a[href^="https://wa.me/"]').first().getAttribute("href");
  relatar(zap?.includes("wa.me/556493054630"), "botão do WhatsApp usa o número configurado");

  relatar(erros.length === 0, `console limpo no celular${erros.length ? `: ${erros.join(" | ")}` : ""}`);

  /* A verificação que interessa depois do envio: nem o `Lead` escapou. */
  relatar(
    EM_PRODUCAO ? true : paraAMeta.length === 0,
    EM_PRODUCAO
      ? "envio auditado com o Pixel neutralizado: nenhum `Lead` de teste na conta"
      : `nenhuma requisição para a Meta em todo o fluxo, incluindo o envio (${paraAMeta.join(", ") || "zero"})`
  );

  await contexto.close();
}

/* ─── Lead que não chegou a lugar nenhum ─────────────── */
{
  const contexto = await navegador.newContext(devices["iPhone 13"]);
  const pagina = await contexto.newPage();

  // Banco fora e sem webhook: a API responde `ok`, mas `entregue: false`.
  await pagina.route("**/api/lead", (r) =>
    r.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, gravado: false, entregue: false }),
    })
  );

  await pagina.goto(`${BASE}${ROTA}`, { waitUntil: "networkidle" });
  await pagina.locator("#candidatura").scrollIntoViewIfNeeded();
  await pagina.fill("#c10-nome", "Ana Souza");
  await pagina.fill("#c10-empresa", "Empresa Modelo");
  await pagina.fill("#c10-telefone", "62999998888");
  await pagina.fill("#c10-email", "ana@empresamodelo.com.br");
  await pagina.selectOption("#c10-segmento", "E-commerce");
  await pagina.fill("#c10-cidade", "Goiânia, GO");
  await pagina.selectOption("#c10-volume", "De 201 a 500");
  await pagina.fill("#c10-problema", "Demoramos horas para responder e perdemos orçamento.");
  await pagina.selectOption("#c10-objetivo", "Qualificar leads");
  await pagina.fill("#c10-motivo", "Temos volume real e queremos testar a IA.");
  await pagina.check("#c10-consentimento");
  await pagina.locator('button[type="submit"]').click();
  await pagina.waitForTimeout(1200);

  const sucessoNaTela = await pagina.locator("text=Candidatura recebida!").count();
  const avisoDeErro = await pagina.locator('[role="alert"]').count();
  const nomePreservado = await pagina.inputValue("#c10-nome");

  relatar(
    sucessoNaTela === 0 && avisoDeErro > 0 && nomePreservado === "Ana Souza",
    "lead não entregue: mostra erro em vez de sucesso e preserva o que foi digitado"
  );

  await contexto.close();
}

/* ─── Larguras: rolagem lateral e alvo de toque ──────── */

/* Mesmo critério de `tests/teste-gratis.mjs`: controles do formulário, não
   links dentro de texto corrido — a WCAG 2.5.8 dispensa o link no meio de uma
   frase, e o checkbox tem o label inteiro como área de toque. */
function alvosPequenos() {
  return [
    ...document.querySelectorAll(
      'form button, form select, form textarea, form input:not([type="checkbox"])'
    ),
  ]
    .map((el) => ({ el, r: el.getBoundingClientRect() }))
    .filter(({ r }) => (r.width || r.height) && r.height < 44)
    .map(({ el, r }) => `${(el.name || el.tagName).slice(0, 20)}=${Math.round(r.height)}px`);
}

for (const largura of [320, 375, 768, 1024, 1440]) {
  const { contexto, pagina } = await abrir(navegador, {
    viewport: { width: largura, height: 800 },
    isMobile: largura < 1024,
    hasTouch: largura < 1024,
  });

  const lateral = await rolagemLateral(pagina);
  const pequenos = await pagina.evaluate(alvosPequenos);

  // Com as mensagens de erro à mostra o formulário cresce: medir de novo.
  await pagina.locator("#candidatura").scrollIntoViewIfNeeded();
  await pagina.locator('button[type="submit"]').click();
  await pagina.waitForTimeout(300);
  const lateralComErro = await rolagemLateral(pagina);

  relatar(
    lateral <= 0 && lateralComErro <= 0 && pequenos.length === 0,
    `${largura}px: rolagem lateral ${lateral}/${lateralComErro}px, alvos pequenos ${pequenos.join(", ") || "nenhum"}`
  );
  await contexto.close();
}

/* ─── As LPs existentes continuam de pé ──────────────── */
for (const rota of ["/lp-empresas", "/lp-saude", "/lp-adv", "/lp-seguros"]) {
  const contexto = await navegador.newContext({ viewport: { width: 1280, height: 800 } });
  const pagina = await contexto.newPage();
  const erros = [];
  pagina.on("pageerror", (e) => erros.push(String(e)));
  const resposta = await pagina.goto(`${BASE}${rota}`, { waitUntil: "networkidle" });
  const formularios = await pagina.locator("#oferta form").count();
  relatar(
    resposta.status() === 200 && formularios === 1 && erros.length === 0,
    `${rota} intacta (status ${resposta.status()}, formulário ${formularios})`
  );
  await contexto.close();
}

await navegador.close();

console.log(
  falhas === 0
    ? "\n\x1b[32mTudo certo.\x1b[0m\n"
    : `\n\x1b[31m${falhas} verificação(ões) falharam.\x1b[0m\n`
);
process.exit(falhas === 0 ? 0 : 1);
