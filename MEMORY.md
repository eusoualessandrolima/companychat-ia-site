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
| Nichos | `Nichos.tsx` | Carrossel de 16 segmentos, gira sozinho; cada card abre o WhatsApp com a mensagem do segmento |
| PorteEmpresa | `PorteEmpresa.tsx` | "A solução certa para qualquer tamanho de empresa" — pequenas, médias e grandes em zigue-zague, fundo escuro |
| Garantias | `Garantias.tsx` | "O que você pode esperar da CompanyChat IA" — 6 compromissos, grid 3×2, antes dos planos |
| CompanyAi | `CompanyAi.tsx` | Resumo da Company AI na home (projetos sob medida); detalhe em `/company-ai` |
| Sobre | `Sobre.tsx` | Sobre a empresa |
| FAQ | `FAQ.tsx` | Perguntas frequentes |
| Contato | `Contato.tsx` | Formulário/CTA de contato |
| Footer | `Footer.tsx` | Rodapé |
| Logo | `Logo.tsx` | Componente de logo |
| WhatsAppButton | `WhatsAppButton.tsx` | Botão flutuante do WhatsApp (exporta `WHATSAPP_NUMBER` e `whatsappLink` — fonte única) |
| CountUp | `CountUp.tsx` | Contador animado compartilhado (usado em Hero e Sobre) |

> `Depoimentos.tsx` foi removido em 2026-07-14 (código morto desde a remoção da seção da home; recuperável via git se necessário).

### Página `/comecar` (`src/app/comecar/page.tsx`)

Quiz de captação para anúncio do Meta. Fora do menu, fora do `sitemap.ts` e com
`robots: { index: false, follow: false }` — não existe link para ela em nenhum lugar do site.
Não tem seções: é uma tela por pergunta, sem rolagem. Componentes em `src/components/comecar/`:

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| Quiz | `Quiz.tsx` | Capa + 4 etapas: os três dados de contato numa tela só (nome, empresa, WhatsApp) e depois três perguntas de escolha (quem atende, volume, dor), que avançam sozinhas em 220 ms. Grava no banco a cada etapa. Tela final "Dados enviados com sucesso" com botão "Falar com um especialista" |
| MetaPixel | `MetaPixel.tsx` | Pixel do Meta; não injeta nada sem `NEXT_PUBLIC_META_PIXEL_ID` |

### Página `/leads` (`src/app/leads/page.tsx`)

Painel dos leads do quiz, protegido por senha única. `noindex` e bloqueado no `robots.ts`.

| Arquivo | Descrição |
|---------|-----------|
| `src/lib/leads.ts` | Grava e lê no Postgres próprio (Coolify) com o driver `pg`. Pool guardada no `globalThis` para o hot reload não estourar conexões |
| `src/lib/painel.ts` | Senha única em `PAINEL_LEADS_SENHA`. O cookie guarda um HMAC da senha, não a senha; comparação com `timingSafeEqual` |
| `src/components/leads/FormSenha.tsx` | Tela de senha |
| `src/components/leads/ListaLeads.tsx` | Resumo (total, concluíram, hoje), busca, filtro, cartão por lead com botão de WhatsApp e exportação CSV |
| `src/app/api/leads/entrar/route.ts` | POST valida a senha e grava o cookie; DELETE encerra a sessão |
| `src/app/api/leads/csv/route.ts` | Exportação CSV, protegida pelo mesmo cookie. Escapa fórmulas (`=`, `+`, `-`, `@`) para o arquivo não virar execução no Excel |
| `db/leads_site.sql` | DDL da tabela `leads_site` |
| `db/README.md` | Como criar o banco no Coolify, a variável `DATABASE_URL` e os cuidados de segurança |

Rota de apoio: `src/app/api/lead/route.ts` — valida o lead, normaliza o telefone para E.164 e
entrega em `LEAD_WEBHOOK_URL` (com `LEAD_WEBHOOK_TOKEN` opcional como Bearer).

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

### Página `/company-ai` (`src/app/company-ai/page.tsx`)

Frente de projetos sob medida (desenvolvimento personalizado), separada dos produtos prontos.
Mesmo padrão visual das outras páginas internas e reaproveita `ApiHeader`, `NossasSolucoes`,
`Footer` e `WhatsAppButton`. Componentes em `src/components/company-ai/`:

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| CompanyAiHero | `CompanyAiHero.tsx` | Hero com três cartões de "antes e depois" ilustrativos |
| Origem | `Origem.tsx` | Por que a Company AI existe: narrativa do YouTube + citação do fundador |
| OqueConstruimos | `OqueConstruimos.tsx` | Quatro frentes de construção, alimentado por `company-ai-data.ts` |
| ComoTrabalhamos | `ComoTrabalhamos.tsx` | Conversa, desenho, construção, entrega e ajuste |
| CompanyAiCta | `CompanyAiCta.tsx` | CTA final (WhatsApp + cross-link para `/planos`) |
| company-ai-data | `company-ai-data.ts` | Fonte única das quatro frentes (home e página) |

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

### 2026-07-28 — Página `/planos` (primeira vez que o site exibe preço)
- **Contexto:** referência do BotConversa (cards com toggle anual, grupos de features, badge "Recomendado") + documento comercial do dono com o plano **CompanyChat IA Pro, R$ 497/mês**. Fecha o item antigo de "Próximos Passos" sobre criar seção de planos
- **Decisões comerciais confirmadas com o dono antes de construir:** 2 planos (Pro + Sob medida), **só mensal** (sem toggle anual, o desconto do exemplo não existe aqui), **sem taxa de setup** e **custo das mensagens da Meta explicitamente à parte**, com link para a calculadora de `/api-oficial`
- **Fonte única dos planos:** `src/components/planos/planos-data.ts`. Atualizar preço ou escopo **só ali**, nunca no JSX
- **Componentes novos** em `src/components/planos/`:

| Componente | Descrição |
|------------|-----------|
| `planos-data.ts` | Dados dos 2 planos: grupos de itens, nota opcional, rodapé e CTA |
| `TabelaPlanos.tsx` | Hero + os 2 cards. O Pro usa `.glow-border` e `h-full`; o "Sob medida" tem altura natural (evita o vazio de 250px que aparecia quando ambos esticavam) |
| `Incluso.tsx` | 4 pilares do que vem na mensalidade, com link para `/assistente-ia` e `/#crm-kanban` |
| `CustoMeta.tsx` | Bloco de transparência (mensalidade nossa vs mensagem da Meta) com CTA para `/api-oficial#calculadora` |
| `PlanosFaq.tsx` | 8 perguntas de objeção comercial (setup, custo Meta, fidelidade, número próprio) |
| `PlanosCta.tsx` | CTA final (WhatsApp + `/assistente-ia`) |

