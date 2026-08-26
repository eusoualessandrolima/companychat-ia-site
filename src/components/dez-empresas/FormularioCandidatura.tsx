"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  Loader2,
  Lock,
  MessageSquareText,
  Phone,
  ShieldCheck,
  Tag,
  Target,
  TrendingUp,
  User,
} from "lucide-react";
import { evento, urlInicial } from "@/lib/analytics";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/icones/WhatsAppIcon";
import {
  CONSENTIMENTO_VERSAO,
  formulario,
  IDENTIFICACAO,
  OBJETIVOS,
  OUTRO_SEGMENTO,
  SEGMENTOS,
  VOLUMES,
} from "./conteudo";

type Campos = {
  nome: string;
  empresa: string;
  telefone: string;
  segmento: string;
  volume: string;
  problema: string;
  objetivo: string;
  consentimento: boolean;
};

type Erros = Partial<Record<keyof Campos | "geral", string>>;

const VAZIO: Campos = {
  nome: "",
  empresa: "",
  telefone: "",
  segmento: "",
  volume: "",
  problema: "",
  objetivo: "",
  consentimento: false,
};

/** Quais campos pertencem a cada etapa. A divisão é **só de interface**: o
 *  envio continua sendo um POST único, no fim, com o mesmo `id` de lead do
 *  começo — a idempotência do upsert depende disso. */
const ETAPAS: (keyof Campos)[][] = [
  ["nome", "empresa", "telefone"],
  ["segmento", "volume", "objetivo", "problema", "consentimento"],
];

/** Limite dos campos abertos. O servidor corta a dor em 400 caracteres e cada
 *  valor da origem em 600: cortar aqui evita que a pessoa escreva um texto que
 *  chegaria truncado do outro lado sem ela saber. */
const LIMITE_TEXTO = 400;

const CAMPOS_ORIGEM = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
] as const;

