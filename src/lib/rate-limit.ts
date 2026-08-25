/* Limite de requisições por origem, em memória.
 *
 * O site roda num container só no Coolify, então a contagem em memória cobre
 * o tráfego real. Se um dia houver mais de uma instância, cada uma passa a ter
 * o próprio balde e o teto efetivo multiplica pelo número de instâncias; a
 * barreira que não depende disso é a deduplicação no banco, que impede o
 * segundo disparo para o mesmo contato.
 *
 * O mapa vive no `globalThis` porque em desenvolvimento o Next recarrega os
 * módulos e zeraria a contagem a cada edição. */

type Balde = { inicio: number; usos: number };

const global_ = globalThis as typeof globalThis & {
  baldesRateLimit?: Map<string, Balde>;
};

function baldes() {
  if (!global_.baldesRateLimit) global_.baldesRateLimit = new Map();
  return global_.baldesRateLimit;
}

export type Veredito = { permitido: boolean; esperarSegundos: number };

export function consumir(
  chave: string,
  { limite, janelaSegundos }: { limite: number; janelaSegundos: number }
): Veredito {
  const agora = Date.now();
  const janela = janelaSegundos * 1000;
  const mapa = baldes();

  // Faxina barata: sem ela o mapa cresce com cada IP que passou uma vez.
  if (mapa.size > 5000) {
    for (const [k, v] of mapa) {
      if (agora - v.inicio > janela) mapa.delete(k);
    }
  }

  const balde = mapa.get(chave);

  if (!balde || agora - balde.inicio > janela) {
    mapa.set(chave, { inicio: agora, usos: 1 });
    return { permitido: true, esperarSegundos: 0 };
  }

  balde.usos += 1;

  if (balde.usos > limite) {
    return {
      permitido: false,
      esperarSegundos: Math.ceil((janela - (agora - balde.inicio)) / 1000),
    };
  }

  return { permitido: true, esperarSegundos: 0 };
}

/** IP de quem chamou, atrás do Traefik do Coolify.
 *
 *  **Nunca o primeiro item de `x-forwarded-for`.** O cabeçalho é uma cadeia da
 *  esquerda para a direita e o Traefik *acrescenta* o IP real ao que já veio na
 *  requisição. Ler o primeiro item é ler o que o cliente mandou: bastaria
 *  enviar `x-forwarded-for: 1.2.3.4` com um valor diferente a cada tentativa
 *  para o limite por IP nunca fechar. Quem sabe a verdade é o proxy, e o que
 *  ele escreveu está no **fim** da cadeia.
 *
 *  `x-real-ip` vem primeiro por ser um valor único posto pelo proxy, sem
 *  cadeia para interpretar.
 *
 *  Isto pressupõe que só o Traefik fala com a aplicação, que é o caso no
 *  Coolify. Expor a porta 3000 direto na internet devolveria o problema, agora
 *  pelos dois cabeçalhos. */
export function ipDaRequisicao(cabecalhos: Headers) {
  const doProxy = cabecalhos.get("x-real-ip")?.trim();
  if (doProxy) return doProxy;

  const cadeia = cabecalhos.get("x-forwarded-for");
  if (cadeia) {
    const partes = cadeia
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    if (partes.length > 0) return partes[partes.length - 1];
  }

  return "desconhecido";
}
