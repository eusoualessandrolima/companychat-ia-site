/* Homologação do funil contra um Postgres de verdade.
 *
 *   TESTE_GRATIS_DB=1 npm run test:banco -- "postgresql://..."
 *
 * Exige opt-in explícito porque grava e apaga linhas. Aponte para um banco de
 * homologação, nunca para o de produção. Tudo o que o script cria é removido no
 * fim, inclusive quando algum passo falha.
 *
 * O script chama as **funções reais** de `src/lib/teste-gratis` (compiladas em
 * `.testes-build` pelo `npm run test:banco`), e não um SQL parecido escrito
 * aqui. A primeira versão fazia o contrário, e foi exatamente por isso que um
 * `on conflict` inválido passou despercebido: o teste testava a própria cópia.
 *
 * O que só o banco de verdade prova:
 *   - as consultas do repositório são SQL válido para este schema
 *   - o índice único impede um segundo job de follow-up para o mesmo lead
 *   - `for update skip locked` entrega o job a um processo só
 *   - o índice parcial de eventos deduplica reentrega do webhook
 *   - a fila não reenvia, respeita consentimento e aplica backoff */

import { createRequire } from "node:module";

if (process.env.TESTE_GRATIS_DB !== "1") {
  console.log(
    "Pulado. Rode com TESTE_GRATIS_DB=1 e a URL de um banco de homologação como argumento."
  );
  process.exit(0);
}

const url = process.argv[2] || process.env.DATABASE_URL;
if (!url) {
  console.error("Informe a URL do banco de homologação.");
  process.exit(1);
}

/* O módulo da pool lê `DATABASE_URL` no carregamento, então precisa estar
   definida antes do primeiro `require`. */
process.env.DATABASE_URL = url;

/* Este script verifica o caminho de envio, que a chave geral bloqueia quando
   desligada. Ligada só aqui dentro, contra o banco de homologação e um
   provedor falso: nada sai para a Meta. */
process.env.FREE_TRIAL_WHATSAPP_ENABLED = "true";

const require_ = createRequire(import.meta.url);
const carregar = (caminho) => require_(`../.testes-build/lib/${caminho}.js`);

const repo = carregar("teste-gratis/repositorio");
const { processarFila } = carregar("teste-gratis/fila");
const { pool } = carregar("postgres");

const ok = (texto) => console.log(`\x1b[32m✓\x1b[0m ${texto}`);
const criados = [];
let saida = 0;
let passos = 0;

function checar(condicao, mensagem) {
  if (!condicao) throw new Error(mensagem);
  passos += 1;
  ok(mensagem);
}

let contador = 0;
function leadDeTeste(extra = {}) {
  contador += 1;
  const sufixo = String(contador).padStart(2, "0");
  return {
    nome: "Homologação Automatizada",
    email: `homologacao+${Date.now()}${sufixo}@example.invalid`,
    whatsapp: `(62) 9${sufixo}00-0000`,
    whatsappE164: `+55629${sufixo}000000`,
    site: null,
    semSite: true,
    segmento: "Homologação",
    consentimentoWhatsapp: true,
    consentimentoVersao: "teste-homologacao",
    origem: { utm_source: "homologacao" },
    ...extra,
  };
}

async function criar(status = "recebido", extra = {}) {
  const lead = await repo.criarLead(leadDeTeste(extra), status);
  criados.push(lead.id);
  return lead;
}

function provedorFalso(resposta, registro = []) {
  return {
    nome: "homologacao",
    async enviarTemplate(pedido) {
      registro.push(pedido);
      return resposta;
    },
  };
}

