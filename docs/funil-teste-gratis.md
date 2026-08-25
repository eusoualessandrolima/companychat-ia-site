# Funil de teste grátis

Caminho comercial principal do site, de ponta a ponta:

```
CTA "Teste grátis"
  → /teste-gratis (formulário)
  → lead gravado no Postgres + job de follow-up agendado
  → worker envia o template aprovado pelo WhatsApp (3 minutos depois)
  → lead responde
  → webhook registra a resposta e entrega a conversa para a IA
  → IA qualifica e passa para uma pessoa quando for o caso
```

Nenhuma etapa segura requisição HTTP esperando o tempo passar. O atraso vive
como linha na tabela `teste_gratis_jobs`, e um redeploy no meio do caminho não
perde o disparo.

---

## Arquivos

| Arquivo | Papel |
|---|---|
| `db/teste_gratis.sql` | DDL das três tabelas do funil |
| `src/lib/cta.ts` | Destino e rótulos do caminho comercial (fonte única) |
| `src/components/CtaTesteGratis.tsx` | Botão compartilhado dos CTAs, com o evento de clique |
| `src/lib/analytics.ts` | Eventos do navegador e captura da primeira URL da visita |
| `src/app/teste-gratis/page.tsx` | A landing |
| `src/components/teste-gratis/Formulario.tsx` | Formulário, validação de tela e estados |
| `src/components/teste-gratis/conteudo.ts` | Segmentos e garantias |
| `src/lib/teste-gratis/consentimento.ts` | Texto e versão do consentimento |
| `src/lib/teste-gratis/config.ts` | Toda leitura de variável de ambiente do funil |
| `src/lib/teste-gratis/telefone.ts` | Normalização E.164 e variantes do `wa_id` |
| `src/lib/teste-gratis/validacao.ts` | Validação e saneamento no servidor |
| `src/lib/teste-gratis/captacao.ts` | Regra da captação: opt-out, dedupe, agendamento, CRM |
| `src/lib/teste-gratis/repositorio.ts` | Todo o SQL do funil |
| `src/lib/teste-gratis/fila.ts` | Processamento dos jobs, retentativa e bloqueios |
| `src/lib/teste-gratis/whatsapp-provedor.ts` | Adapter de envio (Cloud API ou webhook) |
| `src/lib/teste-gratis/webhook.ts` | Tradução dos eventos do provedor |
| `src/lib/teste-gratis/intencao.ts` | Botões do template e leitura de opt-out |
| `src/lib/teste-gratis/ia.ts` | Dossiê e entrega da conversa para a IA |
| `src/lib/teste-gratis/assinatura.ts` | Validação de assinatura e de segredo |
| `src/lib/rate-limit.ts` | Limite por IP, em memória |
| `src/app/api/teste-gratis/route.ts` | Captação |
| `src/app/api/teste-gratis/worker/route.ts` | Gatilho da fila (cron) |
| `src/app/api/whatsapp/webhook/route.ts` | Webhook do provedor |
| `instrumentation.ts` | Tique interno opcional da fila |

---

## Estados do lead

| Estado | Quando |
|---|---|
| `recebido` | formulário enviado |
| `agendado` | job de follow-up criado |
| `contatado` | template enviado ao provedor |
| `entregue` | provedor confirmou a entrega |
| `respondeu` | o lead escreveu ou tocou um botão |
| `qualificado` | a IA concluiu a qualificação |
| `convertido` | virou teste, demonstração ou reunião |
| `pausado` | tocou em "Agora não" ou pediu para adiar |
| `opt_out` | pediu para não ser mais contatado |
| `falha_envio` | o provedor recusou em definitivo |

`pausado` e `opt_out` são terminais para a automação: nenhum evento de entrega
os desfaz, e o job pendente é encerrado junto.

A leitura da mensagem não é estado, é a coluna `lido_em`: um `read` que chega
antes do `delivered` não pode empurrar o lead para trás.

Quem marca `qualificado` e `convertido` é quem conduz a conversa (a IA ou o
CRM), gravando o evento correspondente. O site não adivinha esses dois.

---

## Eventos

Os eventos do navegador saem pelo analytics que já existia, o Pixel do Meta,
como `trackCustom`, e também por `dataLayer` se houver um contêiner de tags.
Nenhuma ferramenta nova foi instalada.

Os eventos de servidor ficam em `teste_gratis_eventos`, que é a fonte de
verdade do funil e a trilha de auditoria.

| Evento | Onde nasce |
|---|---|
| `free_trial_cta_clicked` | navegador, no clique do CTA |
| `free_trial_form_started` | navegador, no primeiro campo tocado |
| `free_trial_form_submitted` | navegador e servidor |
| `free_trial_form_error` | navegador e servidor |
| `whatsapp_followup_scheduled` | servidor, ao criar o job |
| `whatsapp_message_sent` | servidor, no envio e no status do provedor |
| `whatsapp_message_delivered` | webhook |
| `whatsapp_message_read` | webhook |
| `whatsapp_lead_replied` | webhook |
| `free_trial_whatsapp_send_error` | fila, em qualquer falha de envio |
| `free_trial_opt_out` / `free_trial_paused` | webhook |
| `free_trial_ia_handoff` | webhook, ao acordar a IA |
| `lead_qualified` / `lead_converted` | quem conduz a conversa grava na mesma tabela |

