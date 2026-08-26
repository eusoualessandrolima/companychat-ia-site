/* Assinatura oficial da marca (identidade v3, "balão em destaque"): símbolo +
   wordmark Manrope ExtraBold convertida em curvas. Até a v2 o manual proibia
   símbolo; a v3 aprovou um, e a assinatura completa passou a ser a versão
   principal — é dela que sai o favicon.

   O manual continua proibindo recriar a marca com texto, spans ou CSS, e
   proibindo inverter cores por filtro — por isso são dois arquivos, um por
   tipo de fundo. Proporção intrínseca 568 × 72; ver docs/marca/MANUAL-DA-MARCA.md. */

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
      src={`/brand/companychat-logo-balao-destaque-${dark ? "dark" : "light"}.svg`}
      alt="CompanyChat"
      width={568}
      height={72}
      decoding="async"
      /* 165/182 px e não os 145/160 de antes: o wordmark ocupa 500 das 568
         unidades do arquivo, então manter o nome no mesmo tamanho óptico do
         header publicado exige compensar a largura que o símbolo acrescenta. */
      className={`block h-auto w-[165px] md:w-[182px] ${className}`}
    />
  );
}

/* Símbolo isolado, para onde o nome já apareceu ou não cabe — foto de perfil,
   avatar, selo. Só existe a partir da v3 da identidade: até a v2 o manual
   proibia símbolo, e por isso o site vinha desenhando um "C" no lugar.

   `dark-green` é a mesma variante do favicon: é assim que a marca aparece como
   foto de perfil de verdade, num quadrado ou círculo escuro. */
export function Simbolo({
  className = "",
  variante = "dark-green",
}: {
  className?: string;
  variante?: "dark-green" | "dark" | "light" | "brand";
}) {
  return (
    <img
      src={`/brand/companychat-symbol-balao-destaque-${variante}.svg`}
      alt=""
      width={440}
      height={460}
      decoding="async"
      className={`block ${className}`}
    />
  );
}
