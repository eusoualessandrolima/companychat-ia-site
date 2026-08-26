import { NextResponse } from "next/server";
import { consumir, ipDaRequisicao } from "@/lib/rate-limit";
import { corpoGrandeDemais, respostaCorpoGrande } from "@/lib/corpo";
import { registrarSolicitacao } from "@/lib/teste-gratis/captacao";
import { registrarEvento } from "@/lib/teste-gratis/repositorio";
import { caiuNaIsca, validarFormulario } from "@/lib/teste-gratis/validacao";

/* Captação do funil de teste grátis.
 *
 * A rota não dispara mensagem: ela grava o lead e agenda o job. O envio é da
 * fila, que roda fora da requisição.
 *
 * Três camadas antes de gravar: honeypot (robô que preenche tudo), limite por
 * IP e deduplicação por telefone ou e-mail dentro da janela. Só a última
 * depende do banco. */

export const runtime = "nodejs";
// Rota de escrita: nada aqui pode ser servido de cache.
export const dynamic = "force-dynamic";

const LIMITE_POR_IP = 5;
const JANELA_SEGUNDOS = 600;

export async function POST(requisicao: Request) {
  if (corpoGrandeDemais(requisicao)) return respostaCorpoGrande();

  /* O limite vem **antes** do parse. Ele rodava depois, e nessa ordem um corpo
     inválido devolvia 400 sem consumir o balde: bastava mandar lixo para
     tentar à vontade, e o corpo inteiro já tinha sido alocado em memória
     antes de qualquer decisão. */
  const ip = ipDaRequisicao(requisicao.headers);
  const veredito = consumir(`teste-gratis:${ip}`, {
    limite: LIMITE_POR_IP,
    janelaSegundos: JANELA_SEGUNDOS,
  });

  if (!veredito.permitido) {
    return NextResponse.json(
      {
        ok: false,
        erro: "Muitas tentativas seguidas. Tente novamente em alguns minutos.",
      },
      { status: 429, headers: { "Retry-After": String(veredito.esperarSegundos) } }
    );
  }

  let corpo: Record<string, unknown>;
  try {
    corpo = await requisicao.json();
  } catch {
    return NextResponse.json({ ok: false, erro: "corpo inválido" }, { status: 400 });
  }

  /* Resposta de sucesso de propósito: dizer ao robô que ele foi identificado
     só ensina a próxima tentativa. Nada é gravado. */
  if (caiuNaIsca(corpo)) {
    return NextResponse.json({ ok: true, duplicado: false, agendado: false });
  }

  const validacao = validarFormulario(corpo);

  if (!validacao.ok) {
    await registrarEvento("free_trial_form_error", {
      dados: { campos: Object.keys(validacao.erros) },
    });
    return NextResponse.json(
      { ok: false, erros: validacao.erros },
      { status: 422 }
    );
  }

  try {
    const resultado = await registrarSolicitacao(validacao.lead);

    return NextResponse.json({
      ok: true,
      duplicado: resultado.duplicado,
      agendado: resultado.agendado,
    });
  } catch (erro) {
    // O erro fica no log do container com o campo, nunca com o dado pessoal.
    console.error("Falha ao registrar solicitação de teste grátis:", erro);
    return NextResponse.json(
      {
        ok: false,
        erro: "Não conseguimos registrar a sua solicitação agora. Tente de novo.",
      },
      { status: 500 }
    );
  }
}
