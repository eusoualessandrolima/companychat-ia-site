# Calculadora de Impacto — engenharia reversa da referência (ChatGuru)

Investigado em 11/08/2026 via Chrome DevTools + análise do bundle de produção.
Fonte: `https://calculadora-impacto.chatguru.com.br/`

---

## 1. Stack da referência

| Item | Valor |
|---|---|
| Build | React + Vite, bundle único (`/assets/index-*.js`, 921 KB) |
| Plataforma | base44 (no-code/low-code), servido em domínio próprio |
| CSS | Tailwind + variáveis HSL em `:root` |
| Animação | framer-motion (transição horizontal entre passos) |
| Gráficos | Recharts (BarChart + LineChart) |
| UI primitives | Radix (Dialog) |
| Formulário | HubSpot Forms embed (`js.hsforms.net`, portal 45843703) |
| Tracking | GTM, GA4 (x3), Meta Pixel, Bing UET, Google Ads, HubSpot |

Nosso projeto já cobre tudo exceto Recharts (não instalado).

---

## 2. Design system extraído

### Tokens de cor (valores reais do `:root`)

| Token | HSL | HEX |
|---|---|---|
| `--brand-green` | `152 100% 33%` | `#00a85a` |
| `--brand-orange` | `32 92% 55%` | `#f69323` |
| `--brand-mint` | `130 59% 92%` | `#dff7e3` |
| `--brand-cream` | `44 100% 91%` | `#ffeed1` |
| `--brand-bg` | `130 50% 97%` | `#f4fbf5` |
| `--brand-dark` | `0 0% 20%` | `#333333` |
| `--brand-muted` | `0 0% 40%` | `#666666` |
| `--brand-danger` | `0 64% 55%` | `#d64545` |
| `--foreground` | `160 39% 15%` | `#173b2b` |
| `--border` | `156 9% 89%` | `#e0e5e3` |
| `--radius` | `1rem` | — |

Cores exclusivas dos gráficos: `#254D3D` (modelo atual), `#D64545` (API pura), `#01C38D` (híbrida).

### Tipografia

Montserrat para tudo (heading, body, display). Pesos pesados: `font-extrabold` (800) e `font-black` (900) em títulos, números e botões. Corpo em 400.

### Padrões visuais

- Raio grande: cards `rounded-[26px]` / `rounded-[22px]` / `rounded-[20px]`, botões `rounded-full`.
- Hero em bloco `bg-brand-mint` com blob circular verde no canto superior direito.
- Card do wizard: header sólido `bg-brand-green` + barra de progresso `bg-brand-orange` sobre trilho `bg-brand-green/15`, transição `duration-500 ease-out`.
- Grid do wizard: `lg:grid-cols-[1.6fr_1fr]` — formulário à esquerda, painel "Informação" (`bg-brand-bg`) à direita.
- Seleção de opção: `border-2` + `bg-brand-mint` quando ativa; `hover:border-brand-green/50` quando inativa.
- CTA principal: pílula laranja com `animate-ping` atrás (halo pulsante).
- Sombras nomeadas: `shadow-card`, `shadow-green-glow`.

---

## 3. Fluxo — wizard de 6 passos

**Passo 0 (comum):** escolha do modo — `active` (campanha ativa) ou `receptive` (atendimento receptivo). Define qual conjunto de perguntas segue.

### Modo "Campanha ativa" (5 perguntas)

| # | Chave | Pergunta | Tipo |
|---|---|---|---|
| 1 | `templateType` | Qual tipo de template você envia nas suas campanhas? | escolha: Marketing `0.35` / Utilidade `0.067` / Autenticação `0.067` |
| 2 | `contacts` | Para quantos contatos você costuma disparar campanhas? | número |
| 3 | `responseRate` | Qual a taxa de resposta dessas campanhas? | número (%) |
| 4 | `campaigns` | Quantas campanhas você envia por mês? | número |
| 5 | `msgs` | Quantas mensagens sua empresa envia por conversa? | número |

