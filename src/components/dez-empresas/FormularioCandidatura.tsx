"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  Loader2,
  Lock,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Sparkles,
  Tag,
  Target,
  TrendingUp,
  User,
} from "lucide-react";
import { evento, urlInicial } from "@/lib/analytics";
import { WHATSAPP_NUMBER, WhatsAppIcon } from "@/components/WhatsAppButton";
import {
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
  email: string;
  segmento: string;
  cidade: string;
  volume: string;
  problema: string;
  objetivo: string;
  motivo: string;
  consentimento: boolean;
};

type Erros = Partial<Record<keyof Campos | "geral", string>>;

const VAZIO: Campos = {
  nome: "",
  empresa: "",
  telefone: "",
  email: "",
  segmento: "",
  cidade: "",
  volume: "",
  problema: "",
  objetivo: "",
  motivo: "",
  consentimento: false,
};

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
     encostando na borda do teclado. A margem de rolagem dá a folga. */
  return `w-full scroll-my-32 rounded-2xl border bg-dark-surface py-3.5 ${
    comIcone ? "pl-12" : "pl-4"
  } pr-4 text-dark-text placeholder:text-dark-muted/60 transition-colors focus:outline-none ${
    temErro ? "border-red-400/70" : "border-dark-border focus:border-primary"
  }`;
}

/** A conversa já abre com o contexto da candidatura, para quem atender do
 *  outro lado saber de onde a pessoa veio. Número vem da configuração central
 *  (`src/lib/whatsapp.ts`), o mesmo destino das outras LPs. */
function linkWhatsApp(nome: string, empresa: string) {
  const texto = [
    "Olá! Acabei de me candidatar na seleção das 10 empresas e quero testar a IA da CompanyChat.",
    "",
    `Nome: ${nome.trim()}`,
    `Empresa: ${empresa.trim()}`,
  ].join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
}

