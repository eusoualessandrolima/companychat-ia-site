/* Auditoria pós-deploy do funil em MODO SOMENTE CAPTAÇÃO.
 *
 *   BASE_URL=https://... DATABASE_URL="postgresql://..." \
 *     node tests/auditoria-pos-deploy.mjs
 *
 * Opcional, para conferir também o worker:
 *   TESTE_GRATIS_WORKER_TOKEN=... (lido do ambiente, nunca impresso)
 *
 * **Somente leitura.** Não cria lead, não apaga nada, não dispara mensagem.
 * Por isso pode rodar contra produção: o único efeito colateral possível é uma
 * chamada ao worker, que com a chave desligada não toca na fila.
 *
 * O que ela responde, em uma passada:
 *   - a página publicada promete o que o sistema realmente faz?
 *   - os CTAs comerciais levam ao funil?
 *   - o lead que você enviou à mão foi gravado inteiro?
 *   - nenhum job de WhatsApp nasceu e nenhuma mensagem foi tentada?
 *
 * Rode depois de enviar um lead de teste pelo formulário publicado. */

import { createRequire } from "node:module";

const BASE = process.env.BASE_URL;
const URL_BANCO = process.env.DATABASE_URL;
const TOKEN_WORKER = process.env.TESTE_GRATIS_WORKER_TOKEN;

if (!BASE || !URL_BANCO) {
  console.error("Defina BASE_URL e DATABASE_URL. Veja o cabeçalho deste arquivo.");
  process.exit(1);
}

const require_ = createRequire(import.meta.url);
const { Pool } = require_("pg");

const pool = new Pool({
  connectionString: URL_BANCO,
  ssl: URL_BANCO.includes("sslmode=disable") ? false : { rejectUnauthorized: false },
});

const verde = (t) => `\x1b[32m${t}\x1b[0m`;
const vermelho = (t) => `\x1b[31m${t}\x1b[0m`;
const amarelo = (t) => `\x1b[33m${t}\x1b[0m`;

const resultados = [];
function checar(item, condicao, detalhe = "") {
  resultados.push({ item, ok: Boolean(condicao) });
  console.log(
    `${condicao ? verde("✓") : vermelho("✗")} ${item}${detalhe ? ` — ${detalhe}` : ""}`
  );
}

/** Nada de dado pessoal na saída desta auditoria: ela costuma virar print.
 *
 *  `visiveis = 0` precisa de tratamento próprio: `slice(-0)` é `slice(0)` e
 *  devolveria a string inteira. Foi assim que a primeira versão imprimiu o
 *  nome completo do lead de teste. */
function mascarar(valor, visiveis = 4) {
  if (!valor) return "(vazio)";
  const texto = String(valor);
  if (visiveis <= 0 || texto.length <= visiveis) return "*".repeat(texto.length);
  return `${"*".repeat(texto.length - visiveis)}${texto.slice(-visiveis)}`;
}

/* Promessas de prazo que a página não pode fazer enquanto o envio automático
   está desligado: quem cadastrar não recebe mensagem em minutos, e sim o
   contato de uma pessoa. */
const PROMESSAS_PROIBIDAS = [
  "alguns minutos",
  "em minutos",
  "imediatamente",
  "na hora",
  "em breve",
];

let saida = 0;

