import { configWhatsApp } from "./config";

/* Adapter de envio de mensagem iniciada pela empresa.
 *
 * O site não tinha integração de envio: o WhatsApp aparecia só como link
 * `wa.me`. Este módulo é a única porta para fora, e existe em duas
 * implementações, escolhidas por variável de ambiente:
 *
 *   cloud-api  fala direto com a Graph API da Meta (WhatsApp Cloud API)
 *   webhook    entrega o pedido de envio a um automatizador que já existe
 *              (n8n ou a própria plataforma da CompanyChat), que conhece as
 *              credenciais e faz a chamada
 *
 * Sem credencial nenhuma o provedor é `nenhum`: a fila registra a tentativa,
 * marca o job como falha e ninguém finge que a mensagem saiu.
 *
 * A primeira mensagem é sempre um template aprovado. Fora da janela de 24h a
 * Meta recusa texto livre, e a recusa chegaria como erro no meio da campanha. */

export type PedidoTemplate = {
  paraE164: string;
  template: string;
  idioma: string;
  /** Variáveis posicionais do corpo. Hoje só `{{1}}`, o primeiro nome. */
  parametros: string[];
};

export type ResultadoEnvio =
  | { ok: true; messageId: string | null; provedor: string }
  | { ok: false; erro: string; permanente: boolean; provedor: string };

export type Provedor = {
  nome: string;
  enviarTemplate(pedido: PedidoTemplate): Promise<ResultadoEnvio>;
};

/* Erros que não melhoram com retentativa: número inválido, template
   inexistente ou credencial errada. Insistir neles só queima a fila.

   `131_042` é o de conta sem forma de pagamento válida. Ele **é** recuperável,
   mas só depois de alguém arrumar o billing no Business Manager, o que não
   acontece em minutos. Tratado como permanente para não gastar cinco
   tentativas por lead enquanto a conta está bloqueada; o job fica em `falhou`
   com o motivo e volta à fila pelo SQL de reprocessamento assim que o
   pagamento estiver regularizado. */
const CODIGOS_PERMANENTES = new Set([
  131_026, 131_042, 131_047, 132_000, 132_001, 132_007, 132_012, 190,
]);

export function escolherProvedor(): Provedor {
  const config = configWhatsApp();
  const declarado = config.provedor;

  if (declarado === "nenhum") return provedorNulo();
  if (declarado === "cloud-api" || (!declarado && config.token && config.telefoneId)) {
    if (!config.token || !config.telefoneId) return provedorNulo("cloud-api sem credencial");
    return cloudApi(config.token, config.telefoneId, config.versaoApi);
  }
  if (declarado === "webhook" || (!declarado && config.envioWebhookUrl)) {
    if (!config.envioWebhookUrl) return provedorNulo("webhook sem URL");
    return webhookDeEnvio(config.envioWebhookUrl, config.envioWebhookToken);
  }

  return provedorNulo();
}

function provedorNulo(motivo = "nenhum provedor de WhatsApp configurado"): Provedor {
  return {
    nome: "nenhum",
    async enviarTemplate() {
      return { ok: false, erro: motivo, permanente: true, provedor: "nenhum" };
    },
  };
}

function cloudApi(token: string, telefoneId: string, versao: string): Provedor {
  return {
    nome: "cloud-api",
    async enviarTemplate(pedido) {
      const corpo = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        // A Graph API aceita o E.164 sem o `+`.
        to: pedido.paraE164.replace(/\D/g, ""),
        type: "template",
        template: {
          name: pedido.template,
          language: { code: pedido.idioma },
          components: pedido.parametros.length
            ? [
                {
                  type: "body",
                  parameters: pedido.parametros.map((text) => ({ type: "text", text })),
                },
              ]
            : [],
        },
      };

      try {
        const resposta = await fetch(
          `https://graph.facebook.com/${versao}/${telefoneId}/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(corpo),
            signal: AbortSignal.timeout(15_000),
          }
        );

        const dados = (await resposta.json().catch(() => ({}))) as {
          messages?: { id?: string }[];
          error?: { message?: string; code?: number };
        };

        if (!resposta.ok) {
          const codigo = dados.error?.code;
          return {
            ok: false,
            // Mensagem da Meta, nunca o token: o erro vai para o banco e o log.
            erro: `Meta ${resposta.status}${codigo ? ` (${codigo})` : ""}: ${
              dados.error?.message ?? "sem detalhe"
            }`,
            permanente:
              resposta.status === 400 &&
              typeof codigo === "number" &&
              CODIGOS_PERMANENTES.has(codigo),
            provedor: "cloud-api",
          };
        }

        return {
          ok: true,
          messageId: dados.messages?.[0]?.id ?? null,
          provedor: "cloud-api",
        };
      } catch (erro) {
        return {
          ok: false,
          erro: `falha de rede: ${(erro as Error).message}`,
          permanente: false,
          provedor: "cloud-api",
        };
      }
    },
  };
}

function webhookDeEnvio(url: string, token: string | undefined): Provedor {
  return {
    nome: "webhook",
    async enviarTemplate(pedido) {
      try {
        const resposta = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            para: pedido.paraE164,
            template: pedido.template,
            idioma: pedido.idioma,
            parametros: pedido.parametros,
          }),
          signal: AbortSignal.timeout(15_000),
        });

        if (!resposta.ok) {
          return {
            ok: false,
            erro: `webhook de envio respondeu ${resposta.status}`,
            // 4xx é configuração errada; 5xx é o outro lado passando mal.
            permanente: resposta.status >= 400 && resposta.status < 500,
            provedor: "webhook",
          };
        }

        const dados = (await resposta.json().catch(() => ({}))) as {
          messageId?: string;
          message_id?: string;
        };

        return {
          ok: true,
          messageId: dados.messageId ?? dados.message_id ?? null,
          provedor: "webhook",
        };
      } catch (erro) {
        return {
          ok: false,
          erro: `falha de rede: ${(erro as Error).message}`,
          permanente: false,
          provedor: "webhook",
        };
      }
    },
  };
}
