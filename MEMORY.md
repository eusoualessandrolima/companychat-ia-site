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
| Garantias | `Garantias.tsx` | "O que você pode esperar da CompanyChat IA" — 6 compromissos, grid 3×2, última seção antes do FAQ |
| CompanyAi | `CompanyAi.tsx` | Resumo da Company AI na home (projetos sob medida); detalhe em `/company-ai` |
| Sobre | `Sobre.tsx` | Sobre a empresa |
| FAQ | `FAQ.tsx` | Perguntas frequentes |
| Contato | `Contato.tsx` | Formulário/CTA de contato |
| Footer | `Footer.tsx` | Rodapé |
| Logo | `Logo.tsx` | Assinatura oficial v3 em SVG (`public/brand/`): símbolo do balão + wordmark, 165px no mobile e 182px no desktop. Exporta também `Simbolo` (símbolo isolado, para avatar e selo). Não montar a marca com texto — ver `docs/marca/MANUAL-DA-MARCA.md` |
| WhatsAppButton | `WhatsAppButton.tsx` | Botão flutuante do WhatsApp (`"use client"`). No desktop mostra Comercial e Suporte; no celular vira um botão só que abre os dois rotulados. Números e links moram em `src/lib/whatsapp.ts` |
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

### Ecossistema de LPs por nicho (`src/app/lp-*/page.tsx` + `src/components/lp/`)

Quatro landings de captação para anúncio do Meta (2026-08-11), todas com a mesma
estrutura de conversão adaptada do template `matheusmontelro/template-landing-page-sem-clientes`:
hero → barra de autoridade → problema → calculadora de perda → como funciona → provas de
competência → marquee de nichos → antes/depois → oferta com formulário → FAQ → CTA final.
Fora do menu, fora do sitemap, `noindex`, e mesmos eventos de Pixel (ViewContent, Lead,
Contact) para as campanhas serem comparáveis.

| Rota | Nicho | Conteúdo |
|------|-------|----------|
| `/lp-saude` | Clínicas e saúde/bem-estar (20 segmentos) | `conteudos/saude.ts` — copy validada na ex-`/comecar2` |
| `/lp-empresas` | PMEs em geral (16 segmentos) | `conteudos/empresas.ts` |
| `/lp-adv` | Advogados e escritórios (12 áreas) | `conteudos/advogados.ts` — FAQ deixa claro que a IA não dá orientação jurídica |
| `/lp-seguros` | Corretoras de seguros (12 ramos) | `conteudos/seguros.ts` — FAQ deixa claro que a IA não cota nem emite apólice |

`/comecar2` → redirect permanente para `/lp-saude` (em `next.config.ts`). A `/comecar`
(quiz) segue intocada por ser o destino do anúncio ativo.

Arquitetura em `src/components/lp/`: `tipos.ts` define `LPConteudo` (toda copy);
`Landing.tsx`, `Calculadora.tsx` e `FormularioLead.tsx` são genéricos. As páginas
(Server Components) passam só o NOME do nicho (`<Landing nicho="saude" />`) porque os
conteúdos carregam componentes de ícone, que não podem cruzar a fronteira
servidor→cliente como prop — o registro `CONTEUDOS` vive dentro da `Landing` (client).
Barra de autoridade é compartilhada (fundamentos institucionais reais).

Pixel por LP: `MetaPixel` aceita `pixelId` opcional; cada página passa a sua env
(`NEXT_PUBLIC_META_PIXEL_ID_SAUDE`, `_EMPRESAS`, `_ADV`, `_SEGUROS`), com fallback para
o `NEXT_PUBLIC_META_PIXEL_ID` global enquanto os Pixels separados não existirem. As
envs por nicho ainda NÃO estão criadas no Coolify.

Leads: mesma rota `/api/lead` (painel `/leads` + card no CRM). O segmento vai em
`origem.segmento` e a página em `origem.pagina` — a migração `0012_lead_site_segmento.sql`
do CRM (aplicada em produção) mostra ambos no comentário do card, então cada LP fica
identificada no Kanban automaticamente. Responsividade validada de 320px a 4K na
estrutura compartilhada (2026-08-11): padding fluido `clamp(1rem,4vw,2rem)`, alvos de
toque ≥44px, safe-area, sem overflow horizontal.

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
| CompanyAiCta | `CompanyAiCta.tsx` | CTA final (WhatsApp + cross-link para `/assistente-ia`) |
| company-ai-data | `company-ai-data.ts` | Fonte única das quatro frentes (home e página) |

### Calculadora de impacto — `components/calculadora/` (rota `/calculadora`)

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| Calculadora | `Calculadora.tsx` | Orquestrador: hero, estado das respostas, alterna wizard e resultado |
| Wizard | `Wizard.tsx` | Wizard de 6 passos (ativa) ou 3 (receptiva), com painel lateral de ajuda |
| Resultado | `Resultado.tsx` | Resumo, 3 cards de cenário, banner de urgência, gráficos, tabela, imprimir |
| Graficos | `Graficos.tsx` | Barras e linha em SVG puro, sem biblioteca de gráficos |
| ModalLead | `ModalLead.tsx` | Captura de lead via `/api/lead`, com os números da simulação na origem |
| calculo | `calculo.ts` | Fórmulas, formatadores e preços; consome `api-oficial/pricing.ts` |
| perguntas | `perguntas.ts` | Passos, textos de ajuda, copy dos cenários e linhas da tabela |

### Funil de teste grátis — rota `/teste-gratis`

Caminho comercial principal do site. Detalhes de operação em `docs/funil-teste-gratis.md`.

| Arquivo | Descrição |
|---------|-----------|
| `src/app/teste-gratis/page.tsx` | Landing: hero, as quatro etapas do que acontece depois do envio e o formulário |
| `src/components/teste-gratis/Formulario.tsx` | Formulário completo, com consentimento, honeypot, estados e eventos |
| `src/components/teste-gratis/conteudo.ts` | Segmentos e garantias |
| `src/lib/cta.ts` | Destino e rótulos dos CTAs comerciais (fonte única) |
| `src/components/CtaTesteGratis.tsx` | Botão compartilhado dos CTAs, dispara `free_trial_cta_clicked` |
| `src/lib/analytics.ts` | Eventos do navegador e primeira URL da visita |
| `src/lib/postgres.ts` | Pool do Postgres, compartilhada com `leads.ts` |
| `src/lib/rate-limit.ts` | Limite por IP, em memória |
| `src/lib/teste-gratis/*` | Config, telefone, validação, consentimento, captação, repositório, fila, adapter de WhatsApp, webhook, intenção, IA e assinatura |
| `src/app/api/teste-gratis/route.ts` | Captação |
| `src/app/api/teste-gratis/worker/route.ts` | Gatilho da fila (cron) |
| `src/app/api/whatsapp/webhook/route.ts` | Webhook do provedor |
| `instrumentation.ts` | Tique interno opcional da fila |
| `db/teste_gratis.sql` | DDL das três tabelas |
| `tests/unidade/` + `tests/teste-gratis.mjs` + `tests/banco-teste-gratis.mjs` | Testes |

### Campanha "10 Empresas, 10 Assistentes de IA" — rota `/10-empresas` (2026-08-25)

LP de campanha com um objetivo só: candidatura para a seleção de 10 empresas que
recebem a implantação gratuita de um assistente de IA. Sem menu, sem calculadora e
mais curta que as LPs de nicho.

**Redesenhada em 2026-08-26** (UX/UI + CRO + arquitetura). Ordem das seções hoje:
hero → percepção de valor (única seção clara) → jornada em 4 passos → bento de
capacidades → timeline da entrega → para quem é / para quem não é → quem está por
trás → como funciona a seleção → formulário (2 etapas) → FAQ → fechamento.

