"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import Logo from "./Logo";
import { whatsappLink, loginLink } from "./WhatsAppButton";

const navLinks = [
  { href: "/assistente-ia", label: "Assistente IA" },
  { href: "/company-ai",    label: "Company AI" },
  { href: "/planos",        label: "Planos" },
  { href: "#servicos",      label: "Serviços",   desktop: "hidden xl:block" },
  { href: "#beneficios",    label: "Benefícios", desktop: "hidden lg:block" },
  { href: "#sobre",         label: "Sobre",      desktop: "hidden lg:block" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progressScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 h-[2px] origin-left bg-gradient-to-r from-primary via-accent-blue to-accent-purple"
        style={{ scaleX: progressScaleX }}
      />

      <header className="fixed inset-x-0 top-0 z-40 px-4">
        <div
          className={`mx-auto flex items-center justify-between gap-4 transition-all duration-500 ease-out ${
            scrolled
              ? "mt-3 h-14 max-w-4xl rounded-full border border-dark-border bg-dark-base/80 px-6 shadow-xl shadow-black/40 backdrop-blur-xl"
              : "mt-0 h-16 max-w-6xl rounded-full border border-transparent bg-transparent px-0"
          }`}
        >
          <Link href="/" aria-label="CompanyChat, início">
            <Logo dark />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-5 md:flex lg:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap text-sm text-dark-muted transition-colors hover:text-primary ${link.desktop ?? ""}`}
              >
                {link.label}
              </a>
            ))}

            <a
              href={loginLink}
              className="whitespace-nowrap rounded-full border border-dark-border px-5 py-2 text-sm font-semibold text-dark-text transition-all hover:border-primary/40 hover:text-primary"
            >
              Fazer Login
            </a>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25"
            >
              Fale Conosco
            </a>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="md:hidden text-dark-text transition-colors"
          >
            {open ? <X aria-hidden="true" className="h-6 w-6" /> : <Menu aria-hidden="true" className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {open && (
          <nav id="mobile-nav" className="mx-auto mt-2 flex max-w-4xl flex-col gap-4 rounded-3xl border border-dark-border bg-dark-base/95 px-5 py-6 shadow-xl shadow-black/40 backdrop-blur-xl md:hidden">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-dark-muted transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
            <a
              href={loginLink}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full border border-dark-border px-5 py-3 text-center font-semibold text-dark-text"
            >
              Fazer Login
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-primary px-5 py-3 text-center font-semibold text-white"
            >
              Fale Conosco
            </a>
          </nav>
        )}
      </header>
    </>
  );
}
