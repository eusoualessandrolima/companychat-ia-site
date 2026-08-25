# Ativação do funil de teste grátis

Procedimento completo para ligar o funil. Nada aqui foi executado: o código
está pronto e testado localmente, e todos os passos abaixo dependem de acesso a
sistemas de produção.

**Nenhum token real aparece neste documento.** Onde estiver
`[PREENCHER_NO_COOLIFY]`, o valor é colado direto no painel do Coolify, nunca
em arquivo do repositório nem no terminal.

Como funciona por dentro: `docs/funil-teste-gratis.md`.

---

## 1. Template do WhatsApp (Meta)

Onde: **WhatsApp Manager → Ferramentas de conta → Modelos de mensagem → Criar
modelo**.

| Campo | Valor |
|---|---|
| Nome | `companychat_teste_gratis_recebido_v1` |
| Idioma | Português (BR) — código `pt_BR` |
| Categoria | a que o WhatsApp Manager indicar como adequada ao texto |
| Cabeçalho | nenhum |
| Rodapé | nenhum |

**Corpo** (copiar exatamente, com o `{{1}}`):

```
Olá, {{1}}! Recebemos sua solicitação de teste grátis da CompanyChat pelo nosso site. Posso fazer algumas perguntas rápidas para entender sua operação e preparar o melhor teste para você?
```

| Variável | Conteúdo | Exemplo para a aprovação |
|---|---|---|
| `{{1}}` | primeiro nome do lead | `Ana` |

**Botões** — tipo *Resposta rápida*, os três, nesta ordem:

| Ordem | Texto do botão | `payload` |
|---|---|---|
| 1 | `Quero continuar` | `teste_gratis_continuar` |
| 2 | `Agora não` | `teste_gratis_agora_nao` |
| 3 | `Não tenho interesse` | `teste_gratis_sem_interesse` |

> **O payload é o preferido, mas não é bloqueio.** O código lê primeiro o
> `payload`; quando ele não é um dos três acima, cai para o texto visível do
> botão, que também está mapeado em `src/lib/teste-gratis/intencao.ts`. Ou
> seja: a interface do WhatsApp Manager expondo o campo de payload ou não, o
> funil se comporta igual.
>
> Coberto por teste nos dois formatos (`npm test`) e no roteiro ponta a ponta
> (`npm run test:homologacao`, cenário "sem payload"), justamente porque o
> risco aqui é quem toca em "Não tenho interesse" continuar sendo atendido.
>
> O que **não** pode mudar é o **texto** dos botões. Ele é o que sustenta a
> contingência: alterar "Agora não" para "Depois", por exemplo, exige atualizar
> `TEXTO_DOS_BOTOES` em `intencao.ts` junto.

**Categoria:** submeta na que o Manager indicar. Não force categoria para
conseguir aprovação e aceite eventual recategorização da Meta. Forçar custa
bloqueio depois.

**Enquanto o template não estiver aprovado**, a fila registra falha permanente
e o lead fica com status `falha_envio`. Nada é perdido: aprovando o template e
reprocessando o job (SQL em `docs/funil-teste-gratis.md`), o disparo sai.

---

## 2. Webhook (Meta)

Onde: **App do Meta for Developers → WhatsApp → Configuração → Webhook**.

| Campo | Valor |
|---|---|
| URL de callback | `https://www.companychatia.com.br/api/whatsapp/webhook` |
| Token de verificação | o mesmo valor de `WHATSAPP_WEBHOOK_VERIFY_TOKEN` |
| Campos assinados | `messages` |

O campo `messages` cobre as duas coisas que o funil usa: as respostas do lead e
os status `sent`, `delivered`, `read` e `failed`.

Ordem correta: **cadastrar as variáveis no Coolify e publicar antes** de clicar
em "Verificar e salvar". Sem `WHATSAPP_WEBHOOK_VERIFY_TOKEN` a rota responde
503 e a Meta recusa a URL.

A validação de assinatura usa `WHATSAPP_APP_SECRET` (Configurações básicas do
app → Chave secreta do aplicativo). Sem ela a rota recusa **todos** os eventos
com 503, de propósito.

---

## 3. Variáveis de ambiente (Coolify)

Onde: **aplicação `site-companychat` → Environment Variables**. Todas são de
runtime; **nenhuma** precisa ser marcada como *Build Variable*, porque nenhuma
tem o prefixo `NEXT_PUBLIC_`.

### A chave geral do envio

| Variável | Valor | Observação |
|---|---|---|
| `FREE_TRIAL_WHATSAPP_ENABLED` | `false` até tudo estar pronto | ausente ou vazia = desligada |

