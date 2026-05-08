import Logo from "./Logo";
import { whatsappLink } from "./WhatsAppButton";

const links = {
  produto: [
    { href: "#servicos",   label: "Serviços" },
    { href: "#beneficios", label: "Benefícios" },
    { href: "#nichos",     label: "Nichos" },
  ],
  empresa: [
    { href: "#sobre",   label: "Sobre nós" },
    { href: "#contato", label: "Contato" },
    { href: whatsappLink, label: "WhatsApp", external: true },
  ],
  recursos: [
    { href: "#faq",           label: "FAQ" },
    { href: "#como-funciona", label: "Como funciona" },
    { href: "#depoimentos",   label: "Depoimentos" },
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
              no WhatsApp — 24h por dia, sem pausas.
            </p>

            {/* CTA */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30"
            >
              Fale Conosco
            </a>
          </div>

          {/* Links */}
          <div className="grid grid-cols-3 gap-8 lg:col-span-3">
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-dark-muted">
                Produto
              </h4>
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
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-dark-muted">
                Empresa
              </h4>
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
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-dark-muted">
                Recursos
              </h4>
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
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-dark-border pt-8 sm:flex-row">
          <p className="text-xs text-dark-muted">
            &copy; {new Date().getFullYear()} CompanyChat IA. Todos os direitos reservados.
          </p>
          <p className="text-xs text-dark-muted">
            Powered by{" "}
            <span className="text-primary">GPT-4o</span>
            {" "}· Feito no Brasil 🇧🇷
          </p>
        </div>
      </div>
    </footer>
  );
}
