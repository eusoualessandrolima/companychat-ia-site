import { MapPin } from "lucide-react";
import Logo from "./Logo";
import { whatsappLink } from "@/lib/whatsapp";

/* Marca "infinito" da Meta em gradiente azul da marca */
function MetaLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M2 8c0-3.1 1.8-5.6 4.4-5.6 2 0 3.5 1.7 4.8 3.9L12 8l1-1.7c1.3-2.2 2.7-3.9 4.7-3.9C20.2 2.4 22 4.9 22 8s-1.8 5.6-4.4 5.6c-2 0-3.5-1.7-4.8-3.9L12 8l-.8 1.4C9.9 11.6 8.4 13.6 6.4 13.6 3.8 13.6 2 11.1 2 8z"
        stroke="url(#meta-gradient)"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="meta-gradient" x1="0" y1="0" x2="24" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0064E1" />
          <stop offset="1" stopColor="#0082FB" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const links = {
  produto: [
    { href: "/planos",      label: "Planos e preços" },
    { href: "/#servicos",   label: "Serviços" },
    { href: "/#beneficios", label: "Benefícios" },
    { href: "/#nichos",     label: "Nichos" },
  ],
  empresa: [
    { href: "/company-ai", label: "Company AI" },
    { href: "/#sobre",   label: "Sobre nós" },
    { href: "/#contato", label: "Contato" },
    { href: whatsappLink, label: "WhatsApp", external: true },
  ],
  recursos: [
    { href: "/#faq",           label: "FAQ" },
    { href: "/#como-funciona", label: "Como funciona" },
    { href: "/assistente-ia",  label: "Assistente de IA" },
    { href: "/api-oficial",    label: "API Oficial" },
    { href: "/disparos",       label: "Disparo em massa" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-dark-base">
      {/* Gradient top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* Subtle glow */}
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/6 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-16">
        {/* Top section */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Logo dark className="mb-4" />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-dark-muted">
              Assistente IA personalizado que responde, qualifica e converte clientes
              no WhatsApp, 24h por dia, sem pausas.
            </p>

            {/* CTA */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-all hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30"
            >
              Fale Conosco
            </a>
          </div>

          {/* Links */}
          <div className="grid grid-cols-3 gap-8 lg:col-span-3">
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-dark-muted">
                Produto
              </h3>
              <ul className="space-y-3">
                {links.produto.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="text-sm text-dark-muted transition-colors hover:text-primary">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-dark-muted">
                Empresa
              </h3>
              <ul className="space-y-3">
                {links.empresa.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target={l.external ? "_blank" : undefined}
                      rel={l.external ? "noopener noreferrer" : undefined}
                      className="text-sm text-dark-muted transition-colors hover:text-primary"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-dark-muted">
                Recursos
              </h3>
              <ul className="space-y-3">
                {links.recursos.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="text-sm text-dark-muted transition-colors hover:text-primary">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-center gap-5 border-t border-dark-border pt-8">
          {/* Selo de parceria oficial Meta */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-dark-border bg-dark-surface px-4 py-2">
            <MetaLogo className="h-4 w-6 shrink-0" />
            <span className="text-sm font-medium text-dark-text">Meta Business Partner</span>
          </div>

          <p className="flex items-center gap-1.5 text-center text-xs text-dark-muted">
            <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-primary" />
            Goiânia, GO · Atendimento 100% online para todo o Brasil
          </p>

          <p className="text-center text-xs text-dark-muted">
            &copy; {new Date().getFullYear()} CompanyChat IA Ltda. Todos os direitos reservados
            <span className="mx-3 opacity-40">|</span>
            CNPJ 36.076.441/0001-14
            <span className="mx-3 opacity-40">|</span>
            <a href="/privacidade" className="underline underline-offset-4 transition-colors hover:text-primary">
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
