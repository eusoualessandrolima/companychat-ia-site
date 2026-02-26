import Logo from "./Logo";

const links = [
  { href: "#servicos", label: "Serviços" },
  { href: "#beneficios", label: "Benefícios" },
  { href: "#sobre", label: "Sobre" },
  { href: "#contato", label: "Contato" },
];

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-section py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <Logo />

          <nav className="flex flex-wrap justify-center gap-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-text-secondary transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-8 border-t border-black/5 pt-8 text-center text-sm text-text-secondary">
          &copy; {new Date().getFullYear()} CompanyChat IA. Todos os direitos
          reservados.
        </div>
      </div>
    </footer>
  );
}
