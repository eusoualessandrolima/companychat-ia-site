import { Pool } from "pg";

/* Acesso aos leads no Postgres (instância própria no Coolify).
   Sem `DATABASE_URL` o site funciona normalmente e o quiz não trava:
   as funções apenas não gravam nem listam. */

const URL_BANCO = process.env.DATABASE_URL;

export type Lead = {
  id: string;
  nome: string | null;
  empresa: string | null;
  telefone: string | null;
  telefone_e164: string | null;
  equipe: string | null;
  volume: string | null;
  dor: string | null;
  etapa: number;
  concluido: boolean;
  clicou_whatsapp: boolean;
  origem: Record<string, string>;
  criado_em: string;
  atualizado_em: string;
};

export function bancoConfigurado() {
  return Boolean(URL_BANCO);
}

/* Uma pool por processo, guardada no escopo global: em desenvolvimento o
   Next recarrega os módulos a cada edição e abriria uma pool nova a cada
   vez, estourando o limite de conexões do Postgres. */
const global_ = globalThis as typeof globalThis & { poolLeads?: Pool };

function pool() {
  if (!URL_BANCO) return null;

  if (!global_.poolLeads) {
    global_.poolLeads = new Pool({
      connectionString: URL_BANCO,
      // Banco em VPS própria costuma usar certificado autoassinado; a
      // conexão continua criptografada, só não valida a cadeia.
      ssl: URL_BANCO.includes("sslmode=disable")
        ? false
        : { rejectUnauthorized: false },
      // O site roda em funções serverless: poucas conexões por instância.
      max: 3,
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

/** Grava ou atualiza o lead. Chamado a cada etapa do quiz, então a linha
 *  existe desde o primeiro envio e o abandono no meio fica registrado. */
export async function salvarLead(lead: {
  id: string;
  nome: string | null;
  empresa: string | null;
  telefone: string | null;
  telefone_e164: string | null;
  equipe: string | null;
  volume: string | null;
  dor: string | null;
  etapa: number;
  concluido: boolean;
  clicou_whatsapp: boolean;
  origem: Record<string, unknown>;
}) {
  const conexao = pool();
  if (!conexao) return { ok: true, gravado: false };

  try {
    await conexao.query(
      `insert into leads_site (
         id, nome, empresa, telefone, telefone_e164, equipe, volume, dor,
         etapa, concluido, clicou_whatsapp, origem
       )
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       on conflict (id) do update set
         -- coalesce: uma etapa posterior não pode apagar o que já veio antes
         nome            = coalesce(excluded.nome, leads_site.nome),
         empresa         = coalesce(excluded.empresa, leads_site.empresa),
         telefone        = coalesce(excluded.telefone, leads_site.telefone),
         telefone_e164   = coalesce(excluded.telefone_e164, leads_site.telefone_e164),
         equipe          = coalesce(excluded.equipe, leads_site.equipe),
         volume          = coalesce(excluded.volume, leads_site.volume),
         dor             = coalesce(excluded.dor, leads_site.dor),
         etapa           = greatest(excluded.etapa, leads_site.etapa),
         concluido       = leads_site.concluido or excluded.concluido,
         clicou_whatsapp = leads_site.clicou_whatsapp or excluded.clicou_whatsapp,
         origem          = case
                             when leads_site.origem = '{}'::jsonb then excluded.origem
                             else leads_site.origem
                           end,
         atualizado_em   = now()`,
      [
        lead.id,
        lead.nome,
        lead.empresa,
        lead.telefone,
        lead.telefone_e164,
        lead.equipe,
        lead.volume,
        lead.dor,
        lead.etapa,
        lead.concluido,
        lead.clicou_whatsapp,
        JSON.stringify(lead.origem),
      ]
    );

    return { ok: true, gravado: true };
  } catch (erro) {
    console.error("Falha ao gravar lead no Postgres:", erro);
    return { ok: true, gravado: false };
  }
}

export async function listarLeads(limite = 500): Promise<Lead[]> {
  const conexao = pool();
  if (!conexao) return [];

  try {
    const { rows } = await conexao.query<Lead>(
      `select * from leads_site order by criado_em desc limit $1`,
      [limite]
    );
    return rows;
  } catch (erro) {
    console.error("Falha ao listar leads no Postgres:", erro);
    return [];
  }
}