try {
  const conexao = pool();
  const { rows: versao } = await conexao.query("select version()");
  ok(`Conectado: ${versao[0].version.split(",")[0]}`);

  /* ─── 1. Schema aplicado ─────────────────────────────── */
  const { rows: tabelas } = await conexao.query(
    `select table_name from information_schema.tables
      where table_name like 'teste_gratis_%' order by table_name`
  );
  checar(
    tabelas.map((t) => t.table_name).join(",") ===
      "teste_gratis_eventos,teste_gratis_jobs,teste_gratis_leads",
    "as três tabelas do funil existem"
  );

  const { rows: indices } = await conexao.query(
    `select indexname from pg_indexes
      where tablename like 'teste_gratis_%' and indexdef like '%UNIQUE%'`
  );
  const nomes = indices.map((i) => i.indexname);
  checar(
    nomes.includes("teste_gratis_jobs_unico_idx"),
    "índice único (lead_id, tipo) presente nos jobs"
  );
  checar(
    nomes.includes("teste_gratis_eventos_chave_idx"),
    "índice único parcial da chave presente nos eventos"
  );

  /* ─── 2. Eventos: gravação e deduplicação ───────────── */
  const leadEventos = await criar();
  const chave = `status:wamid.homolog-${leadEventos.id}:delivered`;

  checar(
    (await repo.registrarEvento("whatsapp_message_delivered", {
      leadId: leadEventos.id,
      chave,
      dados: { status: "delivered" },
    })) === true,
    "evento novo é gravado e reconhecido como inédito"
  );

  const { rows: gravados } = await conexao.query(
    "select count(*)::int as n from teste_gratis_eventos where chave = $1",
    [chave]
  );
  checar(
    gravados[0].n === 1,
    "o evento realmente foi para a tabela (não engolido por erro de SQL)"
  );

  checar(
    (await repo.registrarEvento("whatsapp_message_delivered", {
      leadId: leadEventos.id,
      chave,
    })) === false,
    "reentrega do mesmo evento é reconhecida como repetida"
  );

  checar(
    (await repo.registrarEvento("free_trial_form_started", { leadId: leadEventos.id })) ===
      true,
    "evento sem chave é sempre gravado, sem colidir com o índice parcial"
  );

  /* ─── 3. Agendamento idempotente ────────────────────── */
  const leadJob = await criar();
  const quando = new Date(Date.now() - 1000);

  checar(
    (await repo.agendarFollowUp(leadJob.id, quando)) === true,
    "primeiro agendamento cria o job"
  );
  checar(
    (await repo.agendarFollowUp(leadJob.id, quando)) === false,
    "segundo agendamento do mesmo lead não cria nada"
  );

  await repo.marcarAgendado(leadJob.id, quando);
  checar(
    (await repo.buscarLead(leadJob.id)).status === "agendado",
    "o lead vai para agendado"
  );

  /* ─── 4. Reivindicação com skip locked ──────────────── */
  const primeira = await repo.reivindicarJobs(10);
  const segunda = await repo.reivindicarJobs(10);
  checar(primeira.length >= 1, "primeira rodada reivindica o job vencido");
  checar(
    !segunda.some((j) => primeira.some((p) => p.id === j.id)),
    "segunda rodada não pega o mesmo job"
  );
  checar(primeira[0].tentativas === 1, "a tentativa é contada na reivindicação");

  /* ─── 5. Fila: envio, idempotência e bloqueios ──────── */
  const leadEnvio = await criar();
  await repo.agendarFollowUp(leadEnvio.id, new Date(Date.now() - 1000));

  const enviados = [];
  const resumo = await processarFila(
    50,
    provedorFalso({ ok: true, messageId: "wamid.homolog-1", provedor: "homologacao" }, enviados)
  );
  checar(resumo.enviados >= 1, "a fila envia o job vencido");
  checar(
    enviados.some((p) => p.paraE164 === leadEnvio.whatsapp_e164),
    "o template sai para o número normalizado do lead"
  );
  checar(
    enviados.every((p) => p.parametros[0] === "Homologação"),
    "o parâmetro {{1}} é o primeiro nome"
  );

  const aposEnvio = await repo.buscarLead(leadEnvio.id);
  checar(aposEnvio.status === "contatado", "o lead vai para contatado");
  checar(
    aposEnvio.whatsapp_message_id === "wamid.homolog-1",
    "o id da mensagem fica gravado no lead"
  );

  const reenvio = [];
  await repo.agendarFollowUp(leadEnvio.id, new Date(Date.now() - 1000));
  await conexao.query(
    `update teste_gratis_jobs set status = 'pendente', executar_em = now() - interval '1 minute'
      where lead_id = $1`,
    [leadEnvio.id]
  );
  const resumoReenvio = await processarFila(
    50,
    provedorFalso({ ok: true, messageId: "wamid.nao-deveria" }, reenvio)
  );
  checar(
    reenvio.length === 0 && resumoReenvio.ignorados >= 1,
    "job reivindicado de novo não reenvia para quem já recebeu"
  );

  /* ─── 5b. A chave geral desliga a fila inteira ──────── */
  const leadChave = await criar();
  await repo.agendarFollowUp(leadChave.id, new Date(Date.now() - 1000));

  process.env.FREE_TRIAL_WHATSAPP_ENABLED = "false";
  const comChaveDesligada = [];
  const resumoDesligado = await processarFila(
    50,
    provedorFalso({ ok: true, messageId: "nao-deveria" }, comChaveDesligada)
  );
  process.env.FREE_TRIAL_WHATSAPP_ENABLED = "true";

  checar(
    comChaveDesligada.length === 0 && resumoDesligado.envioDesligado === true,
    "chave geral desligada impede qualquer envio"
  );
  const { rows: jobIntacto } = await conexao.query(
    "select status, tentativas from teste_gratis_jobs where lead_id = $1",
    [leadChave.id]
  );
  checar(
    jobIntacto[0].status === "pendente" && jobIntacto[0].tentativas === 0,
    "chave desligada não consome tentativa: religar retoma de onde parou"
  );

  /* Tira este job da fila antes de seguir: ele está válido e pendente, e as
     verificações seguintes rodam a fila inteira esperando zero envio. */
  await conexao.query("delete from teste_gratis_jobs where lead_id = $1", [leadChave.id]);

  /* ─── 6. Consentimento e opt-out barram o envio ─────── */
  const leadSemConsentimento = await criar("recebido");
  await conexao.query(
    "update teste_gratis_leads set consentimento_whatsapp = false where id = $1",
    [leadSemConsentimento.id]
  );
  await repo.agendarFollowUp(leadSemConsentimento.id, new Date(Date.now() - 1000));

  const leadOptOut = await criar("opt_out");
  await repo.agendarFollowUp(leadOptOut.id, new Date(Date.now() - 1000));

  const bloqueados = [];
  await processarFila(50, provedorFalso({ ok: true, messageId: "x" }, bloqueados));
  checar(bloqueados.length === 0, "sem consentimento e em opt-out, nada é enviado");

  /* ─── 7. Falha temporária volta para a fila ─────────── */
  const leadFalha = await criar();
  await repo.agendarFollowUp(leadFalha.id, new Date(Date.now() - 1000));
  await processarFila(
    50,
    provedorFalso({ ok: false, erro: "Meta 500", permanente: false, provedor: "homologacao" })
  );
  const { rows: jobFalha } = await conexao.query(
    "select status, tentativas, ultimo_erro, executar_em > now() as adiado from teste_gratis_jobs where lead_id = $1",
    [leadFalha.id]
  );
  checar(
    jobFalha[0].status === "pendente" && jobFalha[0].adiado === true,
    "falha temporária devolve o job à fila com espera"
  );
  checar(
    jobFalha[0].ultimo_erro.includes("Meta 500"),
    "o motivo da falha fica registrado no job"
  );

  /* ─── 8. Falha permanente encerra ───────────────────── */
  const leadPermanente = await criar();
  await repo.agendarFollowUp(leadPermanente.id, new Date(Date.now() - 1000));
  await processarFila(
    50,
    provedorFalso({
      ok: false,
      erro: "Meta 400 (132001): template não existe",
      permanente: true,
      provedor: "homologacao",
    })
  );
  const { rows: jobPerm } = await conexao.query(
    "select status from teste_gratis_jobs where lead_id = $1",
    [leadPermanente.id]
  );
  checar(jobPerm[0].status === "falhou", "falha permanente encerra o job");
  checar(
    (await repo.buscarLead(leadPermanente.id)).status === "falha_envio",
    "o lead fica marcado como falha de envio"
  );

  /* ─── 9. Deduplicação de solicitação e opt-out ──────── */
  const leadDedupe = await criar();
  const recente = await repo.solicitacaoRecente(
    leadDedupe.whatsapp_e164,
    leadDedupe.email,
    24
  );
  checar(recente?.id === leadDedupe.id, "solicitação recente é encontrada pelo telefone");

  const porEmail = await repo.solicitacaoRecente("+5511000000000", leadDedupe.email, 24);
  checar(porEmail?.id === leadDedupe.id, "solicitação recente é encontrada pelo e-mail");

  const foraDaJanela = await repo.solicitacaoRecente(
    "+5511999999999",
    "ninguem@example.invalid",
    24
  );
  checar(foraDaJanela === null, "contato desconhecido não é tratado como repetido");

  checar(
    (await repo.temOptOut(leadOptOut.whatsapp_e164)) === true,
    "opt-out anterior é detectado pelo telefone"
  );
  checar(
    (await repo.temOptOut(leadDedupe.whatsapp_e164)) === false,
    "quem nunca pediu para sair não é bloqueado"
  );

  /* ─── 10. Status fora de ordem e encerramento ───────── */
  const leadStatus = await criar();
  await repo.marcarEnviado(leadStatus.id, "wamid.ordem");
  await repo.marcarEntregue(leadStatus.id);
  await repo.marcarLido(leadStatus.id);
  await repo.marcarResposta(leadStatus.id, { texto: "quero continuar", botao: null });
  await repo.marcarEntregue(leadStatus.id);
  const depois = await repo.buscarLead(leadStatus.id);
  checar(
    depois.status === "respondeu",
    "status atrasado do provedor não empurra o lead para trás"
  );
  checar(depois.lido_em !== null, "a leitura fica registrada fora do status");

  await repo.agendarFollowUp(leadStatus.id, new Date(Date.now() + 600_000));
  await repo.encerrarAutomacao(leadStatus.id, "opt_out");
  const { rows: jobEncerrado } = await conexao.query(
    "select status from teste_gratis_jobs where lead_id = $1",
    [leadStatus.id]
  );
  checar(
    (await repo.buscarLead(leadStatus.id)).status === "opt_out",
    "opt-out trava o status do lead"
  );
  checar(
    jobEncerrado.every((j) => j.status === "concluido"),
    "opt-out encerra o job pendente"
  );

  /* ─── 11. Busca pelo wa_id sem o nono dígito ────────── */
  const leadWaId = await criar();
  const semNono = leadWaId.whatsapp_e164.replace(/^\+55(\d\d)9/, "55$1");
  const achado = await repo.buscarLeadPorTelefone(semNono);
  checar(
    achado?.id === leadWaId.id,
    "o lead é encontrado pelo wa_id brasileiro sem o nono dígito"
  );

  console.log(`\n\x1b[32mTudo certo.\x1b[0m ${passos} verificações no banco.\n`);
} catch (erro) {
  console.error(`\x1b[31m✗\x1b[0m ${erro.message}`);
  saida = 1;
} finally {
  const conexao = pool();
  if (conexao && criados.length) {
    // `on delete cascade` leva jobs e eventos junto.
    await conexao.query("delete from teste_gratis_leads where id = any($1)", [criados]);
    ok(`limpeza: ${criados.length} lead(s) de homologação removido(s)`);

    const { rows } = await conexao.query(
      "select count(*)::int as n from teste_gratis_leads where id = any($1)",
      [criados]
    );
    if (rows[0].n !== 0) {
      console.error("\x1b[31m✗\x1b[0m sobrou lead de teste no banco");
      saida = 1;
    }
  }
  if (conexao) await conexao.end();
  process.exit(saida);
}