**Desligada é o padrão, e é o estado correto até o template estar aprovado, o
billing confirmado e o token rotacionado.** Com ela desligada o funil roda em
**modo somente captação**:

- o formulário grava o lead e o entrega ao CRM pelo `LEAD_WEBHOOK_URL`;
- nenhum job é criado e nenhuma mensagem é tentada;
- a página deixa de prometer contato em minutos e passa a dizer que o contato
  é feito pela equipe (`src/components/teste-gratis/conteudo.ts`);
- o worker responde `{"envioDesligado":true}` para o cron não parecer saudável
  quando na verdade o envio está travado.

Só o valor exato `true` liga. A trava existe em dois pontos, de propósito: na
captação (não cria job) e na fila (não reivindica job). Isso garante que ligar
a chave depois **não** dispare de uma vez a fila inteira de quem se cadastrou
enquanto ela estava desligada, e que desligar no meio de um incidente não
consuma tentativa de ninguém.

**Consequência operacional:** em modo captação os leads chegam e ninguém os
contata automaticamente. Alguém precisa trabalhar a coluna "Lead novo" do CRM.

### Obrigatórias para o funil funcionar

| Variável | Valor | Observação |
|---|---|---|
| `DATABASE_URL` | já existe | mesmo banco do quiz |
| `WHATSAPP_APP_SECRET` | `[PREENCHER_NO_COOLIFY]` | chave secreta do app Meta |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | `[PREENCHER_NO_COOLIFY]` | invente uma frase longa e aleatória; é o mesmo valor colado na Meta |
| `TESTE_GRATIS_WORKER_TOKEN` | `[PREENCHER_NO_COOLIFY]` | segredo do cron; sem ele a rota do worker responde 503 |

### Envio: escolha **uma** das duas opções

**Opção A — WhatsApp Cloud API (fala direto com a Meta)**

| Variável | Valor |
|---|---|
| `WHATSAPP_PROVIDER` | `cloud-api` |
| `WHATSAPP_TOKEN` | `[PREENCHER_NO_COOLIFY]` |
| `WHATSAPP_PHONE_NUMBER_ID` | `[PREENCHER_NO_COOLIFY]` |
| `WHATSAPP_API_VERSION` | `v23.0` (opcional) |

**Opção B — entregar o envio a um automatizador que já existe (n8n, plataforma)**

| Variável | Valor |
|---|---|
| `WHATSAPP_PROVIDER` | `webhook` |
| `WHATSAPP_ENVIO_WEBHOOK_URL` | `[PREENCHER_NO_COOLIFY]` |
| `WHATSAPP_ENVIO_WEBHOOK_TOKEN` | `[PREENCHER_NO_COOLIFY]` (opcional) |

Deixando `WHATSAPP_PROVIDER` em branco, o site escolhe sozinho: Cloud API se
houver token e telefone, senão o webhook de envio se houver URL, senão nenhum.

O que o site manda na opção B, com `Authorization: Bearer <token>` quando o
token existir:

```json
{
  "para": "+5562993054630",
  "template": "companychat_teste_gratis_recebido_v1",
  "idioma": "pt_BR",
  "parametros": ["Ana"]
}
```

Resposta esperada: `200` com `{ "messageId": "wamid...." }` (aceita também
`message_id`). Sem o id a mensagem é dada como enviada, mas o webhook não
consegue casar os status com o lead pelo id — ele ainda casa pelo telefone.

### Comportamento do funil

| Variável | Padrão | Faixa aceita |
|---|---|---|
| `FREE_TRIAL_FOLLOWUP_DELAY_SECONDS` | `180` | 180 a 300; fora disso é preso no limite |
| `FREE_TRIAL_DEDUPE_WINDOW_HOURS` | `24` | mínimo 1 |
| `WHATSAPP_FREE_TRIAL_TEMPLATE` | `companychat_teste_gratis_recebido_v1` | — |
| `WHATSAPP_FREE_TRIAL_TEMPLATE_LANG` | `pt_BR` | — |

### IA e CRM

| Variável | Valor | Observação |
|---|---|---|
| `IA_HANDOFF_URL` | `[PREENCHER_NO_COOLIFY]` | formato na seção 5 |
| `IA_HANDOFF_TOKEN` | `[PREENCHER_NO_COOLIFY]` | opcional, vira `Bearer` |
| `LEAD_WEBHOOK_URL` | já existe | mesmo webhook do quiz, leva o lead ao CRM |
| `LEAD_WEBHOOK_TOKEN` | já existe | — |

### Worker interno (só se não houver cron)

