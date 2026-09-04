import Link from "next/link";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";

/* Casca comum das três páginas jurídicas (`/privacidade`, `/termos` e
   `/exclusao-de-dados`). Antes só existia a política de privacidade, com o
   cabeçalho escrito à mão dentro da própria página; com três documentos a
   duplicação seria a forma mais fácil de um deles divergir do outro.

   As três páginas são **claras** — usam o fundo do `body`, sem envelope
   escuro. Até 2026-08-26 a política carregava tokens de modo escuro herdados de
   uma versão anterior, e o texto saía #F5F7F6 sobre #F5F7F6: o documento
   inteiro estava invisível em produção. Ao editar aqui, use `foreground` /
   `text-secondary` / `card-border`; os tokens `dark-*` só valem dentro do card
   escuro do rodapé de cada página.

   Nenhuma delas depende de autenticação, cookie ou JavaScript: a revisão de
   apps da Meta abre a URL direto, sem sessão, e precisa receber 200 com o
   conteúdo já no HTML. */

export function Secao({
  id,
  titulo,
  children,
}: {
  id?: string;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-10 scroll-mt-24">
      <h2 className="text-xl font-bold tracking-[-0.01em] text-foreground sm:text-2xl">
        {titulo}
      </h2>
      <div className="mt-3 space-y-3 leading-relaxed text-text-secondary">
        {children}
      </div>
    </section>
  );
}

/** Rótulo em negrito que abre um parágrafo de definição. */
export function Termo({ children }: { children: React.ReactNode }) {
  return <strong className="text-foreground">{children}</strong>;
}

/** Link externo com o alvo e o `rel` corretos, no verde de contraste alto. */
export function LinkExterno({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary-text underline underline-offset-4"
    >
      {children}
    </a>
  );
}

/** Link interno entre os três documentos jurídicos. */
export function LinkInterno({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="text-primary-text underline underline-offset-4">
      {children}
    </Link>
  );
}

export default function PaginaLegal({
  titulo,
  atualizadoEm,
  introducao,
  children,
  rodape,
}: {
  titulo: string;
  atualizadoEm: string;
  introducao: React.ReactNode;
  children: React.ReactNode;
  /** Card escuro do fim da página, normalmente um convite a falar com a gente. */
  rodape?: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b border-card-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-[clamp(1rem,4vw,2rem)] py-5">
          {/* Variante clara, não a escura: estas páginas rodam sobre o fundo
              claro do `body`, e no arquivo escuro o balão e a palavra `Company`
              são #F5F7F6 — sumiam por completo. */}
          <Link href="/" aria-label="Ir para a página inicial">
            <Logo />
          </Link>
          <Link
            href="/"
            /* `primary-text` e não `primary`: o verde vivo dá 2,16:1 sobre o
               fundo claro, e um estado de hover não pode piorar a leitura. */
            className="text-sm text-text-secondary transition-colors hover:text-primary-text"
          >
            Voltar ao site
          </Link>
        </div>
      </header>

      <main
        id="conteudo"
        tabIndex={-1}
        className="mx-auto max-w-3xl px-[clamp(1rem,4vw,2rem)] py-12 sm:py-16"
      >
        <h1 className="text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl">
          {titulo}
        </h1>
        <p className="mt-3 text-sm text-text-secondary">
          Última atualização: {atualizadoEm}
        </p>

        <div className="mt-8 space-y-3 leading-relaxed text-text-secondary">
          {introducao}
        </div>

        {children}

        {rodape ? (
          <div className="mt-12 rounded-2xl border border-dark-border bg-dark-surface p-6">
            {/* Único bloco escuro da página: aqui os tokens de modo escuro são
                os corretos, e é por isso que ele não acompanha a conversão do
                resto. */}
            {rodape}
          </div>
        ) : null}
      </main>

      <Footer />
    </>
  );
}
