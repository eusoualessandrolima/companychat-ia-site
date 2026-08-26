"use client";

import { useEffect } from "react";
import { evento, urlInicial } from "@/lib/analytics";

/* Visualização da página no mesmo canal dos demais eventos do funil.
 *
 * O `PageView` do Pixel já sai no script; este é o evento nomeado da campanha,
 * que também alimenta o `dataLayer` quando houver contêiner de tags.
 *
 * Renderiza `null`: existe só para carregar o efeito. É o que permite que a
 * página inteira ao redor seja Server Component — antes, este `useEffect`
 * sozinho obrigava as 524 linhas da campanha a serem código de cliente. */
export default function MedidorDePagina() {
  useEffect(() => {
    urlInicial();
    evento("campanha10_page_view");
  }, []);

  return null;
}
