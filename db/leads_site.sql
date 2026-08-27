-- Tabela dos leads capturados pelo quiz em /comecar.
-- Rodar uma vez no Postgres do Coolify:
--   psql "$DATABASE_URL" -f db/leads_site.sql
--
-- A gravação acontece a cada etapa respondida, sempre no mesmo `id`,
-- então uma linha representa uma visita: quem parou no meio também fica
-- registrado, com `concluido = false` e a etapa em que parou. Quem digitou
-- os dados e saiu sem enviar entra com `etapa = 0`.

create table if not exists leads_site (
  id              uuid primary key,
  nome            text,
  empresa         text,
  telefone        text,
  telefone_e164   text,
  equipe          text,
  volume          text,
  dor             text,
  etapa           integer     not null default 0,
  concluido       boolean     not null default false,
  clicou_whatsapp boolean     not null default false,
  origem          jsonb       not null default '{}'::jsonb,
  criado_em       timestamptz not null default now(),
  atualizado_em   timestamptz not null default now()
);

create index if not exists leads_site_criado_em_idx
  on leads_site (criado_em desc);

create index if not exists leads_site_concluido_idx
  on leads_site (concluido);

-- Quando o lead chegou ao CRM. Aditiva e idempotente: o arquivo continua
-- valendo tanto para um banco vazio quanto para o que já está em produção.
--
-- Antes desta coluna, a entrega ao CRM saía num `after()` cujo resultado
-- ninguém lia: se o webhook falhasse com o banco gravado, o lead ficava no
-- painel e nunca virava card, sem erro, sem nova tentativa e sem ninguém
-- saber. Nulo aqui num lead contatável significa exatamente isso.
alter table leads_site
  add column if not exists crm_entregue_em timestamptz;

-- Índice parcial: a consulta que importa é sempre "o que ainda não chegou",
-- e ela ignora quem já foi entregue.
create index if not exists leads_site_sem_crm_idx
  on leads_site (criado_em desc)
  where crm_entregue_em is null;

-- Divergência painel × CRM — leads contatáveis que nunca foram entregues:
--
--   select id, nome, telefone_e164, criado_em
--     from leads_site
--    where crm_entregue_em is null
--      and telefone_e164 is not null
--      and length(nome) >= 2
--    order by criado_em desc;
