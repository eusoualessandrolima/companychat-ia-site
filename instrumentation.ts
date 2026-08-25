/* Tique interno da fila de follow-up.
 *
 * O agendamento é durável porque vive no Postgres; isto aqui é só o gatilho.
 * O gatilho de produção recomendado é o cron chamando
 * `/api/teste-gratis/worker`, que sobrevive a qualquer coisa que aconteça com
 * o processo do site. Este tique existe para o funil funcionar antes de o cron
 * estar configurado, e é desligado por padrão.
 *
 * Não é `setTimeout` dentro da requisição: o job já está gravado antes de o
 * tique existir, então um redeploy no meio do caminho não perde o disparo,
 * apenas o adia até o próximo tique. */

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { workerInternoLigado, intervaloWorkerInternoSegundos } = await import(
    "./src/lib/teste-gratis/config"
  );

  if (!workerInternoLigado()) return;

  const { processarFila } = await import("./src/lib/teste-gratis/fila");
  const intervalo = intervaloWorkerInternoSegundos() * 1000;

  let rodando = false;

  const tique = setInterval(async () => {
    // Uma rodada por vez: envio lento não pode empilhar rodadas.
    if (rodando) return;
    rodando = true;
    try {
      const resumo = await processarFila();
      if (resumo.reivindicados > 0) {
        console.log("Fila de teste grátis:", JSON.stringify(resumo));
      }
    } catch (erro) {
      console.error("Tique da fila de teste grátis falhou:", erro);
    } finally {
      rodando = false;
    }
  }, intervalo);

  // Sem isto o processo não encerra sozinho em ambiente de teste.
  tique.unref?.();

  console.log(
    `Fila de teste grátis: tique interno ligado a cada ${intervalo / 1000}s`
  );
}