| Arquivo | Descrição |
|---------|-----------|
| `src/app/10-empresas/page.tsx` | Rota, metadados/OG, `noindex` e o Pixel global (`<MetaPixel />`, sem variável própria) |
| `src/app/10-empresas/error.tsx` | Boundary da rota: erro de runtime não derruba mais a campanha inteira |
| `src/components/dez-empresas/Campanha.tsx` | **Server Component**: só compõe as seções |
| `src/components/dez-empresas/Hero.tsx` | Hero, mock do WhatsApp e as etiquetas de resultado |
| `src/components/dez-empresas/Secao*.tsx` | Uma por seção, todas Server Components |
| `src/components/dez-empresas/Moldura.tsx` | Cabeçalho e rodapé |
| `src/components/dez-empresas/CtaAncora.tsx` · `LinkWhatsApp.tsx` · `MedidorDePagina.tsx` | As três ilhas de cliente (só analytics) |
| `src/components/dez-empresas/FormularioCandidatura.tsx` | Formulário de 8 campos em 2 etapas de interface, com 1 POST |
| `src/components/dez-empresas/conteudo.ts` | Toda a copy, incluindo o FAQ com a regra comercial da campanha |
| `src/components/comum/Revelar.tsx` · `Rotulo.tsx` · `FundoAurora.tsx` | Primitivas compartilhadas com as LPs de nicho (antes duplicadas byte a byte) |
| `src/components/icones/WhatsAppIcon.tsx` | SVG isolado, sem `"use client"` |
| `src/lib/origem.ts` | Saneia o `origem` (jsonb) de qualquer lead: teto de chaves e de tamanho |
| `tests/campanha-10-empresas.mjs` | Verificação no navegador (`npm run test:campanha10`) |
| `tests/unidade/origem.test.mjs` | Testes do saneamento da origem |

Decisões desta LP:
- **Estrutura própria, não a `Landing` das LPs.** Aquela é um funil longo e acoplado a
  `LPConteudo`; mexer nela para caber uma seção opcional colocaria as quatro LPs em
  risco. Reaproveitado o sistema visual (tokens, `glass-card-dark`, `glow-border`,
  `animate-cta-pulse`, padrão de revelação), nenhum arquivo de `components/lp/` tocado.
- **Mesma integração `/api/lead`.** Nome, empresa, telefone e volume nas colunas
  próprias; os objetivos escolhidos em `dor`, unidos por ` · `; e-mail, cidade,
  segmento, `objetivos` (a mesma string, para quem filtra por `origem`), consentimento
  com versão e data, UTMs, referrer, página e `enviado_em` em `origem`, junto de
  `origem=lp-10-empresas`, `campanha=10-empresas-10-assistentes` e `tipo=candidatura`.
  **Sem mudança de schema:** a tabela `leads_site` continua igual.
- **A etapa 2 pergunta objetivos, não o problema (2026-08-26).** O campo livre
  "descreva seu problema" virou caixas de seleção múltipla: quem candidata marca o que
  quer que a IA faça. Texto livre em formulário de campanha rende resposta curta e
  inútil ("atendimento ruim") e ainda cria fricção no celular; a lista fechada devolve
  dado comparável entre candidatas e escolhe mais de um objetivo quando é o caso.
  A copy das opções vive em `conteudo.ts`; `dor` continua sendo a coluna de destino.
- **`noindex` e fora do `sitemap.ts`** (decisão do dono, 2026-08-25): a campanha é
  temporária e uma página de seleção encerrada envelhece mal no resultado de busca.
  Sitemap listando URL bloqueada seria contradição reportada como erro no Search
  Console. O tráfego vem de anúncio e link direto; o card de OG continua valendo no
  compartilhamento. Mesma postura das LPs de nicho.
- **Um Pixel só.** A página monta `<MetaPixel />` sem `pixelId`, ou seja, o
  `NEXT_PUBLIC_META_PIXEL_ID` global. A campanha é separada pelos eventos
  `campanha10_*` dentro do mesmo Pixel, sem variável de ambiente nova.
- **Escopo comercial aprovado em 2026-08-25:** o que é gratuito é a *implantação
  inicial*, dentro do escopo definido pela CompanyChat; o que fica fora é tratado
  separadamente, com valor apresentado antes; a participação não gera contratação
  automática. Proibido na copy: "gratuito para sempre" e qualquer integração ou
  recurso que ainda não exista.

#### Redesign de 2026-08-26 — decisões

- **A escassez virou o `<h1>`.** Antes o título era "Atenda seus clientes com mais
  eficiência e agilidade" — a mesma frase da `/teste-gratis` — e "10 empresas" vivia
  num badge de 12px. Numa página cujo argumento é a seleção, a seleção não pode estar
  no menor tipo da tela.
- **Sem âncora de preço riscado.** O briefing previa "~~R$ X.XXX~~ → R$ 0", mas o site
  parou de publicar valor em 26/08 (preço sai no diagnóstico). O card mostra "R$ 0 ·
  Implantação inicial 100% gratuita", sem número inventado.
- **Uma seção clara no meio do escuro** (`.superficie-areia`), na percepção de valor.
  A página passava seis seções escuras sem quebra de temperatura.
- **Formulário em 2 etapas, não 3.** Só na interface: um POST, um `id` de lead. Wizard
  de 3 passos numa LP curta anuncia "isto vai demorar" antes de a pessoa ver o fim.
- **Botão principal é sempre `type="submit"`.** Alternar entre `button` e `submit`
  conforme a etapa criou um bug silencioso: o React reaproveita o nó e troca só o
  atributo, então o mesmo clique que avançava também submetia, e a etapa 2 nascia com
  os 5 campos em vermelho. Coberto por teste de regressão.
- **Framer Motion saiu da rota.** `Revelar` virou CSS (`animation-timeline: view()`
  dentro de `@supports`), e a página deixou de ter um chunk privado de 140 KB. JS da
  rota: 246 KB → 202 KB gzip. Elementos com `opacity:0` no HTML do servidor: 32 → 0.
- **`@media print` desliga a revelação.** Sem rolagem, animação ancorada na rolagem
  nunca sai do quadro inicial: um Ctrl+P saía com seis seções em branco.
- **Consentimento agora é gravado** (`consentimento`, `_versao`, `_em` dentro de
  `origem`), e o servidor recusa candidatura sem ele. A política publicada já
  prometia esse registro desde sempre; o código não cumpria.
- **Honeypot `empresaWebsite`** passou a existir neste formulário. A API já checava o
  campo — era esta página que não o renderizava, o que deixava a proteção inerte.
- **Hero fora do `Revelar`.** O `Revelar` (motion com `initial opacity 0`) sai no
  HTML do servidor já invisível e só acende na hidratação. Como o `<h1>` é o
  elemento de LCP, isso custava **5,2 s de LCP no Lighthouse mobile** (91% em
  render delay) e deixava o topo em branco em conexão ruim. Com o hero estático:
  **LCP 3,0 s e Performance 90** (desktop 100). A animação continua da segunda
  dobra em diante.
  > As quatro LPs de nicho têm o mesmo padrão e a mesma penalidade
  > (`/lp-empresas` medida em Performance 75 / LCP 5,2 s). Não foram alteradas
  > por decisão de escopo — é a melhoria de maior retorno se um dia forem tocadas.
- **`preconnect` da Meta em `MetaPixel.tsx`** (2026-08-25): o handshake custava
  ~360 ms no caminho crítico. Mudança aditiva, vale para todas as páginas com
  Pixel, sem alterar layout nem o que é carregado.
- **Analytics só nos domínios de produção** (2026-08-25, vale para o site todo):
  `analyticsPermitido()` em `src/lib/analytics.ts` libera medição apenas em
  `companychatia.com.br` e `www.companychatia.com.br`. `MetaPixel` virou client
  component e não injeta **nada** fora dessa lista — nem script, nem preconnect —
  e `evento()` não transmite nem enfileira. `localStorage.cc_debug_analytics =
  "true"` liga só o `dataLayer` local, que não cruza a rede.
  > `NODE_ENV` não servia: `npm run start` roda em `production` no localhost, e
  > foi assim que uma sessão de teste chegou a registrar 2 page views no Pixel
  > real. O host é o único sinal confiável.
  > O pixel de `<noscript>` saiu junto: era a única parte impossível de
  > condicionar ao domínio, e no formato atual nunca chegaria a um navegador sem
  > JS. Perde-se a contagem de visitante sem JavaScript, que não converte.
- **`entregue` na resposta de `/api/lead`** (2026-08-25): com o banco fora, o
  lead se perdia e o visitante via "Candidatura recebida!" — `salvarLead` engole
  o erro e devolve `ok`, o que é certo para o quiz e péssimo para quem preencheu
  dez campos. A rota agora informa se o lead chegou ao banco **ou** ao webhook, e
  a candidatura só comemora quando chegou. Campo aditivo: quiz e LPs olham só
  `ok` e não mudam. O `fetch` do formulário também ganhou teto de 20 s.
