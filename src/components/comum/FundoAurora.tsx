/* Ambientação das landings escuras: malha de pontos no topo e um brilho verde
 * que flutua no canto.
 *
 * Estava duplicado em `dez-empresas/Campanha.tsx:145-170` e
 * `lp/Landing.tsx:101-124`, com a única diferença sendo a animação do blob.
 *
 * Duas correções em relação às cópias: a animação usa `.animate-blob-float`,
 * que já existe no sistema, em vez de repetir `animation:` inline; e o segundo
 * tom vem de `--color-accent-blue`, em vez do `#0092ff` que estava hardcoded e
 * não é token de nada.
 *
 * Tudo aqui é decoração atrás do conteúdo: `pointer-events-none`, nenhum texto
 * se apoia no gradiente. */
export default function FundoAurora() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-clip">
      <div
        className="absolute inset-x-0 top-0 h-[900px] opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage:
            "radial-gradient(ellipse 75% 55% at 50% 30%, black 10%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 55% at 50% 30%, black 10%, transparent 75%)",
        }}
      />
      <div
        className="animate-blob-float absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full opacity-[0.12]"
        style={{
          background:
            "radial-gradient(circle, var(--color-primary) 0%, var(--color-accent-blue) 50%, transparent 70%)",
        }}
      />
    </div>
  );
}
