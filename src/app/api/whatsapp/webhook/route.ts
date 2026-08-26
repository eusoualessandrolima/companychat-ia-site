import { after, NextResponse } from "next/server";
import { assinaturaConfere, segredoConfere } from "@/lib/teste-gratis/assinatura";
import { configWhatsApp } from "@/lib/teste-gratis/config";
import { processarWebhook } from "@/lib/teste-gratis/webhook";
import { corpoGrandeDemais } from "@/lib/corpo";

/* Webhook do WhatsApp: status das mensagens que saíram e respostas que
 * chegaram.
 *
 * Este endpoint não espera nada e não agenda nada. O follow-up de três minutos
 * é da fila; aqui só se registra o que já aconteceu.
 *
 * O provedor corta a entrega quando a resposta demora, e reentrega o mesmo
 * evento quando não recebe 200. Por isso a rota confirma primeiro e processa
 * depois, e o processamento deduplica pelo id da mensagem. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Handshake de verificação da Meta ao cadastrar a URL. */
export async function GET(requisicao: Request) {
  const { verifyToken } = configWhatsApp();
  if (!verifyToken) return new NextResponse("não configurado", { status: 503 });

  const parametros = new URL(requisicao.url).searchParams;

  if (
    parametros.get("hub.mode") === "subscribe" &&
    segredoConfere(parametros.get("hub.verify_token"), verifyToken)
  ) {
    return new NextResponse(parametros.get("hub.challenge") ?? "", { status: 200 });
  }

  return new NextResponse("proibido", { status: 403 });
}

export async function POST(requisicao: Request) {
  const { appSecret } = configWhatsApp();

  /* Sem App Secret não dá para saber quem mandou o evento. Recusar é melhor do
     que confiar: com a URL na mão, qualquer um marcaria leads como
     respondidos e acordaria a IA. */
  if (!appSecret) {
    console.error("Webhook do WhatsApp chamado sem WHATSAPP_APP_SECRET configurado");
    return new NextResponse(null, { status: 503 });
  }

  /* Teto de tamanho antes de ler. Aqui a ordem não pode ser invertida como nas
     outras rotas — a assinatura é calculada sobre o corpo cru, então ele
     precisa ser lido para ser verificado, e quem não tem a assinatura ainda
     assim consegue fazer a aplicação alocar o corpo inteiro. Limitar o
     tamanho é a única defesa que sobra antes da leitura.

     256 KB porque um lote de status da Cloud API é maior que um formulário:
     o padrão de 64 KB cortaria evento legítimo. */
  if (corpoGrandeDemais(requisicao, 256 * 1024)) {
    return new NextResponse(null, { status: 413 });
  }

  // O corpo cru é o que foi assinado: reserializar o JSON muda os bytes.
  const bruto = await requisicao.text();

  if (!assinaturaConfere(bruto, requisicao.headers.get("x-hub-signature-256"), appSecret)) {
    return new NextResponse(null, { status: 401 });
  }

  let corpo: unknown;
  try {
    corpo = JSON.parse(bruto);
  } catch {
    // 200 de propósito: corpo ilegível não melhora com reentrega.
    return new NextResponse(null, { status: 200 });
  }

  /* `after` roda depois da resposta sair, e o Next segura o processo até
     terminar. É o que permite confirmar em milissegundos sem perder o
     trabalho, que é o que aconteceria com uma promessa solta.

     Um erro aqui não pode virar 500: a Meta reentregaria o lote inteiro. Como
     o processamento deduplica pelo id da mensagem, reentrega é inofensiva, mas
     500 em série derruba a assinatura do webhook. */
  after(async () => {
    try {
      await processarWebhook(corpo);
    } catch (erro) {
      console.error("Falha ao processar webhook do WhatsApp:", erro);
    }
  });

  return new NextResponse(null, { status: 200 });
}
