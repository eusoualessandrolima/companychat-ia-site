# MEMORY.md — Memória Persistente do Projeto

> Registro de contexto, decisões, histórico e próximos passos. Atualizar sempre que houver decisão relevante ou ao encerrar uma sessão.

---

## Contexto do Projeto

**Projeto:** Site institucional / landing page da CompanyChat IA
**Propósito:** Apresentar a plataforma de atendimento automatizado via WhatsApp com IA para empresas brasileiras
**Audiência-alvo:** Donos de pequenas e médias empresas (clínicas, academias, imobiliárias, advocacia, e-commerce etc.)
**Status atual:** Em desenvolvimento ativo

---

## Stack Técnica

| Tecnologia | Versão | Papel |
|------------|--------|-------|
| Next.js | 16.2.10 | Framework principal |
| React | 19.2.3 | UI library |
| TypeScript | ^5 | Tipagem |
| Tailwind CSS | ^4 | Estilização (sem config file — via CSS) |
| Framer Motion | ^12.34.3 | Animações |
| Lucide React | ^0.575.0 | Ícones |

---

## Componentes Existentes

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| Header | `Header.tsx` | Navegação principal |
| Hero | `Hero.tsx` | Seção inicial/destaque com chat mockup |
| Integracoes | `Integracoes.tsx` | Diagrama orbital de integrações (WhatsApp, GPT, CRMs etc.) |
| Problemas | `Problemas.tsx` | Problemas que a plataforma resolve |
| ComoFunciona | `ComoFunciona.tsx` | Passo a passo de como a plataforma funciona |
| Servicos | `Servicos.tsx` | Serviços oferecidos |
| Beneficios | `Beneficios.tsx` | Benefícios da plataforma |
| Nichos | `Nichos.tsx` | Segmentos de mercado atendidos |
| Sobre | `Sobre.tsx` | Sobre a empresa |
| FAQ | `FAQ.tsx` | Perguntas frequentes |
| Contato | `Contato.tsx` | Formulário/CTA de contato |
| Footer | `Footer.tsx` | Rodapé |
| Logo | `Logo.tsx` | Componente de logo |
| WhatsAppButton | `WhatsAppButton.tsx` | Botão flutuante do WhatsApp (exporta `WHATSAPP_NUMBER` e `whatsappLink` — fonte única) |
| CountUp | `CountUp.tsx` | Contador animado compartilhado (usado em Hero e Sobre) |

> `Depoimentos.tsx` foi removido em 2026-07-14 (código morto desde a remoção da seção da home; recuperável via git se necessário).

### Página `/api-oficial` (`src/app/api-oficial/page.tsx`)

Seção dedicada explicando a API Oficial do WhatsApp + calculadora de custo. Componentes em `src/components/api-oficial/`:

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| ApiHeader | `ApiHeader.tsx` | Header slim da página (voltar ao site + logo + CTA) |
| ApiHero | `ApiHero.tsx` | Hero de abertura do guia |
| Janela24h | `Janela24h.tsx` | Timeline interativa da janela de 24h (recriação nativa da imagem) |
| Categorias | `Categorias.tsx` | Tabela nativa das 4 categorias de mensagem e custos |
| Calculadora | `Calculadora.tsx` | Calculadora de custo mensal/anual (presets, sliders, breakdown, ajuste de preço) |
| ApiFaq | `ApiFaq.tsx` | FAQ específico da API Oficial |
| ApiCta | `ApiCta.tsx` | CTA final para WhatsApp |
| pricing.ts | `pricing.ts` | Fonte única de dados: categorias + preços padrão (aproximados Meta BR) + formatador BRL |

---

## Skills Ativas

| Nome | Pasta | Descrição |
|------|-------|-----------|
| `frontend-design` | `.agents/skills/frontend-design/` | Criação de interfaces de alta qualidade, evitando estética genérica de IA |

---

## Decisões Tomadas

### 2026-03-20
- Criação da estrutura de gestão (CLAUDE.md, MEMORY.md, SKILLS.md)
- Padrão de skills confirmado: `.agents/skills/{nome}/SKILL.md` com frontmatter padronizado
- Skill `frontend-design` cadastrada como base estética do projeto

### 2026-06-18
- Reestruturação dos arquivos de gestão: CLAUDE.md expandido com regras explícitas de nomenclatura, frontmatter e processo de criação de skills
- Criado `Agentes.md` para documentar agentes disponíveis no projeto
- Obrigação de leitura no início de cada sessão ampliada para incluir `Agentes.md`

