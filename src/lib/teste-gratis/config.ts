/* Configuração do funil de teste grátis, lida uma vez por processo.
   Tudo o que muda entre ambientes vive aqui: nada de `process.env` espalhado
   pelas rotas.

   Regra do projeto (ver `src/lib/env.ts`): variável declarada no Docker e não
   preenchida chega como string vazia, então `??` não serve como padrão. */

function texto(valor: string | undefined) {
  const limpo = valor?.trim();
  return limpo ? limpo : undefined;
}

function inteiro(valor: string | undefined, padrao: number) {
  const n = Number.parseInt(texto(valor) ?? "", 10);
  return Number.isFinite(n) ? n : padrao;
}

/** Chave geral do envio de WhatsApp do funil.
 *
 *  **Desligado é o padrão.** Variável ausente, vazia ou com qualquer valor que
 *  não seja exatamente `true` significa não enviar. Um interruptor que protege
 *  disparo para cliente não pode depender de alguém lembrar de desligá-lo: ele
 *  nasce desligado e só liga por decisão explícita.
 *
 *  Com ele desligado o funil roda em **modo somente captação**: o formulário
 *  grava o lead, nenhum job é criado, nenhuma mensagem é tentada, e a página
 *  deixa de prometer contato em minutos. É o estado correto enquanto o template
 *  não está aprovado, o billing não está confirmado ou o token não foi
 *  rotacionado. */
export function envioWhatsappLigado() {
  return texto(process.env.FREE_TRIAL_WHATSAPP_ENABLED) === "true";
}

export const ATRASO_MINIMO_SEGUNDOS = 180;
export const ATRASO_MAXIMO_SEGUNDOS = 300;

/** Atraso do follow-up, em segundos. O pedido do produto é "alguns minutos":
 *  180s de padrão, com teto de 300s para o contato não chegar frio. */
export function atrasoFollowUpSegundos(
  bruto = process.env.FREE_TRIAL_FOLLOWUP_DELAY_SECONDS
) {
  const valor = inteiro(bruto, ATRASO_MINIMO_SEGUNDOS);
  return Math.min(Math.max(valor, ATRASO_MINIMO_SEGUNDOS), ATRASO_MAXIMO_SEGUNDOS);
}

/** Janela em que uma nova solicitação do mesmo telefone ou e-mail é tratada
 *  como a mesma solicitação, em vez de virar um segundo disparo. */
export function janelaDeduplicacaoHoras() {
  return Math.max(1, inteiro(process.env.FREE_TRIAL_DEDUPE_WINDOW_HOURS, 24));
}

export function configWhatsApp() {
  return {
    template:
      texto(process.env.WHATSAPP_FREE_TRIAL_TEMPLATE) ??
      "companychat_teste_gratis_recebido_v1",
    idioma: texto(process.env.WHATSAPP_FREE_TRIAL_TEMPLATE_LANG) ?? "pt_BR",
    /* `cloud-api` fala direto com a Graph API da Meta; `webhook` entrega o
       pedido de envio a um automatizador já existente (n8n, plataforma da
       CompanyChat). Sem credencial nenhuma o provedor é `nenhum`: a fila
       registra a tentativa e não inventa envio. */
    provedor: texto(process.env.WHATSAPP_PROVIDER),
    token: texto(process.env.WHATSAPP_TOKEN),
    telefoneId: texto(process.env.WHATSAPP_PHONE_NUMBER_ID),
    versaoApi: texto(process.env.WHATSAPP_API_VERSION) ?? "v23.0",
    envioWebhookUrl: texto(process.env.WHATSAPP_ENVIO_WEBHOOK_URL),
    envioWebhookToken: texto(process.env.WHATSAPP_ENVIO_WEBHOOK_TOKEN),
    verifyToken: texto(process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN),
    appSecret: texto(process.env.WHATSAPP_APP_SECRET),
  };
}

export function configIa() {
  return {
    url: texto(process.env.IA_HANDOFF_URL),
    token: texto(process.env.IA_HANDOFF_TOKEN),
  };
}

/** Segredo que autoriza o cron a rodar a fila. Sem ele a rota do worker
 *  responde 503: fila aberta na internet é fila de outra pessoa. */
export function tokenDoWorker() {
  return texto(process.env.TESTE_GRATIS_WORKER_TOKEN);
}

/** Liga o tique interno do processo (ver `instrumentation.ts`). Serve quando
 *  ainda não há cron externo configurado no Coolify. */
export function workerInternoLigado() {
  return texto(process.env.TESTE_GRATIS_WORKER_INTERNO) === "true";
}

export function intervaloWorkerInternoSegundos() {
  return Math.max(15, inteiro(process.env.TESTE_GRATIS_WORKER_INTERVALO, 30));
}

/** Espera antes da próxima tentativa, com teto de 30 minutos. Backoff
 *  exponencial a partir de 30s: 30s, 60s, 120s, 240s, 480s. */
export function backoffSegundos(tentativas: number) {
  return Math.min(30 * 2 ** Math.max(0, tentativas - 1), 1800);
}
