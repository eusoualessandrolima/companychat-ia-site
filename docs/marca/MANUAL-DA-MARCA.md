# Manual da marca — CompanyChat

> Identidade Oficial **v3 — "balão em destaque"**, 26 de agosto de 2026.
> Origem dos arquivos: `Marketing/Logomarca/Modelo v3` (Google Drive).
> A v2 era um wordmark sem símbolo e proibia qualquer símbolo. A v3 aprovou um
> — e é dele que sai o favicon, que até então não existia.

## 1. Assinatura oficial

A assinatura visual oficial é o **símbolo do balão em destaque seguido do wordmark**:

> ▣ CompanyChat

- O símbolo vem sempre à esquerda, na mesma altura do nome.
- Uma palavra, sem espaço, no wordmark.
- `C` maiúsculo em `Company` e em `Chat`.
- `Company` em branco sobre fundo escuro ou quase preto sobre fundo claro.
- `Chat` em verde.
- Sem cápsulas `IA` ou `AI`.

O wordmark isolado (sem símbolo) continua válido, mas é a versão secundária:
usar só onde o símbolo não couber ou já estiver presente ao lado.

## 2. Construção

### Símbolo

- Duas peças: um balão de conversa à frente e um quadrado arredondado atrás.
- Sem moldura externa e sem cor de interseção — a peça da frente simplesmente cobre a de trás.
- A geometria é fixa. Só as cores das duas peças mudam entre as versões.

### Wordmark

- Tipografia de origem: **Manrope ExtraBold 800**.
- `Company` e `Chat` usam o mesmo peso, tamanho e linha de base.
- O encontro de `y` com `C` recebeu ajuste óptico para o nome funcionar como uma unidade.
- Os SVGs estão convertidos em curvas e não dependem de fonte no site.
- Não recriar a marca digitando o nome em HTML, CSS, Canva ou outro editor.

## 3. Cores

### Sobre fundo escuro (versão principal)

- Balão da frente: `#F5F7F6`
- Peça de trás: `#70E8C6`
- `Company`: `#F5F7F6`
- `Chat`: `#00C896`
- Fundo preferencial: `#071011`

Existe uma variante `dark-green` para o mesmo fundo escuro — balão `#00C896`
sobre peça `#075F4C` — usada quando o verde precisa dominar em peça pequena.
É a versão aplicada no favicon. Nas telas do site, a principal é a de balão branco.

### Sobre fundo claro

- Balão da frente: `#00A77B`
- Peça de trás: `#A9F3DC`
- `Company`: `#071011`
- `Chat`: `#00A77B`
- Fundo preferencial: `#F3F6F5` ou branco

### Sobre fundo verde da marca

- Balão da frente: `#FFFFFF`
- Peça de trás: `#A9F3DC`
- Wordmark inteiro em `#FFFFFF`

O verde mais escuro da versão clara melhora o contraste.

## 4. Arquivos oficiais

Todos em `public/brand/`.

### Assinatura completa — horizontal (`568 × 72`)

- `companychat-logo-balao-destaque-dark.svg`: **principal**, para fundos escuros.
- `companychat-logo-balao-destaque-light.svg`: para fundos claros.
- `companychat-logo-balao-destaque-dark-green.svg`: fundo escuro, variante de balão verde.
- `companychat-logo-balao-destaque-brand.svg`: sobre o verde da marca.

### Assinatura completa — vertical (`556 × 420`)

- `companychat-logo-balao-destaque-vertical-dark.svg`
- `companychat-logo-balao-destaque-vertical-light.svg`
- `companychat-logo-balao-destaque-vertical-brand.svg`

### Símbolo isolado (`viewBox 40 32 440 460`)

- `companychat-symbol-balao-destaque-dark.svg`
- `companychat-symbol-balao-destaque-dark-green.svg`
- `companychat-symbol-balao-destaque-light.svg`
- `companychat-symbol-balao-destaque-brand.svg`

Usar só onde o nome já apareceu ou não cabe: favicon, avatar, selo, app.

### Wordmark isolado (`500 × 72`) — secundário

- `companychat-logo-dark.svg`, `companychat-logo-light.svg`
- `companychat-logo-white.svg`, `companychat-logo-black.svg` (monocromáticas)

Não adaptar cores com filtros CSS e não inverter versões manualmente.

## 5. Área de proteção

Manter uma margem livre mínima equivalente a metade da altura do `C` ao redor da
marca. Menu, bordas, botões e textos não devem invadir essa área. O espaço entre
o símbolo e o wordmark já está embutido no arquivo e não deve ser alterado.

## 6. Tamanhos recomendados

Medidas de **largura total da assinatura completa**, que inclui o símbolo:

- Header desktop: `182 px` (`160 px` de wordmark + símbolo).
- Header mobile: `165 px` (`145 px` de wordmark + símbolo).
- Outros materiais digitais: mínimo de `136 px`.
- Impressos: mínimo de `36 mm`.
- Símbolo isolado: mínimo de `24 px`.

No site, usar `display: block`, largura controlada e `height: auto`. A proporção
original da assinatura horizontal é `568 × 72`.

## 7. Frase da comunicação

> Quem usa CompanyChat não acompanha o mercado. **Inova ele.**

A frase não faz parte do logotipo. Ela pode ser usada no hero e em campanhas, com
`Inova ele.` em destaque e com efeito visual discreto.

## 8. Usos proibidos

- Recolocar `IA` ou `AI` ao lado do logotipo.
- Acrescentar qualquer elemento além do símbolo oficial: robô, seta, brilho, sombra, degradê ou 3D.
- Redesenhar o símbolo, mudar sua geometria ou adicionar moldura e cor de interseção.
- Alterar as proporções do SVG ou a distância entre símbolo e wordmark.
- Separar o nome em duas linhas.
- Usar pesos diferentes em `Company` e `Chat`.
- Aplicar opacidade ao logotipo.
- Trocar o verde sem aprovação.

## 9. Favicon

O favicon é o **símbolo isolado na variante `dark-green`** — balão `#00C896`
sobre peça `#075F4C`, num quadrado `#071011` sem cantos arredondados (o sistema
operacional aplica o recorte). Os arquivos vieram prontos da v3 e não devem ser
regerados por conversão manual:

| Arquivo no repositório | Origem na v3 | Para quê |
|---|---|---|
| `src/app/favicon.ico` | `05-FAVICON/favicon.ico` | Aba do navegador (16 e 32 px) |
| `src/app/icon.svg` | `05-FAVICON/favicon.svg` | Navegador moderno, vetor |
| `src/app/apple-icon.png` | `05-FAVICON/apple-touch-icon.png` | Tela de início do iOS (180 px) |
| `public/icons/android-chrome-192x192.png` | idem | Manifest, Android |
| `public/icons/android-chrome-512x512.png` | idem | Manifest, Android, logo do JSON-LD |
| `public/icons/favicon-16x16.png`, `-32x32`, `-48x48` | idem | PNGs avulsos de apoio |

Os três primeiros seguem as convenções de arquivo do App Router: o Next gera as
tags `<link>` sozinho. O manifest é gerado por `src/app/manifest.ts`. Os ícones
**não** são declarados `maskable`: o balão chega perto da borda e a máscara
circular do Android cortaria a ponta da cauda.

`theme_color` e `background_color` do manifest, e o `themeColor` do
`layout.tsx`, são todos `#071011` — o mesmo fundo do ícone.