| Variável | Valor |
|---|---|
| `TESTE_GRATIS_WORKER_INTERNO` | `true` |
| `TESTE_GRATIS_WORKER_INTERVALO` | `30` (segundos, mínimo 15) |

---

## 4. Cron do worker (Coolify)

Onde: **aplicação `site-companychat` → Scheduled Tasks → Add**.

| Campo | Valor |
|---|---|
| Name | `teste-gratis-worker` |
| Frequency | `* * * * *` (a cada minuto) |
| Container | o container da própria aplicação |
| Command | ver abaixo |

```sh
curl -fsS -m 30 -X POST http://localhost:3000/api/teste-gratis/worker \
  -H "Authorization: Bearer $TESTE_GRATIS_WORKER_TOKEN"
```

`localhost:3000` porque a tarefa roda dentro do próprio container: o pedido não
sai para a internet e o segredo não passa pelo Traefik. O `$TESTE_GRATIS_WORKER_TOKEN`
é lido do ambiente do container, então o valor não aparece no comando.

Se preferir chamar de fora (cron em outra máquina), a URL é
`https://www.companychatia.com.br/api/teste-gratis/worker`, mesmo cabeçalho.

Resposta esperada, em JSON:

```json
{"ok":true,"reivindicados":1,"enviados":1,"adiados":0,"falhas":0,"ignorados":0}
```

`{"ok":true,"reivindicados":0,...}` é o normal: significa que não havia job
vencido naquele minuto.

**Alternativa sem cron:** `TESTE_GRATIS_WORKER_INTERNO=true`. Os dois podem
conviver; a reivindicação usa `for update skip locked` e o mesmo job nunca sai
para dois processos.

---

## 5. Formato do `IA_HANDOFF_URL`

Um endpoint HTTP seu (n8n, plataforma da CompanyChat, função própria) que
recebe `POST` com `Content-Type: application/json` e, se `IA_HANDOFF_TOKEN`
estiver definido, `Authorization: Bearer <token>`.

Ele é chamado **uma vez, quando o lead responde** — nunca antes. Deve responder
`2xx`; qualquer outra coisa é registrada como falha no evento
`free_trial_ia_handoff` e a conversa segue para tratamento humano.

Corpo enviado:

```json
{
  "origem": "site/teste-gratis",
  "gatilho": "continuar",
  "lead": {
    "id": "0f3f7a5e-1c2b-4f0a-9b77-9f5c8a1d2e34",
    "nome": "Ana Souza",
    "primeiroNome": "Ana",
    "email": "ana@suaempresa.com.br",
    "whatsapp": "+5562993054630",
    "site": "https://suaempresa.com.br/",
    "semSite": false,
    "segmento": "Odontologia",
    "solicitouTesteGratis": true,
    "consentimentoEm": "2026-08-25T14:03:11.482Z",
    "consentimentoVersao": "teste-gratis-2026-08-v1"
  },
  "atribuicao": {
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "marca",
    "utm_content": "header",
    "gclid": "Cj0KCQ...",
    "url_inicial": "https://www.companychatia.com.br/",
    "url_conversao": "https://www.companychatia.com.br/teste-gratis?origem=header",
    "referrer": "https://www.google.com/",
    "pagina": "/teste-gratis"
  },
  "conversa": {
    "statusAtual": "respondeu",
    "primeiroContatoEm": "2026-08-25T14:06:11.482Z",
    "respondeuEm": "2026-08-25T14:09:02.114Z",
    "botaoEscolhido": "Quero continuar",
    "ultimaResposta": "Quero continuar"
  },
  "jaRespondido": ["nome", "email", "whatsapp", "site", "segmento"],
  "perguntasPendentes": [
    "quantas pessoas atendem hoje pelo WhatsApp",
    "volume de conversas por dia",
    "principal dificuldade no atendimento de hoje",
    "qual solução usa hoje"
  ]
}
```

`gatilho` vale `continuar` (tocou no botão) ou `conversa` (escreveu). Os botões
"Agora não" e "Não tenho interesse" **não** chegam aqui: eles pausam ou
encerram o lead antes.

O agente do outro lado deve usar `jaRespondido` para não repetir perguntas e
seguir o roteiro de `docs/jade-teste-gratis.md`.

---

## 6. Migration

Aplicar (cria as três tabelas; o DDL é todo `if not exists` e pode rodar de novo):

```sh
npm run db:verificar
```

Ou direto no banco, sem passar pelo Node:

```sh
psql "$DATABASE_URL" -f db/teste_gratis.sql
```

Verificar que ficou tudo de pé:

```sh
psql "$DATABASE_URL" -c "\dt teste_gratis_*"
psql "$DATABASE_URL" -c "\d teste_gratis_jobs"
```