- **`CAMPANHA_ENCERRADA` em `conteudo.ts`**: chave que troca o formulário pelo
  aviso de seleção encerrada e muda o rótulo dos CTAs, como manda a regra
  comercial. Ao virá-la, vale revisar também o badge do hero e o selo de vagas,
  que seguem falando em vaga aberta.

Rascunho da base da Jade: `docs/jade-campanha-10-empresas.md` (aguarda aprovação;
inclui a versão de encerramento a aplicar quando a seleção fechar).

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

> **Revertida em 2026-08-26** — ver "Preço sai do site". A rota, os componentes e o
> `planos-data.ts` não existem mais; o registro fica pelo contexto comercial.
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

> **Revertida em 2026-08-26** — ver "Preço sai do site". `PlanosHome.tsx` foi removido.
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

### 2026-08-12 — `/calculadora`: cópia da calculadora de impacto do ChatGuru

Página nova inspirada em `calculadora-impacto.chatguru.com.br`, cuja estrutura foi
levantada por engenharia reversa do bundle de produção. A investigação completa
(fórmulas, tokens de design, blocos da tela de resultado) está em
`docs/calculadora-impacto-spec.md`.

O que foi copiado: wizard de 6 passos com painel lateral de ajuda, três cenários com o
do meio marcado como risco e o nosso como escolha, banner de prejuízo anual, gráficos,
tabela comparativa e imprimir/PDF.

Onde divergimos de propósito:

- **Tema escuro**, não claro. A referência é clara, mas o site inteiro é `dark-base`;
  uma página clara faria o visitante sentir que trocou de site ao clicar em "voltar".
- **Preços vêm de `api-oficial/pricing.ts`**, não dos valores do ChatGuru (que cobra
  autenticação ao mesmo preço de utilidade). Aquele arquivo já é a fonte de verdade do
  site e da base da Jade — um segundo número oficial para a mesma pergunta é o tipo de
  divergência que já deu problema antes.
- **`R$ 0,035` exibido com três casas.** A referência arredonda para `R$ 0,04` na tela
  mas calcula com `0,035`: quem confere na mão acha um erro de R$ 192 que não existe.
- **Gráfico de linha mostra só o custo variável.** Somando o template, as três curvas
  se achatam numa faixa estreita no topo e a divergência — que é o argumento inteiro —
  some. Sem ele, a linha verde estaciona no roteamento e a vermelha sobe sem parar.
- **Gráficos em SVG puro**, sem Recharts: são três barras e três retas, não justificam
  ~100 KB de dependência.
- **Formulário próprio** em vez do embed do HubSpot, reaproveitando `/api/lead`. Os
  números da simulação viajam na `origem` do lead, então quem atende abre a conversa já
  sabendo qual conta assustou o visitante.

### Hero: smartphone com WhatsApp em vez da janela de chat (2026-08-15)

- **Aparelho desenhado em CSS, não o PNG entregue no pacote** `~/Desktop/CompanyChat-IA-Novo-Hero`.
  O mockup aprovado (`companychat-hero-preview.html`) já fazia assim, o PNG tem rotação de
  ~15° contra os 4–6° que o próprio briefing exige, e encaixar uma tela em DOM sobre uma
  foto em perspectiva exigiria `matrix3d` calibrado à mão. O PNG segue disponível no pacote
  caso a decisão mude.
- **Interface do WhatsApp toda no DOM** (status bar, cabeçalho, balões, composer). Cores do
  app em constante local `WA`, fora dos tokens do site de propósito: o reconhecimento
  imediato depende de o app parecer o app.
- **SSR entrega a conversa inteira** e um layout effect a recolhe para o passo 0 antes da
  primeira pintura. É o que faz a demonstração ser legível sem JavaScript sem piscar o
  quadro cheio na carga.
- **O laço pausa** quando a aba some (`visibilitychange`) ou quando o telefone sai da
  viewport (`useInView`).
- **Trilha de etapas** encosta à esquerda no desktop e some abaixo de 640px — nas duas
  posições anteriores ela caía atrás dos botões flutuantes de WhatsApp.

### Identidade v2: a marca pública virou "CompanyChat" (2026-08-15)

Pacote oficial em `~/Desktop/CompanyChat-IA-Novo-Hero/09-IDENTIDADE-OFICIAL-EXTRABOLD`
(idêntico a `~/Documents/Codex/2026-08-15/.../companychat-identidade-oficial-v2`).

- **O logotipo é um SVG, não texto.** `Logo.tsx` montava a marca com dois `span` mais
  uma cápsula `IA`; agora serve `public/brand/companychat-logo-{dark,light}.svg`
  (Manrope ExtraBold em curvas, 500 × 72). O manual proíbe recriar a marca em
  HTML/CSS e proíbe inverter cores por filtro — daí dois arquivos em vez de um.
  O componente é usado em 9 lugares, então a troca cobriu header, footer, ApiHeader,
  privacidade, login do painel, lista de leads, LPs e quiz de uma vez.
- **`<img>` e não `next/image`:** é SVG de dimensão fixa, não há o que otimizar. O
  `eslint-disable` no topo do componente registra o porquê.
- **Nome público:** `CompanyChat IA` → `CompanyChat` em 42 arquivos. Preservadas as
  duas ocorrências de `CompanyChat IA Ltda` (razão social, em `Footer.tsx` e na
  política de privacidade) e todas as referências descritivas a IA (`Assistente IA`,
  `IA integrada`, o produto `Company AI`).
- **O card social recriava o logotipo:** `opengraph-image.tsx` desenhava o nome em
  texto ao lado de um ponto verde. Agora embute o SVG oficial via data URI — o Satori
  aceita, e a imagem é gerada no build.
- **Favicon auditado, não trocado:** `app/icon.svg` é um quadrado verde com a letra
  `C`. Não contém `IA`, então ficou como está — o manual proíbe inventar símbolo.
- **`public/` deixou de ser vazio.** O `Dockerfile` já fazia `COPY /app/public ./public`,
  então os SVGs chegam à produção mesmo com `output: standalone`.

### Botões flutuantes: um só no celular (2026-08-15)

A pilha de dois círculos ocupava 48×104px fixos no canto inferior direito e passava por
cima do conteúdo — em 390px de largura qualquer bloco centralizado com mais de ~262px
fica embaixo dela. Pior: no celular os rótulos eram `hidden sm:inline-block`, então eram
dois círculos coloridos sem nome e ninguém sabia qual era comercial e qual era suporte.

- **Celular:** um botão de 48×48 (área ocupada caiu 54%). Ao tocar, abre os dois canais
  **com rótulo**; fecha ao tocar fora ou apertar Esc.
- **Desktop:** sem mudança — os dois canais continuam à vista, cada um com seu rótulo.
- **Custo:** o Comercial passou de um toque para dois no celular. Em troca, quem precisa
  de suporte finalmente consegue distinguir os canais. Se a conversão cair, o caminho é
  fazer o botão fechado linkar direto no Comercial e deixar o Suporte atrás do menu.
- **`bottom` com `env(safe-area-inset-bottom)`:** o layout usa `viewportFit: cover`,
  então em iPhone com notch os 24px de `bottom-6` caíam embaixo do indicador de home
  (34px). Agora é `max(1.5rem, calc(env(safe-area-inset-bottom) + 0.5rem))` — 24px em
  tela sem recorte, 42px com. Valia para os dois botões antigos também; só apareceu
  quando o DevTools mostrou o botão único encostando na borda.
- **`src/lib/whatsapp.ts`:** `WhatsAppButton.tsx` virou `"use client"` por causa do
  estado de aberto/fechado. Componentes de servidor (`Footer`, `StructuredData`,
  `/privacidade`) importariam referências de cliente no lugar das strings, então os
  números e links saíram para esse módulo neutro. `WhatsAppButton.tsx` reexporta tudo
  para os ~25 componentes de cliente que já importavam de lá.

### 2026-08-25 — Funil de teste grátis (`/teste-gratis`) substitui o caminho comercial

O caminho comercial principal deixou de ser "abrir o WhatsApp direto" e passou a ser
formulário → lead no banco → mensagem de template agendada → resposta → IA assume.
Documentação completa em **`docs/funil-teste-gratis.md`**; aqui ficam só as decisões.

