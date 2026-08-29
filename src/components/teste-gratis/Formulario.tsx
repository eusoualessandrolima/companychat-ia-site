"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Globe,
  Loader2,
  Lock,
  Mail,
  MessageCircle,
  Phone,
  Tag,
  User,
} from "lucide-react";
import { evento, urlInicial } from "@/lib/analytics";
import {
  CONSENTIMENTO_ANTES,
  CONSENTIMENTO_DEPOIS,
  CONSENTIMENTO_LINK,
} from "@/lib/teste-gratis/consentimento";
import { CAMPOS_ORIGEM } from "@/lib/teste-gratis/validacao";
import {
  detalheDoSucesso,
  OUTRO_SEGMENTO,
  SEGMENTOS,
  type CopyDoFunil,
} from "./conteudo";
import { whatsappLink, WhatsAppIcon } from "@/components/WhatsAppButton";

type Campos = {
  nome: string;
  email: string;
  whatsapp: string;
  site: string;
  semSite: boolean;
  segmento: string;
  outroSegmento: string;
  consentimentoWhatsapp: boolean;
};

type Erros = Partial<Record<keyof Campos | "geral", string>>;

const VAZIO: Campos = {
  nome: "",
  email: "",
  whatsapp: "+55 ",
  site: "",
  semSite: false,
  segmento: "",
  outroSegmento: "",
  consentimentoWhatsapp: false,
};

/* Máscara só para o formato brasileiro, que é a esmagadora maioria. Número de
   outro país fica como a pessoa digitou: inventar máscara para 200 planos de
   numeração dá mais erro do que ajuda, e o servidor normaliza de qualquer
   jeito. */