Constante fixa (não perguntada): `msgCost = 0.035` — preço por mensagem enviada no modelo futuro.

### Modo "Atendimento receptivo" (2 perguntas)

| # | Chave | Pergunta |
|---|---|---|
| 1 | `messagesPerAttendance` | Quantas mensagens você envia por atendimento? |
| 2 | `attendancesPerMonth` | Quantos atendimentos você recebe por mês? |

Constante fixa: `pricePerMessage = 0.035`.

### Validação

Campo numérico só é válido com `Number(v) > 0`. Botão "Continuar" fica `disabled` até validar; mensagem de erro: "Ops, esse campo é obrigatório." O último passo troca o rótulo para "Ver resultado".

### Defaults do "Restaurar exemplo"

Ativo: `contacts 10.000 · templateType 0,35 · responseRate 12 · campaigns 4 · msgs 8 · msgCost 0,035`
Receptivo: `messagesPerAttendance 8 · attendancesPerMonth 11.000 · pricePerMessage 0,035`

---

## 4. Fórmulas exatas

### Campanha ativa

```
templatesSent          = contacts × campaigns
conversations          = templatesSent × (responseRate / 100)
additionalApiMessages  = conversations × msgs
hybridRedirectMessages = conversations × 2

current = templatesSent × templateType
future  = current + additionalApiMessages × msgCost
hybrid  = current + hybridRedirectMessages × msgCost
```

### Atendimento receptivo

```
conversations = attendancesPerMonth
apiMessages   = conversations × messagesPerAttendance

current = 0
future  = apiMessages × pricePerMessage
hybrid  = 0
```

### Derivados do banner de urgência

```
economiaMensal = max(0, future - hybrid)
percentual     = future > 0 ? (economiaMensal / future) × 100 : 0
prejuizoAnual  = economiaMensal × 12
```

### Gráfico de evolução (linha)

25 pontos. Passo = `max(additionalApiMessages, 1) / 25`. Para cada ponto `m`:
`atual = templatesSent × templateType` (reta) · `futuro = atual + m × msgCost` · `hibrida` cresce só até o teto de roteamento.

### Conferência com valores reais capturados

Entrada: 10.000 contatos · Marketing · 12% · 4 campanhas/mês · 8 msgs/conversa.

| Saída | Valor da tela | Confere |
|---|---|---|
| Templates enviados | 40.000 | ✅ 10.000 × 4 |
| Conversas com resposta | 4.800 | ✅ 40.000 × 0,12 |
| Modelo atual | R$ 14.000,00 | ✅ 40.000 × 0,35 |
| Modelo futuro API pura | R$ 15.344,00 | ✅ 14.000 + 38.400 × 0,035 |
| Engine Híbrida | R$ 14.336,00 | ✅ 14.000 + 9.600 × 0,035 |
| Prejuízo anual | R$ 12.096,00 | ✅ (15.344 − 14.336) × 12 |
| Aumento | 6,6% | ✅ 1.008 / 15.344 |

**Defeito encontrado na referência:** o resumo exibe "Valor cobrado pela Meta (msg): R$ 0,04" e "38.400 × R$ 0,04", mas o cálculo usa `0,035`. Causa: o formatador de moeda arredonda para 2 casas. Quem conferir na mão vai achar erro (38.400 × 0,04 = R$ 1.536, não R$ 1.344). Na nossa versão: exibir `R$ 0,035` com 3 casas decimais.

---

## 5. Tela de resultado — blocos, em ordem

1. **Resumo das informações** — grid `grid-cols-2 sm:grid-cols-3` de mini-cards brancos sobre `bg-brand-bg/40`, um por variável de entrada e derivada.
2. **Cabeçalho** — "Comparativo dos 3 cenários" + frase de contexto por modo + botões `Editar respostas` e `Compartilhar resultado`.
3. **Três cards de cenário** (`md:grid-cols-3`):
   - *Modelo atual* — neutro, badge cinza "Base de comparação".
   - *Modelo futuro API pura* — `border-red-300 bg-red-50/40`, badge vermelho "⚠️ Risco de Orçamento", valor em `text-red-600`.
   - *Engine Híbrida* — `border-brand-green`, gradiente mint→branco, `shadow-green-glow`, badge verde "🏆 Escolha Inteligente".
   Cada card: badge, título, descrição curta, valor em `text-3xl font-extrabold`, meta-linha com o volume.