**⚠️ Tensão com a decisão de 2026-08-05, assumida pelo dono.** Naquela sessão "teste
gratuitamente" foi recusado por não existir trial em `planos-data.ts` e a Jade não
sustentar a promessa. O funil novo foi pedido explicitamente, e a copy resolve a
tensão sem criar oferta: a página diz, em dois lugares, que o envio **registra a
solicitação e não cria nem libera conta automaticamente**. **A base de conhecimento da
Jade precisa ser atualizada** com esse enquadramento antes de o funil ir ao ar, ou ela
vai divergir do site como já aconteceu com a implantação (ver `CLAUDE.md`).

**CTAs redirecionados** (via `src/lib/cta.ts` + `CtaTesteGratis.tsx`, fonte única):
Header (desktop e mobile), Hero, `ApiHeader` (todas as páginas internas), `Contato`,
CTA do Footer e os CTAs finais de `/assistente-ia`, `/api-oficial`, `/disparos` e
`/planos`. Rótulos: "Teste grátis" em barra, "Quero testar grátis" em botão de bloco.

**Deixados no WhatsApp de propósito:** botões flutuantes de Comercial e Suporte (são o
caminho humano direto, que o próprio fluxo da IA exige), cards de `Nichos` e
`PorteEmpresa` (levam mensagem pré-preenchida com o segmento, que qualifica melhor
que o formulário), cards de plano em `PlanosHome`/`TabelaPlanos` (contexto de plano
específico), `CompanyAiCta` (projetos sob medida não são o mesmo funil) e o link de
WhatsApp do Footer. "Fazer Login" não foi tocado.

**Banco:** três tabelas em `db/teste_gratis.sql`, no mesmo Postgres do quiz.
`teste_gratis_leads` (cadastro, consentimento com versão, atribuição, estado),
`teste_gratis_jobs` (o agendamento) e `teste_gratis_eventos` (auditoria, analytics de
servidor e deduplicação do webhook). A pool saiu de `leads.ts` para `src/lib/postgres.ts`,
compartilhada pelos dois funis.

**Agendamento sem fila nova.** O projeto não tem Redis, BullMQ nem cron interno, e o
site roda como container único no Coolify. O job é uma linha no Postgres reivindicada
com `for update skip locked`; o gatilho é o cron chamando `/api/teste-gratis/worker`.
`TESTE_GRATIS_WORKER_INTERNO=true` liga um tique dentro do processo
(`instrumentation.ts`) para o funil funcionar antes de o cron existir. Nada de
`setTimeout` dentro de rota: morreria no primeiro redeploy.

**Três camadas de idempotência, todas no banco:**
- índice único `(lead_id, tipo)` em `teste_gratis_jobs` — um lead nunca tem dois disparos;
- consulta de solicitação recente por telefone **ou** e-mail dentro de 24h;
- índice único parcial em `teste_gratis_eventos.chave` — reentrega do provedor vira
  `on conflict do nothing`, e o `rowCount` diz se o evento é inédito.

**Armadilha do `wa_id` brasileiro.** A Meta devolve o `wa_id` quase sempre **sem** o
nono dígito (`556293054630` para `+5562993054630`). Comparar as strings cruas faz o
webhook não achar o lead e a conversa nunca chegar na IA. `variantesE164()` gera as
duas grafias e a busca usa `= any($1)`.

**Envio isolado num adapter** (`whatsapp-provedor.ts`), porque o site não tinha
integração de envio nenhuma: só link `wa.me`. Duas implementações, escolhidas por
variável: Cloud API da Meta e webhook para um automatizador existente. Sem credencial,
o provedor é `nenhum` e a fila registra falha em vez de fingir que enviou.

**A IA não mora aqui.** O webhook entrega o dossiê em `IA_HANDOFF_URL` e só depois de o
lead responder. O dossiê carrega `jaRespondido` para o agente não repetir o que o
formulário já perguntou.

**Opt-out vence consentimento novo.** Quem pediu para parar e preenche o formulário de
novo tem o lead gravado com status `opt_out` e **nenhum** disparo; destravar é decisão
de gente. O lead ainda chega ao CRM pelo `LEAD_WEBHOOK_URL` que o quiz já usava.

**Analytics sem ferramenta nova:** eventos de navegador saem no Pixel do Meta como
`trackCustom` (mais `dataLayer` se houver contêiner de tags); eventos de servidor vivem
em `teste_gratis_eventos`. `user_agent` **não** é gravado: não faz parte da arquitetura
atual e seria dado pessoal a mais sem uso definido.

**Testes:** `npm run test:unidade` (55 casos, sem banco e sem rede, com `node --test`
sobre `src/lib` compilado para CommonJS em `.testes-build/` — ver `tsconfig.testes.json`)
e `npm run test:teste-gratis` (Playwright: navegação dos 6 CTAs, formulário e 10
viewports). `npm run test:banco` exige `TESTE_GRATIS_DB=1` e uma URL de banco de teste;
**não foi executado** nesta sessão por não haver Postgres local.

### 2026-08-25 — Funil pronto para homologação (mesma sessão, segunda rodada)

**`free_trial_cta_clicked` deixou de se perder na home.** O Pixel só é montado nas
páginas que declaram `<MetaPixel />`, e carregá-lo no site inteiro só para medir um
clique ampliaria o rastreamento de todas as páginas, o que é decisão do dono e não
efeito colateral de métrica. Solução: o evento disparado onde não há Pixel fica numa
fila no `sessionStorage` (teto de 10) e é entregue ao chegar em `/teste-gratis`, que já
carrega o Pixel, marcado com `adiado: true`. Componente `EventosPendentes` faz o
descarregamento. Verificado no navegador: `fbq` ausente na home, presente no funil, e
a chamada `trackCustom free_trial_cta_clicked {local:"header", adiado:true}` chegando
na fila do `fbq` com o `sessionStorage` limpo depois.

**`npm run test:responsivo` voltou ao verde sem afrouxar o critério.** A falha era real:
o link "Política de Privacidade" dentro do consentimento do quiz tinha alvo de toque de
15px (35px quando quebrava em duas linhas), contra os 44px que o teste exige. Corrigido
com `py-4` no próprio `<a>`: preenchimento vertical em caixa **inline** não entra no
cálculo da linha, então a área de toque vai a 47px sem mover nada. Medido antes e depois
em 390, 768 e 1440: parágrafo, cartão e `scrollHeight` do documento idênticos ao pixel.
O mesmo padrão existe nas LPs de nicho (`lp/FormularioLead.tsx`), fora do alcance de
qualquer teste hoje; não mexido para não misturar escopo.

**Auditoria de CTA fechada.** Passaram a apontar para `/teste-gratis`, com o `local` indo
para `origem.utm_content`: `ComoFunciona`, `CrmKanban`, calculadora de `/api-oficial`,
heros de `/assistente-ia` e `/disparos`, e os cartões de plano de `PlanosHome` e
`TabelaPlanos` (`local="plano-{id}"`, então o contexto do plano sobrevive). Continuam no
WhatsApp, com motivo: `Nichos` e `PorteEmpresa` (mensagem pré-preenchida qualifica mais
que o formulário), `CompanyAiCta`/`CompanyAiHero` (oferta diferente), link secundário do
`Contato` e do próprio formulário (caminho humano, exigido pelo fluxo da IA), quiz e LPs
(funis próprios de tráfego pago), `ModalLead` da calculadora (carrega os números da
simulação), `StructuredData` e `/privacidade` (canal institucional). Login e botões
flutuantes intocados. O teste de navegação cobre 13 CTAs no funil e 3 canais preservados.

⚠️ **Risco assumido nos cartões de plano:** quem está em `/planos` pronto para comprar
agora passa por formulário e espera alguns minutos, em vez de cair direto no WhatsApp.
Se a conversão de `/planos` cair, é o primeiro lugar a reverter.

**Documentos de ativação criados:** `docs/ativacao-teste-gratis.md` (template com os três
payloads, envs com `[PREENCHER_NO_COOLIFY]`, URL do webhook, cron do Coolify, contrato do
`IA_HANDOFF_URL`, comandos da migration e roteiro de homologação em 16 passos) e
`docs/jade-teste-gratis.md` (conteúdo pronto para a base da Jade). **A base da Jade não
foi alterada:** o MCP `fazer-ai` não está conectado nesta sessão e a base é produção.

### 2026-08-25 — Homologação contra Postgres real: dois bugs que só apareceriam em produção

Rodado contra um Postgres 16 exclusivo de homologação (container efêmero, nunca o banco
de produção). Os testes de unidade estavam todos verdes e não pegariam nenhum dos dois.