function mascarar(valor: string) {
  const digitos = valor.replace(/\D/g, "");

  if (!digitos.startsWith("55")) {
    return valor.startsWith("+") ? `+${digitos}` : digitos;
  }

  const local = digitos.slice(2, 13);
  if (local.length <= 2) return `+55 ${local}`.trimEnd();
  if (local.length <= 6) return `+55 (${local.slice(0, 2)}) ${local.slice(2)}`;
  if (local.length <= 10) {
    return `+55 (${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
  }
  return `+55 (${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
}

function classesCampo(temErro: boolean) {
  return `w-full rounded-2xl border bg-dark-surface py-3.5 pl-12 pr-4 text-dark-text placeholder:text-dark-muted/60 transition-colors focus:outline-none ${
    temErro ? "border-red-400/70" : "border-dark-border focus:border-primary"
  }`;
}

export default function Formulario({ copy }: { copy: CopyDoFunil }) {
  const [campos, setCampos] = useState<Campos>(VAZIO);
  const [erros, setErros] = useState<Erros>({});
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const origem = useRef<Record<string, string>>({});
  const comecou = useRef(false);
  /* Trava de envio fora do estado: dois cliques rápidos disparam os dois
     manipuladores antes de o React repintar com `enviando`. */
  const emVoo = useRef(false);

  /* Atribuição lida do `window`, e não de `useSearchParams`: assim a página
     continua estática, sem fronteira de Suspense. Mesmo padrão das LPs. */
  useEffect(() => {
    const busca = new URLSearchParams(window.location.search);
    const coletado: Record<string, string> = {};

    for (const chave of CAMPOS_ORIGEM) {
      const valor = busca.get(chave);
      if (valor) coletado[chave] = valor;
    }

    // De qual CTA a pessoa veio, quando o clique passou pelo botão do site.
    const local = busca.get("origem");
    if (local && !coletado.utm_content) coletado.utm_content = local;

    coletado.pagina = window.location.pathname;
    coletado.url_conversao = window.location.href;
    coletado.url_inicial = urlInicial();
    if (document.referrer) coletado.referrer = document.referrer;

    origem.current = coletado;
  }, []);

  function marcarInicio() {
    if (comecou.current) return;
    comecou.current = true;
    evento("free_trial_form_started");
  }

  function alterar<C extends keyof Campos>(campo: C, valor: Campos[C]) {
    marcarInicio();
    setCampos((atuais) => ({ ...atuais, [campo]: valor }));
    if (erros[campo]) {
      setErros((atuais) => {
        const restantes = { ...atuais };
        delete restantes[campo];
        return restantes;
      });
    }
  }

  function validar(): Erros {
    const encontrados: Erros = {};

    if (campos.nome.trim().length < 2) {
      encontrados.nome = "Informe o seu nome completo";
    } else if (!campos.nome.trim().includes(" ")) {
      encontrados.nome = "Informe o nome e o sobrenome";
    }

    if (!/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(campos.email.trim())) {
      encontrados.email = "Informe um e-mail válido";
    }

    const digitos = campos.whatsapp.replace(/\D/g, "");
    if (digitos.length < 10) {
      encontrados.whatsapp = "Informe o código do país, o DDD e o número";
    }

    if (!campos.segmento) encontrados.segmento = "Escolha o seu segmento";
    if (campos.segmento === OUTRO_SEGMENTO && !campos.outroSegmento.trim()) {
      encontrados.outroSegmento = "Descreva o seu segmento";
    }

    if (!campos.consentimentoWhatsapp) {
      encontrados.consentimentoWhatsapp =
        "É preciso concordar em receber o contato pelo WhatsApp";
    }

    return encontrados;
  }

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (emVoo.current) return;

    const encontrados = validar();
    if (Object.keys(encontrados).length > 0) {
      setErros(encontrados);
      evento("free_trial_form_error", { campos: Object.keys(encontrados) });
      // Leva o foco para o primeiro campo com problema.
      document.getElementById(`tg-${Object.keys(encontrados)[0]}`)?.focus();
      return;
    }

    emVoo.current = true;
    setErros({});
    setEnviando(true);

    // O honeypot fica no formulário e é lido do DOM: nada dele no estado.
    const isca =
      (e.currentTarget.elements.namedItem("empresaWebsite") as HTMLInputElement | null)
        ?.value ?? "";

    try {
      const resposta = await fetch("/api/teste-gratis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: campos.nome,
          email: campos.email,
          whatsapp: campos.whatsapp,
          site: campos.site,
          semSite: campos.semSite,
          segmento: campos.segmento,
          outroSegmento: campos.outroSegmento,
          consentimentoWhatsapp: campos.consentimentoWhatsapp,
          empresaWebsite: isca,
          origem: origem.current,
        }),
      });

      const dados = (await resposta.json().catch(() => ({}))) as {
        ok?: boolean;
        erro?: string;
        erros?: Record<string, string>;
      };

      if (!resposta.ok || !dados.ok) {
        const doServidor: Erros = dados.erros ?? {};
        setErros({
          ...doServidor,
          geral:
            dados.erro ??
            (Object.keys(doServidor).length
              ? "Confira os campos destacados."
              : "Não conseguimos enviar agora. Tente novamente."),
        });
        evento("free_trial_form_error", {
          status: resposta.status,
          campos: Object.keys(doServidor),
        });
        return;
      }

      evento("free_trial_form_submitted", { segmento: campos.segmento });
      setEnviado(true);
    } catch {
      setErros({
        geral:
          "Não conseguimos enviar agora. Confira a sua conexão e tente novamente.",
      });
      evento("free_trial_form_error", { rede: true });
    } finally {
      emVoo.current = false;
      setEnviando(false);
    }
  }

  if (enviado) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-3xl border border-dark-border bg-dark-surface p-7 text-center sm:p-9"
        role="status"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.1 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15"
        >
          <Check aria-hidden="true" className="h-8 w-8 text-primary" />
        </motion.div>

        <h2 className="mt-6 text-2xl font-bold tracking-[-0.02em] text-dark-text">
          Solicitação recebida!
        </h2>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-dark-muted">
          {copy.sucessoTexto}
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-dark-muted/85">
          {detalheDoSucesso(copy, campos.whatsapp.trim())}
        </p>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center justify-center gap-2.5 rounded-full border border-dark-border bg-dark-elevated px-7 py-3.5 font-semibold text-dark-text transition-colors hover:border-primary/40 hover:text-primary"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Prefere falar agora? Chame a gente
        </a>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={enviar}
      noValidate
      className="rounded-3xl border border-dark-border bg-dark-surface p-6 sm:p-8"
    >
      <h2 className="text-xl font-bold tracking-[-0.01em] text-dark-text">
        Comece pelos seus dados
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-dark-muted">
        Leva menos de um minuto. Todos os campos com asterisco são obrigatórios.
      </p>

      {/* Isca: some da tela, some do leitor de tela e some da tabulação. Só
          robô que preenche tudo o que encontra cai aqui. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="tg-empresaWebsite">Não preencha este campo</label>
        <input
          id="tg-empresaWebsite"
          name="empresaWebsite"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="mt-6 space-y-4">
        <Campo
          id="tg-nome"
          rotulo="Nome completo"
          icone={User}
          erro={erros.nome}
          obrigatorio
        >
          <input
            id="tg-nome"
            name="nome"
            type="text"
            autoComplete="name"
            placeholder="Ex.: Ana Souza"
            value={campos.nome}
            onChange={(e) => alterar("nome", e.target.value)}
            aria-invalid={Boolean(erros.nome)}
            aria-describedby={erros.nome ? "erro-nome" : undefined}
            className={classesCampo(Boolean(erros.nome))}
          />
        </Campo>

        <Campo
          id="tg-email"
          rotulo="E-mail profissional"
          icone={Mail}
          erro={erros.email}
          obrigatorio
        >
          <input
            id="tg-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Ex.: ana@suaempresa.com.br"
            value={campos.email}
            onChange={(e) => alterar("email", e.target.value)}
            aria-invalid={Boolean(erros.email)}
            aria-describedby={erros.email ? "erro-email" : undefined}
            className={classesCampo(Boolean(erros.email))}
          />
        </Campo>

        <Campo
          id="tg-whatsapp"
          rotulo="WhatsApp com código do país"
          icone={Phone}
          erro={erros.whatsapp}
          ajuda="É neste número que o nosso agente de IA vai chamar você."
          obrigatorio
        >
          <input
            id="tg-whatsapp"
            name="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+55 (62) 99999-9999"
            value={campos.whatsapp}
            onChange={(e) => alterar("whatsapp", mascarar(e.target.value))}
            aria-invalid={Boolean(erros.whatsapp)}
            aria-describedby={`${erros.whatsapp ? "erro-whatsapp " : ""}ajuda-tg-whatsapp`}
            className={classesCampo(Boolean(erros.whatsapp))}
          />
        </Campo>

        <div>
          <Campo
            id="tg-site"
            rotulo="Site da empresa"
            icone={Globe}
            erro={erros.site}
          >
            <input
              id="tg-site"
              name="site"
              type="text"
              inputMode="url"
              autoComplete="url"
              placeholder="Ex.: suaempresa.com.br"
              value={campos.site}
              disabled={campos.semSite}
              onChange={(e) => alterar("site", e.target.value)}
              aria-invalid={Boolean(erros.site)}
              aria-describedby={erros.site ? "erro-site" : undefined}
              className={`${classesCampo(Boolean(erros.site))} disabled:opacity-50`}
            />
          </Campo>

          <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-sm text-dark-muted">
            <input
              type="checkbox"
              name="semSite"
              checked={campos.semSite}
              onChange={(e) => {
                alterar("semSite", e.target.checked);
                if (e.target.checked) alterar("site", "");
              }}
              className="h-4 w-4 shrink-0 accent-[var(--color-primary)]"
            />
            Minha empresa ainda não possui site
          </label>
        </div>

        <Campo
          id="tg-segmento"
          rotulo="Segmento da empresa"
          icone={Tag}
          erro={erros.segmento}
          obrigatorio
        >
          <div className="relative">
            <select
              id="tg-segmento"
              name="segmento"
              value={campos.segmento}
              onChange={(e) => alterar("segmento", e.target.value)}
              aria-invalid={Boolean(erros.segmento)}
              aria-describedby={erros.segmento ? "erro-segmento" : undefined}
              className={`${classesCampo(Boolean(erros.segmento))} appearance-none pr-10 ${
                campos.segmento ? "" : "text-dark-muted/60"
              }`}
            >
              <option value="" disabled>
                Escolha na lista
              </option>
              {SEGMENTOS.map((segmento) => (
                <option key={segmento} value={segmento}>
                  {segmento}
                </option>
              ))}
              <option value={OUTRO_SEGMENTO}>{OUTRO_SEGMENTO}</option>
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-muted"
            />
          </div>
        </Campo>

        {campos.segmento === OUTRO_SEGMENTO && (
          <Campo
            id="tg-outroSegmento"
            rotulo="Qual é o seu segmento?"
            icone={Tag}
            erro={erros.outroSegmento}
            obrigatorio
          >
            <input
              id="tg-outroSegmento"
              name="outroSegmento"
              type="text"
              placeholder="Ex.: locação de equipamentos"
              value={campos.outroSegmento}
              onChange={(e) => alterar("outroSegmento", e.target.value)}
              aria-invalid={Boolean(erros.outroSegmento)}
              aria-describedby={erros.outroSegmento ? "erro-outroSegmento" : undefined}
              className={classesCampo(Boolean(erros.outroSegmento))}
            />
          </Campo>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-dark-border bg-dark-base/60 p-4">
        <label
          htmlFor="tg-consentimentoWhatsapp"
          className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-dark-muted"
        >
          <input
            id="tg-consentimentoWhatsapp"
            name="consentimentoWhatsapp"
            type="checkbox"
            checked={campos.consentimentoWhatsapp}
            onChange={(e) => alterar("consentimentoWhatsapp", e.target.checked)}
            aria-invalid={Boolean(erros.consentimentoWhatsapp)}
            aria-describedby={
              erros.consentimentoWhatsapp ? "erro-consentimentoWhatsapp" : undefined
            }
            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-primary)]"
          />
          <span>
            {CONSENTIMENTO_ANTES}{" "}
            <Link
              href="/privacidade"
              target="_blank"
              className="text-primary underline underline-offset-2"
            >
              {CONSENTIMENTO_LINK}
            </Link>
            {CONSENTIMENTO_DEPOIS}
          </span>
        </label>
        {erros.consentimentoWhatsapp && (
          <p
            id="erro-consentimentoWhatsapp"
            role="alert"
            className="mt-2 text-sm text-red-400"
          >
            {erros.consentimentoWhatsapp}
          </p>
        )}
      </div>

      {erros.geral && (
        <p
          role="alert"
          className="mt-4 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {erros.geral}
        </p>
      )}

      <div className="cta-glow-wrap mt-6">
        <button
          type="submit"
          disabled={enviando}
          className="group flex w-full items-center justify-center gap-2.5 rounded-full bg-primary px-8 py-4 font-semibold text-on-primary shadow-lg shadow-primary/25 transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {enviando ? (
            <>
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
              Enviando a sua solicitação
            </>
          ) : (
            <>
              Quero testar grátis
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
              />
            </>
          )}
        </button>
      </div>

      <p className="mt-4 flex items-start justify-center gap-2 text-xs leading-relaxed text-dark-muted">
        <Lock aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span className="min-w-0">
          O envio registra a sua solicitação de teste. Ele não cria nem libera
          uma conta automaticamente: quem define o teste certo para você é o
          atendimento.
        </span>
      </p>

      <p className="mt-4 flex items-center justify-center gap-2 text-xs text-dark-muted">
        <MessageCircle aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-dark-text"
        >
          Prefere falar direto com uma pessoa?
        </a>
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
  obrigatorio = false,
  children,
}: {
  id: string;
  rotulo: string;
  icone: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  erro?: string;
  ajuda?: string;
  obrigatorio?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-dark-text">
        {rotulo}
        {obrigatorio && (
          <span aria-hidden="true" className="ml-1 text-primary">
            *
          </span>
        )}
        {!obrigatorio && (
          <span className="ml-2 text-xs font-normal text-dark-muted">opcional</span>
        )}
      </label>
      <div className="relative">
        <Icone
          aria-hidden={true}
          className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-dark-muted"
        />
        {children}
      </div>
      {ajuda && (
        <p id={`ajuda-${id}`} className="mt-1.5 text-xs text-dark-muted">
          {ajuda}
        </p>
      )}
      {erro && (
        <p id={`erro-${id.replace("tg-", "")}`} role="alert" className="mt-1.5 text-sm text-red-400">
          {erro}
        </p>
      )}
    </div>
  );
}
