-- Funil de teste grátis: lead capturado em /teste-gratis, follow-up de WhatsApp
-- agendado como job durável e eventos do provedor.
--
-- Rodar uma vez no Postgres do Coolify (ou usar `npm run db:verificar`, que
-- aplica este arquivo quando as tabelas ainda não existem):
--   psql "$DATABASE_URL" -f db/teste_gratis.sql
--
-- Três tabelas, cada uma com um papel:
--   teste_gratis_leads   - o cadastro e o estado do lead no funil
--   teste_gratis_jobs    - o agendamento do disparo, com retentativa
--   teste_gratis_eventos - trilha de auditoria, analytics de servidor e
--                          deduplicação dos eventos do webhook

create table if not exists teste_gratis_leads (
  id                     uuid primary key,
  nome                   text        not null,
  email                  text        not null,
  -- Como a pessoa digitou, para conferência humana no painel.
  whatsapp               text        not null,
  -- E.164 sem espaços nem sinais: +5562993054630. É a chave de contato.
  whatsapp_e164          text        not null,
  site                   text,
  sem_site               boolean     not null default false,
  segmento               text        not null,
  consentimento_whatsapp boolean     not null default false,
  consentimento_em       timestamptz,
  -- Versão do texto aceito. Sem isto não dá para provar o que foi consentido
  -- depois que a redação mudar.
  consentimento_versao   text,
  origem                 jsonb       not null default '{}'::jsonb,
  status                 text        not null default 'recebido',
  follow_up_em           timestamptz,
  whatsapp_message_id    text,
  entregue_em            timestamptz,
  lido_em                timestamptz,
  respondeu_em           timestamptz,
  -- Última resposta livre e o botão escolhido no template, para quem assumir a
  -- conversa não precisar abrir o provedor.
  ultima_resposta        text,
  botao_escolhido        text,
  criado_em              timestamptz not null default now(),
  atualizado_em          timestamptz not null default now()
);

comment on column teste_gratis_leads.status is
  'recebido | agendado | contatado | entregue | respondeu | qualificado | convertido | pausado | opt_out | falha_envio';

create index if not exists teste_gratis_leads_criado_em_idx
  on teste_gratis_leads (criado_em desc);

-- Deduplicação de solicitação recente: a consulta filtra por telefone ou
-- e-mail dentro de uma janela de horas.
create index if not exists teste_gratis_leads_whatsapp_idx
  on teste_gratis_leads (whatsapp_e164, criado_em desc);

create index if not exists teste_gratis_leads_email_idx
  on teste_gratis_leads (lower(email), criado_em desc);

-- O webhook chega com o `wa_id` do contato ou com o id da mensagem enviada.
create index if not exists teste_gratis_leads_message_id_idx
  on teste_gratis_leads (whatsapp_message_id)
  where whatsapp_message_id is not null;

create table if not exists teste_gratis_jobs (
  id             bigserial   primary key,
  lead_id        uuid        not null references teste_gratis_leads (id) on delete cascade,
  tipo           text        not null default 'followup_whatsapp',
  executar_em    timestamptz not null,
  status         text        not null default 'pendente',
  tentativas     integer     not null default 0,
  max_tentativas integer     not null default 5,
  ultimo_erro    text,
  -- Marca de quem reivindicou o job. Um job travado há muito tempo é de uma
  -- instância que morreu no meio; o worker o devolve para a fila.
  travado_em     timestamptz,
  criado_em      timestamptz not null default now(),
  atualizado_em  timestamptz not null default now()
);

comment on column teste_gratis_jobs.status is
  'pendente | processando | concluido | falhou';

-- Idempotência do agendamento: um lead tem no máximo um job de cada tipo.
-- Reenvio do formulário, retry do navegador ou webhook repetido não criam
-- um segundo disparo.
create unique index if not exists teste_gratis_jobs_unico_idx
  on teste_gratis_jobs (lead_id, tipo);

-- O worker varre por (status, executar_em) a cada tique.
create index if not exists teste_gratis_jobs_fila_idx
  on teste_gratis_jobs (status, executar_em);

create table if not exists teste_gratis_eventos (
  id        bigserial   primary key,
  lead_id   uuid        references teste_gratis_leads (id) on delete cascade,
  evento    text        not null,
  -- Identidade do evento na origem (id da mensagem + status, no caso da Meta).
  -- Quando presente, o índice único abaixo transforma o insert em dedupe.
  chave     text,
  dados     jsonb       not null default '{}'::jsonb,
  criado_em timestamptz not null default now()
);

create unique index if not exists teste_gratis_eventos_chave_idx
  on teste_gratis_eventos (chave)
  where chave is not null;

create index if not exists teste_gratis_eventos_lead_idx
  on teste_gratis_eventos (lead_id, criado_em desc);

create index if not exists teste_gratis_eventos_evento_idx
  on teste_gratis_eventos (evento, criado_em desc);
