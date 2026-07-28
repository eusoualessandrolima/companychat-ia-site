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

### Página `/disparos` (`src/app/disparos/page.tsx`)

Página-irmã da `/api-oficial`, mesmo padrão visual (dark + aurora + tokens). Apresenta a ferramenta SaaS de disparo em massa via API Oficial. Reaproveita `ApiHeader`, `Footer` e `WhatsAppButton`. Componentes em `src/components/disparos/`:

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| DisparoHero | `DisparoHero.tsx` | Hero com mini-mock do painel (metrics + gráfico animado) |
| Fluxo | `Fluxo.tsx` | Stepper interativo de 4 passos (importar → campanha → disparar → acompanhar) |
| Recursos | `Recursos.tsx` | Grade de 8 recursos da ferramenta |
| Painel | `Painel.tsx` | Recriação nativa do dashboard real (Enviadas/Fila/Campanhas/Falhas + entrega/leitura + gráfico + resumo) |
| Ecossistema | `Ecossistema.tsx` | 3 pilares: Agente IA + CRM + Disparo em massa |
| DisparoFaq | `DisparoFaq.tsx` | FAQ específico de disparo em massa |
| DisparoCta | `DisparoCta.tsx` | CTA final (WhatsApp + cross-link para `/api-oficial`) |

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
- **Domínio real é `www.companychatia.com.br`** — `companychatia.com` (sem .br) NÃO resolve. Corrigidos `metadataBase`, sitemap e robots para o domínio certo (via `NEXT_PUBLIC_SITE_URL` com fallback correto). Vars `NEXT_PUBLIC_SITE_URL` e `NEXT_PUBLIC_WHATSAPP_NUMBER` cadastradas no Vercel (Production) via CLI; projeto Vercel chama-se `site`. Apex `companychatia.com.br` (sem www) também não responde — considerar redirect no painel
- **Auditoria de responsividade (Chrome DevTools, build de produção):** testadas as larguras 320/390/768/1024/1440 nas duas páginas, com detecção automática de overflow horizontal. Único bug real: glow decorativo de 700px em `Integracoes.tsx` vazava até 190px à direita em telas <700px (scroll horizontal no celular). Corrigido com `overflowX: "clip"` na section (vertical continua `visible`). Todas as larguras limpas após o fix; badges do Hero confirmadas visualmente sem invadir o texto em 1024px e presentes em 1440px

### 2026-07-21 — Página `/disparos` (ferramenta de disparo em massa)
- Criada a página `/disparos`: extensão-irmã da `/api-oficial` para apresentar o novo SaaS de disparo em massa via API Oficial (campanhas de marketing, templates aprovados, disparos ao vivo, relatórios, integração com CRM)
- **Padrão reaproveitado por completo:** mesmos tokens (dark-base/surface, accents, `text-gradient-primary`, `cta-glow-wrap`), aurora no hero, seções alternando dark/light, Framer Motion. Reusa `ApiHeader`, `Footer` e `WhatsAppButton` (sem duplicar header)
- **Dashboard recriado nativo** em React/Tailwind (não PNG) a partir do print real do painel "Dispara AI" — métricas, entrega/leitura, gráfico de 24h animado e resumo
- **Tese do ecossistema:** seção `Ecossistema.tsx` posiciona os 3 produtos como um só — Agente IA + CRM + Disparo em massa
- Registrada no `Footer` (coluna Recursos → "Disparo em massa") e no `sitemap.ts` (priority 0.8). CTA cruza link para `/api-oficial` e vice-versa possível no futuro
- **Verificação:** `npm run lint` ✓ · `npm run build` ✓ (rota `/disparos` prerenderizada estática)
- Nomes de brand mantidos genéricos ("Disparo em massa" / "Painel de Campanhas"); dados do painel são ilustrativos (12.480 enviadas etc.), não números reais de cliente

### 2026-07-21 — Botão "Fazer Login" + revisão ortográfica de /disparos
- Rodada a skill `text-quality` na página `/disparos`: ajustes de concordância ("prontas"), UX ("banimento") e remoção de travessão. Página 100% sem travessões
- Corrigidos os 2 últimos travessões longos em texto visível do site inteiro: `alt` da OG image e `aria-label` do Header
- Corrigida a responsividade dos CTAs do hero de `/disparos` (`whitespace-nowrap` + empilhar no lg, lado a lado no xl, full-width no mobile)
- **Novo:** botão "Fazer Login" (pill outline) adicionado ao `Header.tsx` e ao `ApiHeader.tsx` (logo em `/api-oficial` e `/disparos`), desktop e mobile. Aponta para `https://app.companychatia.com.br/app/login`
- **`loginLink`** centralizado em `WhatsAppButton.tsx` (mesmo padrão do `whatsappLink`), configurável via `NEXT_PUBLIC_LOGIN_URL` com fallback. Cadastrar essa var no Vercel se o domínio do app mudar