**1. `on conflict (chave)` era SQL inválido para um índice parcial.** O índice de
`teste_gratis_eventos` é `unique (chave) where chave is not null`; o Postgres só o usa na
inferência do conflito se o predicado aparecer também no `on conflict`. Sem ele, **todo**
insert de evento estourava. Como `registrarEvento` engole a exceção e devolve `true`, o
efeito seria mudo e caro: nenhum evento gravado, nenhuma trilha de auditoria e, pior, a
deduplicação do webhook desligada — cada reentrega da Meta seria processada como resposta
nova, e a IA seria acordada de novo a cada uma. Corrigido para
`on conflict (chave) where chave is not null do nothing`.

O log do catch agora começa com `TRILHA DE EVENTOS indisponível`, para o alarme ser
procurável. O `return true` continua de propósito: sem gravação não dá para saber se o
evento é repetido, e processar duas vezes é menos grave do que engolir a primeira.

**Causa raiz do bug ter passado:** o teste de banco tinha SQL próprio, parecido com o do
repositório. Testava a cópia. Reescrito para chamar as **funções reais** de
`src/lib/teste-gratis` (34 verificações), então divergência assim não passa mais.

**2. O limite por IP era contornável com um cabeçalho.** `ipDaRequisicao` lia o
**primeiro** item de `x-forwarded-for`. O Traefik *acrescenta* o IP real ao que o cliente
mandou, então o primeiro item é justamente o valor forjado: bastava variar o cabeçalho a
cada tentativa para nunca fechar o balde. Corrigido para preferir `x-real-ip` e, na
ausência dele, ler o **último** item da cadeia. Coberto por teste que reprova a leitura do
primeiro item. Pressupõe que só o Traefik fala com a aplicação, que é o caso no Coolify;
expor a porta 3000 direto devolveria o problema.

**Ensaio ponta a ponta sem a Meta:** `tests/homologacao-funil.mjs` (`npm run
test:homologacao`) sobe um provedor de envio e um endpoint de IA falsos, assina os
eventos como a Meta assina e percorre 64 verificações. Resultado: 64/64. Confirmado
também que nem o log do site nem a trilha de eventos carregam telefone, e-mail ou
segredo: no caminho de erro o destino aparece como `*********7777`.

**Não executado por falta de acesso:** publicar em homologação, aprovar o template no
WhatsApp Manager, apontar o webhook real e aplicar `docs/jade-teste-gratis.md` na base.

### 2026-08-25 — Contingência do payload dos botões deixou de ser bloqueio

O plano de ativação previa: "se o WhatsApp Manager não expuser o campo de payload,
pare e ajuste `intencao.ts`". Verificando o código, o `payload` desconhecido já caía
na leitura de texto livre e os três textos dos botões acertavam por coincidência das
listas `RECUSA`/`ADIAMENTO`/`ACEITE`. Coincidência não é garantia: bastava alguém
editar uma dessas listas para o opt-out por botão quebrar em silêncio.

Tornado explícito com o mapa `TEXTO_DOS_BOTOES` em `intencao.ts`, consultado tanto
para o `payload` quanto para o texto. Comportamento idêntico ao anterior, agora
protegido por 4 casos de unidade e por um cenário ponta a ponta ("sem payload") que
prova o opt-out chegando pelo texto visível.

**Efeito prático:** o template pode ser submetido na Meta dos dois jeitos, e a
aprovação deixa de depender de a interface expor o campo de payload. O que não pode
mudar é o **texto** dos botões, que agora é contrato: mexer nele exige atualizar
`TEXTO_DOS_BOTOES` junto.

### 2026-08-25 — Modo somente captação e a chave `FREE_TRIAL_WHATSAPP_ENABLED`

O template foi criado na Meta pela Graph API (id `1421557873209367`, `pt_BR`, enviado
como `UTILITY` com `allow_category_change=true`) e está **PENDING**. Billing não
confirmado, e o token usado na criação foi exposto em texto puro: **comprometido, não
reutilizar**. O funil precisava de um estado intermediário publicável, e ele não existia.

**Chave geral criada, nascendo desligada.** `FREE_TRIAL_WHATSAPP_ENABLED` só liga com o
valor exato `true`; ausente, vazia ou qualquer outra coisa significa não enviar. Um
interruptor que protege disparo para cliente não pode depender de alguém lembrar de
desligá-lo.

**A trava é dupla, de propósito:**
- na **captação**, nenhum job é criado (evento `free_trial_captacao_sem_envio`);
- na **fila**, nenhum job é reivindicado (`resumo.envioDesligado = true`).

Barrar na captação é o que impede que ligar a chave depois dispare de uma vez a fila
inteira de quem se cadastrou enquanto ela estava desligada. Barrar na fila sem
reivindicar é o que permite desligar no meio de um incidente sem consumir tentativa de
ninguém.

**A copy acompanha o estado.** `conteudo.ts` tem duas versões e a página, que é
componente de servidor, escolhe uma: com envio promete "em alguns minutos"; sem envio
promete o canal e o assunto, nunca o prazo. Teste garante que a versão sem envio não
contém "minutos", "imediat", "em breve" nem "assim que". Sem isso a publicação em modo
captação viraria a mesma armadilha de site prometendo o que o sistema não entrega.

**Erro 131042 (billing) entrou como permanente.** É recuperável, mas só depois de alguém
arrumar o pagamento no Business Manager, o que não acontece em minutos. Sem isso cada
lead gastaria cinco tentativas com backoff enquanto a conta está bloqueada.

**Dois defeitos encontrados nesta rodada:**
1. `copyDoFunil` devolvia uma função (`sucessoDetalhe(whatsapp)`) passada como prop de
   servidor para cliente. Função não atravessa a fronteira RSC e o **build quebrou** —
   `tsc` e `lint` passaram. Virou string com `{whatsapp}` e um `detalheDoSucesso` no
   cliente. Lição: mudança em prop de fronteira exige `npm run build`, não só `tsc`.
2. A própria auditoria vazava o nome completo do lead: `mascarar(nome, 0)` caía em
   `slice(-0)`, que devolve a string inteira.

**`npm run auditoria`** (`tests/auditoria-pos-deploy.mjs`) é a verificação pós-deploy:
somente leitura, pode rodar contra produção, confere que a página não promete prazo, que
os CTAs levam ao funil, que o caminho humano continua no ar, que o worker recusa chamada
sem token e responde `envioDesligado`, que nenhum job nasceu, que nenhum evento de envio
existe e que o lead enviado à mão foi gravado inteiro. Saída mascara nome, e-mail e
telefone. Validado: 25/25.

### 2026-08-25 — Publicação em modo somente captação + incidente de 8 dias resolvido

**O site estava perdendo lead em silêncio desde 17/08 às 14:33.** A porta pública do
Postgres foi fechada em algum momento, mas o `DATABASE_URL` da aplicação continuava
apontando para `72.60.152.110:5435`: `ECONNREFUSED`, 26 ocorrências no log, `leads_site`
com **0 linhas**. Atingia o quiz `/comecar` e as quatro LPs de nicho, não só o funil novo.
Descoberto ao conferir os pré-requisitos da publicação, não por monitoramento.

**Corrigido pela raiz.** Os dois containers estão na mesma rede `coolify` e o nome interno
agora resolve (Coolify subiu de 4.1.2 para 4.3.9), o que fecha a pendência registrada em
2026-08-06. `DATABASE_URL` passou a
`postgres://***:***@zodw9ve89i8c3m0hspu3qhqy:5432/leads_site?sslmode=disable`. A porta
pública fica fechada: o banco deixou de estar exposto na internet.

**Como alterar variável no Coolify por fora do painel:** o valor é cifrado com a APP_KEY
(payload Laravel), então escrever direto no `environment_variables` corrompe. O caminho é
`docker exec coolify php artisan tinker` mexendo pelo modelo `EnvironmentVariable`.

**As "duplicatas" de `LEAD_WEBHOOK_*` não eram erro.** O Coolify cria uma contrapartida
com `is_preview=true` para cada variável. Alarme falso meu; fica registrado para não
custar investigação de novo.

