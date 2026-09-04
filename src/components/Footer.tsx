import { MapPin } from "lucide-react";
import Logo from "./Logo";
import CtaTesteGratis from "./CtaTesteGratis";
import { CTA_LABEL_CURTO, CTA_TESTE_GRATIS } from "@/lib/cta";
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
    { href: CTA_TESTE_GRATIS, label: "Teste grátis" },
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
    { href: "/agente-ia",      label: "Agente de IA" },
    { href: "/api-oficial",    label: "API Oficial" },
    { href: "/disparos",       label: "Disparo em massa" },
  ],
};

/* Fora do objeto `links` de propósito: estes três não são navegação de
   produto, aparecem numa linha própria da barra inferior e a revisão de apps
   da Meta exige que estejam visíveis em todas as páginas. */
const legais = [
  { href: "/privacidade", label: "Política de Privacidade" },
  { href: "/termos", label: "Termos de Serviço" },
  { href: "/exclusao-de-dados", label: "Exclusão de Dados" },
];

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
              Agente de IA personalizado que atende, qualifica, agenda e converte
              clientes no WhatsApp, 24h por dia, sem pausas.
            </p>

            {/* CTA */}
            <CtaTesteGratis
              local="footer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-all hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30"
            >
              {CTA_LABEL_CURTO}
            </CtaTesteGratis>
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

          {/* Os três documentos jurídicos em linha própria, e não espremidos no
              fim da linha de copyright: a revisão do aplicativo da Meta procura
              os links de Política de Privacidade, Termos e Exclusão de Dados no
              rodapé, e o alvo de toque precisa dar os 44px no celular. Com
              `text-xs` a caixa de linha tem 16px, então são 14px de
              preenchimento vertical (`py-3.5`) para fechar os 44 — com `py-2` o
              alvo media 32px. */}
          <nav aria-label="Documentos legais">
            {/* Sem separador "|" entre os itens: os três não cabem numa linha a
                partir de 390px, e a barra sobrava no começo da linha de baixo.
                O espaçamento sozinho já separa. */}
            <ul className="flex flex-wrap items-center justify-center gap-x-3 text-xs">
              {legais.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="inline-block px-1 py-3.5 text-dark-muted underline underline-offset-4 transition-colors hover:text-primary"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <p className="text-center text-xs text-dark-muted">
            &copy; {new Date().getFullYear()} CompanyChat IA Ltda. Todos os direitos reservados
            <span className="mx-3 opacity-40">|</span>
            CNPJ 36.076.441/0001-14
          </p>
        </div>
      </div>
    </footer>
  );
}
