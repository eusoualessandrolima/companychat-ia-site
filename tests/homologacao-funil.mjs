/* Homologação ponta a ponta do funil de teste grátis, com provedor simulado.
 *
 * Percorre o roteiro de 16 passos de `docs/ativacao-teste-gratis.md` sem
 * depender da Meta: o script sobe um servidor local que faz o papel do
 * provedor de envio e do endpoint da IA, e assina os eventos de webhook do
 * mesmo jeito que a Meta assina.
 *
 * O que ele NÃO substitui: a aprovação do template no WhatsApp Manager e a
 * entrega real no aparelho. Esses dois só o ambiente de homologação com número
 * autorizado prova, e estão marcados no relatório final.
 *
 * ─── Como rodar ───
 *
 * 1. Suba o site apontando para o banco de homologação e para este script:
 *
 *      DATABASE_URL="postgresql://..."            \
 *      WHATSAPP_PROVIDER=webhook                  \
 *      WHATSAPP_ENVIO_WEBHOOK_URL=http://127.0.0.1:4599/enviar \
 *      IA_HANDOFF_URL=http://127.0.0.1:4599/ia    \
 *      WHATSAPP_APP_SECRET=...                    \
 *      WHATSAPP_WEBHOOK_VERIFY_TOKEN=...          \
 *      TESTE_GRATIS_WORKER_TOKEN=...              \
 *      npx next start -p 3050
 *
 * 2. Com as mesmas variáveis no ambiente, rode:
 *
 *      TESTE_GRATIS_DB=1 BASE_URL=http://localhost:3050 \
 *        node tests/homologacao-funil.mjs
 *
 * Exige `TESTE_GRATIS_DB=1` porque grava e apaga linhas. Aponte para o banco
 * de homologação, nunca para o de produção. */

import { createHmac, randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { createRequire } from "node:module";

if (process.env.TESTE_GRATIS_DB !== "1") {
  console.log("Pulado. Rode com TESTE_GRATIS_DB=1 e um banco de homologação.");
  process.exit(0);
}

const BASE = process.env.BASE_URL ?? "http://localhost:3050";
const PORTA_FALSA = Number(process.env.PORTA_PROVEDOR_FALSO ?? 4599);
const SEGREDO = process.env.WHATSAPP_APP_SECRET;
const VERIFY = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
const TOKEN_WORKER = process.env.TESTE_GRATIS_WORKER_TOKEN;
const URL_BANCO = process.env.DATABASE_URL;

for (const [nome, valor] of [
  ["DATABASE_URL", URL_BANCO],
  ["WHATSAPP_APP_SECRET", SEGREDO],
  ["WHATSAPP_WEBHOOK_VERIFY_TOKEN", VERIFY],
  ["TESTE_GRATIS_WORKER_TOKEN", TOKEN_WORKER],
]) {
  if (!valor) {
    console.error(`Falta ${nome} no ambiente. Veja o cabeçalho deste arquivo.`);
    process.exit(1);
  }
}

const require_ = createRequire(import.meta.url);
const { Pool } = require_("pg");

const pool = new Pool({
  connectionString: URL_BANCO,
  ssl: URL_BANCO.includes("sslmode=disable") ? false : { rejectUnauthorized: false },
});

const verde = (t) => `\x1b[32m${t}\x1b[0m`;
const vermelho = (t) => `\x1b[31m${t}\x1b[0m`;

const resultados = [];
function checar(passo, condicao, detalhe = "") {
  resultados.push({ passo, ok: Boolean(condicao), detalhe });
  console.log(
    `${condicao ? verde("✓") : vermelho("✗")} ${passo}${detalhe ? ` — ${detalhe}` : ""}`
  );
}

/* ─── Provedor e IA simulados ────────────────────────── */

const enviados = [];
const handoffs = [];
let proximoEnvio = { status: 200, corpo: { messageId: null } };

const servidor = createServer((req, res) => {
  let corpo = "";
  req.on("data", (p) => (corpo += p));
  req.on("end", () => {
    const dados = corpo ? JSON.parse(corpo) : {};
    if (req.url === "/enviar") {
      const id = `wamid.homolog.${enviados.length + 1}`;
      enviados.push({ ...dados, autorizacao: Boolean(req.headers.authorization), id });
      res.writeHead(proximoEnvio.status, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ...proximoEnvio.corpo, messageId: id }));
      return;
    }
    if (req.url === "/ia") {
      handoffs.push(dados);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end("{}");
      return;
    }
    res.writeHead(404);
    res.end();
  });
});