**Publicado.** Commit `3980fb6` em `origin/main`, redeploy só da `site-companychat`
(applicationId 3, uuid `rk7m8v4yjc9q4d7vu0jfae2c`), imagem na tag `3980fb6…`, deploy
`finished`. As 10 rotas públicas respondem 200, `/teste-gratis` deixou de dar 404, zero
5xx, zero erro de conexão, e os outros 35 containers da VPS ficaram intactos. Confirmado
que a aplicação voltou a gravar: o evento da validação que disparei chegou na tabela.

**Migration aplicada** no `leads_site` com backup prévio em
`/root/backups/leads-site-pre-teste-gratis-2026-08-25-1742.sql.gz` (gzip íntegro, tabela
estava vazia por causa do incidente). Três tabelas e os dois índices únicos conferidos.

⚠️ **Não existe backup externo.** Nenhum `s3_storages` cadastrado e zero agendamentos de
backup em toda a instância do Coolify — para nenhum banco, não só este. O backup que criei
mora na própria VPS: protege contra erro de operação, não contra perder a máquina. Antes
de receber lead real, cadastrar um S3 e agendar backup diário do `leads-site`.

**Defeito corrigido na auditoria:** ela reprovava um deploy recém-publicado porque exigia
`free_trial_captacao_sem_envio > 0`, que só existe depois do primeiro lead. Zero ali
significa "ninguém se cadastrou ainda", não "captação quebrada". A verificação passou para
dentro do bloco que só roda quando há lead.

### 2026-08-26 — Identidade v3: a marca ganhou símbolo, e com ele o favicon

Origem: `Marketing/Logomarca/Modelo v3` no Google Drive. O wordmark não mudou (os dois
arquivos entregues são byte a byte iguais aos que já estavam em `public/brand/`); o que
mudou é que **agora existe um símbolo aprovado** — o "balão em destaque", um balão de
conversa à frente de um quadrado arredondado. A v2 proibia símbolo explicitamente, e era
por causa dessa proibição que o site não tinha favicon de verdade.

- **A assinatura principal passou a ser símbolo + wordmark** (`568 × 72`). `Logo.tsx`
  aponta para `companychat-logo-balao-destaque-{dark,light}.svg`. A largura subiu de
  145/160 para 165/182 px: o wordmark ocupa 500 das 568 unidades, então essa é a
  compensação exata para o nome continuar do mesmo tamanho óptico do header publicado.
- **O favicon é o símbolo na variante `dark-green`** (balão `#00C896` sobre `#075F4C`,
  em quadrado `#071011`). Os arquivos vieram prontos e não foram regerados. Entraram
  pelas convenções do App Router — `src/app/favicon.ico`, `icon.svg`, `apple-icon.png` —
  para o Next emitir as tags `<link>` sozinho, sem metatag manual.
- **Manifest virou rota** (`src/app/manifest.ts`) em vez de arquivo estático, pelo mesmo
  motivo: o Next injeta o `<link rel="manifest">`. `theme_color`, `background_color` e o
  `themeColor` do `layout.tsx` são todos `#071011`, igual ao fundo do ícone.
- **Ícones não são `maskable`.** O balão chega perto da borda do quadrado e a máscara
  circular do Android cortaria a ponta da cauda.
- **O `logo` do JSON-LD passou a apontar para o PNG de 512** e não para `/icon.svg`: o
  Google quer dimensões conhecidas, e o Next serve o `icon.svg` numa URL com hash que
  muda a cada build.
- **O "C" desenhado no mock do Hero saiu.** A foto de perfil da conversa era uma inicial
  em círculo com gradiente — marca recriada, o que o manual proíbe. Agora usa o símbolo
  oficial, que é exatamente o que o cliente vê no WhatsApp de verdade.
- **`/privacidade` estava com a variante escura sobre fundo claro.** No arquivo escuro o
  balão e a palavra `Company` são `#F5F7F6`; sumiam por completo. Passou a usar `<Logo />`.
  Uma varredura das 16 rotas (30 ocorrências da marca) confirmou que era o único caso.

### 2026-08-26 — A marca invisível na `/privacidade` era a ponta de um bug maior

Trocar a variante do logo revelou que **a política de privacidade inteira estava
ilegível em produção**. A página usa o fundo claro do `body`, mas carregava os tokens de
modo escuro de uma versão anterior: `text-dark-text` é `#F5F7F6` sobre `#F5F7F6` — o
texto simplesmente não existia na tela. `text-dark-muted` dava 1,4:1.

Pesava mais do que parece: é a página que a revisão de anúncios da Meta abre, e o link
vive em todos os formulários de captura.

- **Convertida para os tokens claros:** `text-foreground` nos títulos e nos `<strong>`,
  `text-text-secondary` no corpo (6,49:1), `border-card-border` na borda do cabeçalho.
  O card escuro do fim da página ficou como estava — ali os tokens `dark-*` são os certos,
  e o comentário no arquivo já dizia isso.
- **`hover:text-primary` virou `hover:text-primary-text`** no link "Voltar ao site": o
  verde vivo dá 2,16:1 sobre fundo claro, e um hover não pode piorar a leitura.

**Varredura de contraste nas 16 rotas** (pixel real medido, não cor computada) para
garantir que não havia outro caso da mesma família. Achou mais um:

- **CRM Kanban, coluna "Oportunidade Perdida":** branco sobre `bg-red-500` do Tailwind =
  3,82:1, abaixo dos 4,5:1 que os 12 px pedem. Passou a `bg-accent-error` (`#C73546`, o
  vermelho semântico do guia) = 5,22:1. Foi o único resto da migração de paleta que ainda
  usava cor crua do Tailwind num par que reprovava.
- **Estados de erro dos formulários** medidos à parte, porque só existem depois de uma
  submissão inválida e nenhuma varredura de página os alcança: de 4,52:1 a 8,49:1, todos
  passam. Os das LPs passam raspando — se o vermelho mudar, medir de novo.

**Sobre a ferramenta de auditoria:** medir cor computada em vez de pixel dá falso positivo
em massa. Elemento `fixed` tem ancestral no DOM que não é o que está atrás dele na tela;
`transition-colors` anima a cor de teste; `whileInView` do Framer Motion re-dispara ao
rolar até o elemento. O que funcionou: `reducedMotion: "reduce"` no contexto do Playwright
(o site tem `MotionConfig reducedMotion="user"`, então tudo chega no estado final),
transições desligadas por CSS, cor transparente aplicada ao elemento **e aos filhos**, e
`scrollIntoView` antes de medir. Mesmo assim, `<strong>` inline que quebra em duas linhas
devolve um `boundingBox` que cobre o parágrafo inteiro e a amostra cai no texto do pai —
o único "achado" restante em `/calculadora` é esse artefato, conferido a olho.

---

### 2026-08-26 — Preço sai do site: venda é consultiva, valor só no diagnóstico

O dono vende sistema personalizado. O preço na vitrine ancorava a conversa antes de ele ver
a operação do cliente e prejudicava o pitch. **Nenhum valor de plano aparece mais no site.**

- **Removidos:** `src/app/planos/`, `src/components/planos/` (com `planos-data.ts`) e
  `src/components/PlanosHome.tsx`. A home foi de 14 para 13 seções: `Garantias` → `FAQ`
- **`/planos` responde 308** para `/teste-gratis?origem=planos` (`next.config.ts`). Link antigo,
  anúncio e resultado de busca não caem em 404, e a origem fica rastreável no funil
- **Menu e rodapé** perderam o item "Planos"; `Contato` trocou "Conheça os planos" por uma
  linha sobre proposta com escopo e valor fechados; `Nichos` aponta para `#contato`;
  `CompanyAiCta` aponta para `/assistente-ia`
- **"Quanto custa?" foi reescrito em 5 FAQs** (home + `lp-adv`, `lp-seguros`, `lp-empresas`,
  `lp-saude`): o valor sai depois do diagnóstico, sem taxa de setup e sem fidelidade
- **Fonte única de preço não existe mais.** Se um dia o preço voltar ao site, ele volta a
  `planos-data.ts` — o arquivo está no histórico do git, não foi reescrito
- **Base da Jade:** o documento 6 (Planos e preços) ainda tinha R$ 497 quando esta mudança
  foi aplicada. Site e base divergentes já causaram problema real antes

---

### 2026-08-26 — O site não tem deploy automático: o repositório está sem webhook

Três commits de `main` ficaram sete horas fora do ar sem ninguém notar, incluindo o que
tirava o preço da vitrine. O sintoma que puxou o fio foi outro: `/favicon.ico`,
`/apple-icon.png`, `/manifest.webmanifest` e `/icons/*.png` respondiam 404 em produção
mesmo estando commitados.

