import { bancoConfigurado, pool } from "./postgres";

/* Acesso aos leads no Postgres (instância própria no Coolify).
   Sem `DATABASE_URL` o site funciona normalmente e o quiz não trava:
   as funções apenas não gravam nem listam. A pool mora em `postgres.ts`,
   compartilhada com o funil de teste grátis. */

export { bancoConfigurado };

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
  /** Quando o lead chegou ao CRM. Nulo num lead contatável é divergência:
   *  ele está no painel e não virou card. Ver `marcarEntregaNoCrm`. */
  crm_entregue_em: string | null;
};

/** Grava ou atualiza o lead. Chamado a cada etapa do quiz, então a linha
 *  existe desde o primeiro envio e o abandono no meio fica registrado. */
export type ResultadoGravacao = {
  ok: boolean;
  gravado: boolean;
  /** Verdadeiro só na primeira gravação da visita. Quem consome o lead lá fora
   *  (CRM) usa isto para saber que é um lead novo, e não mais uma etapa. */
  inserido: boolean;
};

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
}): Promise<ResultadoGravacao> {
  const conexao = pool();
  if (!conexao) return { ok: true, gravado: false, inserido: false };

  try {
    const { rows } = await conexao.query<{ inserido: boolean }>(
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
         atualizado_em   = now()
       -- xmax = 0 é a marca do INSERT: numa linha que veio do DO UPDATE ele
       -- carrega o id da transação que a atualizou.
       returning (xmax = 0) as inserido`,
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

    return { ok: true, gravado: true, inserido: rows[0]?.inserido === true };
  } catch (erro) {
    console.error("Falha ao gravar lead no Postgres:", erro);
    return { ok: true, gravado: false, inserido: false };
  }
}

/** Carimba a entrega do lead no CRM.
 *
 *  Existe porque a entrega acontece fora do caminho da resposta (`after()`),
 *  onde um `false` não tinha para onde ir: a falha virava um `console.error`
 *  em logs que ninguém coleta, e o lead ficava no painel sem nunca virar card.
 *  Com o carimbo, a divergência entre painel e CRM passa a ser uma consulta —
 *  ver o rodapé de `db/leads_site.sql`.
 *
 *  Não sobrescreve um carimbo anterior: um lead entra no webhook mais de uma
 *  vez (ao nascer e ao clicar no WhatsApp), e o que interessa é a primeira
 *  entrega bem-sucedida, não a última.
 *
 *  Falha aqui é engolida de propósito. Este código roda depois de a resposta
 *  já ter saído; lançar não avisaria ninguém e derrubaria o `after()`. O custo
 *  de não carimbar é um falso positivo na consulta de divergência — que leva a
 *  reenviar um lead que o CRM já tem, e o CRM é idempotente pelo `id`. */
export async function marcarEntregaNoCrm(id: string): Promise<void> {
  const conexao = pool();
  if (!conexao) return;

  try {
    await conexao.query(
      `update leads_site
          set crm_entregue_em = now()
        where id = $1
          and crm_entregue_em is null`,
      [id]
    );
  } catch (erro) {
    console.error("Falha ao carimbar entrega do lead no CRM:", erro);
  }
}

/** Apaga o lead de vez. Usado pelo painel para limpar testes.
 *  Devolve `false` quando o id não existe mais — assim o painel não mente
 *  dizendo que excluiu algo que já não estava lá. */
export async function excluirLead(id: string): Promise<boolean> {
  const conexao = pool();
  if (!conexao) return false;

  try {
    const { rowCount } = await conexao.query(
      `delete from leads_site where id = $1`,
      [id]
    );
    return (rowCount ?? 0) > 0;
  } catch (erro) {
    console.error("Falha ao excluir lead no Postgres:", erro);
    return false;
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
