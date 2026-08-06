"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Building2,
  Check,
  Loader2,
  Lock,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import Logo from "@/components/Logo";
import { WHATSAPP_NUMBER, WhatsAppIcon } from "@/components/WhatsAppButton";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type Campo = "equipe" | "volume" | "dor" | "nome" | "empresa" | "telefone";
type Respostas = Record<Campo, string>;
type Erros = Partial<Record<Campo, string>>;

type Opcao = {
  valor: string;
  emoji: string;
  descricao: string;
  /** Gradiente do quadradinho do emoji. */
  cor: string;
};

type CampoContato = {
  campo: Campo;
  rotulo: string;
  exemplo: string;
  icone: typeof User;
  telefone?: boolean;
};

type Etapa =
  | { tipo: "contato"; pergunta: string; ajuda: string; campos: CampoContato[] }
  | { tipo: "escolha"; campo: Campo; pergunta: string; ajuda: string; opcoes: Opcao[] };

/* Contato numa tela só, qualificação depois. Três telas seguidas de
   digitação cansavam; e o lead precisa estar completo no banco antes das
   perguntas de perfil, porque contato sem telefone não serve para nada. */
const ETAPAS: Etapa[] = [
  {
    tipo: "contato",
    pergunta: "Para começar, seus dados",
    ajuda: "É por aqui que a gente vai falar com você.",
    campos: [
      { campo: "nome", rotulo: "Seu nome", exemplo: "Como podemos te chamar", icone: User },
      {
        campo: "empresa",
        rotulo: "Nome da empresa",
        exemplo: "Do jeito que o cliente conhece",
        icone: Building2,
      },
      {
        campo: "telefone",
        rotulo: "WhatsApp com DDD",
        exemplo: "(62) 99999-9999",
        icone: Phone,
        telefone: true,
      },
    ],
  },
  {
    tipo: "escolha",
    campo: "equipe",
    pergunta: "Quantas pessoas atendem o WhatsApp hoje?",
    ajuda: "Vale contar quem responde cliente, mesmo que não seja só isso que a pessoa faça.",
    opcoes: [
      {
        valor: "Só eu",
        emoji: "🙋",
        descricao: "Sou eu que respondo tudo",
        cor: "from-blue-500 to-cyan-400",
      },
      {
        valor: "2 a 5 pessoas",
        emoji: "👥",
        descricao: "Um time pequeno dividindo as conversas",
        cor: "from-emerald-500 to-teal-400",
      },
      {
        valor: "6 a 15 pessoas",
        emoji: "🏢",
        descricao: "Uma equipe de atendimento montada",
        cor: "from-violet-500 to-purple-400",
      },
      {
        valor: "Mais de 15 pessoas",
        emoji: "🏬",
        descricao: "Várias unidades ou times separados",
        cor: "from-amber-500 to-orange-400",
      },
    ],
  },
  {
    tipo: "escolha",
    campo: "volume",
    pergunta: "Quantas mensagens de cliente chegam por dia?",
    ajuda: "Um número aproximado já serve.",
    opcoes: [
      {
        valor: "Até 20 por dia",
        emoji: "💬",
        descricao: "Dá para acompanhar no celular",
        cor: "from-blue-500 to-cyan-400",
      },
      {
        valor: "De 20 a 50 por dia",
        emoji: "📈",
        descricao: "Começa a acumular quando fica corrido",
        cor: "from-emerald-500 to-teal-400",
      },
      {
        valor: "De 50 a 100 por dia",
        emoji: "⚡",
        descricao: "Alguém sempre fica esperando resposta",
        cor: "from-amber-500 to-yellow-400",
      },
      {
        valor: "Mais de 100 por dia",
        emoji: "🔥",
        descricao: "Não dá conta sem automação",
        cor: "from-red-500 to-orange-500",
      },
    ],
  },
  {
    tipo: "escolha",
    campo: "dor",
    pergunta: "Por último: o que mais te incomoda hoje?",
    ajuda: "Escolha o que mais dói. É por aí que a gente começa.",
    opcoes: [
      {
        valor: "Demoro para responder e o cliente some",
        emoji: "⏳",
        descricao: "Quando você responde, ele já comprou de outro",
        cor: "from-red-500 to-orange-500",
      },
      {
        valor: "Fora do horário ninguém responde",
        emoji: "🌙",
        descricao: "Noite, domingo e feriado ficam no vácuo",
        cor: "from-indigo-500 to-violet-500",
      },
      {
        valor: "Some gente que estava quase fechando",
        emoji: "🕳️",
        descricao: "Sem registro, ninguém percebe que sumiu",
        cor: "from-fuchsia-500 to-pink-500",
      },
      {
        valor: "Meu time repete preço e horário o dia todo",
        emoji: "🔁",
        descricao: "Quem devia vender fica respondendo o básico",
        cor: "from-amber-500 to-orange-400",
      },
    ],
  },
];