O que precisa aparecer:

- tabelas `teste_gratis_leads`, `teste_gratis_jobs`, `teste_gratis_eventos`;
- índice único `teste_gratis_jobs_unico_idx` em `(lead_id, tipo)`;
- índice único `teste_gratis_eventos_chave_idx` em `(chave) where chave is not null`.

Esses dois índices são o que impede disparo duplicado e contagem dupla de
evento. Sem eles o funil roda e erra em silêncio.

### Banco de homologação

Os testes automatizados **não** usam o Postgres de produção, e o teste de banco
fica desligado por padrão. Quando existir um banco de homologação, o comando é:

```sh
TESTE_GRATIS_DB=1 npm run test:banco -- "postgresql://USUARIO:SENHA@HOST:PORTA/BANCO?sslmode=require"
```

Ele cria leads de teste, verifica os índices e os locks, e apaga tudo o que
criou, inclusive se falhar no meio. Não rodar contra produção.

---

## 7. Roteiro de homologação ponta a ponta

### 7a. Ensaio automatizado, sem depender da Meta

Antes de gastar template aprovado e aparelho, o roteiro inteiro roda contra um
provedor simulado. É o mesmo caminho de código de produção: o formulário grava
no banco, o worker reivindica o job, o adapter chama o provedor, o webhook chega
assinado e a IA recebe o dossiê. O que **não** é exercitado é a entrega real no
WhatsApp e a aprovação do template.

Suba um Postgres exclusivo de homologação (qualquer instância vazia serve;
localmente, um container basta):

```sh
docker run -d --name cc-homolog-pg \
  --env-file /caminho/protegido/pg.env \
  -e POSTGRES_USER=homolog -e POSTGRES_DB=teste_gratis_homolog \
  -p 55432:5432 postgres:16-alpine
```

Aplique a migration (seção 6) e suba o site com o ambiente de ensaio:

```sh
DATABASE_URL="postgresql://homolog:...@127.0.0.1:55432/teste_gratis_homolog?sslmode=disable" \
WHATSAPP_PROVIDER=webhook \
WHATSAPP_ENVIO_WEBHOOK_URL=http://127.0.0.1:4599/enviar \
IA_HANDOFF_URL=http://127.0.0.1:4599/ia \
WHATSAPP_APP_SECRET="$(openssl rand -hex 32)" \
WHATSAPP_WEBHOOK_VERIFY_TOKEN="$(openssl rand -hex 32)" \
TESTE_GRATIS_WORKER_TOKEN="$(openssl rand -hex 32)" \
npx next start -p 3050
```

Com as **mesmas** variáveis no ambiente do terminal:

```sh
TESTE_GRATIS_DB=1 BASE_URL=http://localhost:3050 npm run test:homologacao
```

O script sobe o provedor e a IA falsos na porta 4599, percorre 64 verificações
(handshake e assinatura do webhook, proteção do worker, validação do
formulário, agendamento, reenvio idempotente, disparo, status, os três botões,
opt-out escrito, eco, limite por IP, honeypot e trilha de eventos) e apaga tudo
o que criou. Gere os segredos em arquivo protegido, nunca no histórico do shell.

### 7b. Roteiro manual com número autorizado

Pré-requisitos: passos 1 a 6 concluídos e o site publicado em homologação.

**Número autorizado.** Fora do modo de produção, a Cloud API só entrega para
números cadastrados em **WhatsApp Manager → Números de telefone de teste** (ou
para os destinatários permitidos do app em desenvolvimento). Use um aparelho
seu. Não use número de cliente.