await new Promise((r) => servidor.listen(PORTA_FALSA, "127.0.0.1", r));

/* ─── Auxiliares ─────────────────────────────────────── */

function assinar(corpo) {
  return `sha256=${createHmac("sha256", SEGREDO).update(corpo, "utf8").digest("hex")}`;
}

async function postarWebhook(valor, { assinatura } = {}) {
  const corpo = JSON.stringify({
    object: "whatsapp_business_account",
    entry: [{ id: "homolog", changes: [{ field: "messages", value: valor }] }],
  });
  const resposta = await fetch(`${BASE}/api/whatsapp/webhook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hub-signature-256": assinatura ?? assinar(corpo),
    },
    body: corpo,
  });
  // O processamento roda depois da resposta (`after`); dá um instante a ele.
  await new Promise((r) => setTimeout(r, 400));
  return resposta;
}

const META = { display_phone_number: "556493054630", phone_number_id: "homolog" };

function statusDe(id, status, destino) {
  return { metadata: META, statuses: [{ id, status, recipient_id: destino }] };
}

function mensagemDe(de, conteudo) {
  return {
    metadata: META,
    messages: [{ id: `msg.${randomUUID()}`, from: de, ...conteudo }],
  };
}

async function rodarWorker() {
  const resposta = await fetch(`${BASE}/api/teste-gratis/worker`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN_WORKER}` },
  });
  return { status: resposta.status, corpo: await resposta.json().catch(() => ({})) };
}

/* Cada cenário chega de um "visitante" diferente. Sem isso o roteiro estoura o
   limite por IP no sexto envio, que é justamente o comportamento correto e é
   verificado em bloco próprio mais abaixo. Em produção este cabeçalho não é
   confiável e o valor que vale é o que o Traefik acrescenta no fim da cadeia
   (ver `src/lib/rate-limit.ts`). */
async function enviarFormulario(campos, ip = "198.51.100.1") {
  const resposta = await fetch(`${BASE}/api/teste-gratis`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify({
      nome: "Homologação Ponta A Ponta",
      email: `homologacao+${randomUUID().slice(0, 8)}@example.invalid`,
      segmento: "Odontologia",
      semSite: true,
      consentimentoWhatsapp: true,
      origem: { utm_source: "homologacao", utm_content: "roteiro" },
      ...campos,
    }),
  });
  return { status: resposta.status, corpo: await resposta.json().catch(() => ({})) };
}

const emails = [];
async function exigirLead(whatsappE164, passo) {
  const lead = await leadPor(whatsappE164);
  if (!lead) throw new Error(`${passo}: lead não encontrado para ${whatsappE164}`);
  return lead;
}

async function leadPor(whatsappE164) {
  const { rows } = await pool.query(
    `select * from teste_gratis_leads where whatsapp_e164 = $1 order by criado_em desc limit 1`,
    [whatsappE164]
  );
  if (rows[0]) emails.push(rows[0].email);
  return rows[0] ?? null;
}

async function adiantarJob(leadId) {
  await pool.query(
    `update teste_gratis_jobs set executar_em = now() - interval '1 minute' where lead_id = $1`,
    [leadId]
  );
}

/* Números fictícios em faixa de teste, cada cenário com o seu. */
const NUM = {
  principal: "+5562990010001",
  pausa: "+5562990010002",
  optOutBotao: "+5562990010003",
  optOutTexto: "+5562990010004",
  semPayload: "+5562990010005",
};

let saida = 0;

