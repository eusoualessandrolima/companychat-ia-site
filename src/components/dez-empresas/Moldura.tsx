import Logo from "@/components/Logo";
import { WhatsAppIcon } from "@/components/icones/WhatsAppIcon";
import CtaAncora from "./CtaAncora";
import LinkWhatsApp from "./LinkWhatsApp";

/* Cabeçalho e rodapé da campanha. Server Components: nada aqui tem estado, e
 * os dois pontos interativos (o CTA e o link do WhatsApp) já são ilhas. */

/** Sem menu: a página tem um objetivo só. O cabeçalho carrega a marca e o
 *  mesmo CTA de todo o resto — e **rola junto com a página**, não é `fixed`.
 *  É por isso que a campanha marca `data-landing-sem-header-fixo`: o
 *  `scroll-padding-top: 5.5rem` global existe para compensar o header fixo do
 *  site e, herdado aqui, deixava 112px de vazio acima do formulário no salto
 *  da âncora. */
export function Cabecalho() {
  return (
    <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-3 px-[clamp(1rem,4vw,2rem)] py-6 pt-[max(1.5rem,env(safe-area-inset-top))] sm:gap-4">
      {/* O logo tem largura fixa de 165px e, como elemento substituído, não
          encolhe em flex: somado ao botão, estourava os 320px de um iPhone SE
          e o `overflow-clip` do root comia a borda direita. Abaixo de 380px
          ele cede 40px. */}
      <Logo dark className="max-[380px]:w-[125px]" />
      <CtaAncora rotulo="Candidatar" local="cabecalho" tamanho="medio" />
    </header>
  );
}

export function Rodape() {
  /* Calculado no servidor. Em componente de cliente, `getFullYear()` no
     corpo do render produz o ano do build no HTML e o ano corrente na
     hidratação — mismatch garantido na virada do ano. */
  const ano = new Date().getFullYear();

  return (
    <footer className="relative border-t border-dark-border pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-[clamp(1rem,4vw,2rem)] text-center">
        <Logo dark />
        <p className="text-sm text-dark-muted">
          © {ano} CompanyChat. Todos os direitos reservados.
        </p>
        <LinkWhatsApp
          local="rodape"
          className="inline-flex min-h-11 items-center gap-2 px-3 text-sm text-dark-muted transition-colors hover:text-dark-text"
        >
          <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
          Fale com a gente no WhatsApp
        </LinkWhatsApp>
        <a
          href="/privacidade"
          className="inline-flex min-h-11 items-center px-3 text-sm text-dark-muted underline underline-offset-4 transition-colors hover:text-dark-text"
        >
          Política de Privacidade
        </a>
      </div>
    </footer>
  );
}