/* O que o assistente faz, na linguagem do cliente. Tudo já está em
   `planos-data.ts` e em `Capacidades.tsx`: nenhuma promessa nova. */
const BENEFICIOS = [
  "Responde na hora, 24 horas por dia, inclusive fim de semana",
  "Entende áudio, foto e documento, e qualifica o cliente sozinho",
  "Agenda, registra o lead no CRM e chama o seu time quando precisa",
];

const VAZIO: Respostas = {
  equipe: "",
  volume: "",
  dor: "",
  nome: "",
  empresa: "",
  telefone: "",
};

function mascararTelefone(valor: string) {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** O WhatsApp abre com o quiz inteiro na mensagem: quem atender do outro
 *  lado já sabe tudo o que a pessoa acabou de responder. */
function montarLink(r: Respostas) {
  const texto = [
    "Oi! Respondi as perguntas no site e quero saber como funciona o assistente de IA.",
    "",
    `Nome: ${r.nome.trim()}`,
    `Empresa: ${r.empresa.trim()}`,
    `Quem atende hoje: ${r.equipe}`,
    `Mensagens por dia: ${r.volume}`,
    `Maior problema: ${r.dor}`,
  ].join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
}

/* ─── Fundo compartilhado ─────────────────────────────── */
function Fundo() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage:
            "radial-gradient(ellipse 75% 55% at 50% 45%, black 10%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 55% at 50% 45%, black 10%, transparent 75%)",
        }}
      />
      <div
        className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full opacity-[0.12]"
        style={{
          background: "radial-gradient(circle, #00ab7a 0%, #0092ff 50%, transparent 70%)",
          animation: "blob-float 14s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -bottom-48 -right-32 h-[560px] w-[560px] rounded-full opacity-[0.10]"
        style={{
          background: "radial-gradient(circle, #8b5cf6 0%, #00ab7a 60%, transparent 70%)",
          animation: "blob-float-slow 18s ease-in-out infinite",
        }}
      />
    </div>
  );
}

/* ─── Capa ────────────────────────────────────────────── */
function Capa({ aoComecar }: { aoComecar: () => void }) {
  return (
    <motion.div
      key="capa"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-3xl bg-card p-7 shadow-2xl shadow-black/50 sm:p-10"
    >
      <div className="flex w-fit items-center gap-2.5 rounded-full border border-card-border bg-section px-4 py-2 text-sm font-medium text-text-secondary">
        <Bot aria-hidden="true" className="h-4 w-4 text-primary" />
        Assistente de IA treinado no seu negócio
      </div>

      <h1 className="mt-6 text-[clamp(26px,3.6vw,36px)] font-bold leading-[1.08] tracking-[-0.02em] text-foreground">
        Descubra como colocar um{" "}
        <span className="text-gradient-primary">assistente de IA</span> no seu atendimento
      </h1>

      <p className="mt-5 leading-relaxed text-text-secondary">
        Responda quatro perguntas rápidas sobre a sua operação. No fim, você fala com um
        especialista que já vai saber como funciona o seu atendimento hoje.
      </p>

      <ul className="mt-7 space-y-3">
        {BENEFICIOS.map((beneficio) => (
          <li key={beneficio} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-light">
              <Check aria-hidden="true" className="h-3 w-3 text-primary" />
            </span>
            <span className="text-[15px] leading-snug text-foreground">{beneficio}</span>
          </li>
        ))}
      </ul>

      <motion.button
        type="button"
        onClick={aoComecar}
        whileTap={{ scale: 0.98 }}
        className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-primary/30 transition-colors hover:bg-primary-dark"
      >
        Começar agora
        <ArrowRight aria-hidden="true" className="h-5 w-5" />
      </motion.button>

      <p className="mt-6 flex items-center gap-2 text-xs text-text-secondary">
        <ShieldCheck aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
        Configuração e treinamento por nossa conta, no ar em até 7 dias
      </p>
    </motion.div>
  );
}