try {
  console.log(`\nBase: ${BASE}`);
  console.log(`Banco: ${URL_BANCO.replace(/:\/\/([^:]+):[^@]+@/, "://$1:****@")}\n`);

  /* ─── Passo 1 e 2: rotas protegidas ────────────────── */
  const verifyOk = await fetch(
    `${BASE}/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=${encodeURIComponent(VERIFY)}&hub.challenge=desafio123`
  );
  checar(
    "webhook: handshake de verificação devolve o desafio",
    verifyOk.status === 200 && (await verifyOk.text()) === "desafio123"
  );

  const verifyRuim = await fetch(
    `${BASE}/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=errado&hub.challenge=x`
  );
  checar("webhook: token de verificação errado é recusado", verifyRuim.status === 403);

  const semAssinatura = await fetch(`${BASE}/api/whatsapp/webhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entry: [] }),
  });
  checar("webhook: evento sem assinatura é recusado", semAssinatura.status === 401);

  const assinaturaErrada = await postarWebhook(statusDe("x", "delivered", "1"), {
    assinatura: "sha256=00",
  });
  checar("webhook: assinatura inválida é recusada", assinaturaErrada.status === 401);

  const workerSemToken = await fetch(`${BASE}/api/teste-gratis/worker`, { method: "POST" });
  checar("worker: sem token responde 401", workerSemToken.status === 401);

  const workerTokenErrado = await fetch(`${BASE}/api/teste-gratis/worker`, {
    method: "POST",
    headers: { Authorization: "Bearer token-errado-de-teste" },
  });
  checar("worker: token errado responde 401", workerTokenErrado.status === 401);

  /* ─── Passo 2 e 3: validação do formulário ─────────── */
  const vazio = await enviarFormulario(
    { nome: "", email: "", whatsapp: "", segmento: "" },
    "198.51.100.10"
  );
  checar("formulário: envio vazio é recusado", vazio.status === 422);

  const semConsentimento = await enviarFormulario(
    { whatsapp: NUM.principal, consentimentoWhatsapp: false },
    "198.51.100.11"
  );
  checar(
    "formulário: sem consentimento é recusado",
    semConsentimento.status === 422 && Boolean(semConsentimento.corpo.erros?.consentimentoWhatsapp)
  );

  /* ─── Passo 4, 5, 6: lead gravado e job agendado ───── */
  const enviado = await enviarFormulario({ whatsapp: NUM.principal }, "198.51.100.12");
  checar("formulário: envio válido é aceito", enviado.status === 200 && enviado.corpo.ok);

  const lead = await exigirLead(NUM.principal, "envio válido");
  checar("lead: gravado com status agendado", lead?.status === "agendado", lead?.status);
  checar("lead: consentimento com data e versão", Boolean(lead?.consentimento_em && lead?.consentimento_versao));
  checar("lead: atribuição preservada", lead?.origem?.utm_source === "homologacao");

  const atrasoSegundos = lead ? (new Date(lead.follow_up_em) - new Date(lead.criado_em)) / 1000 : 0;
  checar(
    "agendamento: follow-up entre 180 e 300 segundos",
    atrasoSegundos >= 179 && atrasoSegundos <= 301,
    `${Math.round(atrasoSegundos)}s`
  );

  const { rows: jobs } = await pool.query(
    "select status, tentativas from teste_gratis_jobs where lead_id = $1",
    [lead.id]
  );
  checar("fila: um job pendente criado", jobs.length === 1 && jobs[0].status === "pendente");

  /* ─── Passo 7: reenvio idempotente ─────────────────── */
  const reenvio = await enviarFormulario({ whatsapp: NUM.principal }, "198.51.100.13");
  const { rows: contagem } = await pool.query(
    "select count(*)::int as n from teste_gratis_leads where whatsapp_e164 = $1",
    [NUM.principal]
  );
  const { rows: jobs2 } = await pool.query(
    "select count(*)::int as n from teste_gratis_jobs where lead_id = $1",
    [lead.id]
  );
  checar("reenvio: responde sucesso para a pessoa", reenvio.corpo.ok === true);
  checar("reenvio: não cria um segundo lead", contagem[0].n === 1);
  checar("reenvio: não cria um segundo job", jobs2[0].n === 1);

  /* ─── Passo 8: worker dispara o template ───────────── */
  const antesDaHora = await rodarWorker();
  checar(
    "worker: não dispara antes da hora",
    antesDaHora.corpo.reivindicados === 0 && enviados.length === 0
  );

  await adiantarJob(lead.id);
  const rodada = await rodarWorker();
  checar("worker: autorizado responde 200", rodada.status === 200);
  checar("worker: envia o job vencido", rodada.corpo.enviados === 1, JSON.stringify(rodada.corpo));
  checar("envio: chegou ao provedor", enviados.length === 1);
  checar("envio: destino em E.164", enviados[0]?.para === NUM.principal, enviados[0]?.para);
  checar(
    "envio: template e idioma configuráveis",
    enviados[0]?.template === "companychat_teste_gratis_recebido_v1" &&
      enviados[0]?.idioma === "pt_BR"
  );
  checar(
    "envio: {{1}} é o primeiro nome",
    enviados[0]?.parametros?.[0] === "Homologação",
    enviados[0]?.parametros?.[0]
  );

  const contatado = await leadPor(NUM.principal);
  checar("lead: vai para contatado", contatado.status === "contatado", contatado.status);
  checar("lead: guarda o id da mensagem", Boolean(contatado.whatsapp_message_id));

  const segundaRodada = await rodarWorker();
  checar(
    "worker: rodada seguinte não reenvia",
    segundaRodada.corpo.enviados === 0 && enviados.length === 1
  );

  /* ─── Passo 9 e 10: status do provedor ─────────────── */
  const idMensagem = contatado.whatsapp_message_id;
  const waId = NUM.principal.replace("+", "");

  await postarWebhook(statusDe(idMensagem, "sent", waId));
  await postarWebhook(statusDe(idMensagem, "delivered", waId));
  const entregue = await leadPor(NUM.principal);
  checar("webhook: delivered marca entrega", entregue.status === "entregue" && Boolean(entregue.entregue_em));

  await postarWebhook(statusDe(idMensagem, "read", waId));
  const lido = await leadPor(NUM.principal);
  checar("webhook: read registra a leitura", Boolean(lido.lido_em));

  await postarWebhook(statusDe(idMensagem, "delivered", waId));
  const { rows: eventosEntrega } = await pool.query(
    "select count(*)::int as n from teste_gratis_eventos where lead_id = $1 and evento = 'whatsapp_message_delivered'",
    [lead.id]
  );
  checar("webhook: reentrega do mesmo status não duplica", eventosEntrega[0].n === 1);

  /* ─── Passo 11: botão Quero continuar acorda a IA ──── */
  await postarWebhook(
    mensagemDe(waId, {
      type: "button",
      button: { payload: "teste_gratis_continuar", text: "Quero continuar" },
    })
  );
  const respondeu = await leadPor(NUM.principal);
  checar("resposta: lead vai para respondeu", respondeu.status === "respondeu", respondeu.status);
  checar("IA: recebeu o handoff", handoffs.length === 1);
  checar("IA: gatilho continuar", handoffs[0]?.gatilho === "continuar");
  checar(
    "IA: dossiê não repete o que o formulário já perguntou",
    JSON.stringify(handoffs[0]?.jaRespondido) ===
      JSON.stringify(["nome", "email", "whatsapp", "site", "segmento"])
  );
  checar("IA: dossiê marca que veio do teste grátis", handoffs[0]?.lead?.solicitouTesteGratis === true);

  /* ─── Passo 12: Agora não pausa ────────────────────── */
  await enviarFormulario({ whatsapp: NUM.pausa }, "198.51.100.14");
  const leadPausa = await exigirLead(NUM.pausa, "botão Agora não");
  await adiantarJob(leadPausa.id);
  await rodarWorker();
  const pausaContatado = await leadPor(NUM.pausa);
  await postarWebhook(
    mensagemDe(NUM.pausa.replace("+", ""), {
      type: "button",
      button: { payload: "teste_gratis_agora_nao", text: "Agora não" },
    })
  );
  const pausado = await leadPor(NUM.pausa);
  const { rows: jobPausa } = await pool.query(
    "select status from teste_gratis_jobs where lead_id = $1",
    [leadPausa.id]
  );
  checar("botão Agora não: lead fica pausado", pausado.status === "pausado", pausado.status);
  checar("botão Agora não: job encerrado", jobPausa[0]?.status === "concluido");
  checar("botão Agora não: IA não é acionada", handoffs.length === 1);
  checar("botão Agora não: nenhuma mensagem extra", enviados.length === 2, String(enviados.length));
  void pausaContatado;

  /* ─── Passo 13 e 14: opt-out por botão ─────────────── */
  await enviarFormulario({ whatsapp: NUM.optOutBotao }, "198.51.100.15");
  const leadOpt = await exigirLead(NUM.optOutBotao, "opt-out por botão");
  await adiantarJob(leadOpt.id);
  await rodarWorker();
  await postarWebhook(
    mensagemDe(NUM.optOutBotao.replace("+", ""), {
      type: "button",
      button: { payload: "teste_gratis_sem_interesse", text: "Não tenho interesse" },
    })
  );
  const optOut = await leadPor(NUM.optOutBotao);
  checar("botão Não tenho interesse: lead em opt-out", optOut.status === "opt_out", optOut.status);
  checar("botão Não tenho interesse: IA não é acionada", handoffs.length === 1);

  const enviadosAntes = enviados.length;
  const novoPedido = await enviarFormulario({ whatsapp: NUM.optOutBotao }, "198.51.100.16");
  const { rows: leadsOpt } = await pool.query(
    "select status from teste_gratis_leads where whatsapp_e164 = $1 order by criado_em desc",
    [NUM.optOutBotao]
  );
  const { rows: jobsOpt } = await pool.query(
    `select count(*)::int as n from teste_gratis_jobs j
       join teste_gratis_leads l on l.id = j.lead_id
      where l.whatsapp_e164 = $1 and j.status in ('pendente','processando')`,
    [NUM.optOutBotao]
  );
  await rodarWorker();
  checar("opt-out: novo formulário responde sucesso à pessoa", novoPedido.corpo.ok === true);
  checar("opt-out: novo lead nasce bloqueado", leadsOpt[0].status === "opt_out");
  checar("opt-out: nenhum job pendente é criado", jobsOpt[0].n === 0);
  checar("opt-out: nenhuma mensagem nova sai", enviados.length === enviadosAntes);

  /* ─── Passo 15: opt-out escrito ────────────────────── */
  await enviarFormulario({ whatsapp: NUM.optOutTexto }, "198.51.100.17");
  const leadTexto = await exigirLead(NUM.optOutTexto, "opt-out por texto");
  await adiantarJob(leadTexto.id);
  await rodarWorker();
  await postarWebhook(
    mensagemDe(NUM.optOutTexto.replace("+", ""), {
      type: "text",
      text: { body: "para de mandar mensagem" },
    })
  );
  const optOutTexto = await leadPor(NUM.optOutTexto);
  checar(
    "texto livre: 'para de mandar mensagem' vira opt-out",
    optOutTexto.status === "opt_out",
    optOutTexto.status
  );
  checar("texto livre: IA não é acionada no opt-out", handoffs.length === 1);

  /* ─── Eco e número desconhecido ────────────────────── */
  const handoffsAntes = handoffs.length;
  await postarWebhook(
    mensagemDe(META.display_phone_number, { type: "text", text: { body: "eco da empresa" } })
  );
  checar("eco: mensagem do próprio número não acorda a IA", handoffs.length === handoffsAntes);

  const desconhecido = await postarWebhook(
    mensagemDe("5511999998888", { type: "text", text: { body: "oi" } })
  );
  checar("número desconhecido: webhook responde 200 sem quebrar", desconhecido.status === 200);

  /* ─── Contingência: template sem campo de payload ──── */
  /* Se o WhatsApp Manager não expuser o payload, o botão chega com o texto
     visível no lugar. O funil precisa continuar correto assim, senão quem
     tocar em "Não tenho interesse" seguiria sendo atendido. */
  await enviarFormulario({ whatsapp: NUM.semPayload }, "198.51.100.18");
  const leadSemPayload = await exigirLead(NUM.semPayload, "sem payload");
  await adiantarJob(leadSemPayload.id);
  await rodarWorker();

  const handoffsAntesSemPayload = handoffs.length;
  await postarWebhook(
    mensagemDe(NUM.semPayload.replace("+", ""), {
      type: "button",
      button: { payload: "Não tenho interesse", text: "Não tenho interesse" },
    })
  );
  const semPayload = await leadPor(NUM.semPayload);
  checar(
    "sem payload: texto visível do botão ainda gera opt-out",
    semPayload.status === "opt_out",
    semPayload.status
  );
  checar(
    "sem payload: IA não é acionada",
    handoffs.length === handoffsAntesSemPayload
  );

  /* ─── Antispam: limite por IP e honeypot ───────────── */
  const IP_ABUSO = "198.51.100.200";
  const codigos = [];
  for (let i = 0; i < 7; i++) {
    const r = await enviarFormulario({ whatsapp: "+5562990019999" }, IP_ABUSO);
    codigos.push(r.status);
  }
  checar(
    "limite por IP: barra a partir da sexta tentativa na janela",
    codigos.filter((c) => c === 429).length >= 2,
    codigos.join(",")
  );

  const forjado = await enviarFormulario(
    { whatsapp: "+5562990019999" },
    `10.0.0.${Math.floor(Math.random() * 200)}, ${IP_ABUSO}`
  );
  checar(
    "limite por IP: cabeçalho forjado pelo cliente não escapa do balde",
    forjado.status === 429,
    String(forjado.status)
  );

  const enviadosAntesIsca = enviados.length;
  const isca = await fetch(`${BASE}/api/teste-gratis`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": "198.51.100.30" },
    body: JSON.stringify({
      nome: "Robo Robo",
      email: "robo@example.invalid",
      whatsapp: "+5562990018888",
      segmento: "Odontologia",
      semSite: true,
      consentimentoWhatsapp: true,
      empresaWebsite: "http://spam.example",
    }),
  });
  const { rows: leadIsca } = await pool.query(
    "select count(*)::int as n from teste_gratis_leads where whatsapp_e164 = $1",
    ["+5562990188888"]
  );
  checar("honeypot: responde sucesso sem revelar a isca", isca.status === 200);
  checar("honeypot: nenhum lead gravado", leadIsca[0].n === 0);
  checar("honeypot: nenhuma mensagem enviada", enviados.length === enviadosAntesIsca);

  /* ─── Passo 16: trilha de eventos ──────────────────── */
  const { rows: trilha } = await pool.query(
    `select evento, count(*)::int as n from teste_gratis_eventos
      where lead_id = any($1) group by evento order by evento`,
    [[lead.id, leadPausa.id, leadOpt.id, leadTexto.id, leadSemPayload.id]]
  );
  const porEvento = Object.fromEntries(trilha.map((t) => [t.evento, t.n]));
  console.log(`\n  trilha de eventos: ${JSON.stringify(porEvento)}\n`);

  for (const esperado of [
    "free_trial_form_submitted",
    "whatsapp_followup_scheduled",
    "whatsapp_message_sent",
    "whatsapp_message_delivered",
    "whatsapp_message_read",
    "whatsapp_lead_replied",
    "free_trial_ia_handoff",
    "free_trial_paused",
    "free_trial_opt_out",
  ]) {
    checar(`trilha: ${esperado} registrado`, (porEvento[esperado] ?? 0) >= 1);
  }
  checar(
    "trilha: nenhum evento duplicado de leitura",
    (porEvento.whatsapp_message_read ?? 0) === 1
  );
} catch (erro) {
  console.error(vermelho(`\nErro inesperado: ${erro.message}`));
  saida = 1;
} finally {
  const { rowCount } = await pool.query(
    "delete from teste_gratis_leads where whatsapp_e164 = any($1)",
    [[...Object.values(NUM), "+5562990019999", "+5562990018888"]]
  );
  console.log(`\n${verde("✓")} limpeza: ${rowCount} lead(s) de homologação removido(s)`);
  await pool.end();
  servidor.close();

  const falhas = resultados.filter((r) => !r.ok);
  console.log(
    `\n${resultados.length - falhas.length}/${resultados.length} verificações passaram.`
  );
  if (falhas.length) {
    console.error(vermelho(`\n${falhas.length} falha(s):`));
    for (const f of falhas) console.error(`  - ${f.passo}${f.detalhe ? ` (${f.detalhe})` : ""}`);
    saida = 1;
  }
  process.exit(saida);
}
