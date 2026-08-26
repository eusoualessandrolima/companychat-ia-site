# Ficha técnica — CompanyChat

## Identificação

- Nome público: CompanyChat
- Tipo: símbolo + wordmark tipográfico
- Versão: Identidade Oficial v3 — "balão em destaque"
- Data: 26 de agosto de 2026
- Substitui: v2 (wordmark ExtraBold sem símbolo, 15 de agosto de 2026)

## Arquivos mestre

| Peça | ViewBox | Observação |
|---|---|---|
| Assinatura horizontal | `0 0 568 72` | Principal; o wordmark ocupa 500 das 568 unidades |
| Assinatura vertical | `0 0 556 420` | Símbolo acima do nome |
| Símbolo isolado | `40 32 440 460` | Favicon, avatar, selo |
| Wordmark isolado | `0 0 500 72` | Secundário, herdado da v2 |

- Formato: SVG
- Fundo: transparente
- Tipografia: convertida em curvas
- Dependência de fonte no site: nenhuma

## Tipografia de origem

- Família: Manrope
- Peso: **800 / ExtraBold**
- Tracking óptico: ajustado especificamente para a assinatura
- Licença: SIL Open Font License 1.1
- Licença incluída em `OFL-Manrope.txt`

## Paleta

### Símbolo

| Fundo | Balão da frente | Peça de trás |
|---|---|---|
| Escuro (principal) | `#F5F7F6` | `#70E8C6` |
| Escuro (variante do favicon) | `#00C896` | `#075F4C` |
| Claro | `#00A77B` | `#A9F3DC` |
| Verde da marca | `#FFFFFF` | `#A9F3DC` |

### Wordmark

| Uso | Cor |
|---|---|
| Company em fundo escuro | `#F5F7F6` |
| Chat em fundo escuro | `#00C896` |
| Company em fundo claro | `#071011` |
| Chat em fundo claro | `#00A77B` |
| Wordmark inteiro sobre verde da marca | `#FFFFFF` |
| Fundo escuro preferencial | `#071011` |
| Fundo claro preferencial | `#F3F6F5` |

## PNGs transparentes

Entregues na v3, em `Modelo v3/03-PNG-TRANSPARENTE` (não versionados no repositório):

- Assinatura horizontal: 640 e 1280 px.
- Assinatura vertical: 800 px.
- Símbolo: 64, 128, 256 e 512 px.

No site, priorizar sempre o SVG. Os únicos PNGs versionados são os do favicon,
em `public/icons/` e `src/app/`, porque `.ico` e `apple-touch-icon` exigem raster.

## Favicon

Gerado a partir do símbolo na variante `dark-green` sobre `#071011`.
Ver a seção 9 do `MANUAL-DA-MARCA.md` para a tabela arquivo a arquivo.
