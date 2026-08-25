/* Consulta pontual do status do template na Meta.
 *
 *   WHATSAPP_TOKEN=... WABA_ID=... node tests/status-template.mjs
 *
 * Uma consulta por execução, de propósito: status de template muda em minutos
 * ou horas, e ficar batendo na Graph API não acelera aprovação nenhuma. Rode
 * quando quiser saber, não em laço.
 *
 * O token é lido do ambiente e **nunca** aparece na saída. Rode com o token que
 * está no Coolify, num terminal onde ele não fique no histórico:
 *
 *   read -rs WHATSAPP_TOKEN && export WHATSAPP_TOKEN
 *
 * Nada aqui altera o template: é só leitura. */

const TOKEN = process.env.WHATSAPP_TOKEN;
const WABA = process.env.WABA_ID;
const NOME =
  process.env.WHATSAPP_FREE_TRIAL_TEMPLATE ?? "companychat_teste_gratis_recebido_v1";
const VERSAO = process.env.WHATSAPP_API_VERSION ?? "v23.0";

if (!TOKEN || !WABA) {
  console.error(
    "Defina WHATSAPP_TOKEN e WABA_ID no ambiente. Veja o cabeçalho deste arquivo."
  );
  process.exit(1);
}

const url = new URL(`https://graph.facebook.com/${VERSAO}/${WABA}/message_templates`);
url.searchParams.set("name", NOME);
url.searchParams.set("fields", "id,name,language,status,category,rejected_reason,components");

try {
  const resposta = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    signal: AbortSignal.timeout(15_000),
  });
  const dados = await resposta.json();

  if (!resposta.ok) {
    // Mensagem da Meta, nunca o cabeçalho de autorização.
    console.error(
      `Meta ${resposta.status}: ${dados?.error?.message ?? "sem detalhe"}` +
        (dados?.error?.code ? ` (código ${dados.error.code})` : "")
    );
    process.exit(1);
  }

  const encontrados = dados.data ?? [];
  if (encontrados.length === 0) {
    console.log(`Nenhum template chamado "${NOME}" nesta WABA.`);
    process.exit(1);
  }

  for (const t of encontrados) {
    console.log(`\n  ${t.name} · ${t.language}`);
    console.log(`  id:        ${t.id}`);
    console.log(`  status:    ${t.status}`);
    console.log(`  categoria: ${t.category}`);
    if (t.rejected_reason && t.rejected_reason !== "NONE") {
      console.log(`  motivo:    ${t.rejected_reason}`);
    }

    const botoes =
      t.components?.find((c) => c.type === "BUTTONS")?.buttons ?? [];
    if (botoes.length) {
      console.log("  botões:");
      for (const b of botoes) {
        /* O que interessa conferir aqui: o texto, que é o contrato do funil.
           Se a Meta devolver payload, ele aparece junto. */
        console.log(
          `    - "${b.text}"${b.payload ? ` → payload "${b.payload}"` : " (sem payload)"}`
        );
      }
    }
  }

  console.log(
    "\n  APPROVED libera os próximos passos de `docs/ativacao-teste-gratis.md`.\n" +
      "  REJECTED: traga o motivo antes de mexer em qualquer texto.\n"
  );
} catch (erro) {
  console.error(`Falha ao consultar: ${erro.message}`);
  process.exit(1);
}