export default function FormularioCandidatura() {
  const [campos, setCampos] = useState<Campos>(VAZIO);
  const [erros, setErros] = useState<Erros>({});
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const origem = useRef<Record<string, string>>({});
  const idLead = useRef("");
  const comecou = useRef(false);
  /* Trava fora do estado: dois cliques rápidos disparam os dois manipuladores
     antes de o React repintar com `enviando`. */
  const emVoo = useRef(false);

  /* Atribuição lida do `window` para a página continuar estática, sem
     fronteira de Suspense. Mesmo padrão das LPs e de `/teste-gratis`. */
  useEffect(() => {
    idLead.current = crypto.randomUUID();

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

    if (campos.empresa.trim().length < 2) {
      encontrados.empresa = "Informe o nome da empresa";
    }

    if (campos.telefone.replace(/\D/g, "").length < 10) {
      encontrados.telefone = "Informe o DDD e o número";
    }

    if (!/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(campos.email.trim())) {
      encontrados.email = "Informe um e-mail válido";
    }

    if (!campos.segmento) encontrados.segmento = "Escolha o segmento da empresa";
    if (campos.cidade.trim().length < 3) {
      encontrados.cidade = "Informe a cidade e o estado";
    }
    if (!campos.volume) encontrados.volume = "Escolha uma faixa";
    if (campos.problema.trim().length < 10) {
      encontrados.problema = "Conte em poucas linhas o que trava hoje";
    }
    if (!campos.objetivo) encontrados.objetivo = "Escolha o objetivo principal";
    if (campos.motivo.trim().length < 10) {
      encontrados.motivo = "Este campo ajuda a nossa equipe na seleção";
    }
    if (!campos.consentimento) {
      encontrados.consentimento = "É preciso concordar para enviar a candidatura";
    }

    return encontrados;
  }

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (emVoo.current) return;

    evento("campanha10_form_submit");

    const encontrados = validar();
    if (Object.keys(encontrados).length > 0) {
      setErros(encontrados);
      evento("campanha10_form_error", { campos: Object.keys(encontrados) });
      document.getElementById(`c10-${Object.keys(encontrados)[0]}`)?.focus();
      return;
    }

    if (!idLead.current) idLead.current = crypto.randomUUID();

    emVoo.current = true;
    setErros({});
    setEnviando(true);

    try {
      const resposta = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        /* Sem teto, um banco fora do ar deixa o botão em "Enviando" por quase
           vinte segundos (o pool tenta conectar duas vezes, 8 s cada). Estourado
           o prazo, cai no `catch`: mensagem clara, dados preservados e o botão
           de volta. Reenviar é seguro — o lead viaja sempre com o mesmo `id` e
           a gravação é um upsert. */
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
          origem: {
            ...origem.current,
            email: campos.email.trim(),
            segmento: campos.segmento,
            cidade: campos.cidade.trim(),
            objetivo: campos.objetivo,
            motivo: campos.motivo.trim(),
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
         de preencher dez campos. */
      if (!resposta.ok || !dados.ok || dados.entregue === false) {
        setErros({
          geral:
            "Não conseguimos registrar a sua candidatura agora. Os seus dados continuam preenchidos: tente novamente em instantes ou fale com a gente pelo WhatsApp.",
        });
        evento("campanha10_form_error", {
          status: resposta.status,
          naoEntregue: dados.entregue === false,
        });
        return;
      }

      evento("campanha10_form_submitted", { segmento: campos.segmento });
      setEnviado(true);
    } catch {
      setErros({
        geral:
          "Não conseguimos enviar agora. Confira a sua conexão e tente novamente: nada do que você escreveu foi perdido.",
      });
      evento("campanha10_form_error", { rede: true });
    } finally {
      emVoo.current = false;
      setEnviando(false);
    }
  }

  /** Marca no mesmo lead que a pessoa foi para o WhatsApp, em vez de criar
   *  outra linha. `sendBeacon` sobrevive à saída da página. */
  function registrarCliqueWhatsApp() {
    evento("campanha10_whatsapp_clicked");

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
      navigator.sendBeacon("/api/lead", new Blob([corpo], { type: "application/json" }));
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
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        role="status"
        className="glow-border rounded-3xl bg-dark-elevated p-7 text-center sm:p-9"
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
          {formulario.sucesso.titulo}
        </h2>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-dark-muted">
          {formulario.sucesso.mensagem}
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-dark-muted/85">
          {formulario.sucesso.complemento}
        </p>

        <a
          href={linkWhatsApp(campos.nome, campos.empresa)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={registrarCliqueWhatsApp}
          className="mt-8 inline-flex items-center justify-center gap-2.5 rounded-full border border-dark-border bg-dark-surface px-7 py-3.5 font-semibold text-dark-text transition-colors hover:border-primary/40 hover:text-primary"
        >
          <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
          {formulario.sucesso.botao}
        </a>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={enviar}
      noValidate
      className="glow-border rounded-3xl bg-dark-elevated p-6 sm:p-8"
    >
      <h2 className="text-2xl font-bold tracking-[-0.01em] text-dark-text">
        {formulario.titulo}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-dark-muted">
        {formulario.subtitulo}
      </p>

      <div className="mt-7 space-y-4">
        <Campo id="c10-nome" rotulo="Nome completo" icone={User} erro={erros.nome}>
          <input
            id="c10-nome"
            name="nome"
            type="text"
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
            autoComplete="organization"
            placeholder="Ex.: Empresa Modelo"
            value={campos.empresa}
            onChange={(e) => alterar("empresa", e.target.value)}
            aria-invalid={Boolean(erros.empresa)}
            aria-describedby={erros.empresa ? "erro-c10-empresa" : undefined}
            className={classesCampo(Boolean(erros.empresa))}
          />
        </Campo>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Campo
            id="c10-telefone"
            rotulo="WhatsApp com DDD"
            icone={Phone}
            erro={erros.telefone}
          >
            <input
              id="c10-telefone"
              name="telefone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="(62) 99999-9999"
              value={campos.telefone}
              onChange={(e) => alterar("telefone", mascararTelefone(e.target.value))}
              aria-invalid={Boolean(erros.telefone)}
              aria-describedby={erros.telefone ? "erro-c10-telefone" : undefined}
              className={classesCampo(Boolean(erros.telefone))}
            />
          </Campo>

          <Campo
            id="c10-email"
            rotulo="E-mail profissional"
            icone={Mail}
            erro={erros.email}
          >
            <input
              id="c10-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="ana@suaempresa.com.br"
              value={campos.email}
              onChange={(e) => alterar("email", e.target.value)}
              aria-invalid={Boolean(erros.email)}
              aria-describedby={erros.email ? "erro-c10-email" : undefined}
              className={classesCampo(Boolean(erros.email))}
            />
          </Campo>
        </div>

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
            id="c10-cidade"
            rotulo="Cidade e estado"
            icone={MapPin}
            erro={erros.cidade}
          >
            <input
              id="c10-cidade"
              name="cidade"
              type="text"
              autoComplete="address-level2"
              placeholder="Ex.: Goiânia, GO"
              value={campos.cidade}
              onChange={(e) => alterar("cidade", e.target.value)}
              aria-invalid={Boolean(erros.cidade)}
              aria-describedby={erros.cidade ? "erro-c10-cidade" : undefined}
              className={classesCampo(Boolean(erros.cidade))}
            />
          </Campo>
        </div>

        <Campo
          id="c10-volume"
          rotulo="Quantos contatos a empresa recebe pelo WhatsApp por mês?"
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

        <Campo
          id="c10-problema"
          rotulo="Qual é o principal problema do atendimento atual?"
          icone={MessageSquareText}
          erro={erros.problema}
        >
          <textarea
            id="c10-problema"
            name="problema"
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

        <Campo
          id="c10-objetivo"
          rotulo="O que você gostaria que a IA fizesse?"
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
          id="c10-motivo"
          rotulo="Por que sua empresa deveria ser selecionada?"
          icone={Sparkles}
          erro={erros.motivo}
        >
          <textarea
            id="c10-motivo"
            name="motivo"
            rows={3}
            maxLength={LIMITE_TEXTO}
            placeholder="Conte o que a sua empresa faz, o momento dela e como pretende usar a IA."
            value={campos.motivo}
            onChange={(e) => alterar("motivo", e.target.value)}
            aria-invalid={Boolean(erros.motivo)}
            aria-describedby={erros.motivo ? "erro-c10-motivo" : undefined}
            className={`${classesCampo(Boolean(erros.motivo))} resize-y leading-relaxed`}
          />
        </Campo>
      </div>

      <div className="mt-6 rounded-2xl border border-dark-border bg-dark-base/60 p-4">
        <label
          htmlFor="c10-consentimento"
          className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-dark-muted"
        >
          <input
            id="c10-consentimento"
            name="consentimento"
            type="checkbox"
            checked={campos.consentimento}
            onChange={(e) => alterar("consentimento", e.target.checked)}
            aria-invalid={Boolean(erros.consentimento)}
            aria-describedby={erros.consentimento ? "erro-c10-consentimento" : undefined}
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
          <p id="erro-c10-consentimento" role="alert" className="mt-2 text-sm text-red-400">
            {erros.consentimento}
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

      <button
        type="submit"
        disabled={enviando}
        className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-primary px-6 py-4 text-base font-semibold text-on-primary shadow-lg shadow-primary/25 transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {enviando ? (
          <>
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            {formulario.botaoEnviando}
          </>
        ) : (
          <>
            {formulario.botao}
            <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
          </>
        )}
      </button>

      <p className="mt-4 flex items-start justify-center gap-2 text-xs leading-relaxed text-dark-muted">
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
  children,
}: {
  id: string;
  rotulo: string;
  icone: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  erro?: string;
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
      {erro && (
        <p id={`erro-${id}`} role="alert" className="mt-1.5 text-sm text-red-400">
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
          <option key={opcao} value={opcao}>
            {opcao}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-muted"
      />
    </>
  );
}
