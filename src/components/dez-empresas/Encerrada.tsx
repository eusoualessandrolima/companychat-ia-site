import { WhatsAppIcon } from "@/components/icones/WhatsAppIcon";
import LinkWhatsApp from "./LinkWhatsApp";
import { encerramento } from "./conteudo";

/** Toma o lugar do formulário quando `CAMPANHA_ENCERRADA` está ligada.
 *
 *  Este caminho não é exercitado pelo teste E2E — quando a chave for virada,
 *  vale conferir as duas posições à mão antes de publicar. */
export default function Encerrada() {
  return (
    <div className="rounded-3xl border border-dark-border bg-dark-elevated p-7 text-center sm:p-9">
      <span className="inline-block rounded-full border border-dark-border bg-white/[0.04] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-dark-muted">
        {encerramento.badge}
      </span>
      <h2 className="mt-6 text-[clamp(1.5rem,3.4vw,2.125rem)] font-bold leading-[1.15] tracking-[-0.02em]">
        {encerramento.titulo}
      </h2>
      <p className="mx-auto mt-5 max-w-lg leading-relaxed text-dark-muted">
        {encerramento.texto}
      </p>
      <p className="mx-auto mt-3 max-w-lg text-[0.9375rem] leading-relaxed text-dark-muted/85">
        {encerramento.complemento}
      </p>
      <LinkWhatsApp
        local="encerrada"
        className="mt-8 inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-primary px-7 py-3.5 font-semibold text-on-primary transition-colors hover:bg-primary-dark"
      >
        <WhatsAppIcon className="h-5 w-5" />
        {encerramento.botao}
      </LinkWhatsApp>
    </div>
  );
}
