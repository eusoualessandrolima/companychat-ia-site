# CLAUDE.md — Instruções para o Claude Code

> Leia este arquivo, MEMORY.md e SKILLS.md no início de cada sessão antes de qualquer trabalho.

## Sobre este projeto

Site institucional/landing page da **CompanyChat IA** — plataforma de atendimento automatizado via WhatsApp com IA.

- **Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide React
- **Raiz do código:** `companychat-ia-site/`
- **Estrutura de componentes:** `src/components/` (um componente por seção da página)
- **Página principal:** `src/app/page.tsx`

---

## Regras de trabalho

### Leitura obrigatória no início de cada sessão
1. `CLAUDE.md` — este arquivo (instruções)
2. `MEMORY.md` — contexto persistente e histórico de decisões
3. `SKILLS.md` — catálogo de skills e stack do projeto

### Criação e gestão de skills
- Skills ficam em `.agents/skills/{nome-da-skill}/SKILL.md`
- Toda skill deve ter frontmatter com: `name`, `description`, `license`
- Nomes de skills em kebab-case (ex: `frontend-design`, `copy-review`)
- Ao criar uma nova skill, registre-a na tabela do `SKILLS.md`
- Nunca duplique skills existentes — verifique antes de criar

### Padrão de frontmatter para SKILL.md
```yaml
---
name: nome-da-skill
description: Descrição objetiva do que a skill faz e quando usá-la.
license: Complete terms in LICENSE.txt
---
```

### Código
- Prefira editar arquivos existentes em vez de criar novos
- Siga os padrões já estabelecidos nos componentes existentes
- Use Tailwind v4 (sem `tailwind.config.js` — configuração via CSS)
- Framer Motion para animações; Lucide React para ícones
- TypeScript estrito — sem `any` implícito
- Componentes em PascalCase, arquivos em PascalCase.tsx

### Estilo e design
- A skill `frontend-design` define o padrão estético do projeto
- Evite fontes genéricas (Inter, Roboto, Arial, system fonts)
- Evite gradientes roxos em fundo branco — clichê de IA
- Cada componente deve ter identidade visual coesa com o todo
- Paleta e tokens devem usar CSS variables

### Atualizações de memória
- Sempre que uma decisão importante for tomada, atualizar `MEMORY.md`
- Sempre que uma nova skill for criada, atualizar `SKILLS.md`
- Manter `MEMORY.md` com próximos passos atualizados

### Commits
- Usar conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, `style:`
- Mensagens em português são aceitas

---

## Estrutura do projeto

```
companychat-ia-site/
├── src/
│   ├── app/
│   │   ├── globals.css       # Estilos globais e variáveis CSS
│   │   ├── layout.tsx        # Layout raiz
│   │   └── page.tsx          # Página principal (monta todas as seções)
│   └── components/
│       ├── Header.tsx
│       ├── Hero.tsx
│       ├── Problemas.tsx
│       ├── Servicos.tsx
│       ├── Beneficios.tsx
│       ├── Nichos.tsx
│       ├── Sobre.tsx
│       ├── FAQ.tsx
│       ├── Contato.tsx
│       ├── Footer.tsx
│       ├── Logo.tsx
│       └── WhatsAppButton.tsx
├── public/
├── .agents/skills/           # Skills do projeto
│   └── frontend-design/
│       └── SKILL.md
├── CLAUDE.md                 # Este arquivo
├── MEMORY.md                 # Memória persistente
├── SKILLS.md                 # Catálogo de skills
└── package.json
```

---

## Comandos úteis

```bash
npm run dev      # Inicia servidor de desenvolvimento (localhost:3000)
npm run build    # Build de produção
npm run lint     # Verificação de lint (ESLint)
```
