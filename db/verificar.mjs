/**
 * Verifica o banco dos leads de ponta a ponta:
 * conecta, cria a tabela se faltar, grava um lead de teste, lê de volta
 * e apaga. Roda antes de subir o anúncio, para não descobrir problema
 * de conexão com verba correndo.
 *
 *   npm run db:verificar
 *   npm run db:verificar -- "postgresql://usuario:senha@host:porta/banco?sslmode=require"
 */

import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { Pool } from "pg";

const ok = (texto) => console.log(`\x1b[32m✓\x1b[0m ${texto}`);
const falha = (texto) => console.log(`\x1b[31m✗\x1b[0m ${texto}`);

/** O Next carrega o .env.local sozinho; um script solto não. */
function lerEnvLocal(chave) {
  try {
    const arquivo = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    const linha = arquivo
      .split("\n")
      .find((l) => l.trim().startsWith(`${chave}=`));
    return linha?.slice(linha.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
  } catch {
    return undefined;
  }
}

const url = process.argv[2] || process.env.DATABASE_URL || lerEnvLocal("DATABASE_URL");

if (!url) {
  falha("DATABASE_URL não encontrada.");
  console.log("\nDefina no .env.local ou passe como argumento:");
  console.log('  npm run db:verificar -- "postgresql://usuario:senha@host:porta/banco?sslmode=require"\n');
  process.exit(1);
}

// Nunca imprimir a senha inteira no terminal.
console.log(`\nBanco: ${url.replace(/:\/\/([^:]+):[^@]+@/, "://$1:****@")}\n`);

const pool = new Pool({
  connectionString: url,
  ssl: url.includes("sslmode=disable") ? false : { rejectUnauthorized: false },
  connectionTimeoutMillis: 10_000,
});

const id = randomUUID();
let saida = 0;

try {
  const { rows: versao } = await pool.query("select version()");
  ok(`Conectado: ${versao[0].version.split(",")[0]}`);

  const { rows: existe } = await pool.query(
    "select to_regclass('public.leads_site') is not null as tem"
  );

  if (!existe[0].tem) {
    const ddl = readFileSync(new URL("./leads_site.sql", import.meta.url), "utf8");
    await pool.query(ddl);
    ok("Tabela leads_site criada agora");
  } else {
    ok("Tabela leads_site já existe");
  }

  /* O DDL do funil de teste grátis é todo `if not exists`, então rodar de novo
     é inofensivo e garante índice novo depois de uma alteração no arquivo. */
  const { rows: funil } = await pool.query(
    "select to_regclass('public.teste_gratis_leads') is not null as tem"
  );
  await pool.query(
    readFileSync(new URL("./teste_gratis.sql", import.meta.url), "utf8")
  );
  ok(
    funil[0].tem
      ? "Tabelas do funil de teste grátis já existiam (DDL reaplicado)"
      : "Tabelas do funil de teste grátis criadas agora"
  );

  await pool.query(
    `insert into leads_site (id, nome, empresa, telefone, telefone_e164, etapa, origem)
     values ($1, 'Lead de teste', 'Verificação', '(62) 90000-0000', '5562900000000', 1, $2)`,
    [id, JSON.stringify({ utm_source: "verificacao" })]
  );
  ok("Gravação funcionou");

  const { rows } = await pool.query("select nome from leads_site where id = $1", [id]);
  if (rows[0]?.nome !== "Lead de teste") throw new Error("o lead gravado não voltou na leitura");
  ok("Leitura funcionou");

  await pool.query("delete from leads_site where id = $1", [id]);
  ok("Limpeza do lead de teste funcionou");

  const { rows: total } = await pool.query("select count(*)::int as n from leads_site");
  ok(`Leads reais no banco: ${total[0].n}`);

  console.log("\n\x1b[32mTudo certo.\x1b[0m Cadastre a mesma DATABASE_URL no Vercel.\n");
} catch (erro) {
  // Conexão recusada chega como AggregateError de mensagem vazia: o motivo
  // real fica nos erros internos.
  const motivo =
    erro.message ||
    erro.errors?.map((e) => `${e.code ?? ""} ${e.message ?? ""}`.trim()).join("; ") ||
    erro.code ||
    String(erro);
  falha(`Falhou: ${motivo}`);
  console.log(
    "\nO que costuma ser:\n" +
      "  · acesso externo desligado no Coolify (Make it publicly available)\n" +
      "  · porta errada: o Coolify publica numa porta diferente da 5432\n" +
      "  · senha ou nome do banco incorretos na URL\n" +
      "  · firewall da VPS bloqueando a porta\n"
  );
  saida = 1;
} finally {
  await pool.end();
  process.exit(saida);
}