- **Causa:** `gh api repos/eusoualessandrolima/companychat-ia-site/hooks` devolve `[]`.
  O Coolify tem `is_auto_deploy_enabled = true` e guarda o secret do webhook, mas o GitHub
  nunca chama ninguém. **Todo deploy que já aconteceu foi disparado à mão pelo painel.**
- **O que estava no ar:** container criado 15:12 com o commit `1b2eb33` (12:58). Faltavam
  `165d215` (verde antigo), `86ed4f3` (favicon e identidade v3) e `036546b` (preço fora)
- **Resolvido na hora:** deploy manual disparado, HEAD `036546b` publicado, os seis assets
  voltaram a 200 e o R$ 497 saiu da home. O webhook **não** foi criado — decisão do dono
- **O `R$ 2.500` e o `R$ 4.000` que sobram no HTML da home não são preço:** são valores de
  negociação dos cards fictícios do mock em `CrmKanban.tsx` (linhas 57 e 65). Quem for
  auditar "preço sumiu do site" com `grep 'R\$'` vai tropeçar neles

**Onde o site roda de verdade:** VPS Hostinger `72.60.152.110` (KVM 4, Ubuntu 24.04 com
Coolify), painel em `https://coolify.companychatia.com.br`, aplicação id 3, uuid
`rk7m8v4yjc9q4d7vu0jfae2c`. O domínio aponta direto para esse IP.

---

## Aprendizados e Padrões

- Tailwind v4 não usa `tailwind.config.js` — toda configuração fica em `globals.css`
- Ícones via Lucide React exclusivamente (não misturar com outras bibliotecas)
- Estrutura de componentes: um arquivo `.tsx` por seção da landing page
- Animações via Framer Motion — não usar CSS puro para animações complexas
- CSS variables para tokens de cor e tipografia — centralizar em `globals.css`
- ~~Verificação de deploy: usar `vercel ls`~~ — **o site não roda mais na Vercel.** Desde a migração para o Coolify, a checagem é `docker ps --filter name=rk7m8v4yjc9q4d7vu0jfae2c --format "{{.Image}}"` na VPS: a tag da imagem **é** o SHA do commit publicado. As menções a "cadastrar no Vercel" nos Próximos Passos são anteriores à migração e devem ser lidas como "cadastrar no painel do Coolify"
- "Está no ar" exige três evidências, todas fora da máquina local: working tree limpo, HEAD publicado no remoto e o container ativo com a tag igual a esse commit. Em 2026-08-03 uma sessão registrou o hero como publicado tendo verificado só o `localhost`; o trabalho ficou quatro dias parado sem commit. Em 2026-08-26 o inverso aconteceu — commit e push corretos, deploy nunca disparado (ver o incidente do webhook ausente)
- Assets estáticos que respondem 404 em produção mas existem no repositório quase nunca são bug de código: são build antigo. `public/` e os arquivos especiais de `src/app/` entram na imagem, então um 404 neles prova que a imagem no ar é anterior ao commit que os adicionou. Confirme pela tag do container antes de investigar o `Dockerfile`
- Botões e links de header ou de par lado a lado precisam de `whitespace-nowrap`, senão quebram em duas linhas em 768px e em cards estreitos
- Validação visual: use o build de produção numa porta dedicada (`npx next start -p 3005`). O servidor de desenvolvimento recarrega a página na primeira compilação, o que derruba a captura do MCP do Chrome e esconde os elementos animados por Framer Motion
- Elemento `fixed` no canto inferior direito cobre conteúdo em telas estreitas: em 390px, qualquer bloco centralizado com mais de ~262px passa por baixo. Não adianta caçar a seção "culpada" — resolve-se encolhendo o que está fixo (foi o que fizemos com os botões de WhatsApp em 2026-08-15)
- Componente compartilhado que exporta constantes **e** um componente interativo precisa se dividir: com `"use client"` no topo, quem roda no servidor recebe referência de cliente no lugar do valor. Padrão do projeto: constantes num módulo neutro em `src/lib/`, o componente reexporta para os consumidores de cliente
- Há um overflow horizontal de 14px em larguras ≤768px vindo de um bloco `.group relative flex gap-6 border-b border-card-border py-8` (não é do Hero — reproduz igual com o Hero antigo). `npm run test:responsivo` não pega porque só percorre `/comecar`
- Para medir contraste no navegador, **não** dá para fazer parse da string de `getComputedStyle().color`: o Tailwind v4 devolve `oklch()` e um parser ingênuo lê como RGB, produzindo razões falsas perto de 1.0. Pinte a cor num canvas 1×1 e leia com `getImageData` — funciona com qualquer sintaxe de cor
- Três CTAs reprovam contraste AA no Lighthouse (Header, Nichos, Contato) e o do Hero também: branco sobre `#00ab7a` dá 2.95:1. É o estilo de botão primário do site inteiro. O mockup do hero novo resolve com texto **escuro** (`#06120f`) sobre o verde, que dá ~7:1 — decisão de marca pendente

---

### 2026-08-27 — Auditoria da `/lp-empresas`: o consentimento que não existia e a entrega cega ao CRM

Auditoria ponta a ponta da LP em produção, do link público ao CRM. Relatório completo
em `auditoria-lp-empresas-2026-08-27/RELATORIO.md`, fora do repositório.

**Veredito: PASS COM RESSALVAS.** O caminho `LP → banco → painel → CRM` está comprovado
ponta a ponta, e com os **dois leads reais** do dia em vez de um lead sintético. Eles
estão em `portal.companychatia.com.br/negocios`, coluna **Lead novo**, um card cada,
origem `/lp-empresas` e segmento idênticos ao banco. `13:20:04 UTC` no banco = `10:20`
no comentário do CRM: **sincronização abaixo de um minuto**.

**A idempotência do receptor foi comprovada na prática**, e não por leitura de código:
cada lead dispara **dois** POSTs (nascer e clicar no WhatsApp) e virou **um** card, com
os dois eventos como comentários separados. Isso encerra a dúvida que estava registrada
como "não verificável".

**O que ainda falta para um PASS limpo:** os dois leads entraram às 09:19 e 10:20, e o
deploy das correções foi às 14:57 — ou seja, **o E2E comprovado é o do código anterior**.
O payload novo é aditivo (`consentimento*` e `origem.tipo`), a expectativa é que nada
quebre, mas expectativa não é evidência. Um lead de teste com UTMs depois do deploy fecha isso.

**As UTMs chegam ao card do CRM, mas só duas das quatro.** Descoberto sem gastar lead:
dois cards antigos de teste da `/10-empresas` foram enviados com UTM, e o comentário
deles traz `• Campanha: selecao10` (de `utm_campaign`) e `• Origem: teste-lead` (de
`utm_source`). **`utm_medium`, `utm_content` e `fbclid` não aparecem** — ficam só no
`origem` do banco. Quem montar campanha contando com `utm_medium` no card vai procurar
por algo que não existe. Ressalva: os dois cards vieram da candidatura, e o formato do
comentário difere entre as superfícies — o ramo das LPs de anúncio ainda não foi
observado com UTM.

**O CRM não tem responsável, tags nem campanha no card.** Os campos são mensalidade,
implementação, produto, conexões de WhatsApp, contato e comentários. Não é perda de dado
no caminho — é ausência de funcionalidade.

**Dois cards de teste antigos poluem o funil:** `TESTE CLAUDE APAGAR` e `TESTE Claude
Code`. O contador anuncia 6 negócios onde há 4 reais. Não foram removidos — excluir
registro alheio exige autorização específica.

**O que a LP faz certo, verificado e não presumido:** ela não mente. Forçando a rota a
responder `entregue: false`, a tela mostra erro em vez de sucesso e **não dispara**
`fbq('track','Lead')`. Testado com um stub de `fetch` que captura e descarta — nenhum
byte sai para o servidor e nenhum lead é criado. É o teste mais barato do funil e o que
mais protege o orçamento de anúncio; vale repetir a cada mudança no formulário.

**Dois achados ALTOS, ambos corrigidos e publicados** (`ba83e4f` e `fa9dcf4`):

