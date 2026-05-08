"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import Logo from "./Logo";
import { whatsappLink } from "./WhatsAppButton";

const navLinks = [
  { href: "#servicos",   label: "Serviços" },
  { href: "#beneficios", label: "Benefícios" },
  { href: "#sobre",      label: "Sobre" },
  { href: "#contato",    label: "Contato" },
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

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "border-b border-dark-border bg-dark-base/90 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <a href="#">
            <Logo dark />
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-dark-muted transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25"
            >
              Fale Conosco
            </a>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            className="md:hidden text-dark-text transition-colors"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {open && (
          <nav className="flex flex-col gap-4 border-t border-dark-border bg-dark-base px-4 py-6 md:hidden">
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
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 rounded-full bg-primary px-5 py-3 text-center font-semibold text-white"
            >
              Fale Conosco
            </a>
          </nav>
        )}
      </header>
    </>
  );
}
