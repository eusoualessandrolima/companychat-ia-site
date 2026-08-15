"use client";

import { useMemo, useRef, useState } from "react";
import { Zap } from "lucide-react";
import ModalLead from "@/components/calculadora/ModalLead";
import Resultado from "@/components/calculadora/Resultado";
import Wizard from "@/components/calculadora/Wizard";
import { calcular, type Modo } from "@/components/calculadora/calculo";
import {
  PADROES_ATIVA,
  PADROES_RECEPTIVA,
  VAZIO_ATIVA,
  VAZIO_RECEPTIVA,
} from "@/components/calculadora/perguntas";

export default function Calculadora() {
  const [modo, setModo] = useState<Modo>("ativa");
  const [ativa, setAtiva] = useState<Record<string, number>>(VAZIO_ATIVA);
  const [receptiva, setReceptiva] =
    useState<Record<string, number>>(VAZIO_RECEPTIVA);
  const [mostrandoResultado, setMostrandoResultado] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const ancora = useRef<HTMLDivElement>(null);

  const valores = modo === "ativa" ? ativa : receptiva;
  const definir = modo === "ativa" ? setAtiva : setReceptiva;

  const resultado = useMemo(() => calcular(modo, valores), [modo, valores]);

  function alterar(chave: string, valor: number) {
    definir((atuais) => ({ ...atuais, [chave]: valor }));
  }

  function rolarAteOTopo() {
    ancora.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function concluir() {
    setMostrandoResultado(true);
    requestAnimationFrame(rolarAteOTopo);
  }

  function reiniciar() {
    setMostrandoResultado(false);
    setAtiva(VAZIO_ATIVA);
    setReceptiva(VAZIO_RECEPTIVA);
  }

  function restaurarExemplo() {
    setAtiva(PADROES_ATIVA);
    setReceptiva(PADROES_RECEPTIVA);
    setMostrandoResultado(true);
    requestAnimationFrame(rolarAteOTopo);
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-20 pt-28 sm:px-6">
      <header className="rounded-[28px] border border-dark-border bg-gradient-to-br from-primary/12 via-dark-surface to-dark-surface p-6 sm:p-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-on-primary">
          <Zap aria-hidden="true" className="h-4 w-4" />O choque de custos do
          WhatsApp
        </span>

        <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-[-0.02em] text-dark-text sm:text-5xl lg:text-6xl">
          Calculadora de impacto: API, novo modelo e{" "}
          <span className="text-primary">Modelo Híbrido</span>.
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-dark-muted">
          Compare, em segundos, quanto a sua operação pode custar em três
          cenários:{" "}
          <strong className="font-semibold text-dark-text">modelo atual</strong>,{" "}
          <strong className="font-semibold text-dark-text">
            modelo novo cobrado por mensagem enviada
          </strong>{" "}
          e{" "}
          <strong className="font-semibold text-primary">
            Modelo Híbrido CompanyChat
          </strong>
          .
        </p>
      </header>

      <div ref={ancora} className="scroll-mt-24 pt-5">
        {mostrandoResultado ? (
          <Resultado
            modo={modo}
            resultado={resultado}
            aoEditar={() => setMostrandoResultado(false)}
            aoRestaurarExemplo={restaurarExemplo}
            aoPedirContato={() => setModalAberto(true)}
          />
        ) : (
          <Wizard
            modo={modo}
            valores={valores}
            aoTrocarModo={setModo}
            aoAlterar={alterar}
            aoConcluir={concluir}
            aoReiniciar={reiniciar}
          />
        )}
      </div>

      <ModalLead
        aberto={modalAberto}
        aoFechar={() => setModalAberto(false)}
        modo={modo}
        resultado={resultado}
      />
    </div>
  );
}
