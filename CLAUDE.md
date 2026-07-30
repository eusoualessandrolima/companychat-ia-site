# CLAUDE.md — Instruções para o Claude Code

> **Leitura obrigatória no início de cada sessão:** leia este arquivo, `MEMORY.md`, `SKILLS.md` e `Agentes.md` antes de qualquer trabalho.

---

## Sobre o projeto

Site institucional / landing page da **CompanyChat IA** — plataforma de atendimento automatizado via WhatsApp com IA para pequenas e médias empresas brasileiras.

- **Stack:** Next.js · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide React
- **Raiz do código:** `companychat-ia-site/`
- **Componentes:** `src/components/` — um componente por seção da página
- **Página principal:** `src/app/page.tsx`

---

## Leitura obrigatória no início de cada sessão

| Arquivo | O que contém |
|---------|-------------|
| `CLAUDE.md` | Regras de trabalho, convenções e padrões do projeto |
| `MEMORY.md` | Contexto persistente, decisões tomadas e próximos passos |
| `SKILLS.md` | Catálogo de skills disponíveis e stack técnica |
| `Agentes.md` | Agentes disponíveis, quando ativar e responsabilidades |

Nunca inicie trabalho sem ler os quatro arquivos.

---

## Regras de código

- Prefira editar arquivos existentes — nunca crie arquivos desnecessários
- Siga os padrões já estabelecidos nos componentes existentes
- **Tailwind v4** — sem `tailwind.config.js`; configuração via CSS (`globals.css`)
- **Framer Motion** para animações; **Lucide React** para ícones (sem outras bibliotecas)
- TypeScript estrito — proibido `any` implícito
- Componentes em PascalCase, arquivos em `PascalCase.tsx`
- Sem comentários óbvios — apenas quando o "porquê" não é evidente pelo código

---

## O site alimenta a Jade (agente em produção)

O conteúdo comercial deste site é a **fonte de verdade** da base de conhecimento da **Jade**, o
agente de IA que atende o WhatsApp oficial da CompanyChat IA (+55 64 9305-4630). Ela consulta essa
base antes de falar de preço, prazo, o que está incluso, API Oficial e disparo.

**A base não se atualiza sozinha.** Sempre que mudar preço, prazo, o que está incluso, condição
comercial ou descrição de produto, ofereça ao usuário atualizar a base logo depois de aplicar a
mudança no código. Um hook em `.claude/hooks/avisar-base-jade.sh` avisa automaticamente quando um
arquivo de conteúdo comercial é editado.

Arquivos que alimentam a base: `components/planos/planos-data.ts`, `components/api-oficial/pricing.ts`,
os cinco blocos de FAQ, `Capacidades.tsx`, `Recursos.tsx`, `NossasSolucoes.tsx`, `Categorias.tsx` e
os componentes de `components/company-ai/` (incluindo `company-ai-data.ts`).

Como atualizar (ferramentas MCP `fazer-ai`, tenant `companychat-ia`):

| Documento | id | Conteúdo |
|---|---|---|
| Planos e preços | 6 | valores, o que inclui, sob medida, regras comerciais |
| Assistente de IA | 7 | capacidades e dúvidas comuns |
| API Oficial e custo por mensagem | 8 | janela de 24h, categorias, preços da Meta |
| Disparo em massa e CRM Kanban | 9 | campanhas, templates, relatórios |
| Company AI | 13 | consultoria em IA e projetos sob medida, e a diferença para o plano Sob medida |

Use `knowledge_document_create` para substituir o conteúdo e confirme que os documentos voltam ao
estado `READY` com `knowledge_documents_list`. Divergência entre site e base já causou problema real:
a Jade dizia que a implantação era cobrada enquanto o site prometia inclusa.

O contexto completo do agente está em
`~/.claude/Projetos Claude/alessandro-lima/criar-atendimentov2/`.

---

## Regras de design

- A skill `frontend-design` define o padrão estético deste projeto
- **Proibido:** fontes genéricas (Inter, Roboto, Arial, system fonts)
- **Proibido:** gradientes roxos em fundo branco — clichê de IA
- Cada componente deve ter identidade visual coesa com o restante da página
- Paleta e tokens via CSS variables em `globals.css`
- Animações com propósito — não adicionar motion decorativo sem intenção

---

## Criação e gestão de skills

### Localização
```
.agents/skills/{nome-da-skill}/SKILL.md
```

### Nomenclatura
- Nome em **kebab-case** (ex: `copy-review`, `seo-audit`, `analytics-setup`)
- Sem abreviações ambíguas
- Nome deve descrever a função, não a tecnologia

### Frontmatter obrigatório
```yaml
---
name: nome-da-skill
description: Descrição objetiva. Responde "use quando..." e "faz o quê".
license: Complete terms in LICENSE.txt
---
```

### Processo de criação
1. Verifique `SKILLS.md` — nunca duplique skill existente
2. Crie a pasta: `.agents/skills/{nome}/`
3. Crie `SKILL.md` com frontmatter correto e conteúdo da skill
4. Adicione linha na tabela de `SKILLS.md`
5. Registre a decisão em `MEMORY.md`

---

## Atualização dos arquivos de gestão

| Evento | Ação obrigatória |
|--------|-----------------|
| Decisão arquitetural tomada | Atualizar `MEMORY.md` — seção Decisões |
| Nova skill criada | Atualizar `SKILLS.md` + registrar em `MEMORY.md` |
| Componente criado ou removido | Atualizar tabela de componentes em `MEMORY.md` |
| Novo agente adicionado ao projeto | Atualizar `Agentes.md` |
| Sessão encerrada | Atualizar próximos passos em `MEMORY.md` |

---

## Commits

Usar conventional commits em português ou inglês:

```
feat: adicionar seção de depoimentos
fix: corrigir overflow no mobile do Hero
style: ajustar espaçamento na seção Beneficios
chore: atualizar MEMORY.md com decisões da sessão
docs: atualizar SKILLS.md com nova skill
```

---

## Estrutura do projeto

```
companychat-ia-site/
├── src/
│   ├── app/
│   │   ├── globals.css          # Estilos globais e variáveis CSS
│   │   ├── layout.tsx           # Layout raiz
│   │   └── page.tsx             # Página principal
│   └── components/
│       ├── Header.tsx
│       ├── Hero.tsx
│       ├── Integracoes.tsx
│       ├── Problemas.tsx
│       ├── ComoFunciona.tsx
│       ├── Servicos.tsx
│       ├── Beneficios.tsx
│       ├── Nichos.tsx
│       ├── Sobre.tsx
│       ├── FAQ.tsx
│       ├── Contato.tsx
│       ├── Footer.tsx
│       ├── Logo.tsx
│       ├── CountUp.tsx
│       ├── WhatsAppButton.tsx
│       └── api-oficial/         # Componentes da página /api-oficial
├── public/
├── .agents/
│   └── skills/
│       └── frontend-design/
│           └── SKILL.md
├── CLAUDE.md      # Este arquivo — instruções para o Claude Code
├── MEMORY.md      # Memória persistente do projeto
├── SKILLS.md      # Catálogo de skills
├── Agentes.md     # Agentes disponíveis no projeto
└── package.json
```

---

## Comandos úteis

```bash
npm run dev      # Servidor de desenvolvimento (localhost:3000)
npm run build    # Build de produção
npm run lint     # Verificação ESLint
```
