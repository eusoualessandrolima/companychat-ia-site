/** Segmentos oferecidos no formulário. Mesma lista da seção de nichos da home
 *  (`Nichos.tsx`), para o lead chegar rotulado do jeito que o CRM já conhece.
 *  "Outro" abre o campo livre. */
export const SEGMENTOS = [
  "Clínicas e consultórios",
  "Odontologia",
  "Estética e bem-estar",
  "Academias e estúdios",
  "Imobiliárias",
  "Advocacia",
  "Contabilidade",
  "Seguros e consórcios",
  "Educação e cursos",
  "E-commerce e varejo",
  "Restaurantes e delivery",
  "Provedores de internet",
  "Franquias",
  "Turismo e hotelaria",
  "Logística e transporte",
  "Indústria e distribuição",
  "Tecnologia e software",
  "Serviços em geral",
] as const;

export const OUTRO_SEGMENTO = "Outro";

/* ─── Copy conforme o envio automático está ligado ou não ───
 *
 * Com `FREE_TRIAL_WHATSAPP_ENABLED` desligado o site roda em modo somente
 * captação: o lead é gravado e trabalhado por gente no CRM, e nenhuma mensagem
 * é disparada. Prometer "em alguns minutos" nesse estado é a mesma armadilha
 * que já custou caro aqui antes, quando o site dizia uma coisa e a Jade
 * entregava outra. As duas versões vivem lado a lado para a diferença ser
 * visível a quem for editar.
 *
 * Nada de "assim que possível" ou "em breve": a versão sem envio promete o
 * canal e o assunto, não o prazo. */

/* Só dados serializáveis: este objeto atravessa a fronteira
   servidor→cliente como prop do formulário, e função não passa por ali. O
   `{whatsapp}` é substituído no cliente por `detalheDoSucesso`. */
export type CopyDoFunil = {
  subtitulo: string;
  garantias: readonly string[];
  etapaContato: { titulo: string; texto: string };
  sucessoTexto: string;
  sucessoDetalhe: string;
};

const COM_ENVIO: CopyDoFunil = {
  subtitulo:
    "Preencha seus dados e nosso assistente entrará em contato pelo WhatsApp para entender sua operação e preparar o teste mais adequado.",
  garantias: [
    "Contato pelo WhatsApp em alguns minutos",
    "Diagnóstico do seu atendimento sem custo",
    "Sem compromisso e sem cartão de crédito",
  ],
  etapaContato: {
    titulo: "Em alguns minutos, chamamos você no WhatsApp",
    texto:
      "O primeiro contato parte do nosso assistente virtual, no número que você cadastrou.",
  },
  sucessoTexto:
    "Em alguns minutos, a CompanyChat entrará em contato com você pelo WhatsApp para continuar o atendimento.",
  sucessoDetalhe: "A mensagem chega no número {whatsapp}. Deixe o WhatsApp à mão.",
};

const SEM_ENVIO: CopyDoFunil = {
  subtitulo:
    "Preencha seus dados e nossa equipe entrará em contato pelo WhatsApp para entender sua operação e preparar o teste mais adequado.",
  garantias: [
    "Contato pelo WhatsApp",
    "Diagnóstico do seu atendimento sem custo",
    "Sem compromisso e sem cartão de crédito",
  ],
  etapaContato: {
    titulo: "Nossa equipe chama você no WhatsApp",
    texto:
      "O contato é feito por uma pessoa do time comercial, no número que você cadastrou.",
  },
  sucessoTexto:
    "A CompanyChat vai entrar em contato com você pelo WhatsApp para continuar o atendimento.",
  sucessoDetalhe:
    "O contato será feito no número {whatsapp}. Se preferir falar agora, é só nos chamar.",
};

export function copyDoFunil(envioLigado: boolean): CopyDoFunil {
  return envioLigado ? COM_ENVIO : SEM_ENVIO;
}

export function detalheDoSucesso(copy: CopyDoFunil, whatsapp: string) {
  return copy.sucessoDetalhe.replace("{whatsapp}", whatsapp);
}