### 2026-07-21 — Seções CRM Kanban + Solução na home (ref. BotConversa)
- Inspiração: `botconversa.com.br` (analisado ao vivo). Adaptadas 2 seções à nossa marca (verde, nossos tokens), **não** copiado o azul deles
- **`CrmKanban.tsx`** (novo componente, seção dark): "Apresentando o CRM Kanban". Board mock com cards de lead (avatar com iniciais em gradiente, pill de estágio por cor, barra de progresso) + card "Novo card" com borda gradiente animada + 4 pilares + CTA. Layout masonry via `columns-1 sm:columns-2 lg:columns-3`
- **`Solucao.tsx`** (novo componente, seção light `bg-section`): "A solução que faz a diferença". Comparativo Sem/Com CompanyChat (X cinza vs check verde), card "Com" destacado com borda primary, glow e barra gradiente no topo
- **Ordem na home:** `Servicos` → `CrmKanban` (dark) → `Beneficios` (dark) → `Solucao` (light) → `Nichos`. Mantém o ritmo de blocos claro/escuro
- **Novo utilitário CSS `.glow-border`** em `globals.css`: borda gradiente animada nítida (técnica de mask + `::after` com blur) reaproveitando o keyframe `gradient-border`. Serve para qualquer card que precise do efeito de borda viva
- Avatares dos cards são iniciais em gradiente (sem assets de imagem). Dados dos leads são ilustrativos
- Efeitos do site deles ainda não trazidos (sugestão pendente): grid 3D em perspectiva no hero; ver "Próximos Passos"

### 2026-07-21 — Grid 3D no hero + remoção do card de números do Sobre
- **Hero:** grid plano substituído por **grid 3D em perspectiva** (chão recuando). Container com `[perspective:320px]` + filho `rotateX(74deg)`, `backgroundImage` de linhas verde/azul, `maskImage` pra fade no horizonte e keyframe `grid-flow` (linhas fluindo em direção ao usuário). Auroras mantidas
- Novo keyframe `grid-flow` em `globals.css`
- **Sobre:** removido o card de números animados ("500+ Empresas atendidas · 98% Taxa de satisfação · 7 dias Tempo médio de setup") a pedido do dono. Import `CountUp` e array `numeros` também removidos (ficaram sem uso). Os mesmos números seguem no Hero (stats)
- **Overflow de 14px no mobile:** investigado a fundo. Scan confiável (fora de `overflow-hidden`) = 0 culpados; sem `100vw`/`w-screen` no código. Conclusão: artefato de contabilização de scrollbar na emulação headless do chrome-devtools (`clientWidth` lê 485 em vez de 390). Sem corte visível. Não é bug real

### 2026-07-21 — Contato simplificado, Kanban redesenhado, hero enxuto
- **Contato (`Contato.tsx`):** removidos o formulário (Nome/E-mail/WhatsApp/Mensagem) e o card "Prefere pelo WhatsApp?". Agora é um CTA único e centralizado: título + subtítulo + linha "Fale diretamente com um especialista. Resposta rápida e sem compromisso." + botão "Chamar no WhatsApp" pulsando (`animate-breath-glow`). O form antigo só abria o WhatsApp (sem backend), nada de captura foi perdido
- **CrmKanban (`CrmKanban.tsx`) redesenhado** para espelhar o board real do produto: toolbar "Clientes & Oportunidades", colunas com cabeçalho colorido (Novo Lead cinza, Qualificando azul, Proposta Enviada roxo, Negociação âmbar), cards estilo "Conversa #NNN · Nome" com avatar/tempo/valor, colunas slim verticais "Oportunidade Ganha" (verde) e "Oportunidade Perdida" (vermelho), e ghost "+ Adicionar etapa" com `.glow-border`. Board rola horizontalmente (contido no painel). Substituiu o masonry anterior
- **Hero:** o grid 3D em perspectiva e o bloco de stats (500+/70%/98%/7 dias) foram removidos do hero (decisão do dono, hero mais enxuto). Keyframe `grid-flow` ficou sem uso no `globals.css` (inócuo; remover se quiser). `.glow-border` segue em uso no Kanban

### 2026-07-21 — Seção Integrações removida da home
- Removido `<Integracoes />` (diagrama orbital "Conecte com as principais plataformas") do `page.tsx` a pedido do dono (não encaixava no visual). Import também removido
- Arquivo `Integracoes.tsx` **preservado** (não deletado) para reativar fácil se quiser. Não está mais em uso na home
- Ordem atual da home: Hero → Problemas → ComoFunciona → Servicos → CrmKanban → Beneficios → Solucao → Nichos → Sobre → FAQ → Contato