- **Nada de preço inventado:** o plano sob medida é "sob consulta" com escopo definido no diagnóstico. "Sem contrato de fidelidade" foi afirmado porque o FAQ da home **já dizia isso** desde antes, não é invenção nova
- **Header ajustado:** nav ganhou "Planos"; "Serviços", "Benefícios" e "Sobre" agora só aparecem a partir de `lg` (em 768px o header quebrava em duas linhas com 5 itens). `whitespace-nowrap` aplicado nos links e botões do `Header` e do `ApiHeader`
- **Pontes para a página:** `FAQ.tsx` da home ganhou a pergunta "Quanto custa?" com link (o item de FAQ agora aceita `href`/`linkLabel` opcionais), `Contato.tsx` ganhou "Prefere ver os valores antes?", além de `Footer` (Produto → "Planos e preços") e `sitemap.ts` (priority 0.9)
- **Verificação:** `tsc --noEmit` ✓ · `npm run lint` ✓ · `npm run build` ✓ (rota `/planos` estática) · visual em 1440px, 768px e 390px sem overflow · zero travessões longos

### 2026-07-28 — Seção de planos na home (`PlanosHome.tsx`)
- A subpágina sozinha não bastava: o dono queria o preço visível na home também. Criado `src/components/PlanosHome.tsx`, versão resumida dos 2 cards
- **Sem duplicar conteúdo:** o componente lê o mesmo `planos/planos-data.ts`, usando o novo campo `resumo` (5 itens no Pro, 4 no Sob medida). Preço muda em um lugar só e reflete na home e na página
- **Posição na home:** entre `Sobre` (claro) e `FAQ` (claro), com fundo `bg-dark-base` para quebrar o ritmo e destacar o preço. Ordem final: Hero → Problemas → ComoFunciona → Servicos → CrmKanban → Beneficios → Solucao → Nichos → Sobre → **PlanosHome** → FAQ → Contato
- Cada card tem 2 ações: CTA de WhatsApp e "Ver tudo" levando para `/planos`. Rodapé da seção repete o aviso do custo da Meta com link para a calculadora
- `whitespace-nowrap` nos botões (sem ele, "Ver tudo" quebrava em duas linhas no desktop)

### 2026-07-28 — Incidente: Vercel Security Checkpoint no host `www`
- Depois do deploy, o host `www.companychatia.com.br` passou a responder **403 "Vercel Security Checkpoint"** em todas as rotas, enquanto o apex `companychatia.com.br` continuava servindo 200 normalmente
- **Causa:** verificação de deploy feita com polling de `curl` a cada 10s (cerca de 80 requisições seguidas no mesmo host). A mitigação automática de borda da Vercel interpretou como tráfego suspeito. Confirmado que não havia Attack Challenge Mode ligado nem regra de firewall no projeto (API `/v1/security/firewall/config/active` retorna `Config not found`)
- **Resolução:** o bloqueio se dissipou sozinho. Medido: 403 aos 5 minutos, **200 aos 12 minutos** após parar as requisições
- **Regra para as próximas vezes:** confirmar deploy com `vercel ls` (mostra status `Ready` e duração) ou com no máximo 2 requisições espaçadas em minutos. Nunca fazer polling curto contra o domínio de produção

### 2026-07-28 — Redirect do apex para o www (SEO)
- **Problema:** `companychatia.com.br` e `www.companychatia.com.br` serviam o mesmo conteúdo com 200 nos dois, dividindo a autoridade de SEO entre dois endereços
- **Solução no código, não no painel:** regra `redirects()` em `next.config.ts` com `has: [{ type: "host", value: "companychatia.com.br" }]` → `https://www.companychatia.com.br/:path*`, `permanent: true` (308). Fica versionada e revisável, ao contrário de configuração feita no painel
- **Direção escolhida:** apex → www, porque o www já era o canônico em `metadataBase`, `sitemap.ts` e `robots.ts`
- Sem risco de loop: a regra só dispara quando o host é o apex. Testado antes do deploy com `curl -H "Host: ..."`: apex devolve 308 preservando o path, www e localhost seguem 200
- A API de domínios da Vercel foi tentada primeiro, mas o token local da CLI retorna `forbidden/invalidToken` para `/v9/projects/{id}/domains`

---

### 2026-07-30 — Company AI: seção na home + página `/company-ai`

