"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Check,
  Loader2,
  Lock,
  Phone,
  Tag,
  User,
} from "lucide-react";
import { WHATSAPP_NUMBER, WhatsAppIcon } from "@/components/WhatsAppButton";
import type { LPConteudo } from "@/components/lp/tipos";

type Config = LPConteudo["form"];

type Campos = {
  nome: string;
  empresa: string;
  telefone: string;
  segmento: string;
};

type Erros = Partial<Record<keyof Campos, string>>;

function mascararTelefone(valor: string) {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** O WhatsApp abre com o formulário inteiro na mensagem: quem atender do
 *  outro lado já sabe nome, negócio e segmento. */
function montarLink(campos: Campos, config: Config) {
  const texto = [
    "Olá! Acabei de preencher o formulário e quero testar a IA para o meu negócio.",
    "",
    `Nome: ${campos.nome.trim()}`,
    `${config.waRotuloEmpresa}: ${campos.empresa.trim()}`,
    `Segmento: ${campos.segmento}`,
  ].join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
}

export default function FormularioLead({
  config,
  segmentos,
}: {
  config: Config;
  segmentos: string[];
}) {
  const [campos, setCampos] = useState<Campos>({
    nome: "",
    empresa: "",
    telefone: "",
    segmento: "",
  });
  const [erros, setErros] = useState<Erros>({});
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const origem = useRef<Record<string, string>>({});
  /** Identidade do lead no banco, criada uma vez por visita: o clique no
   *  WhatsApp atualiza a mesma linha em vez de criar outra. */
  const idLead = useRef("");

  // De onde veio o clique do anúncio. Lido do window para a página
  // continuar estática, sem fronteira de Suspense.
  useEffect(() => {
    idLead.current = crypto.randomUUID();

    const busca = new URLSearchParams(window.location.search);
    const coletado: Record<string, string> = {};
    for (const chave of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "fbclid",
    ]) {
      const valor = busca.get(chave);
      if (valor) coletado[chave] = valor;
    }
    coletado.pagina = window.location.pathname;
    if (document.referrer) coletado.referrer = document.referrer;
    origem.current = coletado;
  }, []);

  function registrar(extras: { clicouWhatsapp?: boolean } = {}) {
    if (!idLead.current) idLead.current = crypto.randomUUID();

    /* etapa 1 + concluido: na régua do painel /leads, contato completo que
       terminou o fluxo: aqui o formulário é o fluxo inteiro. O segmento
       viaja na origem porque a tabela não tem coluna própria para ele. */
    const corpo = JSON.stringify({
      id: idLead.current,
      nome: campos.nome,
      empresa: campos.empresa,
      telefone: campos.telefone,
      etapa: 1,
      concluido: true,
      ...extras,
      origem: { ...origem.current, segmento: campos.segmento },
    });

    // `sendBeacon` sobrevive à saída da página no toque do botão do WhatsApp.
    if (extras.clicouWhatsapp && navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/lead",
        new Blob([corpo], { type: "application/json" })
      );
      return Promise.resolve();
    }

    return fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: corpo,
      keepalive: true,
    }).catch(() => {
      /* silencioso de propósito: nada trava a tela de sucesso */
    });
  }

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();

    const encontrados: Erros = {};
    if (campos.nome.trim().length < 2) {
      encontrados.nome = "Preencha para continuar";
    }
    if (campos.empresa.trim().length < 2) {
      encontrados.empresa = "Preencha para continuar";
    }
    if (campos.telefone.replace(/\D/g, "").length < 10) {
      encontrados.telefone = "Informe o DDD e o número";
    }
    if (!campos.segmento) {
      encontrados.segmento = "Escolha o seu segmento";
    }
    if (Object.keys(encontrados).length > 0) {
      setErros(encontrados);
      return;
    }

    setErros({});
    setEnviando(true);
    await registrar();
    window.fbq?.("track", "Lead");
    setEnviando(false);
    setEnviado(true);
  }

  function alterar(campo: keyof Campos, valor: string) {
    setCampos((atuais) => ({
      ...atuais,
      [campo]: campo === "telefone" ? mascararTelefone(valor) : valor,
    }));
    if (erros[campo]) {
      setErros((atuais) => {
        const restantes = { ...atuais };
        delete restantes[campo];
        return restantes;
      });
    }
  }

  if (enviado) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-3xl bg-card p-7 text-center shadow-2xl shadow-black/50 sm:p-9"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.1 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-light"
        >
          <Check aria-hidden="true" className="h-8 w-8 text-primary" />
        </motion.div>

        <h3 className="mt-6 break-words text-2xl font-bold tracking-[-0.02em] text-foreground">
          Pronto, {campos.nome.trim().split(" ")[0]}.
          <span className="mt-1 block text-primary">Dados enviados com sucesso.</span>
        </h3>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-text-secondary">
          Agora teste a nossa IA no WhatsApp. Ela já conhece o seu segmento e
          vai atender você como se fosse {config.sucessoComo}.
        </p>

        <a
          href={montarLink(campos, config)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            window.fbq?.("track", "Contact");
            registrar({ clicouWhatsapp: true });
          }}
          className="animate-breath-glow mt-8 flex w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-8 py-4 text-lg font-semibold text-white transition-transform hover:scale-[1.02]"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Testar a IA no WhatsApp
        </a>

        <p className="mt-5 text-sm text-text-secondary">
          Demonstração imediata, sem compromisso.
        </p>
      </motion.div>
    );
  }

  const CAMPOS_TEXTO = [
    {
      campo: "nome" as const,
      rotulo: "Qual é o seu nome?",
      exemplo: "Ex.: Ana Souza",
      icone: User,
      autoComplete: "name",
      telefone: false,
    },
    {
      campo: "empresa" as const,
      rotulo: config.rotuloEmpresa,
      exemplo: config.exemploEmpresa,
      icone: Building2,
      autoComplete: "organization",
      telefone: false,
    },
    {
      campo: "telefone" as const,
      rotulo: "Qual é o seu WhatsApp com DDD?",
      exemplo: "Ex.: (62) 99999-9999",
      icone: Phone,
      autoComplete: "tel-national",
      telefone: true,
    },
  ];

  return (
    <form
      onSubmit={enviar}
      noValidate
      className="rounded-3xl bg-card p-6 shadow-2xl shadow-black/50 sm:p-8"
    >
      <h3 className="text-xl font-bold tracking-[-0.01em] text-foreground">
        Teste a IA no seu WhatsApp
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
        Preencha para liberar a conversa. Leva menos de um minuto.
      </p>

      <div className="mt-6 space-y-4">
        {CAMPOS_TEXTO.map((item) => (
          <div key={item.campo}>
            <label
              htmlFor={`lead-${item.campo}`}
              className="mb-1.5 block text-sm font-semibold text-foreground"
            >
              {item.rotulo}
            </label>
            <div className="relative">
              <item.icone
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary"
              />
              <input
                id={`lead-${item.campo}`}
                name={item.campo}
                type={item.telefone ? "tel" : "text"}
                inputMode={item.telefone ? "numeric" : "text"}
                autoComplete={item.autoComplete}
                placeholder={item.exemplo}
                value={campos[item.campo]}
                onChange={(e) => alterar(item.campo, e.target.value)}
                aria-invalid={Boolean(erros[item.campo])}
                aria-describedby={
                  erros[item.campo] ? `erro-${item.campo}` : undefined
                }
                className={`w-full rounded-2xl border bg-card py-3.5 pl-12 pr-4 text-foreground placeholder:text-text-secondary/60 transition-colors focus:outline-none ${
                  erros[item.campo]
                    ? "border-red-400"
                    : "border-card-border focus:border-primary"
                }`}
              />
            </div>
            {erros[item.campo] && (
              <p id={`erro-${item.campo}`} className="mt-1.5 text-sm text-red-500">
                {erros[item.campo]}
              </p>
            )}
          </div>
        ))}

        <div>
          <label
            htmlFor="lead-segmento"
            className="mb-1.5 block text-sm font-semibold text-foreground"
          >
            {config.rotuloSegmento}
          </label>
          <div className="relative">
            <Tag
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary"
            />
            <select
              id="lead-segmento"
              name="segmento"
              value={campos.segmento}
              onChange={(e) => alterar("segmento", e.target.value)}
              aria-invalid={Boolean(erros.segmento)}
              aria-describedby={erros.segmento ? "erro-segmento" : undefined}
              className={`w-full appearance-none rounded-2xl border bg-card py-3.5 pl-12 pr-10 transition-colors focus:outline-none ${
                campos.segmento ? "text-foreground" : "text-text-secondary/60"
              } ${
                erros.segmento
                  ? "border-red-400"
                  : "border-card-border focus:border-primary"
              }`}
            >
              <option value="" disabled>
                Escolha na lista
              </option>
              {segmentos.map((segmento) => (
                <option key={segmento} value={segmento}>
                  {segmento}
                </option>
              ))}
              <option value={config.outroSegmento}>{config.outroSegmento}</option>
            </select>
            <ArrowRight
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-text-secondary"
            />
          </div>
          {erros.segmento && (
            <p id="erro-segmento" className="mt-1.5 text-sm text-red-500">
              {erros.segmento}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={enviando}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-4 text-[15px] font-semibold leading-snug text-on-primary shadow-lg shadow-primary/25 transition-colors hover:bg-primary-dark disabled:opacity-70 sm:gap-2.5 sm:px-8 sm:text-base"
      >
        {enviando ? (
          <>
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            Enviando os seus dados
          </>
        ) : (
          <>
            Liberar a conversa com a IA
            <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
          </>
        )}
      </button>

      <p className="mt-4 flex items-start justify-center gap-2 text-xs leading-relaxed text-text-secondary">
        <Lock aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span className="min-w-0">
          Ao enviar, você concorda que os seus dados sejam usados para
          personalizar a demonstração e para a nossa equipe entrar em contato
          pelo WhatsApp. Saiba mais na{" "}
          <a
            href="/privacidade"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Política de Privacidade
          </a>
          .
        </span>
      </p>
    </form>
  );
}