try {
  console.log(`\nSite:  ${BASE}`);
  console.log(`Banco: ${URL_BANCO.replace(/:\/\/([^:]+):[^@]+@/, "://$1:****@")}\n`);

  /* ─── 1. A página publicada ────────────────────────── */
  const pagina = await fetch(`${BASE}/teste-gratis`, { redirect: "follow" });
  const html = await pagina.text();
  checar("página /teste-gratis responde 200", pagina.status === 200, String(pagina.status));

  const encontradas = PROMESSAS_PROIBIDAS.filter((p) => html.toLowerCase().includes(p));
  checar(
    "a página não promete prazo de contato",
    encontradas.length === 0,
    encontradas.length ? `encontrado: ${encontradas.join(", ")}` : "modo captação"
  );

  checar(
    "a página deixa claro que não libera conta automaticamente",
    html.includes("não cria nem libera uma conta automaticamente")
  );
  checar("o formulário está na página", html.includes('name="consentimentoWhatsapp"'));
  checar(
    "o texto de consentimento está publicado",
    html.includes("Concordo em receber pelo WhatsApp")
  );

  /* ─── 2. Os CTAs comerciais ────────────────────────── */
  const home = await fetch(BASE, { redirect: "follow" });
  const htmlHome = await home.text();
  checar("home responde 200", home.status === 200, String(home.status));
  checar(
    "o CTA do cabeçalho aponta para o funil",
    /href="\/teste-gratis(\?|")/.test(htmlHome)
  );
  checar(
    "o caminho humano continua no ar",
    htmlHome.includes("wa.me/"),
    "botão flutuante e link de suporte"
  );

  /* ─── 3. Worker: existe, protegido e sem enviar ────── */
  const semToken = await fetch(`${BASE}/api/teste-gratis/worker`, { method: "POST" });
  checar(
    "worker recusa chamada sem token",
    semToken.status === 401 || semToken.status === 503,
    String(semToken.status)
  );

  if (TOKEN_WORKER) {
    const comToken = await fetch(`${BASE}/api/teste-gratis/worker`, {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN_WORKER}` },
    });
    const corpo = await comToken.json().catch(() => ({}));
    checar(
      "worker responde com o envio desligado",
      comToken.status === 200 && corpo.envioDesligado === true,
      JSON.stringify(corpo)
    );
  } else {
    console.log(
      amarelo("•") +
        " worker autenticado não verificado (TESTE_GRATIS_WORKER_TOKEN ausente)"
    );
  }

  /* ─── 4. Nenhum job, nenhuma tentativa de envio ────── */
  const { rows: jobs } = await pool.query(
    "select count(*)::int as n from teste_gratis_jobs"
  );
  checar("nenhum job de WhatsApp criado", jobs[0].n === 0, `${jobs[0].n} job(s)`);

  const { rows: eventos } = await pool.query(
    `select evento, count(*)::int as n from teste_gratis_eventos
      group by evento order by evento`
  );
  const porEvento = Object.fromEntries(eventos.map((e) => [e.evento, e.n]));

  for (const proibido of [
    "whatsapp_followup_scheduled",
    "whatsapp_message_sent",
    "whatsapp_message_delivered",
    "whatsapp_message_read",
    "free_trial_whatsapp_send_error",
  ]) {
    checar(
      `nenhum evento ${proibido}`,
      (porEvento[proibido] ?? 0) === 0,
      String(porEvento[proibido] ?? 0)
    );
  }

  checar(
    "a captação registra que o envio está desligado",
    (porEvento.free_trial_captacao_sem_envio ?? 0) > 0,
    `${porEvento.free_trial_captacao_sem_envio ?? 0} lead(s)`
  );

  /* ─── 5. O lead enviado à mão ──────────────────────── */
  const { rows: leads } = await pool.query(
    `select * from teste_gratis_leads order by criado_em desc limit 1`
  );

  if (leads.length === 0) {
    console.log(
      `\n${amarelo("•")} Nenhum lead ainda. Envie um pelo formulário publicado e rode de novo.`
    );
  } else {
    const lead = leads[0];
    const idade = Math.round((Date.now() - new Date(lead.criado_em)) / 60000);

    console.log(
      `\n  último lead: ${mascarar(lead.nome, 0)} · ${mascarar(lead.email, 6)} · ` +
        `${mascarar(lead.whatsapp_e164)} · ${lead.segmento} · há ${idade} min\n`
    );

    checar("lead gravado com status recebido", lead.status === "recebido", lead.status);
    checar("nenhum follow-up agendado para ele", lead.follow_up_em === null);
    checar("nenhuma mensagem associada", lead.whatsapp_message_id === null);
    checar("consentimento gravado com data", lead.consentimento_whatsapp === true && Boolean(lead.consentimento_em));
    checar("versão do consentimento gravada", Boolean(lead.consentimento_versao), lead.consentimento_versao ?? "");
    checar("segmento preenchido", Boolean(lead.segmento));
    checar(
      "atribuição capturada",
      Object.keys(lead.origem ?? {}).length > 0,
      Object.keys(lead.origem ?? {}).join(", ") || "nenhuma"
    );

    const { rows: jobsDoLead } = await pool.query(
      "select count(*)::int as n from teste_gratis_jobs where lead_id = $1",
      [lead.id]
    );
    checar("o lead não gerou job", jobsDoLead[0].n === 0);
  }

  console.log(`\n  trilha de eventos: ${JSON.stringify(porEvento)}`);
} catch (erro) {
  console.error(vermelho(`\nErro na auditoria: ${erro.message}`));
  saida = 1;
} finally {
  await pool.end();

  const falhas = resultados.filter((r) => !r.ok);
  console.log(
    `\n${resultados.length - falhas.length}/${resultados.length} verificações passaram.`
  );
  if (falhas.length) {
    console.error(vermelho(`\n${falhas.length} falha(s):`));
    for (const f of falhas) console.error(`  - ${f.item}`);
    saida = 1;
  }
  process.exit(saida);
}