- **O consentimento das LPs de anúncio nunca existiu.** A guarda criada em 26/08 para a
  candidatura era condicionada a `origem.tipo === "candidatura"`; as LPs não mandavam
  `tipo` nenhum e passavam direto, enquanto `/privacidade` prometia guardar "a data, a
  hora e a versão do texto que você aceitou". Os dois leads que já estavam no banco têm
  `origem = {pagina, segmento}` e mais nada. **A regra foi para `src/lib/aceite.ts`** —
  `test:unidade` só compila `src/lib/`, e regra que não pode ser testada é regra que se
  perde na próxima superfície nova. Foi literalmente o que aconteceu aqui.
- **A entrega no CRM era cega.** Com o banco gravando, o webhook saía por `after()` e o
  resultado era descartado: falhar ali não produzia nada além de um `console.error` em
  logs que ninguém coleta — o container tinha 4 linhas em 72 h. Lead no painel, nenhum
  card, ninguém sabe. Agora `crm_entregue_em` carimba a primeira entrega, e nulo num
  lead contatável significa exatamente uma coisa. A consulta de divergência está no
  rodapé de `db/leads_site.sql`.

**Ainda aberto:** o webhook do CRM continua com **uma tentativa só**, sem retry (o
carimbo torna a perda visível, não a evita). Os 3 leads antigos seguem sem aceite e sem
carimbo — a primeira consulta de divergência traz falsos positivos até normalizar.

**`.env.local` aponta para o banco de produção** (`72.60.152.110:5435/leads_site`).
Qualquer `npm run dev` ou `db:verificar` escreve na base real de leads. O que segura hoje
é o firewall — a porta não responde de fora, verificado. Não é a configuração.

**`NEXT_PUBLIC_META_PIXEL_ID_EMPRESAS` não existe no Coolify**, então a `/lp-empresas`
cai no Pixel global (`2435925136900956`, confirmado na requisição para
`facebook.com/tr/`). Medição existe; separação por campanha, não. Coerente com a decisão
de 25/08 para a `/10-empresas` — se for a mesma decisão aqui, o parâmetro sai do código.

**Contraste da LP: sem problema, ao contrário do que a varredura sugeriu.** Os CTAs usam
texto escuro `rgb(7,16,17)` sobre o verde `rgb(0,200,150)` = **8,89:1**, folgado no AA.
O 2,95:1 anotado nas convenções é do estilo antigo (branco sobre `#00ab7a`) e não vale
para esta LP. Um heurístico que subia a árvore parando em `glass-card-dark`
(`rgba(255,255,255,0.04)`) acusou 30 falsos positivos — a nota das convenções sobre medir
contraste com canvas em vez de parse de string continua valendo, e a armadilha do fundo
quase transparente é a segunda metade dela.

**A branch `redesign/10-empresas` está obsoleta:** o PR #1 foi mergeado por rebase, e
`main` já tem todo o conteúdo dela com hashes diferentes. Trabalho novo sai de
`origin/main`, não dela.

---

## Próximos Passos

### Deploy (o automático está quebrado)

- [ ] **Criar o webhook no GitHub** — enquanto não existir, todo merge em `main` exige
      deploy manual pelo painel. Payload URL
      `https://coolify.companychatia.com.br/webhooks/source/github/events/manual`,
      evento `push`; o secret já existe no Coolify (aplicação id 3, Configuration →
      Webhooks). Adiado por decisão do dono em 2026-08-26
- [x] ~~Mergear o PR #1~~ → mergeado por rebase em 2026-08-26; a branch
      `redesign/10-empresas` ficou obsoleta e `main` tem todo o conteúdo dela
- [x] ~~PR #2 (auditoria da `/lp-empresas`)~~ → mergeado e publicado em 2026-08-27.
      Deploy manual via `queue_application_deployment` no tinker do container `coolify`
      (não existe `app:deploy` no artisan da 4.3.11); container ativo em `fa9dcf4`
- [ ] **Webhook do CRM sem retry** — uma tentativa, 8 s de timeout. `crm_entregue_em`
      mostra quem ficou para trás; falta o reprocessador que reenvia. O receptor é
      idempotente pelo `id`, então reenviar é seguro
- [ ] **Um lead de teste com UTMs depois do deploy de 27/08** — é o único item que
      separa o PASS COM RESSALVAS de um PASS limpo. Responde duas perguntas de uma vez:
      se o payload novo (`consentimento*` + `origem.tipo`) continua sendo aceito pelo
      receptor, e se as UTMs aparecem no card. Falta o telefone da equipe e a confirmação
      de que as automações de WhatsApp estão desligadas para o lead de QA
- [ ] **Limpar `TESTE CLAUDE APAGAR` e `TESTE Claude Code`** da coluna Lead novo
- [ ] **Tirar o `.env.local` de cima do banco de produção** — hoje só o firewall separa
      um `npm run dev` da base real de leads
- [x] ~~Favicon, manifest e ícones 404 em produção~~ → era build antigo; resolvido com o
      deploy manual de `036546b` em 2026-08-26

### Campanha `/10-empresas` (antes de divulgar)

- [x] ~~Regras comerciais do FAQ~~ → definidas pelo dono em 2026-08-25 (implantação
      inicial gratuita dentro do escopo, extras à parte, sem contratação automática)
- [x] ~~Pixel próprio da campanha~~ → descartado: reutiliza o Pixel global
- [x] ~~Indexação~~ → `noindex` e fora do sitemap enquanto for campanha temporária
- [ ] **Confirmar `DATABASE_URL` e `LEAD_WEBHOOK_URL` no painel do deploy antes de
      publicar.** Não são observáveis de fora (server-side) e o banco não aceita
      conexão de fora da VPS. Sem nenhum dos dois, a candidatura passa a mostrar erro
      em vez de sucesso falso — comportamento correto, mas ninguém quer descobrir com
      a campanha no ar. O painel `/leads` autenticado avisa quando o banco falta.
- [ ] **Encerramento da campanha é manual.** Se o deploy for em 25/08/2026, o prazo
      de 30 dias vence em **24/09/2026 23h59 (Brasília)** — nada no código fecha
      sozinho. Virar `CAMPANHA_ENCERRADA` para `true` em
      `src/components/dez-empresas/conteudo.ts` e publicar. Procedimento completo em
      `docs/jade-campanha-10-empresas.md`, seção "Período da campanha e como encerrar".
- [ ] **Aprovar `docs/jade-campanha-10-empresas.md`** e só então aplicar na base da Jade,
      para ela não desconhecer a seleção nem prometer condição diferente da página

### Funil de teste grátis (bloqueantes para o funil ir ao ar)

- [ ] Rodar `npm run db:verificar` contra o Postgres de produção para criar as três
      tabelas de `db/teste_gratis.sql`
- [ ] Submeter o template `companychat_teste_gratis_recebido_v1` no WhatsApp Manager,
      com os três botões e os `payload` exatos de `docs/funil-teste-gratis.md`
- [ ] Cadastrar no Coolify as credenciais do provedor de envio (Cloud API ou webhook),
      `WHATSAPP_APP_SECRET`, `WHATSAPP_WEBHOOK_VERIFY_TOKEN` e `TESTE_GRATIS_WORKER_TOKEN`
- [ ] Apontar o webhook do WhatsApp para `/api/whatsapp/webhook` e assinar os campos
      `messages` (mensagens e status)
- [ ] Criar a Scheduled Task no Coolify chamando `/api/teste-gratis/worker` a cada minuto
      (ou ligar `TESTE_GRATIS_WORKER_INTERNO=true` como paliativo)
- [ ] Configurar `IA_HANDOFF_URL` e ajustar o agente para o roteiro e as regras da seção
      "A conversa da IA" em `docs/funil-teste-gratis.md`
- [ ] **Aplicar `docs/jade-teste-gratis.md` na base da Jade** (documento novo + complemento
      do documento 6), antes de o funil receber tráfego. Conteúdo pronto; falta autorização
      e o MCP `fazer-ai` conectado
- [ ] Rodar `TESTE_GRATIS_DB=1 npm run test:banco` quando existir banco de homologação
- [ ] Seguir `docs/ativacao-teste-gratis.md` na ordem da seção 8
- [x] ~~`free_trial_cta_clicked` na home não chegava ao Meta~~ → resolvido com a fila de
      eventos adiados, sem carregar o Pixel no site inteiro
- [ ] Avaliar aplicar o mesmo ajuste de alvo de toque do link de privacidade nas LPs de
      nicho (`lp/FormularioLead.tsx`), que têm o mesmo padrão e nenhum teste cobrindo

### Anteriores

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