Consulta de acompanhamento:

```sql
select evento, count(*) from teste_gratis_eventos
 where criado_em > now() - interval '7 days'
 group by evento order by 2 desc;
```

Erros de envio que ainda dão para reprocessar:

```sql
select j.id, j.tentativas, j.ultimo_erro, l.segmento
  from teste_gratis_jobs j join teste_gratis_leads l on l.id = j.lead_id
 where j.status = 'falhou';
```

Para tentar de novo um job que falhou em definitivo:

```sql
update teste_gratis_jobs
   set status = 'pendente', tentativas = 0, executar_em = now(), ultimo_erro = null
 where id = $1;
```

---

## Template do WhatsApp

A primeira mensagem é iniciada pela empresa, então tem de ser um template
aprovado. Texto livre fora da janela de 24 horas é recusado pela Meta.

Nome padrão: `companychat_teste_gratis_recebido_v1`
(configurável em `WHATSAPP_FREE_TRIAL_TEMPLATE`).

Corpo submetido ao WhatsApp Manager:

> Olá, {{1}}! Recebemos sua solicitação de teste grátis da CompanyChat pelo
> nosso site. Posso fazer algumas perguntas rápidas para entender sua operação
> e preparar o melhor teste para você?

`{{1}}` é o primeiro nome do lead.

Botões de resposta rápida, com o `payload` exatamente nestes valores (o código
lê por `payload`, não pelo rótulo):

| Rótulo | `payload` | Efeito |
|---|---|---|
| Quero continuar | `teste_gratis_continuar` | acorda a IA |
| Agora não | `teste_gratis_agora_nao` | marca `pausado`, sem nova tentativa |
| Não tenho interesse | `teste_gratis_sem_interesse` | marca `opt_out` |

Submeta na categoria que o WhatsApp Manager indicar como adequada e aceite
eventual recategorização da Meta. Forçar categoria para conseguir aprovação
custa bloqueio depois.

Quem digita em vez de tocar no botão também é entendido: "parar", "sair",
"não quero", "remover meu número" e afins viram opt-out; "agora não" e "mais
tarde" viram pausa. A regra vive em `src/lib/teste-gratis/intencao.ts`.

---

## A conversa da IA

A IA não roda neste repositório. O site entrega o dossiê do lead em
`IA_HANDOFF_URL` (`src/lib/teste-gratis/ia.ts`) assim que a pessoa responde, e
nunca antes disso.

O dossiê leva nome, e-mail, WhatsApp, site, segmento, atribuição de campanha, o
histórico do atendimento e a lista `jaRespondido`. Configure o agente para não
repetir nada dessa lista.

Roteiro da conversa, na ordem, uma pergunta por vez:

1. confirmar a intenção de testar;
2. quantas pessoas atendem hoje pelo WhatsApp;
3. volume de conversas e principal dificuldade;
4. qual solução usa hoje;
5. mostrar em poucas linhas como a CompanyChat resolve aquilo;
6. oferecer o próximo passo: teste, demonstração, reunião ou atendimento humano.

Regras do agente:

- identificar-se como assistente virtual da CompanyChat, sem fingir ser pessoa;
- não inventar preço, integração ou funcionalidade (a base de conhecimento é a
  fonte, e ela vem do conteúdo deste site);
- transferir para humano em pedido explícito, baixa confiança, negociação,
  questão técnica sensível ou intenção clara de compra;
- deixar sempre visível o caminho para falar com gente.

O caminho humano direto continua aberto no site inteiro: os botões flutuantes
de Comercial e Suporte não passam pelo funil.

---

## Como rodar a fila

Preferido, cron do Coolify (Scheduled Task, a cada minuto):

```bash
curl -fsS -X POST https://www.companychatia.com.br/api/teste-gratis/worker \
     -H "Authorization: Bearer $TESTE_GRATIS_WORKER_TOKEN"
```

Alternativa enquanto o cron não existe: `TESTE_GRATIS_WORKER_INTERNO=true`
liga um tique dentro do próprio processo do site (`instrumentation.ts`).

Os dois podem conviver. A reivindicação dos jobs usa `for update skip locked`,
então o mesmo job nunca sai para dois processos.

---

## Testes

```bash
npm run test:unidade        # 55 testes, sem banco e sem rede
npm run test:teste-gratis   # navegação dos CTAs, formulário e responsividade
TESTE_GRATIS_DB=1 npm run test:banco -- "postgresql://..."   # índices e locks
```

O provedor de WhatsApp é sempre falso nos testes. Nenhuma mensagem real sai da
suíte, e nenhum lead real é criado.