Referência trazida pelo usuário: o site da fazer.ai (print dos sitelinks no Google + estrutura da
home). Adaptado, não copiado. O que veio de lá: a lógica de páginas internas com título e descrição
próprios (que é o que alimenta sitelinks) e o enquadramento da seção "Educação" ("Não precisa nos
contratar para aprender"), que casou com a narrativa de YouTube do fundador.

- Nome "Company AI" mantido a pedido do usuário, apesar da proximidade com "CompanyChat IA". O risco
  de confusão de marca foi levantado e a decisão foi dele.
- Posição na home: entre `Nichos` e `Sobre`, em `bg-dark-base`, para alternar com as seções claras
  vizinhas e emendar a narrativa "produtos prontos → e o que não cabe no pronto".
- Sitelinks do Google não são configuráveis. O que foi feito é o que dá para fazer: rota indexável
  com metadata própria, entrada no sitemap, link no header (desktop) e no footer.
- `Serviços` no header passou de `lg` para `xl` para abrir espaço ao novo link sem lotar a barra em
  1024px (verificado: 5 links + 2 botões em 1024, sem overflow horizontal).
- Textos ilustrativos, sem número inventado: o "antes e depois" do hero e os exemplos dos cartões são
  cenários genéricos, não casos de cliente.
- Link do YouTube em `Origem.tsx` sai de `NEXT_PUBLIC_YOUTUBE_URL`, com fallback para
  `@eusoualessandrolima1`. **Confirmar o canal antes de publicar.**

### 2026-07-30 — Padrão visual "silêncio caro" em `/company-ai` (ref. fazer.ai)

Inspeção do CSS ao vivo da fazer.ai revelou que o efeito "chique" não vem de biblioteca nenhuma.
São quatro decisões, todas adotadas em `/company-ai` e na seção da home:

1. **Palco de scroll.** Trilho de 140vh com filho `sticky top-0 h-screen`. O conteúdo fica preso e
   sai por opacidade e escala dirigidas pelo scroll. Só em `lg+` e desligado com
   `prefers-reduced-motion`; no mobile a dobra não cabe presa na tela.
2. **Nenhuma animação em loop.** A fazer.ai tem exatamente um `@keyframes` no site inteiro (`spin`).
   Todo o resto é scroll ou hover, com `cubic-bezier(0.4,0,0.2,1)` em 0,2s / 0,3s / 0,5s. Os blobs
   flutuantes saíram de `/company-ai`, substituídos por um brilho estático `blur(150px)` a 0,10.
3. **Título em duas tonalidades.** Duas linhas do mesmo tamanho, a primeira em `dark-text` e a
   segunda em `dark-muted`. Peso 600 (nunca `font-bold`), entrelinha 1,06, tracking -0.025em.
   Na home a seção manteve `text-gradient-primary` para não destoar das seções vizinhas.
4. **Página inteira no escuro.** `/company-ai` não alterna claro e escuro: separa as seções com um
   fio `bg-gradient-to-r from-transparent via-white/12 to-transparent`.

Não copiado: SF Pro Display (fonte de sistema, proibida pelo CLAUDE.md) e a paleta azul da Apple.
A Bricolage Grotesque sustenta a mesma escala; o verde da marca segue como único acento.

**Duas armadilhas que custaram tempo, registradas para não repetir:**

- `useScroll({ target: ref })` do Framer Motion não atualizou o progresso nesta página. A solução
  foi usar `useScroll()` sem alvo e derivar o curso de `window.innerHeight`, o que funciona porque
  o hero é sempre o primeiro elemento da página.
- Um brilho `absolute` largo estourou 305px de rolagem horizontal no mobile porque o ancestral com
  `overflow-hidden` não era posicionado. O elemento posicionado precisa ser o mesmo que recorta.
  `getBoundingClientRect` não detecta isso (ignora recorte de ancestral); use
  `documentElement.scrollWidth - clientWidth`.

Consultoria em IA entrou como frente em destaque (cartão grande antes das outras quatro).

### 2026-08-03 — Novo posicionamento do hero da home (ref. Datacrazy)

O usuário achou "Seu assistente IA vende enquanto você dorme" pequeno demais para o que a
plataforma entrega (integrações, BI, automações). Trocado por posicionamento de categoria, com o
texto que ele mesmo escreveu:

- **H1:** "Não somos apenas um CRM." (sem o "Somos X" da referência — decisão dele)
- **Sub:** "Quem usa CompanyChat não acompanha o mercado." em texto secundário (20px), com
  **"Inova ele."** em linha própria de 40px, negrito e gradiente — a promessa pesa mais que a
  constatação. Na primeira versão as duas frases tinham o mesmo corpo e o "Inova ele." sumia
- **Descrição:** IA, automações com regras de negócio, BI interno, mensageria e decisões em tempo real
- **Badge:** "IA que trabalha por você" → "Plataforma com IA integrada"
- `opengraph-image.tsx` alinhado ao mesmo texto

O H1 caiu de `clamp(48px,6vw,88px)` para `clamp(44px,4.8vw,60px)`: em coluna de 50% da largura, o
texto curto em 88px empurrava tudo para baixo.

Esta copy **sobreviveu** à reformulação estrutural descrita abaixo — só a coluna direita mudou.

### 2026-08-03 — Hero reformulado: explicar o porquê em 3 segundos

O usuário avaliou que o hero anterior ainda tinha a estrutura de qualquer landing de CRM: bonito,
mas o visitante não entendia **por que** a CompanyChat é diferente. Referências pedidas: Linear,
Stripe, Vercel, Arc, Raycast. Reescrita completa de `Hero.tsx`.

**Copy da coluna esquerda:** mantida a da seção anterior (H1 + "Quem usa CompanyChat… / Inova
ele." + descrição). Uma variante intermediária trocou isso por "Somos a central operacional da sua
empresa" e sete chips de benefício; foi descartada — a dupla "não acompanha / inova" carrega o
contraste sem precisar listar features na dobra.

**Coluna direita: o produto funcionando.** Uma única linha do tempo (`CENA`) comanda o chat e a
trilha de fluxo, para os dois contarem a mesma história:

- Roteiro de ~15s: pergunta de preço → qualificação ("quantas pessoas atendem hoje?") →
  agendamento → dois eventos de automação ("Lead criado no CRM Kanban", "Vendedor notificado no
  WhatsApp"), depois desvanece e reinicia
- Conversa com altura fixa e `mask-image` no topo: as mensagens antigas saem por cima
- `HISTORICO` com duas mensagens fixas evita o quadro vazio nos primeiros segundos
- Os cinco badges flutuantes viraram uma **trilha de quatro etapas** abaixo do chat (mensagem
  recebida → lead qualificado → reunião agendada → time notificado), que acende em sincronia. Isso
  também eliminou a colisão de badge com texto que exigia ajuste fino de tipografia

**Decisões técnicas:**

- `useSyncExternalStore` para ler `prefers-reduced-motion` (o lint proíbe `setState` síncrono
  dentro de `useEffect`; hooks personalizados precisam do prefixo `use`). Com movimento reduzido a
  cena entrega o estado final sem timers
- O relógio da cena vive em `PainelVivo`, não no `Hero`: só a coluna direita re-renderiza a cada
  passo. Medido: zero long tasks em 8s de animação, heap de 5MB
- O hero fecha em 834px, exatamente a altura da janela em 1440x900, com o CTA terminando em 750px
- Em 390x844 o hero mede 1300px, mas isso **não é regressão**: badge, H1, "Inova ele.", descrição e
  os dois CTAs terminam em 666px, dentro da dobra. O que estende a altura é o painel de chat
  empilhando abaixo, comportamento esperado quando a grade de duas colunas vira uma. Sem overflow
  horizontal
- `opengraph-image.tsx` alinhado à mesma copy do hero. A versão intermediária deixou o card social
  prometendo "central operacional" enquanto a página abria com "Inova ele." — quem compartilhava o
  link via uma promessa diferente da que a página entrega

### 2026-08-03 — Seção Company AI removida da home

A home já leva à Company AI pelo menu e pelo rodapé (rota `/company-ai`), então a seção no meio da
página era repetição. Removido `<CompanyAi />` de `src/app/page.tsx`; a página dedicada e os
componentes de `components/company-ai/` continuam intactos. `src/components/CompanyAi.tsx` ficou
sem uso — mantido no repositório caso o usuário queira a seção de volta.

Nenhum link apontava para a âncora `#company-ai` (verificado por busca), então a navegação não
quebrou. A home foi de 13 para 12 seções.

### 2026-08-04 — Nichos vira carrossel (ref. Digisac)

**Contexto:** o dono trouxe 15 prints do digisac.com.br, e o carrossel de segmentos deles apareceu
em 5 — foi o padrão que mais chamou atenção. Nosso `Nichos` era um grid 4×2 estático, sem link e
sem CTA: a seção mais fraca da home em conversão.

Reescrito `src/components/Nichos.tsx` como carrossel, adaptando o padrão deles à nossa paleta:

- Scroll horizontal nativo com `snap-x` — ganha swipe no mobile sem biblioteca. As setas fazem
  `scrollBy` de exatamente um card + gap, então o próximo sempre entra alinhado à esquerda
- O card seguinte fica **cortado na borda do container** (cards a 30% da largura no desktop). É o
  que sinaliza "arraste" sem precisar de instrução — copiado direto do comportamento deles
- CTA "Falar sobre {segmento}" só aparece no card sob o cursor (`md:group-hover`). No toque não
  existe hover, então abaixo de `md` fica sempre visível
- Ícone em quadrado com gradiente esmeralda (`from-primary to-#00d4a0`), no lugar do quadrado
  chapado antigo

**Decisão de conteúdo:** o Digisac linka cada segmento para uma landing própria. Não temos essas
páginas, e um CTA que não leva a lugar nenhum é pior que CTA nenhum. Em vez disso, cada card abre o
WhatsApp com a mensagem já preenchida ("Atuo no segmento de X…") — o lead chega qualificado e a
Jade pula a primeira pergunta. Páginas por segmento ficam para depois, se virarem prioridade de SEO.

Os dois botões que fecham a seção: "Não achei meu segmento" (WhatsApp) e "Ver planos" (`#planos`).

**Observação apurada nesta sessão:** seis das doze seções da home não têm nenhum CTA — `Problemas`,
`Servicos`, `Beneficios`, `Solucao`, `Nichos` (resolvido aqui) e `Sobre`. No Digisac, quase toda
seção fecha com botão. É a maior oportunidade de conversão pendente na home.

### 2026-08-04 — Botões flutuantes por canal + malha de pontos no hero (ref. Digisac)

**WhatsAppButton:** de um botão para dois, Comercial (verde `#25D366`, maior, com o glow que já
existia) e Suporte (azul `#0092ff`, menor). Empilhados à direita, com rótulo ao lado.

Não temos número de suporte separado, e um segundo botão para o mesmo destino seria enfeite. A
solução: `suporteLink` usa `NEXT_PUBLIC_WHATSAPP_SUPORTE` com fallback para o número comercial, e o
que muda hoje é a **mensagem** — "Já sou cliente e preciso de suporte" contra a mensagem comercial.
A Jade recebe o contexto e tria. Se um dia houver número dedicado, basta definir a variável.

Os rótulos são `hidden sm:inline-block`: no celular eles cobriam o mock de chat do hero — a mesma
poluição de lateral direita que descartamos do site do Digisac.

### 2026-08-04 — Nichos ampliados + duas seções novas (ref. Digisac)

**Nichos: de 8 para 16 segmentos.** Acrescentados Contabilidade, Provedores de Internet, Seguros &
Consórcios, Franquias, Turismo & Hotelaria, Logística & Transporte, Indústria & Distribuição e
Tecnologia & Software — os que o Digisac cobria e nós não.

Título trocado de "Nichos de Atuação" para **"Soluções para diferentes segmentos"**, com a frase de
apoio deles adaptada. Onde eles escrevem "centraliza canais" (multicanal), o nosso diz "organiza o
WhatsApp" — a estrutura da frase é boa, a promessa de multicanal não é nossa.

**`Garantias.tsx` (novo)** — "O que você pode esperar da CompanyChat IA", grid 3×2, ancorado logo
antes de `PlanosHome` para matar objeção junto do preço.

⚠️ **Três dos seis cards do Digisac foram descartados de propósito:** "Segurança de dados com
criptografia avançada", "Pagamento facilitado: boleto, cartão ou Pix" e "Conformidade LGPD". Nada
disso aparece em lugar nenhum do site (verificado por busca em `src/`), e a base da Jade não
sustentaria. Os seis que entraram saem todos de `planos-data.ts` ou do `FAQ.tsx`: implantação
inclusa, feito a quatro mãos, no ar em até 7 dias, sem fidelidade, suporte exclusivo, ajustes
contínuos. **Se um dia quisermos os cards de segurança/LGPD/pagamento, a informação precisa existir
antes** — e a base da Jade tem que ser atualizada junto.

**`PorteEmpresa.tsx` (novo)** — "A solução certa para qualquer tamanho de empresa", três blocos em
zigue-zague (pequenas, médias, grandes). Os itens de cada porte saem do Pro e do Sob medida em
`planos-data.ts`.

⚠️ **Sem fotos:** `public/` está vazio, e o layout do Digisac depende de foto de pessoa em metade do
card. No lugar entrou um painel com gradiente esmeralda e o ícone do porte. Funciona, mas foto real
de cliente seria melhor — trocar quando houver.

Seção em fundo escuro (`bg-dark-base` + malha de pontos) de propósito: quebra a sequência de seções
claras do miolo. É o "ritmo de faixas" do Digisac traduzido para a nossa paleta, sem virar azul.

Ordem da home agora: Hero → Problemas → ComoFunciona → Servicos → CrmKanban → Beneficios → Solucao →
**PorteEmpresa** → Nichos → Sobre → **Garantias** → PlanosHome → FAQ → Contato (14 seções).

### 2026-08-04 — Carrossel de nichos gira sozinho

O dono notou que o carrossel do Digisac avança sozinho, chega ao fim, rebobina e recomeça — e pediu
o mesmo. Implementado em `Nichos.tsx`: um card a cada 3,8s; ao atingir o fim, `scrollTo(0)` e o laço
recomeça. As setas continuam funcionando.

**Regras de pausa** (o giro só acontece quando todas passam):
- A seção está à vista — `IntersectionObserver` com threshold 0.25
- O sistema não pediu movimento reduzido — hook `useMovimentoReduzido`
- O cursor não está sobre a trilha
- Passaram-se 9s desde a última interação (seta, arrasto, foco por teclado)

**Duas armadilhas encontradas testando no navegador — não reintroduzir:**

1. **Hover em estado do React trava o carrossel.** A primeira versão usava
   `onMouseEnter`/`onMouseLeave` para ligar `sobCursor`. Quando o `mouseleave` não dispara (acontece
   ao rolar a página com o cursor parado sobre o elemento, entre outros casos), o giro parava para
   sempre. Trocado por `trilha.matches(":hover")` conferido **no instante do tique** — não tem como
   emperrar porque não guarda estado.

2. **Adiamento em `useState` se perde.** `setPausaTemporaria(true)` recriava o efeito e o
   temporizador, e o giro voltava em ~5s em vez de 9s. Trocado por `liberadoEmRef` com
   `performance.now()`, conferido no tique. Mesmo princípio do item anterior: estado que entra nas
   dependências do efeito não serve para controlar o próprio efeito.

Medido no Chrome: paradas em `0 → 360 → 720 → 1080 → 1440 → 1736 → 0`, intervalos de 3,2-3,9s, e
o giro só volta 10,7s depois de um clique na seta.

`useMovimentoReduzido` saiu de dentro do `Hero.tsx` para `src/hooks/useMovimentoReduzido.ts`, agora
compartilhado pelos dois componentes. É o primeiro arquivo em `src/hooks/`.

### 2026-08-04 — Título da Solução: testado e revertido

Tentativa de trocar o h2 "A solução que faz a diferença" por uma frase de três verbos com
palavras-chave em verde ("Atenda no WhatsApp, qualifique cada lead e venda todo dia com
inteligência artificial"), inspirada na estrutura do hero do Digisac.

**Revertido a pedido do dono** — o texto original ficou melhor. `Solucao.tsx` está como antes:
h2 "A solução que faz a diferença" + legenda "Qualifique seus leads, atenda e venda todos os dias
de forma inteligente e automática".

**Aprendizado:** o argumento de que "título genérico desperdiça a linha mais valiosa" não se
sustentou na prática aqui. O h2 curto funciona como respiro entre a faixa escura de `Beneficios` e
a comparação em duas colunas; a frase longa competia com o conteúdo das colunas logo abaixo. Não
repropor essa troca sem um motivo novo.

Registro do que não trazer do Digisac: "Centralize todos os seus canais" promete multicanal
(Instagram, Telegram, SMS, e-mail) — somos WhatsApp-first, a frase viraria promessa cobrada na
primeira reunião.

**Hero:** acrescentada malha de pontos ao fundo (`radial-gradient` 26px, branco a 10%, sobre a
aurora que já existia), com máscara elíptica que apaga nas bordas. É a textura do hero deles
traduzida para o dark. O layout dividido (texto + chat animado) foi **mantido de propósito** — o
deles é centralizado, mas trocar custaria o mock de chat, que é o ativo mais forte da nossa dobra.

### 2026-08-05 — `/comecar`: LP com seções foi descartada, virou quiz

Primeira página do site feita para tráfego pago, não para SEO. Fluxo: anúncio do Meta →
`/comecar` → 6 perguntas → tela final com "Testar agora no meu WhatsApp" → a Jade atende já
sabendo tudo o que a pessoa respondeu.

**Primeira versão (descartada no mesmo dia):** landing page longa no padrão da referência de
WhatsApp API, com hero dividido + formulário e cinco seções embaixo (dor, como funciona, o que
está incluso, FAQ, CTA final). O dono viu no navegador e reprovou: *"muita seção, muita coisa"*.
Arquivos preservados no scratchpad da sessão, fora do repositório.

**Versão atual — quiz de tela cheia.** Formato do projeto `--- Arquivados/quiz/company-quiz`,
que o dono já tinha feito e gostava. Diferenças em relação ao original: as perguntas de escolha
**avançam sozinhas** ao clicar (o original exigia clicar na opção e depois em "Continuar"), e o
fim **não redireciona sozinho** — mostra a tela "Pronto, {nome}" com o botão de teste, a pedido
do dono.

Perguntas, nesta ordem: quem atende hoje → volume diário → maior dor → nome → empresa →
WhatsApp. As três primeiras qualificam antes de pedir contato: quem desiste no meio ainda
deixou o perfil, e quem chega ao fim entregou os dados já convencido.

**Aprendizado:** o argumento de "a LP faz o trabalho de venda enquanto a pessoa decide" não
convenceu na prática. Para este produto e este dono, a página de anúncio é uma tarefa única,
sem nada em volta. Não repropor seções de conteúdo em `/comecar` sem um motivo novo.

**Descartado do concorrente Datacrazy:** o modal de duas opções ("Agendar demo" / "Call
express"). Para tráfego frio, obrigar o visitante a escolher antes de entregar o contato é
atrito puro, e a Jade já agenda dentro da conversa.

**Copy: "teste gratuitamente" foi recusado.** Não existe trial gratuito em `planos-data.ts` e a
Jade não sustentaria a promessa no WhatsApp. Trocado por "diagnóstico gratuito" e "demonstração
sem custo e sem compromisso", que já constam do plano Sob medida. Toda a página repete promessas
que já estão em `planos-data.ts`, `Garantias.tsx` e no FAQ — nenhuma oferta nova foi criada,
então a base de conhecimento da Jade não precisou ser atualizada.

**Decisões técnicas:**
- A rota `/api/lead` nunca segura o lead: se o webhook falhar ou não existir, ela responde
  `{ ok: true, entregue: false }` e o redirecionamento para o WhatsApp acontece igual
- UTMs e `fbclid` são lidos de `window.location.search` em vez de `useSearchParams`, para a
  página continuar estática e sem fronteira de Suspense
- Consentimento por texto sob o botão, não por checkbox obrigatório (menos atrito, mesma
  ação afirmativa)
- A página é `noindex` e não entra no `sitemap.ts`: se indexasse, competiria com a home pelas
  mesmas palavras-chave de Goiânia

**Segunda rodada de ajustes, no mesmo dia:** contato antes da qualificação, persistência no
banco e painel próprio.

- **Ordem invertida a pedido do dono:** nome, empresa e WhatsApp vêm primeiro; quem atende,
  volume e dor vêm depois. O raciocínio dele: quem clicou no anúncio já demonstrou interesse,
  então pode entregar o contato logo, e o lead precisa existir no banco antes das perguntas de
  perfil. Custo aceito conscientemente: pedir telefone na 3ª tela derruba mais gente do que
  pedir na 6ª.
- **Gravação a cada etapa.** Um `crypto.randomUUID()` por visita identifica a linha; cada
  avanço faz upsert no mesmo `id`. Quem larga no meio fica registrado com `concluido = false`
  e a etapa em que parou. O clique no botão do WhatsApp usa `navigator.sendBeacon`, que
  sobrevive à saída da página.
- **Banco: Postgres próprio no Coolify** (decidido em 2026-08-06, trocando o Supabase que tinha
  sido escolhido horas antes). Motivo do dono, correto: o plano gratuito do Supabase **pausa o
  projeto após 7 dias sem atividade**, e um anúncio rodando no fim de semana cairia numa segunda
  com o banco fora do ar. A VPS já está paga e ligada.
  - Isso trocou o acesso via PostgREST (`fetch`) pelo driver `pg` com SQL direto, já que
    Postgres puro não expõe API REST.
  - O `on conflict do update` usa `coalesce` por coluna e `greatest` na etapa: uma gravação
    posterior nunca apaga o que veio antes, o que importa porque o rascunho chega incompleto.
  - Exige expor a porta do Postgres na internet (a Vercel não tem IP fixo para liberar no
    firewall). Mitigado com senha longa, `sslmode=require` e porta fora da padrão. A alternativa
    sem exposição nenhuma é hospedar o site no próprio Coolify. Ver `db/README.md`.
- **Painel com senha única**, não link secreto: link vaza em print e encaminhamento.

**Terceira rodada: copy pelo método Copychefe + revisão `text-quality`.**

Fonte do tom de voz: `~/.claude/Projetos Claude/AlessandroLima/criar-copy/` (agente `copychefe.md`
e `COPIES-COMPANYCHAT-GOIANIA.md`, com as copies dos anúncios já validadas).

- **Furo corrigido:** o quiz abria pedindo o nome sem prometer nada. Quem vem de anúncio via um
  pedido antes de uma promessa. A primeira pergunta virou "Vamos colocar uma IA atendendo no seu
  WhatsApp. Como podemos te chamar?" e o cabeçalho ganhou o selo "Teste sem custo".
- **Ângulo da página:** *a IA que te atende agora é a mesma que vai atender seus clientes* — o
  teste é a própria prova. A tela final explora isso: "Repare no tempo que ela leva para
  responder."
- **Opções da última pergunta viraram cenário concreto** ("Some gente que estava quase fechando"
  no lugar de "Perco o lead no meio da conversa"), seguindo a regra de específico vende do
  Copychefe e o padrão das copies de anúncio.
- **Micro-copy que dá sensação de construção:** cada campo explica para que serve ("É esse nome
  que a IA vai usar quando falar com os seus clientes").
- **Revisão `text-quality`:** os 4 travessões do escopo estão todos em comentários de código, que
  a skill protege e que seguem o padrão do resto do projeto. Nenhum em texto visível.

**Quarta rodada: visual trazido do quiz antigo.** O dono rodou o `company-quiz` original no
navegador e pediu três coisas de volta, todas aplicadas:

1. **Capa de abertura** com ícone de robô, headline de curiosidade ("Descubra quantos clientes
   o seu WhatsApp deixa escapar"), faixa de garantias e botão "Começar agora". Reverte a
   decisão anterior de entrar direto na pergunta.
2. **Cartão branco sobre fundo preto**, no lugar do dark uniforme. O contraste é o que dava a
   sensação de aplicativo no quiz original.
3. **Opções com emoji em quadrado de gradiente colorido + descrição** em duas linhas.

**Não trazido de propósito:** a faixa de prova social do original ("Mais de 300 empresas já
transformaram o atendimento") e o "aumentar suas vendas em até 40%". Números não verificáveis
são risco de reprovação na Meta e viram cobrança em cima da Jade. No lugar entrou o que já é
compromisso da empresa: implantação inclusa, no ar em até 7 dias, sem fidelidade.

**Correção de premissa apontada pelo dono (importante, não repetir o erro):** o quiz chegou a
prometer *"converse com a nossa IA e veja como ela atenderia os seus clientes"*. Está errado.
Quem atende o WhatsApp da CompanyChat é a **Jade, que é comercial** — ela vende a solução, não
demonstra o assistente que o cliente teria. Prometer teste de atendimento é vender uma coisa e
entregar outra logo no primeiro contato.

Corrigido em todos os pontos: a capa fala em "fala com um especialista que já vai saber como
funciona o seu atendimento", a tela final virou "Dados enviados com sucesso" com o botão
**"Falar com um especialista"**, e a mensagem pré-preenchida virou "Respondi as perguntas no
site e quero saber como funciona o assistente de IA".

**Regra que fica:** o quiz é peça de **qualificação**, não de demonstração. Qualquer copy que
sugira teste do produto no WhatsApp do próprio lead está errada enquanto a Jade for comercial.

**Outros ajustes da mesma rodada:** removidas as descrições abaixo do título nas telas de
digitação (só as de escolha mantêm), "Qual o seu WhatsApp?" virou "Qual o seu WhatsApp com
DDD?", e a última pergunta (de escolha) ganhou aviso de "Enviando as suas respostas", que antes
ficava em silêncio durante o envio.

**Contato virou uma tela só (última mudança do dia).** As três perguntas de digitação
seguidas cansavam antes de a pessoa chegar na parte fácil. Agora: capa → uma tela com nome,
empresa e WhatsApp → três perguntas de escolha → tela final. Passou de 6 para 4 etapas.

Efeito colateral aceito conscientemente: quem escreve só o nome e desiste **não** fica mais no
banco, porque a gravação agora só acontece quando os três campos são enviados. Em compensação,
todo lead gravado já tem telefone, e contato sem telefone não servia para nada. Quem desiste
depois disso continua registrado com a etapa em que parou.

`TOTAL_PERGUNTAS` em `ListaLeads.tsx` acompanha esse número (hoje 4). Mudou `ETAPAS` no
`Quiz.tsx`? Muda lá também.

**Banco criado na VPS em 2026-08-06.** Coolify em `coolify.companychatia.com.br`, VPS
`srv1027472.hstgr.cloud` (72.60.152.110), projeto **CompanyChat IA**:

| | |
|---|---|
| Recurso | `leads-site` (postgres:16-alpine), uuid `zodw9ve89i8c3m0hspu3qhqy` |
| Banco / usuário | `leads_site` / `leads` |
| Porta pública | 5435 |
| Tabela | `leads_site`, criada pelo `npm run db:verificar` |

**Migração para o Coolify (2026-08-06).** Resolveu o problema de TLS pela raiz: o site saiu da
Vercel e passou a rodar na mesma VPS do banco.

| | |
|---|---|
| Aplicação | `site-companychat`, uuid `rk7m8v4yjc9q4d7vu0jfae2c` |
| Build | Dockerfile na raiz do repo, Next em `output: "standalone"`, imagem de 314 MB |
| Domínios | `www.companychatia.com.br`, apex e `site.72-60-152-110.sslip.io` (rota de emergência) |
| DNS | `www` e `@` viraram registros **A** para `72.60.152.110` em 2026-08-06 (antes: CNAME/A da Vercel). Backup da zona no scratchpad da sessão |
| Reversão | restaurar `www` CNAME `cname.vercel-dns.com` e `@` A `76.76.21.21`; o deploy da Vercel segue intacto |

**Armadilha na troca de DNS:** depois que o DNS propaga, o Coolify **não emite o certificado
sozinho**. O Traefik serve o certificado padrão e o site fica inacessível por HTTPS
(`curl` acusa `unable to get local issuer certificate`, o navegador mostra aviso de segurança).
A correção é forçar um redeploy da aplicação, que reconfigura o Traefik e dispara o pedido ao
Let's Encrypt. Da próxima vez: **trocar o DNS e já disparar o redeploy em seguida**, sem esperar.
| Deploy automático da Vercel | **desconectado** (`vercel git disconnect`), o site antigo segue servindo o `www` |

**Como o site fala com o banco:** `postgres://leads:...@72.60.152.110:5435/leads_site?sslmode=disable`.
Parece inseguro, mas não é: o container e o Postgres estão no mesmo host, então o pacote não
atravessa a internet. Duas alternativas melhores foram tentadas e falharam nesta versão do
Coolify (4.1.2):

- **Nome interno do container** (`@zodw9ve89i8c3m0hspu3qhqy:5432`): não resolve, mesmo com os
  dois recursos apontando para `destination.network = coolify`. Não há toggle de "connect to
  predefined network" para aplicações com Dockerfile.
- **`host.docker.internal`**: dá `ENOTFOUND` no Linux, e o `custom_docker_run_options` com
  `--add-host=...:host-gateway` persistiu na API mas não surtiu efeito no container.

Se um dia o Coolify passar a resolver o nome interno, troque a URL e feche a porta 5435.

**Sequência de erros que levou até aqui, para não repetir a investigação:** `gravado: false`
silencioso → log do container mostra `ENOTFOUND host.docker.internal` → troca para o IP →
`The server does not support SSL connections` (prova de que alcançou o banco) → `sslmode=disable`
→ `gravado: true`.

**TLS no Postgres continua desligado, mas deixou de ser bloqueante** depois da migração, porque
nada trafega mais pela internet aberta. O histórico do que falhou: O toggle existe e persiste (o método
Livewire é `instantSaveSSL`, no componente `project.database.postgresql.status-info`; a API REST
recusa o campo com "This field is not allowed"). O Coolify chega a gerar o certificado, mas o
container **não sobe** com SSL ligado: fica em `restarting:unhealthy` e a porta para de
responder. Revertido para restaurar o serviço. Suspeita: permissão do arquivo de chave privada,
que o Postgres exige em 0600 com dono correto. Diagnosticar exige SSH, e a API da Hostinger
cadastra a chave pública (id 553749) mas não a anexa à VM por nenhuma rota encontrada.

**Detalhes da UI do Coolify que custaram tempo:** a URL de um recurso é
`/project/{uuid}/environment/{uuid}/database/{uuid}`; qualquer outro formato redireciona para o
dashboard sem erro. Os ids de campo do Livewire mudam a cada render, então seletores precisam
usar prefixo (`input[id^="enableSsl-"]`) ou ir pelo `window.Livewire.all()`.

**Rascunho de quem desiste no meio do preenchimento.** Para fechar o buraco criado pela tela
única de contato: ouvintes de `visibilitychange` e `pagehide` gravam por `sendBeacon` o que já
foi digitado, com `etapa = 0`. `visibilitychange` é o que importa no celular, onde sair é
trocar de aplicativo, não fechar a aba. Só dispara se algum campo tiver mais de um caractere,
então quem abre e fecha não vira lixo no painel. Como o `id` é o mesmo da visita, um envio
posterior atualiza a linha em vez de duplicar. No painel esses leads aparecem como
**"Não chegou a enviar"**.

**CTA final:** "Falar com um especialista" virou **"Falar no WhatsApp agora"**, mais direto.
Recusado "Testar agora no WhatsApp", que recria a promessa de demonstração corrigida acima.

**Validado ponta a ponta em 2026-08-05, contra um PostgREST falso local:** as 6 perguntas
geram 6 upserts na mesma linha (nome já na etapa 1, telefone na 3), o clique no WhatsApp marca
`clicou_whatsapp`, o painel separa quem concluiu de quem parou no meio, o CSV sai com acentos
corretos e responde 401 sem cookie, e senha errada é recusada. Sem overflow horizontal em 390px.

### 2026-08-10 — Lead do quiz cai direto no CRM (coluna "Lead novo")

O lead deixou de morar só no painel `/leads`: ele agora entra no CRM Comercial
(`crm.companychatia.com.br` → Leads & Oportunidades → **Lead novo**), que é a tela
que o dono já abre todo dia enquanto o anúncio roda.

O gancho já existia e estava sem destino: `entregarNoWebhook` em
`src/app/api/lead/route.ts` só precisava de `LEAD_WEBHOOK_URL`. Duas mudanças do lado
do site:

- **Quando avisar** — antes o webhook só saía com o quiz concluído. Como nome, empresa
  e WhatsApp são capturados **na etapa 1**, esperar o fim descartava justamente quem
  travou no meio — metade da verba de anúncio. Agora sai quando o lead fica
  *contatável* (nome + telefone com DDD) e só nos marcos que mudam o card: nascer,
  concluir e clicar no WhatsApp (`contatavel` + `marcoDoLead` na rota). As etapas 2 e 3
  gravam no banco sem incomodar o CRM.
- **`salvarLead` devolve `inserido`** (`returning (xmax = 0)`) — é assim que a rota sabe
  que a linha acabou de nascer, em vez de ser mais uma etapa da mesma visita.

O receptor mora no outro repositório (`company-crm`): Edge Function `lead-site` +
RPC `com_lead_site_registrar`, idempotente pelo `id` do lead — reenvio não duplica card.
Variáveis: `LEAD_WEBHOOK_URL` (URL da função) e `LEAD_WEBHOOK_TOKEN` (mesmo valor do
`LEAD_SITE_TOKEN` lá).

---

## Aprendizados e Padrões

- Tailwind v4 não usa `tailwind.config.js` — toda configuração fica em `globals.css`
- Ícones via Lucide React exclusivamente (não misturar com outras bibliotecas)
- Estrutura de componentes: um arquivo `.tsx` por seção da landing page
- Animações via Framer Motion — não usar CSS puro para animações complexas
- CSS variables para tokens de cor e tipografia — centralizar em `globals.css`
- Verificação de deploy: usar `vercel ls` (status `Ready`) em vez de polling de `curl` no domínio de produção, que dispara a proteção antibot da Vercel (ver incidente de 2026-07-28)
- "Está no ar" exige três evidências, todas fora da máquina local: working tree limpo, HEAD publicado no remoto e o deploy ativo em `vercel ls` apontando para esse commit. Em 2026-08-03 uma sessão registrou o hero como publicado tendo verificado só o `localhost`; o trabalho ficou quatro dias parado sem commit
- Botões e links de header ou de par lado a lado precisam de `whitespace-nowrap`, senão quebram em duas linhas em 768px e em cards estreitos
- Validação visual: use o build de produção numa porta dedicada (`npx next start -p 3005`). O servidor de desenvolvimento recarrega a página na primeira compilação, o que derruba a captura do MCP do Chrome e esconde os elementos animados por Framer Motion

---

## Próximos Passos

- [ ] **Bloqueante para o anúncio:** criar o Postgres no Coolify, rodar `db/leads_site.sql` e cadastrar `DATABASE_URL` no Vercel (passo a passo em `db/README.md`). Sem isso o quiz funciona mas nenhum lead é salvo
- [ ] Cadastrar `PAINEL_LEADS_SENHA` no Vercel para liberar `/leads`
- [ ] Cadastrar `NEXT_PUBLIC_META_PIXEL_ID` no Vercel — sem o pixel a campanha do Meta não otimiza por conversão nem monta público de retargeting
- [ ] Cadastrar `LEAD_WEBHOOK_URL` + `LEAD_WEBHOOK_TOKEN` no Coolify e redeployar — é o que liga o quiz ao CRM (Edge Function `lead-site`, decisão de 2026-08-10). Sem isso o lead continua só no `/leads`
- [ ] Commit + push de `/comecar` (via @devops) → deploy automático no Vercel
- [ ] Depois de rodar o anúncio: medir onde as pessoas abandonam o quiz (hoje só o lead completo chega ao webhook; abandono no meio não é registrado)
- [ ] Decidir se o padrão visual de `/company-ai` vai para as outras páginas internas (o usuário quis ver no ar primeiro, em 2026-07-30)
- [ ] Instalar a CLI do CodeRabbit em `~/.local/bin/coderabbit`: o gate de revisão automática foi pulado nos três pushes de 2026-07-30
- [ ] Revisar com o usuário o texto da consultoria em `company-ai-data.ts`: descreve um serviço ainda não vendido
- [ ] Validar as quatro etapas de `ComoTrabalhamos.tsx`, que descrevem como o trabalho acontece
- [ ] Avaliar remover o código morto do selo "grátis" em `Categorias.tsx` (flag `gratis` e ícone `Gift`, sem categoria que use)
- [ ] Cadastrar `NEXT_PUBLIC_YOUTUBE_URL` no Vercel (o fallback `@eusoualessandrolima1` foi verificado com HTTP 200 e bate com o dono do repositório)
- [x] ~~Commit + push da Company AI~~ → `88a65f4`, no ar em 2026-07-30
- [x] ~~Atualizar a base da Jade com a Company AI~~ → documento 13 criado, `READY`, 4 chunks

- [ ] Commit + push da página `/assistente-ia` (via @devops) → deploy automático no Vercel
- [ ] Avaliar se as cenas de `/assistente-ia` merecem animação de digitação ao vivo (hoje entram por `whileInView`, sem simulação de tempo real)
- [ ] Commit + push das correções da auditoria de 2026-07-14 (via @devops) → deploy automático no Vercel
- [ ] Verificar visualmente a home, a `/api-oficial` e a nova `/disparos` no navegador após o deploy (hero em ~1024px, mock do painel, responsividade do dashboard recriado)
- [ ] Trocar os números ilustrativos do painel em `/disparos` por prints/dados reais se quiser (hoje são exemplos)
- [ ] Avaliar link mais visível para `/disparos` e `/api-oficial` na home (hoje só no Footer)
- [ ] (Efeitos BotConversa) Avaliar um hero com grid 3D em perspectiva / partículas; efeito de tilt nos cards; contadores animados adicionais
- [ ] Investigar overflow horizontal de ~14px na seção `Sobre` em mobile estreito (medição via chrome-devtools pode ser artefato de emulação; confirmar em device real)
- [ ] Cadastrar `NEXT_PUBLIC_SITE_URL` e `NEXT_PUBLIC_WHATSAPP_NUMBER` no painel do Vercel (o código agora lê essas vars com fallback)
- [x] ~~Decidir se cria seção de planos/preços~~ → resolvido em 2026-07-28 com a página `/planos` (Pro R$ 497/mês + Sob medida)
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
