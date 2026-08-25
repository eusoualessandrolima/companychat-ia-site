import { Pool } from "pg";

/* Pool única do Postgres próprio (Coolify), compartilhada pelo painel de leads
   do quiz e pelo funil de teste grátis. Sem `DATABASE_URL` o site continua
   funcionando: quem consome trata o `null` e apenas não grava.

   A pool vive no escopo global porque em desenvolvimento o Next recarrega os
   módulos a cada edição e abriria uma pool nova a cada vez, estourando o
   limite de conexões. */

const URL_BANCO = process.env.DATABASE_URL;

const global_ = globalThis as typeof globalThis & { poolLeads?: Pool };

export function bancoConfigurado() {
  return Boolean(URL_BANCO);
}

export function pool() {
  if (!URL_BANCO) return null;

  if (!global_.poolLeads) {
    global_.poolLeads = new Pool({
      connectionString: URL_BANCO,
      // Banco em VPS própria costuma usar certificado autoassinado; a
      // conexão continua criptografada, só não valida a cadeia.
      ssl: URL_BANCO.includes("sslmode=disable")
        ? false
        : { rejectUnauthorized: false },
      // O site roda num container só: poucas conexões por instância.
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 8_000,
    });

    // Sem este ouvinte, um erro de conexão ociosa derruba o processo.
    global_.poolLeads.on("error", (erro) => {
      console.error("Erro na pool do Postgres:", erro);
    });
  }

  return global_.poolLeads;
}
