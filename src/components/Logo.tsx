/* Wordmark oficial da marca (identidade v2, Manrope ExtraBold convertida em
   curvas). O manual proíbe recriar a marca com texto, spans ou CSS, e proíbe
   inverter cores por filtro — por isso são dois arquivos, um por tipo de fundo.
   Proporção intrínseca 500 × 72; ver docs/marca/MANUAL-DA-MARCA.md. */

/* eslint-disable @next/next/no-img-element -- é um SVG de dimensões fixas:
   next/image não tem o que otimizar e ainda adicionaria wrapper e runtime a um
   elemento que aparece no header de todas as páginas. */
export default function Logo({
  className = "",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <img
      src={`/brand/companychat-logo-${dark ? "dark" : "light"}.svg`}
      alt="CompanyChat"
      width={500}
      height={72}
      decoding="async"
      className={`block h-auto w-[145px] md:w-[160px] ${className}`}
    />
  );
}
