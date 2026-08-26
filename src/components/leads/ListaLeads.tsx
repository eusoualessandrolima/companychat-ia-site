"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  CircleDashed,
  Download,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import type { Lead } from "@/lib/leads";
import Logo from "@/components/Logo";
import { WhatsAppIcon } from "@/components/WhatsAppButton";

type Filtro = "todos" | "concluidos" | "abandonados";

/** Quantas etapas o quiz tem hoje (dados + 3 perguntas), para mostrar
 *  "respondeu 2 de 4". Mudou `ETAPAS` em `Quiz.tsx`? Muda aqui também. */
const TOTAL_PERGUNTAS = 4;

const FILTROS: { id: Filtro; rotulo: string }[] = [
  { id: "todos", rotulo: "Todos" },
  { id: "concluidos", rotulo: "Concluíram" },
  { id: "abandonados", rotulo: "Pararam no meio" },
];

function formatarData(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function linkWhatsApp(lead: Lead) {
  if (!lead.telefone_e164) return null;
  const texto = encodeURIComponent(
    `Olá${lead.nome ? `, ${lead.nome.split(" ")[0]}` : ""}! Aqui é da CompanyChat. Vi que você começou o teste no nosso site.`
  );
  return `https://wa.me/${lead.telefone_e164}?text=${texto}`;
}

/* Campos que a candidatura de `/10-empresas` manda em `origem` (a tabela não
   tem coluna para eles). Sem isto o painel mostraria só nome, empresa e
   telefone, e quem seleciona as empresas precisaria abrir o banco. */
const CAMPOS_DA_ORIGEM: { chave: string; rotulo: string }[] = [
  { chave: "email", rotulo: "E-mail" },
  { chave: "segmento", rotulo: "Segmento" },
  { chave: "cidade", rotulo: "Cidade e estado" },
  { chave: "objetivo", rotulo: "Objetivo com a IA" },
  { chave: "motivo", rotulo: "Por que ser selecionada" },
];

function Etiqueta({ texto, rotulo }: { texto: string | null; rotulo: string }) {
  if (!texto) return null;
  return (
    <div className="flex flex-wrap items-baseline gap-1.5">
      <span className="text-xs text-dark-muted/70">{rotulo}:</span>
      <span className="text-sm text-dark-text">{texto}</span>
    </div>
  );
}

export default function ListaLeads({ leads }: { leads: Lead[] }) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [atualizando, setAtualizando] = useState(false);
  const [confirmando, setConfirmando] = useState<string | null>(null);
  const [excluindo, setExcluindo] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  /* O `router.refresh()` leva um instante para trazer a lista nova do
     servidor; até lá o card sai da tela por aqui, senão o lead reaparece
     depois de o usuário já ter visto que apagou. */
  const [removidos, setRemovidos] = useState<string[]>([]);
  const router = useRouter();

  const presentes = useMemo(
    () => leads.filter((lead) => !removidos.includes(lead.id)),
    [leads, removidos]
  );

  const resumo = useMemo(() => {
    const hoje = new Date().toDateString();
    return {
      total: presentes.length,
      concluidos: presentes.filter((l) => l.concluido).length,
      hoje: presentes.filter((l) => new Date(l.criado_em).toDateString() === hoje)
        .length,
    };
  }, [presentes]);

  const visiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return presentes.filter((lead) => {
      if (filtro === "concluidos" && !lead.concluido) return false;
      if (filtro === "abandonados" && lead.concluido) return false;
      if (!termo) return true;
      return [lead.nome, lead.empresa, lead.telefone]
        .filter(Boolean)
        .some((campo) => (campo as string).toLowerCase().includes(termo));
    });
  }, [presentes, busca, filtro]);

  async function excluir(id: string) {
    setExcluindo(id);
    setErro(null);
    try {
      const resposta = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (!resposta.ok) throw new Error(String(resposta.status));
      setRemovidos((atuais) => [...atuais, id]);
      setConfirmando(null);
      router.refresh();
    } catch {
      setErro("Não deu para excluir agora. Tente de novo.");
    } finally {
      setExcluindo(null);
    }
  }

  async function sair() {
    await fetch("/api/leads/entrar", { method: "DELETE" });
    router.refresh();
  }

  function atualizar() {
    setAtualizando(true);
    router.refresh();
    setTimeout(() => setAtualizando(false), 800);
  }

  return (
    <div className="min-h-svh bg-dark-base">
      <header className="border-b border-dark-border bg-dark-surface">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-5">
          <div className="flex items-center gap-3">
            <Logo dark />
            <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
              Leads
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={atualizar}
              className="flex items-center gap-2 rounded-full border border-dark-border px-4 py-2 text-sm font-medium text-dark-text transition-colors hover:border-primary/50 hover:text-primary"
            >
              <RefreshCw
                aria-hidden="true"
                className={`h-4 w-4 ${atualizando ? "animate-spin" : ""}`}
              />
              Atualizar
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages --
                `/api/leads/csv` é um Route Handler que devolve o arquivo para
                download, não uma página. `<Link>` faria navegação no cliente e
                o download nunca aconteceria. */}
            <a
              href="/api/leads/csv"
              className="flex items-center gap-2 rounded-full border border-dark-border px-4 py-2 text-sm font-medium text-dark-text transition-colors hover:border-primary/50 hover:text-primary"
            >
              <Download aria-hidden="true" className="h-4 w-4" />
              CSV
            </a>
            <button
              type="button"
              onClick={sair}
              aria-label="Sair do painel"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-dark-border text-dark-muted transition-colors hover:border-red-400/50 hover:text-red-400"
            >
              <LogOut aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main id="conteudo" tabIndex={-1} className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid grid-cols-3 gap-3">
          {[
            { rotulo: "Total", valor: resumo.total },
            { rotulo: "Concluíram", valor: resumo.concluidos },
            { rotulo: "Hoje", valor: resumo.hoje },
          ].map((item) => (
            <div
              key={item.rotulo}
              className="rounded-2xl border border-dark-border bg-dark-surface px-5 py-4"
            >
              <p className="text-xs uppercase tracking-wider text-dark-muted">
                {item.rotulo}
              </p>
              <p className="mt-1 text-2xl font-bold text-dark-text">{item.valor}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-muted"
            />
            <input
              type="search"
              /* O placeholder some assim que se digita, então ele não serve de
                 nome acessível. */
              aria-label="Buscar leads por nome, empresa ou telefone"
              placeholder="Buscar por nome, empresa ou telefone"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full rounded-full border border-dark-border bg-dark-surface py-3 pl-11 pr-4 text-sm text-dark-text placeholder:text-dark-muted/60 focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            {FILTROS.map((opcao) => (
              <button
                key={opcao.id}
                type="button"
                onClick={() => setFiltro(opcao.id)}
                className={`whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${
                  filtro === opcao.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-dark-border text-dark-muted hover:text-dark-text"
                }`}
              >
                {opcao.rotulo}
              </button>
            ))}
          </div>
        </div>

        {visiveis.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-dark-border px-6 py-16 text-center">
            <Users aria-hidden="true" className="mx-auto h-8 w-8 text-dark-muted/50" />
            <p className="mt-4 font-medium text-dark-text">
              {leads.length === 0 ? "Nenhum lead ainda" : "Nada com esse filtro"}
            </p>
            <p className="mt-2 text-sm text-dark-muted">
              {leads.length === 0
                ? "Assim que alguém enviar os dados no quiz, o contato aparece aqui."
                : "Tente outra busca ou volte para “Todos”."}
            </p>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {visiveis.map((lead) => {
              const whats = linkWhatsApp(lead);
              const campanha =
                lead.origem?.utm_campaign ??
                lead.origem?.campanha ??
                lead.origem?.utm_source;
              const daOrigem = CAMPOS_DA_ORIGEM.filter(
                (campo) => lead.origem?.[campo.chave]
              );

              return (
                <li
                  key={lead.id}
                  className="rounded-2xl border border-dark-border bg-dark-surface p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-dark-text">
                        {lead.nome ?? "Sem nome"}
                        {lead.empresa && (
                          <span className="font-normal text-dark-muted"> · {lead.empresa}</span>
                        )}
                      </p>
                      <p className="mt-1 text-xs text-dark-muted">
                        {formatarData(lead.criado_em)}
                        {campanha && ` · ${campanha}`}
                      </p>
                    </div>

                    <span
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                        lead.concluido
                          ? "bg-primary/15 text-primary"
                          : "bg-dark-elevated text-dark-muted"
                      }`}
                    >
                      {lead.concluido ? (
                        <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
                      ) : (
                        <CircleDashed aria-hidden="true" className="h-3.5 w-3.5" />
                      )}
                      {lead.concluido
                        ? lead.clicou_whatsapp
                          ? "Foi para o WhatsApp"
                          : "Concluiu, não clicou"
                        : lead.etapa === 0
                        ? "Não chegou a enviar"
                        : `Parou na etapa ${lead.etapa} de ${TOTAL_PERGUNTAS}`}
                    </span>
                  </div>

                  {(lead.equipe || lead.volume || lead.dor || daOrigem.length > 0) && (
                    <div className="mt-4 space-y-1 border-t border-dark-border pt-4">
                      <Etiqueta rotulo="Quem atende" texto={lead.equipe} />
                      <Etiqueta rotulo="Mensagens por dia" texto={lead.volume} />
                      <Etiqueta rotulo="Maior problema" texto={lead.dor} />
                      {daOrigem.map((campo) => (
                        <Etiqueta
                          key={campo.chave}
                          rotulo={campo.rotulo}
                          texto={lead.origem[campo.chave]}
                        />
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    {whats ? (
                      <a
                        href={whats}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
                      >
                        <WhatsAppIcon className="h-4 w-4" />
                        {lead.telefone}
                      </a>
                    ) : (
                      <span />
                    )}

                    {confirmando === lead.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-dark-muted">Excluir de vez?</span>
                        <button
                          type="button"
                          onClick={() => excluir(lead.id)}
                          disabled={excluindo === lead.id}
                          className="inline-flex items-center gap-1.5 rounded-full bg-red-500/90 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-500 disabled:opacity-60"
                        >
                          {excluindo === lead.id && (
                            <Loader2 aria-hidden="true" className="h-3.5 w-3.5 animate-spin" />
                          )}
                          Sim, excluir
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmando(null)}
                          disabled={excluindo === lead.id}
                          className="rounded-full border border-dark-border px-3 py-1.5 text-xs font-medium text-dark-muted transition-colors hover:text-dark-text disabled:opacity-60"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setErro(null);
                          setConfirmando(lead.id);
                        }}
                        aria-label={`Excluir o lead ${lead.nome ?? "sem nome"}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-dark-border px-3 py-1.5 text-xs font-medium text-dark-muted transition-colors hover:border-red-400/50 hover:text-red-400"
                      >
                        <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                        Excluir
                      </button>
                    )}
                  </div>

                  {erro && confirmando === lead.id && (
                    <p className="mt-2 text-right text-xs text-red-400">{erro}</p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
