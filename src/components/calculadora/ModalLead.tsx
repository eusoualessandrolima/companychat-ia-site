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
  X,
} from "lucide-react";
import { WHATSAPP_NUMBER, WhatsAppIcon } from "@/components/WhatsAppButton";
import { moeda, type Modo, type Resultado } from "@/components/calculadora/calculo";

const SEGMENTOS = [
  "Saúde e clínicas",
  "Comércio e varejo",
  "Serviços",
  "Educação",
  "Imobiliária",
  "Advocacia",
  "Seguros",
  "Indústria",
  "Outro",
];

type Campos = { nome: string; empresa: string; telefone: string; segmento: string };
type Erros = Partial<Record<keyof Campos, string>>;

function mascararTelefone(valor: string) {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export default function ModalLead({
  aberto,
  aoFechar,
  modo,
  resultado,
}: {
  aberto: boolean;
  aoFechar: () => void;
  modo: Modo;
  resultado: Resultado;
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
  const idLead = useRef("");
  const painel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;

    idLead.current ||= crypto.randomUUID();

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

    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") aoFechar();
    };
    document.addEventListener("keydown", aoTeclar);

    const scrollTravado = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    /* Foca o primeiro campo, não o painel: o anel de foco global do site
       aparece em qualquer elemento com tabindex, e no container ele desenharia
       uma borda verde em volta do modal inteiro. */
    const primeiroCampo = painel.current?.querySelector<HTMLElement>(
      "input, select, textarea, a[href]"
    );
    (primeiroCampo ?? painel.current)?.focus();

    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = scrollTravado;
    };
  }, [aberto, aoFechar]);

  if (!aberto) return null;

  /* O número simulado viaja junto com o lead: quem atender já abre a conversa
     sabendo qual era a conta que assustou o visitante. */
  const contexto = {
    simulacao: modo === "ativa" ? "Campanha ativa" : "Atendimento receptivo",
    custo_api_pura: moeda(resultado.futuro),
    custo_hibrido: moeda(resultado.hibrido),
    economia_anual: moeda(resultado.prejuizoAnual),
  };

  function registrar(extras: { clicouWhatsapp?: boolean } = {}) {
    if (!idLead.current) idLead.current = crypto.randomUUID();

    const corpo = JSON.stringify({
      id: idLead.current,
      nome: campos.nome,
      empresa: campos.empresa,
      telefone: campos.telefone,
      etapa: 1,
      concluido: true,
      ...extras,
      origem: { ...origem.current, segmento: campos.segmento, ...contexto },
    });

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
      /* silencioso: nada trava a tela de sucesso */
    });
  }

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();

    const encontrados: Erros = {};
    if (campos.nome.trim().length < 2) encontrados.nome = "Preencha para continuar";
    if (campos.empresa.trim().length < 2)
      encontrados.empresa = "Preencha para continuar";
    if (campos.telefone.replace(/\D/g, "").length < 10)
      encontrados.telefone = "Informe o DDD e o número";
    if (!campos.segmento) encontrados.segmento = "Escolha o seu segmento";

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

  const linkDoWhatsApp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    [
      "Olá! Simulei o impacto do novo modelo de cobrança do WhatsApp e quero falar com um especialista.",
      "",
      `Nome: ${campos.nome.trim()}`,
      `Empresa: ${campos.empresa.trim()}`,
      `Segmento: ${campos.segmento}`,
      "",
      `Simulação: ${contexto.simulacao}`,
      `API pura: ${contexto.custo_api_pura} por mês`,
      `Modelo Híbrido: ${contexto.custo_hibrido} por mês`,
      `Diferença em 12 meses: ${contexto.economia_anual}`,
    ].join("\n")
  )}`;

  const CAMPOS_TEXTO = [
    {
      campo: "nome" as const,
      rotulo: "Qual é o seu nome?",
      exemplo: "Ex.: Ana Souza",
      Icone: User,
      autoComplete: "name",
      tipo: "text",
    },
    {
      campo: "empresa" as const,
      rotulo: "Qual é a sua empresa?",
      exemplo: "Ex.: Clínica Vida",
      Icone: Building2,
      autoComplete: "organization",
      tipo: "text",
    },
    {
      campo: "telefone" as const,
      rotulo: "Qual é o seu WhatsApp com DDD?",
      exemplo: "Ex.: (62) 99999-9999",
      Icone: Phone,
      autoComplete: "tel-national",
      tipo: "tel",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:items-center">
      <button
        type="button"
        aria-label="Fechar"
        onClick={aoFechar}
        className="absolute inset-0 cursor-default"
        tabIndex={-1}
      />

      <motion.div
        ref={painel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal-lead"
        tabIndex={-1}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative my-auto w-full max-w-lg rounded-3xl border border-dark-border bg-dark-surface p-6 shadow-2xl shadow-black/60 outline-none sm:p-8"
      >
        <button
          type="button"
          onClick={aoFechar}
          aria-label="Fechar"
          className="absolute right-4 top-4 rounded-full p-2 text-dark-muted transition-colors hover:bg-dark-elevated hover:text-dark-text"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>

        {enviado ? (
          <div className="py-2 text-center">
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15"
            >
              <Check aria-hidden="true" className="h-8 w-8 text-primary" />
            </motion.span>

            <h2 className="mt-6 text-2xl font-bold text-dark-text">
              Pronto, {campos.nome.trim().split(" ")[0]}.
              <span className="mt-1 block text-primary">
                Recebemos a sua simulação.
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-sm leading-relaxed text-dark-muted">
              Chame no WhatsApp e já falamos sobre o seu cenário: os números da
              simulação vão junto na mensagem.
            </p>

            <a
              href={linkDoWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                window.fbq?.("track", "Contact");
                registrar({ clicouWhatsapp: true });
              }}
              className="animate-breath-glow mt-7 flex w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-8 py-4 text-lg font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Falar com um especialista
            </a>
          </div>
        ) : (
          <form onSubmit={enviar} noValidate>
            <h2
              id="titulo-modal-lead"
              className="pr-8 text-xl font-bold text-dark-text"
            >
              Fale com um especialista CompanyChat
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-dark-muted">
              Preencha para receber o desenho do Modelo Híbrido aplicado ao seu
              volume. Leva menos de um minuto.
            </p>

            <div className="mt-6 space-y-4">
              {CAMPOS_TEXTO.map((item) => (
                <div key={item.campo}>
                  <label
                    htmlFor={`calc-${item.campo}`}
                    className="mb-1.5 block text-sm font-semibold text-dark-text"
                  >
                    {item.rotulo}
                  </label>
                  <div className="relative">
                    <item.Icone
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-muted"
                    />
                    <input
                      id={`calc-${item.campo}`}
                      name={item.campo}
                      type={item.tipo}
                      inputMode={item.campo === "telefone" ? "numeric" : "text"}
                      autoComplete={item.autoComplete}
                      placeholder={item.exemplo}
                      value={campos[item.campo]}
                      onChange={(e) => alterar(item.campo, e.target.value)}
                      aria-invalid={Boolean(erros[item.campo])}
                      aria-describedby={
                        erros[item.campo] ? `erro-calc-${item.campo}` : undefined
                      }
                      className={`w-full rounded-2xl border bg-dark-elevated py-3.5 pl-12 pr-4 text-dark-text transition-colors placeholder:text-dark-muted/60 focus:outline-none ${
                        erros[item.campo]
                          ? "border-red-400"
                          : "border-dark-border focus:border-primary"
                      }`}
                    />
                  </div>
                  {erros[item.campo] && (
                    <p
                      id={`erro-calc-${item.campo}`}
                      className="mt-1.5 text-sm text-red-400"
                    >
                      {erros[item.campo]}
                    </p>
                  )}
                </div>
              ))}

              <div>
                <label
                  htmlFor="calc-segmento"
                  className="mb-1.5 block text-sm font-semibold text-dark-text"
                >
                  Qual é o segmento da sua empresa?
                </label>
                <div className="relative">
                  <Tag
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-muted"
                  />
                  <select
                    id="calc-segmento"
                    name="segmento"
                    value={campos.segmento}
                    onChange={(e) => alterar("segmento", e.target.value)}
                    aria-invalid={Boolean(erros.segmento)}
                    aria-describedby={
                      erros.segmento ? "erro-calc-segmento" : undefined
                    }
                    className={`w-full appearance-none rounded-2xl border bg-dark-elevated py-3.5 pl-12 pr-10 transition-colors focus:outline-none ${
                      campos.segmento ? "text-dark-text" : "text-dark-muted/60"
                    } ${
                      erros.segmento
                        ? "border-red-400"
                        : "border-dark-border focus:border-primary"
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
                  </select>
                  <ArrowRight
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-dark-muted"
                  />
                </div>
                {erros.segmento && (
                  <p id="erro-calc-segmento" className="mt-1.5 text-sm text-red-400">
                    {erros.segmento}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-semibold text-on-primary shadow-lg shadow-primary/25 transition-colors hover:bg-primary-dark disabled:opacity-70"
            >
              {enviando ? (
                <>
                  <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                  Enviando os seus dados
                </>
              ) : (
                <>
                  Quero proteger a minha margem
                  <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
                </>
              )}
            </button>

            <p className="mt-4 flex items-start justify-center gap-2 text-xs leading-relaxed text-dark-muted">
              <Lock aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span className="min-w-0">
                Seus dados serão usados para apresentar a CompanyChat. Você
                pode pedir para parar quando quiser.
              </span>
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
}
