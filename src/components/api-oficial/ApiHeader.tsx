import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "../Logo";
import { whatsappLink } from "../WhatsAppButton";

export default function ApiHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-dark-border bg-dark-base/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-dark-muted transition-colors hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden text-sm sm:inline">Voltar ao site</span>
        </Link>

        <Link href="/" aria-label="CompanyChat IA">
          <Logo dark />
        </Link>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25"
        >
          Fale Conosco
        </a>
      </div>
    </header>
  );
}
