/* Eventos do funil, no analytics que o site já tem.
 *
 * Nenhuma ferramenta nova foi instalada. O que existe é o Pixel do Meta
 * (`src/components/comecar/MetaPixel.tsx`), então o evento sai por `fbq` como
 * evento personalizado, e também por `dataLayer` quando houver um contêiner de
 * tags no ar. Sem nenhum dos dois, a chamada não faz nada e nada quebra.
 *
 * ─── Por que existe uma fila de eventos ───
 *
 * O Pixel não é carregado no site inteiro: ele só é montado nas páginas que
 * declaram `<MetaPixel />` (as landings de anúncio, a calculadora e
 * `/teste-gratis`). Esse é o consentimento vigente, e é o que a política de
 * privacidade descreve. Carregar o Pixel na home só para medir o clique do
 * cabeçalho ampliaria o rastreamento para o site todo, o que é decisão do dono,
 * não efeito colateral de uma métrica.
 *
 * Então `free_trial_cta_clicked`, disparado num CTA da home, fica guardado na
 * sessão do navegador e é entregue ao Pixel quando a pessoa chega em
 * `/teste-gratis`, que já carrega o Pixel. O evento não se perde e nenhuma
 * página passa a rastrear o que não rastreava.
 *
 * Os eventos de servidor (envio, entrega, leitura, resposta) não passam por
 * aqui: eles nascem no webhook e ficam em `teste_gratis_eventos`, que é a
 * fonte de verdade do funil. Este módulo é só a metade que roda no navegador. */

export type EventoCliente =
  | "free_trial_cta_clicked"
  | "free_trial_form_started"
  | "free_trial_form_submitted"
  | "free_trial_form_error";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

const CHAVE_PRIMEIRA_VISITA = "cc_url_inicial";
const CHAVE_PENDENTES = "cc_eventos_pendentes";

/* Teto da fila. Um punhado de cliques de CTA na mesma visita é o cenário real;
   mais que isso é robô ou dedo nervoso, e não vale encher o sessionStorage. */
const MAXIMO_PENDENTES = 10;

type Pendente = { nome: EventoCliente; dados: Record<string, unknown> };

/** Primeira URL da visita, guardada na sessão do navegador.
 *
 *  Sem isto a atribuição só enxerga a página do formulário, e a campanha que
 *  trouxe a pessoa desaparece quando ela navega antes de converter. Escrita no
 *  primeiro clique de CTA e na abertura do formulário, o que cobre também quem
 *  cai direto na página. */
export function urlInicial() {
  if (typeof window === "undefined") return "";

  try {
    const guardada = window.sessionStorage.getItem(CHAVE_PRIMEIRA_VISITA);
    if (guardada) return guardada;

    const atual = window.location.href;
    window.sessionStorage.setItem(CHAVE_PRIMEIRA_VISITA, atual);
    return atual;
  } catch {
    // Navegação privada em iOS recusa sessionStorage. Atribuição não é motivo
    // para quebrar a página.
    return "";
  }
}

/** O Pixel está nesta página? O trecho embutido pelo `MetaPixel` define o
 *  `fbq` de forma síncrona, então isto é verdadeiro assim que aquele script
 *  roda, mesmo antes de a biblioteca da Meta terminar de carregar. */
function pixelDisponivel() {
  return typeof window !== "undefined" && typeof window.fbq === "function";
}

function lerPendentes(): Pendente[] {
  try {
    const bruto = window.sessionStorage.getItem(CHAVE_PENDENTES);
    if (!bruto) return [];
    const lista: unknown = JSON.parse(bruto);
    return Array.isArray(lista) ? (lista as Pendente[]) : [];
  } catch {
    return [];
  }
}

function enfileirar(nome: EventoCliente, dados: Record<string, unknown>) {
  try {
    const fila = lerPendentes();
    fila.push({ nome, dados });
    window.sessionStorage.setItem(
      CHAVE_PENDENTES,
      JSON.stringify(fila.slice(-MAXIMO_PENDENTES))
    );
  } catch {
    /* Sem sessionStorage o evento se perde. É o pior caso aceitável: medição
       não pode atrapalhar a navegação. */
  }
}

function enviarAoPixel(nome: EventoCliente, dados: Record<string, unknown>) {
  /* `trackCustom` e não `track`: os nomes do funil não estão no catálogo de
     eventos padrão da Meta, e `track` com nome desconhecido é descartado. */
  window.fbq?.("trackCustom", nome, dados);

  // O envio também alimenta o evento padrão, que é o que a campanha otimiza.
  if (nome === "free_trial_form_submitted") window.fbq?.("track", "Lead");
}

export function evento(nome: EventoCliente, dados: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  try {
    /* O `dataLayer` só existe se houver contêiner de tags carregado nesta
       página, e ele tem o próprio controle de consentimento. Empurrar num
       array que não existe é `undefined?.push`, ou seja, nada. */
    window.dataLayer?.push({ event: nome, ...dados });

    if (pixelDisponivel()) enviarAoPixel(nome, dados);
    else enfileirar(nome, dados);
  } catch {
    /* Bloqueador de anúncio derruba o `fbq` no meio da chamada. Medição não
       pode impedir a pessoa de enviar o formulário. */
  }
}

/** Entrega ao Pixel os eventos guardados em páginas que não o carregam.
 *  Devolve quantos foram entregues, o que é o que o teste verifica.
 *
 *  Chamado por `EventosPendentes`, montado apenas em `/teste-gratis`. */
export function descarregarPendentes() {
  if (!pixelDisponivel()) return 0;

  try {
    const fila = lerPendentes();
    if (fila.length === 0) return 0;

    /* Limpa antes de enviar: se um erro estourar no meio, o pior caso é perder
       um evento, e não repeti-lo a cada carregamento de página. */
    window.sessionStorage.removeItem(CHAVE_PENDENTES);

    for (const item of fila) {
      enviarAoPixel(item.nome, { ...item.dados, adiado: true });
    }

    return fila.length;
  } catch {
    return 0;
  }
}