### 2026-07-28 — Página `/assistente-ia` (o produto principal ganha página própria)
- **Contexto:** print da landing do `fazer.ai agents` trazido pelo dono como referência. Decisão: em vez de espalhar o conteúdo pela home, criar a página dedicada, já que o assistente de IA era o único dos produtos do ecossistema sem página própria (CRM tem âncora, API e Disparos têm página)
- **O que foi adaptado da referência:** a estrutura narrativa das "cenas" (mostrar o agente atendendo em situações reais) e o conjunto de capacidades. **O que foi descartado por não ser nosso modelo:** open source, licença Apache, instalação por linha de comando, self-hosted, GitHub, multi-tenant white-label. A CompanyChat vende serviço gerenciado, então a seção equivalente virou "Do zero ao assistente atendendo em 7 dias" (diagnóstico, treinamento, teste, ativação)
- **Componentes novos** em `src/components/assistente-ia/`:

| Componente | Descrição |
|------------|-----------|
| `ChatMock.tsx` | Janela de conversa reutilizável. Tipos de balão: `cliente`, `ia`, `audio` (com waveform e transcrição), `sistema` (evento) e `card` (agendamento/cobrança/resumo). Anima por `whileInView` |
| `AgenteHero.tsx` | Hero dark com aurora + conversa de agendamento (áudio transcrito → card de agendamento) |
| `Cenas.tsx` | Coração da página: 5 cenas alternando lado, cada uma com bullets + `ChatMock` próprio (ritmo de gente, resolve, base de conhecimento, transfere para humano, follow-up) |
| `Capacidades.tsx` | Grade de 8 capacidades (padrão visual de `disparos/Recursos.tsx`) |
| `Treinamento.tsx` | Timeline estática de 4 passos em card dark (diferente do stepper interativo de `/disparos` de propósito) |
| `AgenteFaq.tsx` | 7 perguntas focadas em objeção real ("vai parecer robô?", "pode inventar?", "meus dados?") |
| `AgenteCta.tsx` | CTA final (WhatsApp + cross-link `/api-oficial`) |

- **`NossasSolucoes.tsx` virou o ecossistema de 4 produtos:** novo card "Assistente de IA" (primeiro, cor primary), API Oficial migrou de primary para `accent-amber` para não repetir cor. `SolucaoGrid` ganhou prop `omit` (esconde o card da própria página) e grid responsivo `sm:2 / lg:3 ou 4` conforme a quantidade
- **Ligações:** `Header.tsx` (nav ganhou "Assistente IA"; "Contato" saiu da nav por ser redundante com o botão "Fale Conosco"), `Footer.tsx` (Recursos → "Assistente de IA"), `sitemap.ts` (priority 0.9, acima das outras internas), `Servicos.tsx` ("Três ferramentas" → "Quatro")
- **Reuso:** a página usa `ApiHeader`, `NossasSolucoes variant="dark" omit="/assistente-ia"`, `Footer` e `WhatsAppButton`, sem duplicar nada
- **Verificação:** `tsc --noEmit` ✓ · `npm run lint` ✓ · `npm run build` ✓ (rota `/assistente-ia` prerenderizada estática) · inspeção visual em 1440px e 390px sem overflow horizontal · zero travessões longos
- Nomes, valores e conversas das cenas são ilustrativos

---

## Aprendizados e Padrões

- Tailwind v4 não usa `tailwind.config.js` — toda configuração fica em `globals.css`
- Ícones via Lucide React exclusivamente (não misturar com outras bibliotecas)
- Estrutura de componentes: um arquivo `.tsx` por seção da landing page
- Animações via Framer Motion — não usar CSS puro para animações complexas
- CSS variables para tokens de cor e tipografia — centralizar em `globals.css`

---

## Próximos Passos

- [ ] Commit + push da página `/assistente-ia` (via @devops) → deploy automático no Vercel
- [ ] Avaliar se as cenas de `/assistente-ia` merecem animação de digitação ao vivo (hoje entram por `whileInView`, sem simulação de tempo real)
- [ ] Commit + push das correções da auditoria de 2026-07-14 (via @devops) → deploy automático no Vercel
- [ ] Verificar visualmente a home, a `/api-oficial` e a nova `/disparos` no navegador após o deploy (hero em ~1024px, mock do painel, responsividade do dashboard recriado)
- [ ] Trocar os números ilustrativos do painel em `/disparos` por prints/dados reais se quiser (hoje são exemplos)
- [ ] Avaliar link mais visível para `/disparos` e `/api-oficial` na home (hoje só no Footer)
- [ ] (Efeitos BotConversa) Avaliar um hero com grid 3D em perspectiva / partículas; efeito de tilt nos cards; contadores animados adicionais
- [ ] Investigar overflow horizontal de ~14px na seção `Sobre` em mobile estreito (medição via chrome-devtools pode ser artefato de emulação; confirmar em device real)
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
