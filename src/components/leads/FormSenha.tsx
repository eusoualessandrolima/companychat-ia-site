"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, KeyRound, Loader2 } from "lucide-react";
import Logo from "@/components/Logo";

export default function FormSenha() {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [entrando, setEntrando] = useState(false);
  const router = useRouter();

  async function entrar(evento: React.FormEvent) {
    evento.preventDefault();
    setEntrando(true);
    setErro("");

    try {
      const resposta = await fetch("/api/leads/entrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senha }),
      });

      if (resposta.ok) {
        router.refresh();
        return;
      }

      setErro(
        resposta.status === 503
          ? "O painel ainda não tem senha configurada."
          : "Senha incorreta."
      );
    } catch {
      setErro("Não foi possível entrar agora. Tente novamente.");
    }

    setEntrando(false);
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-dark-base px-4">
      <form
        onSubmit={entrar}
        className="w-full max-w-sm rounded-3xl border border-dark-border bg-dark-surface p-8 shadow-2xl shadow-black/50"
      >
        <div className="flex justify-center">
          <Logo dark />
        </div>

        <div className="mx-auto mt-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15">
          <KeyRound aria-hidden="true" className="h-5 w-5 text-primary" />
        </div>

        <h1 className="mt-5 text-center text-xl font-bold text-dark-text">
          Painel de leads
        </h1>
        <p className="mt-2 text-center text-sm text-dark-muted">
          Informe a senha para ver os contatos do quiz.
        </p>

        <input
          type="password"
          autoFocus
          autoComplete="current-password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => {
            setSenha(e.target.value);
            if (erro) setErro("");
          }}
          aria-invalid={Boolean(erro)}
          className={`mt-6 w-full rounded-xl border bg-dark-base px-4 py-3 text-dark-text placeholder:text-dark-muted/60 transition-colors focus:outline-none ${
            erro ? "border-red-400/70" : "border-dark-border focus:border-primary"
          }`}
        />
        {erro && <p className="mt-2 text-sm text-red-400">{erro}</p>}

        <button
          type="submit"
          disabled={entrando || senha.length === 0}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-on-primary transition-colors hover:bg-primary-dark disabled:opacity-50"
        >
          {entrando ? (
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Entrar
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