/* ─── Progresso ───────────────────────────────────────── */
function Progresso({ atual, total }: { atual: number; total: number }) {
  const porcento = Math.round(((atual + 1) / total) * 100);

  return (
    <div className="mb-5 w-full">
      <div className="mb-2.5 flex items-center justify-between text-xs font-medium">
        <span className="text-dark-muted">
          Etapa {atual + 1} de {total}
        </span>
        <span className="text-primary">{porcento}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-[#00d4a0]"
          initial={false}
          animate={{ width: `${porcento}%` }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

/* ─── Tela final ──────────────────────────────────────── */
function Final({
  respostas,
  link,
  aoTestar,
}: {
  respostas: Respostas;
  link: string;
  aoTestar: () => void;
}) {
  return (
    <motion.div
      key="final"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-3xl bg-card p-7 text-center shadow-2xl shadow-black/50 sm:p-10"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.1 }}
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-light"
      >
        <Check aria-hidden="true" className="h-8 w-8 text-primary" />
      </motion.div>

      <h2 className="mt-6 text-[clamp(24px,3.2vw,32px)] font-bold leading-tight tracking-[-0.02em] text-foreground">
        Pronto, {respostas.nome.trim().split(" ")[0]}.
        <span className="mt-1 block text-primary">Dados enviados com sucesso.</span>
      </h2>
      <p className="mx-auto mt-4 max-w-md leading-relaxed text-text-secondary">
        Agora é só chamar a gente no WhatsApp. A conversa já começa com tudo o que você
        respondeu aqui, então ninguém vai repetir as mesmas perguntas.
      </p>

      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={aoTestar}
        className="animate-breath-glow mt-8 flex w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-8 py-4 text-lg font-semibold text-white transition-transform hover:scale-[1.02]"
      >
        <WhatsAppIcon className="h-5 w-5" />
        Falar no WhatsApp agora
      </a>

      <p className="mt-5 text-sm text-text-secondary">
        Respondemos na hora, inclusive fora do horário comercial.
      </p>
    </motion.div>
  );
}

/* ─── Quiz ────────────────────────────────────────────── */
export default function Quiz() {
  const [iniciado, setIniciado] = useState(false);
  const [indice, setIndice] = useState(0);
  const [respostas, setRespostas] = useState<Respostas>(VAZIO);
  const [erros, setErros] = useState<Erros>({});
  const [enviando, setEnviando] = useState(false);
  const [link, setLink] = useState("");
  const origem = useRef<Record<string, string>>({});
  const primeiroCampo = useRef<HTMLInputElement>(null);
  /** Espelho do estado para os ouvintes de saída da página, que são
   *  registrados uma vez e enxergariam valores velhos sem isto. */
  const estado = useRef({ respostas: VAZIO, indice: 0 });
  /** Identidade do lead no banco, criada uma vez por visita: cada etapa
   *  atualiza a mesma linha em vez de criar uma nova. */
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

  const etapa = ETAPAS[indice];

  // A tela de dados já entra com o cursor no primeiro campo.
  useEffect(() => {
    if (iniciado && etapa?.tipo === "contato") primeiroCampo.current?.focus();
  }, [iniciado, indice, etapa?.tipo]);

  useEffect(() => {
    estado.current = { respostas, indice };
  }, [respostas, indice]);

  /* Rascunho: quem digita os dados e sai antes de enviar também vira lead.
     `visibilitychange` é o único evento confiável no celular, onde a saída
     costuma ser trocar de aplicativo em vez de fechar a aba. */
  useEffect(() => {
    if (!iniciado) return;

    function salvarRascunho() {
      const { respostas: atuais, indice: etapaAtual } = estado.current;
      // Passou da tela de dados: o fluxo normal já gravou tudo.
      if (etapaAtual > 0) return;

      const algoDigitado = [atuais.nome, atuais.empresa, atuais.telefone].some(
        (valor) => valor.trim().length > 1
      );
      if (!algoDigitado) return;

      if (!idLead.current) idLead.current = crypto.randomUUID();
      const corpo = JSON.stringify({
        id: idLead.current,
        ...atuais,
        etapa: 0,
        origem: origem.current,
      });
      navigator.sendBeacon?.(
        "/api/lead",
        new Blob([corpo], { type: "application/json" })
      );
    }

    function aoEsconder() {
      if (document.visibilityState === "hidden") salvarRascunho();
    }

    document.addEventListener("visibilitychange", aoEsconder);
    window.addEventListener("pagehide", salvarRascunho);
    return () => {
      document.removeEventListener("visibilitychange", aoEsconder);
      window.removeEventListener("pagehide", salvarRascunho);
    };
  }, [iniciado]);

  /** Grava o que já foi respondido. Roda a cada etapa: se a pessoa
   *  abandonar depois de enviar os dados, o contato continua no banco. */
  function registrar(
    dados: Respostas,
    extras: { etapa: number; concluido?: boolean; clicouWhatsapp?: boolean }
  ) {
    if (!idLead.current) idLead.current = crypto.randomUUID();

    const corpo = JSON.stringify({
      id: idLead.current,
      ...dados,
      ...extras,
      origem: origem.current,
    });

    // `sendBeacon` sobrevive à saída da página quando a pessoa toca no
    // botão do WhatsApp; nos demais casos o fetch comum basta.
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
      /* silencioso de propósito: nada trava o avanço do quiz */
    });
  }

  async function concluir(finais: Respostas) {
    setEnviando(true);
    await registrar(finais, { etapa: ETAPAS.length, concluido: true });

    window.fbq?.("track", "Lead");
    setLink(montarLink(finais));
    setEnviando(false);
    setIndice(ETAPAS.length);
  }

  function avancar(finais: Respostas) {
    setErros({});
    if (indice === ETAPAS.length - 1) {
      concluir(finais);
      return;
    }
    // Não esperamos a resposta: a próxima pergunta entra na hora.
    registrar(finais, { etapa: indice + 1 });
    setIndice(indice + 1);
  }

  function escolher(valor: string) {
    if (etapa.tipo !== "escolha") return;
    const finais = { ...respostas, [etapa.campo]: valor };
    setRespostas(finais);
    // Pequena pausa para a marca de selecionado aparecer antes da troca de tela.
    setTimeout(() => avancar(finais), 220);
  }

  function enviarContato(evento: React.FormEvent) {
    evento.preventDefault();
    if (etapa.tipo !== "contato") return;

    const encontrados: Erros = {};
    for (const item of etapa.campos) {
      const valor = respostas[item.campo].trim();
      if (item.telefone) {
        if (valor.replace(/\D/g, "").length < 10) {
          encontrados[item.campo] = "Informe o DDD e o número";
        }
      } else if (valor.length < 2) {
        encontrados[item.campo] = "Preencha para continuar";
      }
    }

    if (Object.keys(encontrados).length > 0) {
      setErros(encontrados);
      return;
    }

    avancar(respostas);
  }

  function alterar(campo: Campo, valor: string, telefone?: boolean) {
    setRespostas((atual) => ({
      ...atual,
      [campo]: telefone ? mascararTelefone(valor) : valor,
    }));
    if (erros[campo]) {
      setErros((atuais) => {
        const restantes = { ...atuais };
        delete restantes[campo];
        return restantes;
      });
    }
  }

  const terminou = indice >= ETAPAS.length;

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-dark-base">
      <Fundo />

      <header className="relative flex items-center justify-center px-4 py-7">
        <Logo dark />
      </header>

      <main className="relative flex flex-1 items-start justify-center px-4 pb-12 sm:items-center">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            {!iniciado ? (
              <Capa key="capa" aoComecar={() => setIniciado(true)} />
            ) : terminou ? (
              <Final
                key="final"
                respostas={respostas}
                link={link}
                aoTestar={() => {
                  window.fbq?.("track", "Contact");
                  registrar(respostas, {
                    etapa: ETAPAS.length,
                    concluido: true,
                    clicouWhatsapp: true,
                  });
                }}
              />
            ) : (
              <motion.div
                key={indice}
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -28 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                <Progresso atual={indice} total={ETAPAS.length} />

                <div className="rounded-3xl bg-card p-6 shadow-2xl shadow-black/50 sm:p-8">
                  <h1 className="text-[clamp(20px,2.6vw,26px)] font-bold leading-[1.25] tracking-[-0.01em] text-foreground">
                    {etapa.pergunta}
                  </h1>
                  <p className="mt-2.5 text-sm leading-relaxed text-text-secondary">
                    {etapa.ajuda}
                  </p>

                  {etapa.tipo === "contato" ? (
                    <form onSubmit={enviarContato} noValidate className="mt-6">
                      <div className="space-y-4">
                        {etapa.campos.map((item, i) => (
                          <div key={item.campo}>
                            <label
                              htmlFor={`quiz-${item.campo}`}
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
                                ref={i === 0 ? primeiroCampo : undefined}
                                id={`quiz-${item.campo}`}
                                name={item.campo}
                                type={item.telefone ? "tel" : "text"}
                                inputMode={item.telefone ? "numeric" : "text"}
                                autoComplete={
                                  item.campo === "nome"
                                    ? "name"
                                    : item.campo === "empresa"
                                    ? "organization"
                                    : "tel-national"
                                }
                                placeholder={item.exemplo}
                                value={respostas[item.campo]}
                                onChange={(e) =>
                                  alterar(item.campo, e.target.value, item.telefone)
                                }
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
                              <p
                                id={`erro-${item.campo}`}
                                className="mt-1.5 text-sm text-red-500"
                              >
                                {erros[item.campo]}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      <button
                        type="submit"
                        className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-primary px-8 py-4 font-semibold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primary-dark"
                      >
                        Enviar e continuar
                        <ArrowRight aria-hidden="true" className="h-4 w-4" />
                      </button>

                      <p className="mt-4 flex items-center justify-center gap-2 text-xs text-text-secondary">
                        <Lock aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                        Seus dados ficam só com a CompanyChat IA
                      </p>
                    </form>
                  ) : (
                    <>
                      <div className="mt-6 space-y-3">
                        {etapa.opcoes.map((opcao, i) => {
                          const marcada = respostas[etapa.campo] === opcao.valor;
                          return (
                            <motion.button
                              key={opcao.valor}
                              type="button"
                              initial={{ opacity: 0, x: -16 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.05 + i * 0.07 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => escolher(opcao.valor)}
                              className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200 ${
                                marcada
                                  ? "border-primary bg-primary-light shadow-md shadow-primary/10"
                                  : "border-card-border bg-card hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                              }`}
                            >
                              <span
                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-2xl shadow-md ${opcao.cor}`}
                              >
                                {opcao.emoji}
                              </span>

                              <span className="flex-1">
                                <span className="block font-bold text-foreground">
                                  {opcao.valor}
                                </span>
                                <span className="mt-0.5 block text-sm leading-snug text-text-secondary">
                                  {opcao.descricao}
                                </span>
                              </span>

                              <span
                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all ${
                                  marcada ? "border-primary bg-primary" : "border-card-border"
                                }`}
                              >
                                {marcada && (
                                  <Check
                                    aria-hidden="true"
                                    className="h-3.5 w-3.5 text-white"
                                  />
                                )}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* A última pergunta é de escolha: sem este aviso, o clique
                          ficaria em silêncio enquanto o envio acontece. */}
                      {enviando ? (
                        <p className="mt-5 flex items-center justify-center gap-2 text-sm font-medium text-primary">
                          <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                          Enviando as suas respostas
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setErros({});
                            setIndice(indice - 1);
                          }}
                          className="mt-5 w-full rounded-full border border-card-border px-6 py-3 text-sm font-semibold text-text-secondary transition-colors hover:border-primary/40 hover:text-foreground"
                        >
                          Voltar
                        </button>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="relative flex items-center justify-center gap-2 px-4 pb-8 text-center text-xs text-dark-muted/70">
        <Lock aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
        Leva menos de um minuto. Seus dados ficam só com a CompanyChat IA.
      </footer>
    </div>
  );
}
