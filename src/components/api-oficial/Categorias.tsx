"use client";

import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import { categorias } from "./pricing";

export default function Categorias() {
  return (
    <section id="categorias" className="relative bg-section py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            As 3 categorias <span className="text-primary-text">cobradas</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            A Meta cobra por template enviado, e o valor muda conforme a categoria.
            A quarta categoria é a de serviço: dentro da janela de 24h ela é gratuita
            e não entra nesta conta.
          </p>
        </motion.div>

        {/* Três colunas fechadas: com grid de 4 os cartões encostavam à esquerda */}
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {categorias.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border ${c.cor.borda} bg-card p-7 shadow-sm transition-all duration-300 hover:shadow-lg`}
            >
              <div className={`absolute top-0 left-0 right-0 h-[3px] ${c.cor.barra} opacity-70 transition-opacity group-hover:opacity-100`} />

              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${c.cor.bg} ${c.cor.text} transition-transform duration-300 group-hover:scale-110`}>
                <c.icon aria-hidden="true" className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-xl font-bold text-foreground">{c.nome}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">
                {c.quandoUsa}
              </p>

              <div className="mt-6 border-t border-card-border pt-4">
                <p className="text-xs uppercase tracking-wide text-text-secondary">
                  Custo por mensagem
                </p>
                {c.gratis ? (
                  <p className={`mt-1 flex items-center gap-1.5 text-lg font-bold ${c.cor.text}`}>
                    <Gift aria-hidden="true" className="h-4 w-4" /> {c.faixa}
                  </p>
                ) : (
                  <p className="mt-1 text-lg font-bold text-foreground">{c.faixa}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-text-secondary">
          Valores aproximados da Meta para o Brasil, sujeitos a alteração. Consulte sempre a documentação oficial.
        </p>
      </div>
    </section>
  );
}