| # | Ação | O que precisa acontecer |
|---|---|---|
| 1 | Abrir `https://www.companychatia.com.br/` e clicar em "Teste grátis" no cabeçalho | vai para `/teste-gratis?origem=header` |
| 2 | Enviar o formulário em branco | erros na tela, nada é enviado |
| 3 | Preencher tudo menos o consentimento e enviar | continua sem enviar |
| 4 | Marcar o consentimento, usar o número autorizado e enviar | tela "Solicitação recebida!" |
| 5 | `select status, follow_up_em from teste_gratis_leads order by criado_em desc limit 1;` | `agendado`, com `follow_up_em` 3 minutos à frente |
| 6 | `select status, tentativas from teste_gratis_jobs order by id desc limit 1;` | `pendente`, `tentativas = 0` |
| 7 | Enviar o mesmo formulário de novo, sem mudar nada | tela de sucesso igual, **nenhum** lead novo e **nenhum** job novo |
| 8 | Esperar o atraso passar (até 3 minutos + 1 minuto do cron) | template chega no WhatsApp com o primeiro nome certo e os três botões |
| 9 | `select status, whatsapp_message_id from teste_gratis_leads ...` | `contatado` ou `entregue`, com `whatsapp_message_id` preenchido |
| 10 | Abrir a conversa no celular sem responder | `lido_em` preenchido; evento `whatsapp_message_read` na tabela de eventos |
| 11 | Tocar em **"Quero continuar"** | lead vira `respondeu`; evento `free_trial_ia_handoff` com `entregue: true`; a IA assume |
| 12 | Repetir com um segundo lead e tocar em **"Agora não"** | lead vira `pausado`, job encerrado, nenhuma nova mensagem |
| 13 | Terceiro lead, tocar em **"Não tenho interesse"** | lead vira `opt_out`, evento `free_trial_opt_out` |
| 14 | Reenviar o formulário com o número do passo 13 | tela de sucesso, lead gravado como `opt_out`, **nenhum** disparo |
| 15 | Quarto lead, responder por escrito "para de mandar mensagem" | vira `opt_out` do mesmo jeito, sem depender do botão |
| 16 | `select evento, count(*) from teste_gratis_eventos group by evento;` | a série do funil presente, sem duplicidade |

Consulta de apoio para os passos 5, 6, 9 e 16:

```sql
select l.status, l.follow_up_em, l.whatsapp_message_id, l.lido_em,
       j.status as job, j.tentativas, j.ultimo_erro
  from teste_gratis_leads l
  left join teste_gratis_jobs j on j.lead_id = l.id
 order by l.criado_em desc
 limit 5;
```

Limpeza depois da homologação:

```sql
delete from teste_gratis_leads
 where email like '%@SEU_DOMINIO_DE_TESTE%'
    or whatsapp_e164 = '+55SEUNUMERO';
```

`on delete cascade` leva jobs e eventos junto.

**Se o template não chegar**, olhe primeiro:

```sql
select id, tentativas, status, ultimo_erro
  from teste_gratis_jobs order by id desc limit 5;
```

`ultimo_erro` traz a mensagem do provedor. Erros permanentes conhecidos:
template inexistente ou não aprovado, número fora da lista de teste, token sem
permissão. Corrigido o motivo, devolva o job para a fila:

```sql
update teste_gratis_jobs
   set status = 'pendente', tentativas = 0, executar_em = now(), ultimo_erro = null
 where id = <ID>;
```

---

## 7c. Auditoria pós-deploy em modo somente captação

Depois de publicar com `FREE_TRIAL_WHATSAPP_ENABLED=false`, envie um lead pelo
formulário publicado e rode:

```sh
BASE_URL=https://... DATABASE_URL="postgresql://..." npm run auditoria
```

Opcionalmente exporte `TESTE_GRATIS_WORKER_TOKEN` para ela conferir também o
worker autenticado.

É **somente leitura**: não cria lead, não apaga nada, não dispara mensagem, e
por isso pode rodar contra produção. Ela confere que a página publicada não
promete prazo, que os CTAs levam ao funil, que o caminho humano continua no ar,
que o worker recusa chamada sem token e responde com o envio desligado, que
nenhum job nasceu, que nenhum evento de envio existe e que o lead que você
mandou foi gravado inteiro, com consentimento datado e versionado.

A saída mascara nome, e-mail e telefone: dá para colar num chamado sem expor
dado pessoal.

## 8. Ordem recomendada

**Fase 1 — publicar capturando, sem enviar nada:**

1. Migration (passo 6) — não muda comportamento de nada que já existe.
2. `FREE_TRIAL_WHATSAPP_ENABLED=false` e as demais variáveis no Coolify (passo 3).
3. Publicar.
4. Enviar um lead pelo formulário e rodar a auditoria (passo 7c).
5. Combinar quem trabalha a coluna "Lead novo" do CRM enquanto o envio está
   desligado.

**Fase 2 — ligar o envio, um pré-requisito de cada vez:**

6. Template aprovado no WhatsApp Manager (passo 1).
7. Billing da conta Meta confirmado. Sem isso o envio falha com `131042`, que o
   código trata como permanente para não gastar cinco tentativas por lead.
8. Token novo criado e cadastrado como segredo no Coolify.
9. Webhook na Meta (passo 2) e cron (passo 4).
10. `IA_HANDOFF_URL` (passo 5) e base da Jade (`docs/jade-teste-gratis.md`).
11. Ensaio automatizado (passo 7a) contra homologação.
12. Primeiro envio real com número autorizado (passo 7b).
13. Só então propor `FREE_TRIAL_WHATSAPP_ENABLED=true`.
