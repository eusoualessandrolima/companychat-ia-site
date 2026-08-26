import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { bancoConfigurado, listarLeads } from "@/lib/leads";
import { estaAutenticado, painelConfigurado } from "@/lib/painel";
import FormSenha from "@/components/leads/FormSenha";
import ListaLeads from "@/components/leads/ListaLeads";

export const metadata: Metadata = {
  title: "Painel de leads | CompanyChat",
  robots: { index: false, follow: false },
};

/* Leads mudam a cada visita ao quiz: nada aqui pode ser pré-renderizado. */
export const dynamic = "force-dynamic";

function Aviso({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <main
      id="conteudo"
      tabIndex={-1}
      className="flex min-h-svh items-center justify-center bg-dark-base px-4"
    >
      <div className="max-w-md rounded-3xl border border-dark-border bg-dark-surface p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15">
          <AlertTriangle aria-hidden="true" className="h-5 w-5 text-amber-400" />
        </div>
        <h1 className="mt-5 text-xl font-bold text-dark-text">{titulo}</h1>
        <p className="mt-3 text-sm leading-relaxed text-dark-muted">{texto}</p>
      </div>
    </main>
  );
}

export default async function Leads() {
  if (!painelConfigurado()) {
    return (
      <Aviso
        titulo="Painel sem senha"
        texto="Cadastre a variável PAINEL_LEADS_SENHA (mínimo 6 caracteres) no ambiente para liberar o acesso."
      />
    );
  }

  if (!(await estaAutenticado())) return <FormSenha />;

  if (!bancoConfigurado()) {
    return (
      <Aviso
        titulo="Banco não configurado"
        texto="Cadastre DATABASE_URL no ambiente para o painel listar os leads. O passo a passo está em db/README.md."
      />
    );
  }

  const leads = await listarLeads();
  return <ListaLeads leads={leads} />;
}