4. **Banner de urgência** — "🛑 Você está prestes a **perder até R$ X por ano!** Seu cenário com a API Pura vai inflar seus custos em **Y%** sem necessidade." + CTA laranja com halo pulsante.
5. **BarChart** — "Comparativo visual dos cenários", 3 barras, `radius [8,8,0,0]`, `maxBarSize 90`, eixo Y formatado `R$ Nk`, tooltip customizado.
6. **LineChart** — "Evolução do custo por mensagem enviada", 3 linhas (cinza/vermelho/verde), eixo X em mensagens acumuladas.
7. **Tabela comparativa** — 4 colunas: Cenário · O que entra no cálculo · Custo mensal estimado · Diferença vs. Engine Híbrida. Linha da API pura com fundo vermelho suave; linha da solução própria com fundo mint.
8. **Ações** — `Imprimir / Salvar PDF` (verde) e `Restaurar exemplo` (escuro), ambos `print:hidden`.

### Modal de captura de lead

Dialog Radix, `max-w-lg`, formulário HubSpot com 5 campos obrigatórios: nome completo · telefone WhatsApp (seletor de país, default +55) · e-mail profissional · segmento da empresa (select) · número de colaboradores (select). Rodapé com aviso de consentimento.

### Modal de compartilhamento

Link copiável + WhatsApp (`wa.me/?text=`) + LinkedIn (`sharing/share-offsite`) + Instagram (copia e abre o site).

---

## 6. O que replicar, o que mudar

### Replicar
- Wizard de 6 passos com painel lateral de ajuda contextual.
- Estrutura de 3 cenários com o do meio marcado como risco e o nosso como escolha.
- Banner de prejuízo anual com CTA pulsante.
- Bar + Line chart, tabela comparativa, imprimir/PDF, compartilhar.
- Densidade tipográfica (títulos 800/900) e raios grandes.

### Adaptar à nossa marca
- Verde: `#00a85a` deles → `#00ab7a` nosso (já é o `--color-primary`). Diferença mínima, o layout inteiro funciona.
- Fonte: Montserrat deles → Outfit + Bricolage (já configuradas no projeto).
- Laranja de CTA: adotar `--color-accent-amber` (`#f59e0b`) ou definir um laranja próprio.
- Substituir "Engine Híbrida ChatGuru" pelo nome do nosso produto equivalente — **decisão de negócio pendente**.

### Corrigir
- Exibir `R$ 0,035` com 3 casas em vez de arredondar para `R$ 0,04`.
- Deixar o preço por mensagem editável (hoje é constante escondida do usuário).
- Cenário receptivo com `current = 0` e `hybrid = 0` deixa dois dos três cards zerados e o gráfico de barras quase vazio — vale revisar essa modelagem.
- Formulário próprio em vez de HubSpot embed: já temos `/api/lead` validado ponta a ponta com integração ao CRM.

---

## 7. Integração com o nosso projeto

| Aspecto | Situação |
|---|---|
| Rota | criar (ex.: `src/app/calculadora/page.tsx`) |
| Componentes | novo diretório `src/components/calculadora/` |
| Captura de lead | reaproveitar `/api/lead` (já em produção, com UTM + origem) |
| Gráficos | instalar `recharts` **ou** desenhar em SVG puro para não adicionar dependência |
| Animação | `framer-motion` já instalado |
| Ícones | `lucide-react` já instalado |
| Tracking | reaproveitar `MetaPixel` já parametrizado por nicho |
| Deploy | Coolify — push na `main` não dispara build; exige Redeploy manual no painel |
