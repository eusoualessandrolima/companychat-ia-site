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