### 2026-07-02
- Criada a página `/api-oficial`: guia sobre a API Oficial do WhatsApp + calculadora de custo (rota nova dentro do próprio site; futuro subdomínio `api.companychatia.com` pode apontar pra ela via DNS/rewrite sem mexer no código)
- **Preços padrão (aproximados Meta BR, editáveis na UI):** Utilidade R$ 0,05 · Autenticação R$ 0,17 · Marketing R$ 0,45 · Serviço grátis. Fonte única em `pricing.ts` — atualizar lá quando a Meta mudar a tabela
- Imagens didáticas (janela 24h e tabela de custos) foram **recriadas nativas** em React/Tailwind (não PNG), responsivas
- Moeda: apenas R$ (BRL)
- Colisão de nome no macOS (case-insensitive): arquivo de dados renomeado de `categorias.ts` → `pricing.ts` para não conflitar com `Categorias.tsx`
- Link discreto adicionado no Footer principal (coluna "Recursos" → "API Oficial")
- **QA Gate (@qa Quinn):** CONCERNS → liberado. Matemática da calculadora sem bugs; português impecável; zero travessões. Aplicados os ajustes MÉDIOS: token `accent-amber` na timeline, contraste dos sub-rótulos, `aria-pressed`/`aria-live` na timeline, foco visível + `aria-expanded` no acordeão de preços da calculadora
- Adicionado `metadataBase: new URL("https://companychatia.com")` no `layout.tsx` (corrige canonical/OG e remove warning de build)
- Criado `.env.local` (config pública documentada; ignorado pelo git via `.env*`). Vars de produção devem ser cadastradas no painel do Vercel
- ~~Pendente: `git add`/`commit`/`push` para `main`~~ → resolvido (commits na main sincronizados com origin)

### 2026-07-14 — Auditoria completa + correções
- **Segurança:** Next.js atualizado 16.1.6 → 16.2.10 (corrigia ~19 advisories, incluindo request smuggling e cache poisoning). `npm audit fix` aplicado nas dev deps. Residual aceito: postcss interno do Next (moderate, sem fix não-destrutivo, sem impacto em site estático)
- **Bug:** links do Footer trocados de `#ancora` para `/#ancora` — na página `/api-oficial` os links não funcionavam
- **Conteúdo:** "agenda" → "agendo" no chat do Hero; removido preço "R$347/mês" da meta description (site não exibe preços); removido seletor de idiomas fake (🇺🇸 English) do Footer
- **SEO:** criados `src/app/sitemap.ts`, `src/app/robots.ts` e `src/app/opengraph-image.tsx` (OG 1200×630 nativa via next/og); canonical `/` na home
- **Refactor:** `CountUp` extraído para componente compartilhado (`CountUp.tsx`, usado em Hero e Sobre); `WHATSAPP_NUMBER` centralizado em `WhatsAppButton.tsx` (lê `NEXT_PUBLIC_WHATSAPP_NUMBER` com fallback); removidos `Depoimentos.tsx` (morto) e SVGs padrão do create-next-app em `public/`
- **A11y:** menu mobile com `aria-expanded`/`aria-controls` e label dinâmico; logo do Header agora `<Link href="/">`; nós do diagrama de integrações focáveis por teclado (`tabIndex`, `aria-label`, tooltip em foco); `autocomplete` nos inputs do formulário de contato
- **UI:** tooltip do diagrama de integrações centralizado (fix `x: "-50%"` no Framer Motion); badges flutuantes do Hero com offset grande só aparecem em `xl:` (evita invadir o texto em ~1024px); onda de `Problemas.tsx` usa `var(--color-background)` em vez de hex fixo
- **Verificação:** `tsc --noEmit` ✓ · `npm run lint` ✓ · `npm run build` ✓ (rotas novas: `/robots.txt`, `/sitemap.xml`, `/opengraph-image`)

---

## Aprendizados e Padrões

- Tailwind v4 não usa `tailwind.config.js` — toda configuração fica em `globals.css`
- Ícones via Lucide React exclusivamente (não misturar com outras bibliotecas)
- Estrutura de componentes: um arquivo `.tsx` por seção da landing page
- Animações via Framer Motion — não usar CSS puro para animações complexas
- CSS variables para tokens de cor e tipografia — centralizar em `globals.css`

---

## Próximos Passos

- [ ] Commit + push das correções da auditoria de 2026-07-14 (via @devops) → deploy automático no Vercel
- [ ] Verificar visualmente a home e a `/api-oficial` no navegador após o deploy (hero em ~1024px, tooltip do diagrama, OG image ao compartilhar link)
- [ ] Cadastrar `NEXT_PUBLIC_SITE_URL` e `NEXT_PUBLIC_WHATSAPP_NUMBER` no painel do Vercel (o código agora lê essas vars com fallback)
- [ ] Decidir se cria seção de planos/preços (a meta description antiga citava R$347/mês; foi removido por não existir no site)
- [ ] Avaliar analytics (GA/Umami) e skills de copy/SEO
- [ ] Considerar refatorar `Integracoes.tsx` para classes Tailwind (hoje usa muito style inline; funcional, baixa prioridade)

---

## Histórico de Sessões

### Sessão 2026-03-20
- Criação da estrutura de gestão (CLAUDE.md, MEMORY.md, SKILLS.md)
- Mapeamento dos componentes existentes
- Identificação da stack técnica completa

### Sessão 2026-06-18
- Reestruturação e expansão de CLAUDE.md com regras detalhadas
- Atualização de MEMORY.md com histórico e data correta
- Criação de Agentes.md — novo arquivo de gestão
- SKILLS.md revisado e mantido