/* Mesma máscara das LPs: DDD entre parênteses e o nono dígito. */
function mascararTelefone(valor: string) {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function classesCampo(temErro: boolean, comIcone = true) {
  /* `scroll-my-32`: quando o envio falha, o foco vai para o primeiro campo com
     erro e o navegador rola até ele. No celular, com o teclado virtual aberto
     sobrando pouco mais da metade da tela, um textarea de três linhas parava
     encostando na borda do teclado. A margem de rolagem dá a folga.

     `border-dark-field-border` e não `border-dark-border`: aquele é token de
     divisor e dava 1,40:1 contra o cartão — borda de campo é componente de UI
     e a WCAG 1.4.11 exige 3:1. O token certo já existia e não era usado em
     lugar nenhum do projeto. */
  return `w-full scroll-my-32 rounded-2xl border bg-dark-surface py-3.5 ${
    comIcone ? "pl-12" : "pl-4"
  } pr-4 text-dark-text placeholder:text-dark-muted/60 transition-colors focus:outline-none ${
    temErro
      ? "border-dark-error-border"
      : "border-dark-field-border focus:border-primary"
  }`;
}

/** A conversa já abre com o contexto da candidatura, para quem atender do
 *  outro lado saber de onde a pessoa veio. */
function mensagemWhatsApp(nome: string, empresa: string) {
  return [
    "Olá! Acabei de me candidatar na seleção das 10 empresas e quero testar a IA da CompanyChat.",
    "",
    `Nome: ${nome.trim()}`,
    `Empresa: ${empresa.trim()}`,
  ].join("\n");
}

export default function FormularioCandidatura() {
  const [campos, setCampos] = useState<Campos>(VAZIO);
  const [erros, setErros] = useState<Erros>({});
  const [etapa, setEtapa] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const origem = useRef<Record<string, string>>({});
  const idLead = useRef("");
  const comecou = useRef(false);
  /* Trava fora do estado: dois cliques rápidos disparam os dois manipuladores
     antes de o React repintar com `enviando`. */
  const emVoo = useRef(false);
  /* Campo isca. Fora do estado de propósito: ele não deve reagir a nada nem
     entrar no ciclo de render — só ser lido no envio. */
  const isca = useRef<HTMLInputElement>(null);
  const tituloEtapa = useRef<HTMLParagraphElement>(null);
  const tituloSucesso = useRef<HTMLHeadingElement>(null);
  /* Marca o momento do aceite, e não o do envio: são coisas diferentes se a
     pessoa marcar a caixa e só enviar minutos depois. */
  const consentidoEm = useRef<string | null>(null);

  /* Atribuição lida do `window` para a página continuar estática, sem
     fronteira de Suspense. Mesmo padrão das LPs e de `/teste-gratis`.
     Roda na montagem do formulário, que acontece junto com a da página — se
     esperasse a última etapa, as UTMs já teriam saído da URL. */
  useEffect(() => {
    try {
      idLead.current = crypto.randomUUID();
    } catch {
      /* `crypto.randomUUID` não existe fora de secure context (um preview
         servido por http num host que não seja localhost, por exemplo). Sem
         este catch, a exceção abortava o efeito inteiro e a atribuição de
         campanha era perdida silenciosamente. */
      idLead.current = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    const busca = new URLSearchParams(window.location.search);
    const coletado: Record<string, string> = { ...IDENTIFICACAO };

    for (const chave of CAMPOS_ORIGEM) {
      const valor = busca.get(chave);
      if (valor) coletado[chave] = valor;
    }

    coletado.pagina = window.location.pathname;
    coletado.url_conversao = window.location.href;
    coletado.url_inicial = urlInicial();
    if (document.referrer) coletado.referrer = document.referrer;

    origem.current = coletado;
  }, []);

  function marcarInicio() {
    if (comecou.current) return;
    comecou.current = true;
    evento("campanha10_form_started");
  }

  function alterar<C extends keyof Campos>(campo: C, valor: Campos[C]) {
    marcarInicio();
    if (campo === "consentimento" && valor === true && !consentidoEm.current) {
      consentidoEm.current = new Date().toISOString();
    }
    setCampos((atuais) => ({ ...atuais, [campo]: valor }));
    if (erros[campo]) {
      setErros((atuais) => {
        const restantes = { ...atuais };
        delete restantes[campo];
        return restantes;
      });
    }
  }

  /** Valida só os campos da etapa pedida — ou todos, quando `alcance` é null. */
  function validar(alcance: (keyof Campos)[] | null): Erros {
    const todos: Erros = {};

    if (campos.nome.trim().length < 2) {
      todos.nome = "Informe o seu nome";
    }
    if (campos.empresa.trim().length < 2) {
      todos.empresa = "Informe o nome da empresa";
    }
    if (campos.telefone.replace(/\D/g, "").length < 10) {
      todos.telefone = "Informe o DDD e o número";
    }
    if (!campos.segmento) todos.segmento = "Escolha o segmento da empresa";
    if (!campos.volume) todos.volume = "Escolha a faixa de contatos";
    if (!campos.objetivo) todos.objetivo = "Escolha o objetivo principal";
    if (campos.problema.trim().length < 10) {
      todos.problema = "Descreva o principal problema do atendimento";
    }
    if (!campos.consentimento) {
      todos.consentimento = "É preciso concordar para enviar a candidatura";
    }

    if (!alcance) return todos;

    const recortados: Erros = {};
    for (const campo of alcance) {
      if (todos[campo]) recortados[campo] = todos[campo];
    }
    return recortados;
  }

  function focarPrimeiroErro(encontrados: Erros) {
    const primeiro = Object.keys(encontrados)[0];
    if (primeiro) document.getElementById(`c10-${primeiro}`)?.focus();
  }

  function avancar() {
    const encontrados = validar(ETAPAS[etapa]);
    if (Object.keys(encontrados).length > 0) {
      setErros(encontrados);
      evento("campanha10_form_validation_failed", {
        etapa: etapa + 1,
        campos: Object.keys(encontrados),
      });
      focarPrimeiroErro(encontrados);
      return;
    }

    /* Sem este evento é impossível saber em qual etapa as pessoas desistem —
       que é exatamente o motivo de dividir o formulário em duas. */
    evento("campanha10_step_completed", { etapa: etapa + 1 });
    setErros({});
    setEtapa((atual) => atual + 1);
  }

  function voltar() {
    /* O estado dos campos vive fora das etapas, então nada se perde ao voltar:
       o que muda é só qual `<fieldset>` está visível. */
    setErros({});
    setEtapa((atual) => Math.max(0, atual - 1));
  }

  /* Ao trocar de etapa, o foco vai para o rótulo da nova etapa. Sem isso ele
     ficaria no botão que acabou de sumir e cairia no `<body>`, e quem usa
     leitor de tela não teria como saber que a tela mudou. */
  useEffect(() => {
    if (etapa > 0) tituloEtapa.current?.focus();
  }, [etapa]);

  useEffect(() => {
    if (enviado) tituloSucesso.current?.focus();
  }, [enviado]);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (emVoo.current) return;

    /* Fora da última etapa, submeter significa avançar.
     *
     * O botão principal é sempre `type="submit"`, e não alterna entre
     * `"button"` e `"submit"` conforme a etapa. Alternar parecia natural e
     * produzia um bug silencioso: o React reaproveita o mesmo nó `<button>`
     * entre os renders e só troca o atributo. Como o `onClick` roda **antes**
     * de o navegador executar a ação padrão do clique, o botão já era
     * `type="submit"` quando essa ação acontecia — e o mesmo clique que
     * avançava a etapa submetia o formulário logo em seguida, fazendo a etapa
     * 2 nascer com os cinco campos marcados em vermelho.
     *
     * De quebra, um único `submit` faz o Enter dentro de um campo se comportar
     * como se espera: avança na etapa 1, envia na etapa 2. */
    if (etapa < ETAPAS.length - 1) {
      avancar();
      return;
    }

    const encontrados = validar(null);
    if (Object.keys(encontrados).length > 0) {
      setErros(encontrados);
      evento("campanha10_form_validation_failed", {
        etapa: etapa + 1,
        campos: Object.keys(encontrados),
      });
      /* Se o erro está na etapa anterior, volta para lá antes de focar —
         focar num campo que não está na tela não ajuda ninguém. */
      const naPrimeira = ETAPAS[0].some((campo) => encontrados[campo]);
      if (naPrimeira && etapa !== 0) {
        setEtapa(0);
        return;
      }
      focarPrimeiroErro(encontrados);
      return;
    }

    /* `form_submit` depois da validação, e não antes: disparado a cada clique
       num formulário incompleto, ele fazia a razão submitted/submit do funil
       ser estruturalmente pessimista e incomparável. Quem conta tentativa
       inválida agora é `form_validation_failed`. */
    evento("campanha10_form_submit");

    if (!idLead.current) idLead.current = crypto.randomUUID();

    emVoo.current = true;
    setErros({});
    setEnviando(true);

    try {
      const resposta = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        /* Sem teto, um banco fora do ar deixa o botão em "Enviando" por quase
           vinte segundos. Estourado o prazo, cai no `catch`: mensagem clara,
           dados preservados e o botão de volta. Reenviar é seguro — o lead
           viaja sempre com o mesmo `id` e a gravação é um upsert. */
        signal: AbortSignal.timeout(20_000),
        /* Colunas próprias onde a tabela tem semântica (nome, empresa,
           telefone, volume, dor) e o resto da candidatura em `origem`, que é
           `jsonb` — o mesmo caminho que as LPs já usam para o segmento. */
        body: JSON.stringify({
          id: idLead.current,
          nome: campos.nome,
          empresa: campos.empresa,
          telefone: campos.telefone,
          volume: campos.volume,
          dor: campos.problema,
          etapa: 1,
          concluido: true,
          /* Campo isca: preenchido, é robô. O servidor já checava por ele —
             era este formulário que não o renderizava, o que deixava a
             proteção inerte justamente na página de tráfego pago. */
          empresaWebsite: isca.current?.value ?? "",
          /* Prova do aceite. A política publicada promete guardar "a data, a
             hora e a versão do texto que você aceitou" — até 26/08/2026 o
             checkbox era validado só no navegador e não saía dele. */
          consentimento: campos.consentimento,
          consentimentoVersao: CONSENTIMENTO_VERSAO,
          consentimentoEm: consentidoEm.current ?? new Date().toISOString(),
          origem: {
            ...origem.current,
            segmento: campos.segmento,
            objetivo: campos.objetivo,
            enviado_em: new Date().toISOString(),
          },
        }),
      });

      const dados = (await resposta.json().catch(() => ({}))) as {
        ok?: boolean;
        entregue?: boolean;
      };

      /* `entregue === false` significa que nem o banco nem o CRM ficaram com a
         candidatura. Anunciar sucesso nesse caso seria mentir para quem acabou
         de preencher o formulário inteiro. */
      if (!resposta.ok || !dados.ok || dados.entregue === false) {
        setErros({
          geral:
            "Não conseguimos registrar a sua candidatura agora. Os seus dados continuam preenchidos: tente novamente em instantes ou fale com a gente pelo WhatsApp.",
        });
        evento("campanha10_form_error", {
          motivo: "servidor",
          status: resposta.status,
          naoEntregue: dados.entregue === false,
        });
        return;
      }

      /* Nome congelado: `analytics.ts` amarra este evento ao `fbq('track',
         'Lead')`. Renomear desliga a otimização por conversão do Meta. */
      evento("campanha10_form_submitted", { segmento: campos.segmento });
      setEnviado(true);
    } catch {
      setErros({
        geral:
          "Não conseguimos enviar agora. Confira a sua conexão e tente novamente: nada do que você escreveu foi perdido.",
      });
      evento("campanha10_form_error", { motivo: "rede" });
    } finally {
      emVoo.current = false;
      setEnviando(false);
    }
  }

  /** Marca no mesmo lead que a pessoa foi para o WhatsApp, em vez de criar
   *  outra linha. `sendBeacon` sobrevive à saída da página. */
  function registrarCliqueWhatsApp() {
    evento("campanha10_whatsapp_clicked", { local: "sucesso" });
    if (!idLead.current) return;

    const corpo = JSON.stringify({
      id: idLead.current,
      nome: campos.nome,
      empresa: campos.empresa,
      telefone: campos.telefone,
      etapa: 1,
      concluido: true,
      clicouWhatsapp: true,
      origem: origem.current,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/lead",
        new Blob([corpo], { type: "application/json" })
      );
      return;
    }

    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: corpo,
      keepalive: true,
    }).catch(() => {
      /* silencioso de propósito: a medição não pode segurar a navegação */
    });
  }

  if (enviado) {
    return (
      <div
        role="status"
        className="borda-destaque rounded-3xl bg-dark-elevated p-7 text-center sm:p-9"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
          <Check aria-hidden="true" className="h-8 w-8 text-primary" />
        </div>

        <h2
          ref={tituloSucesso}
          tabIndex={-1}
          className="mt-6 text-2xl font-bold tracking-[-0.02em] text-dark-text focus:outline-none"
        >
          {formulario.sucesso.titulo}
        </h2>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-dark-muted">
          {formulario.sucesso.mensagem}
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-dark-muted/85">
          {formulario.sucesso.complemento}
        </p>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
            mensagemWhatsApp(campos.nome, campos.empresa)
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={registrarCliqueWhatsApp}
          className="mt-8 inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-dark-border bg-dark-surface px-7 py-3.5 font-semibold text-dark-text transition-colors hover:border-primary/40 hover:text-primary"
        >
          <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
          {formulario.sucesso.botao}
        </a>
      </div>
    );
  }

  const ultima = etapa === ETAPAS.length - 1;
  const errosVisiveis = ETAPAS[etapa].filter((campo) => erros[campo]);

  return (
    <form
      onSubmit={enviar}
      noValidate
      className="borda-destaque rounded-3xl bg-dark-elevated p-6 sm:p-8"
    >
      <h2 className="text-2xl font-bold tracking-[-0.01em] text-dark-text">
        {formulario.titulo}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-dark-muted">
        {formulario.subtitulo}
      </p>

      {/* Progresso. A barra é `aria-hidden` porque o texto ao lado ("Etapa 1
          de 2") já diz a mesma coisa em palavras — duas leituras do mesmo
          dado só atrapalham. */}
      <div className="mt-7">
        <div className="flex items-baseline justify-between gap-4">
          <p
            ref={tituloEtapa}
            tabIndex={-1}
            className="text-sm font-semibold text-dark-text focus:outline-none"
          >
            {formulario.etapas[etapa].titulo}
            <span className="ml-2 font-normal text-dark-muted">
              {formulario.etapas[etapa].descricao}
            </span>
          </p>
          <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            {formulario.progresso(etapa + 1, ETAPAS.length)}
          </p>
        </div>
        <div
          aria-hidden="true"
          className="mt-3 h-1 overflow-hidden rounded-full bg-dark-border"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
            style={{ width: `${((etapa + 1) / ETAPAS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Isca: some da tela, some do leitor de tela e some da tabulação. Só
          robô que preenche tudo o que encontra cai aqui.
          Mesmo desenho do formulário do teste grátis — inclusive o `label`,
          que existe para o campo não virar exceção nas auditorias de rótulo.
          Fora da tela, e não `hidden`: robô que ignora elemento oculto ainda
          preenche este. */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor="c10-empresaWebsite">Não preencha este campo</label>
        <input
          ref={isca}
          id="c10-empresaWebsite"
          name="empresaWebsite"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      {/* As duas etapas ficam montadas; o que muda é qual está visível. É o que
          garante que nada digitado se perca ao voltar — e o `hidden` do HTML
          tira a etapa oculta da navegação por teclado e do leitor de tela sem
          desmontar o estado. */}
      <fieldset className="mt-6 border-0 p-0" hidden={etapa !== 0}>
        <legend className="sr-only">{formulario.etapas[0].titulo}</legend>
        <div className="space-y-4">
          <Campo id="c10-nome" rotulo="Nome completo" icone={User} erro={erros.nome}>
            <input
              id="c10-nome"
              name="nome"
              type="text"
              required
              autoComplete="name"
              placeholder="Ex.: Ana Souza"
              value={campos.nome}
              onChange={(e) => alterar("nome", e.target.value)}
              aria-invalid={Boolean(erros.nome)}
              aria-describedby={erros.nome ? "erro-c10-nome" : undefined}
              className={classesCampo(Boolean(erros.nome))}
            />
          </Campo>

          <Campo
            id="c10-empresa"
            rotulo="Nome da empresa"
            icone={Building2}
            erro={erros.empresa}
          >
            <input
              id="c10-empresa"
              name="empresa"
              type="text"
              required
              autoComplete="organization"
              placeholder="Ex.: Empresa Modelo"
              value={campos.empresa}
              onChange={(e) => alterar("empresa", e.target.value)}
              aria-invalid={Boolean(erros.empresa)}
              aria-describedby={erros.empresa ? "erro-c10-empresa" : undefined}
              className={classesCampo(Boolean(erros.empresa))}
            />
          </Campo>

          <Campo
            id="c10-telefone"
            rotulo="WhatsApp com DDD"
            icone={Phone}
            erro={erros.telefone}
            ajuda="É por aqui que respondemos a sua candidatura."
          >
            <input
              id="c10-telefone"
              name="telefone"
              type="tel"
              required
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="(62) 99999-9999"
              value={campos.telefone}
              onChange={(e) => alterar("telefone", mascararTelefone(e.target.value))}
              aria-invalid={Boolean(erros.telefone)}
              aria-describedby={
                erros.telefone ? "erro-c10-telefone" : "ajuda-c10-telefone"
              }
              className={classesCampo(Boolean(erros.telefone))}
            />
          </Campo>
        </div>
      </fieldset>

      <fieldset className="mt-6 border-0 p-0" hidden={etapa !== 1}>
        <legend className="sr-only">{formulario.etapas[1].titulo}</legend>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Campo
              id="c10-segmento"
              rotulo="Segmento da empresa"
              icone={Tag}
              erro={erros.segmento}
            >
              <Selecao
                id="c10-segmento"
                nome="segmento"
                valor={campos.segmento}
                erro={Boolean(erros.segmento)}
                aoMudar={(v) => alterar("segmento", v)}
                opcoes={[...SEGMENTOS, OUTRO_SEGMENTO]}
              />
            </Campo>

            <Campo
              id="c10-volume"
              rotulo="Contatos por mês"
              icone={TrendingUp}
              erro={erros.volume}
            >
              <Selecao
                id="c10-volume"
                nome="volume"
                valor={campos.volume}
                erro={Boolean(erros.volume)}
                aoMudar={(v) => alterar("volume", v)}
                opcoes={VOLUMES}
              />
            </Campo>
          </div>

          <Campo
            id="c10-objetivo"
            rotulo="O que a IA deve fazer"
            icone={Target}
            erro={erros.objetivo}
          >
            <Selecao
              id="c10-objetivo"
              nome="objetivo"
              valor={campos.objetivo}
              erro={Boolean(erros.objetivo)}
              aoMudar={(v) => alterar("objetivo", v)}
              opcoes={OBJETIVOS}
            />
          </Campo>

          <Campo
            id="c10-problema"
            rotulo="Principal problema do atendimento atual"
            icone={MessageSquareText}
            erro={erros.problema}
          >
            <textarea
              id="c10-problema"
              name="problema"
              required
              rows={3}
              maxLength={LIMITE_TEXTO}
              placeholder="Ex.: demoramos para responder fora do horário comercial e perdemos orçamentos."
              value={campos.problema}
              onChange={(e) => alterar("problema", e.target.value)}
              aria-invalid={Boolean(erros.problema)}
              aria-describedby={erros.problema ? "erro-c10-problema" : undefined}
              className={`${classesCampo(Boolean(erros.problema))} resize-y leading-relaxed`}
            />
          </Campo>

          <div className="rounded-2xl border border-dark-border bg-dark-base/60 p-4">
            <label
              htmlFor="c10-consentimento"
              className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-dark-muted"
            >
              <input
                id="c10-consentimento"
                name="consentimento"
                type="checkbox"
                required
                checked={campos.consentimento}
                onChange={(e) => alterar("consentimento", e.target.checked)}
                aria-invalid={Boolean(erros.consentimento)}
                aria-describedby={
                  erros.consentimento ? "erro-c10-consentimento" : undefined
                }
                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-primary)]"
              />
              <span>
                {formulario.consentimentoAntes}{" "}
                <Link
                  href="/privacidade"
                  target="_blank"
                  className="text-primary underline underline-offset-2"
                >
                  {formulario.consentimentoLink}
                </Link>
                {formulario.consentimentoDepois}
              </span>
            </label>
            {erros.consentimento && (
              <p
                id="erro-c10-consentimento"
                className="mt-2 text-sm text-dark-error"
              >
                {erros.consentimento}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* Um resumo, e não um `role="alert"` por campo: com oito erros de uma
          vez, oito regiões vivas disparando juntas deixam o anúncio truncado
          ou embaralhado. Aqui o leitor recebe uma frase e a lista de campos;
          as mensagens individuais continuam ao lado de cada um, sem `alert`. */}
      {(errosVisiveis.length > 0 || erros.geral) && (
        <div
          role="alert"
          className="mt-5 rounded-2xl border px-4 py-3 text-sm leading-relaxed"
          style={{
            borderColor: "var(--color-dark-error-border)",
            background: "var(--color-dark-error-surface)",
            color: "var(--color-dark-error)",
          }}
        >
          {erros.geral ?? (
            <>
              {errosVisiveis.length === 1
                ? "Falta preencher um campo:"
                : `Faltam preencher ${errosVisiveis.length} campos:`}{" "}
              {errosVisiveis.map((campo) => erros[campo]).join(" · ")}
            </>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
        {/* Sempre `submit`, nas duas etapas — ver o comentário em `enviar()`.
            O rótulo muda; o tipo, não. */}
        <button
          type="submit"
          disabled={enviando}
          className="botao-marca flex min-h-12 flex-1 items-center justify-center gap-2.5 rounded-full px-6 py-4 text-base font-semibold text-on-primary disabled:cursor-not-allowed disabled:opacity-70"
        >
          {enviando ? (
            <>
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
              {formulario.botaoEnviando}
            </>
          ) : (
            <>
              {ultima ? formulario.botao : formulario.avancar}
              <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
            </>
          )}
        </button>

        {etapa > 0 && (
          <button
            type="button"
            onClick={voltar}
            className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-dark-field-border px-6 py-4 text-base font-semibold text-dark-muted transition-colors hover:border-primary/40 hover:text-dark-text sm:flex-none"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4 shrink-0" />
            {formulario.voltar}
          </button>
        )}
      </div>

      <p className="mt-4 flex items-start justify-center gap-2 text-xs leading-relaxed text-dark-muted">
        <ShieldCheck aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span className="min-w-0">{formulario.seguranca}</span>
      </p>
      <p className="mt-2 flex items-start justify-center gap-2 text-xs leading-relaxed text-dark-muted">
        <Lock aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span className="min-w-0">{formulario.microcopy}</span>
      </p>
    </form>
  );
}

function Campo({
  id,
  rotulo,
  icone: Icone,
  erro,
  ajuda,
  children,
}: {
  id: string;
  rotulo: string;
  icone: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  erro?: string;
  ajuda?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-dark-text">
        {rotulo}
        <span aria-hidden="true" className="ml-1 text-primary">
          *
        </span>
      </label>
      <div className="relative">
        <Icone
          aria-hidden={true}
          className="pointer-events-none absolute left-4 top-[27px] z-10 h-5 w-5 -translate-y-1/2 text-dark-muted"
        />
        {children}
      </div>
      {ajuda && !erro && (
        <p id={`ajuda-${id}`} className="mt-1.5 text-xs text-dark-muted">
          {ajuda}
        </p>
      )}
      {erro && (
        <p id={`erro-${id}`} className="mt-1.5 text-sm text-dark-error">
          {erro}
        </p>
      )}
    </div>
  );
}

function Selecao({
  id,
  nome,
  valor,
  erro,
  aoMudar,
  opcoes,
}: {
  id: string;
  nome: string;
  valor: string;
  erro: boolean;
  aoMudar: (valor: string) => void;
  opcoes: string[];
}) {
  return (
    <>
      <select
        id={id}
        name={nome}
        required
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        aria-invalid={erro}
        aria-describedby={erro ? `erro-${id}` : undefined}
        className={`${classesCampo(erro)} appearance-none pr-10 ${
          valor ? "" : "text-dark-muted/60"
        }`}
      >
        <option value="" disabled>
          Escolha na lista
        </option>
        {opcoes.map((opcao) => (
          /* Cor explícita no `<option>`: ele não herda o fundo do `<select>`
             no Windows/Chrome nem no Firefox, e a lista abria com texto claro
             sobre fundo claro. */
          <option key={opcao} value={opcao} className="bg-dark-surface text-dark-text">
            {opcao}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-[27px] h-4 w-4 -translate-y-1/2 text-dark-muted"
      />
    </>
  );
}
