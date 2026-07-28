"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "../Logo";
import { whatsappLink, loginLink } from "../WhatsAppButton";

export default function ApiHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4">
      <div
        className={`mx-auto flex items-center justify-between gap-4 transition-all duration-500 ease-out ${
          scrolled
            ? "mt-3 h-14 max-w-4xl rounded-full border border-dark-border bg-dark-base/80 px-6 shadow-xl shadow-black/40 backdrop-blur-xl"
            : "mt-0 h-16 max-w-6xl rounded-full border border-transparent bg-transparent px-0"
        }`}
      >
        <Link
          href="/"
          aria-label="Voltar ao site"
          className="flex items-center gap-2 text-dark-muted transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span className="hidden text-sm sm:inline">Voltar ao site</span>
        </Link>

        <Link href="/" aria-label="CompanyChat IA">
          <Logo dark />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={loginLink}
            className="hidden whitespace-nowrap rounded-full border border-dark-border px-5 py-2 text-sm font-semibold text-dark-text transition-all hover:border-primary/40 hover:text-primary sm:inline-flex"
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
        </div>
      </div>
    </header>
  );
}
