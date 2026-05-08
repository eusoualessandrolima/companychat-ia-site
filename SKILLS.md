# SKILLS.md — Catálogo de Skills do Projeto

> Inventário de todas as skills disponíveis neste projeto. Atualizar sempre que uma skill for adicionada ou modificada.

---

## Stack do Projeto

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Next.js | 16.1.6 | Framework principal |
| React | 19.2.3 | UI library |
| TypeScript | ^5 | Tipagem estática |
| Tailwind CSS | ^4 | Utilitários de estilo |
| Framer Motion | ^12.34.3 | Animações e transições |
| Lucide React | ^0.575.0 | Biblioteca de ícones |

---

## Skills Disponíveis

| Nome | Localização | Descrição |
|------|-------------|-----------|
| `frontend-design` | `.agents/skills/frontend-design/SKILL.md` | Criação de interfaces frontend de alta qualidade. Evita estética genérica de IA — fontes distintas, composição espacial criativa, animações significativas. Use para criar ou melhorar componentes, páginas e layouts. |

---

## Estrutura de uma Skill

```
.agents/skills/
└── {nome-da-skill}/
    └── SKILL.md
```

### Frontmatter obrigatório

```yaml
---
name: nome-da-skill
description: Descrição objetiva. Quando usar, o que faz, para que serve.
license: Complete terms in LICENSE.txt
---
```

### Regras
- Nome em kebab-case
- Uma skill por pasta
- Description deve responder: "use quando..." e "faz o quê"
- Nunca criar skill duplicada — verifique esta tabela primeiro

---

## Como Adicionar uma Nova Skill

1. Crie a pasta: `.agents/skills/{nome}/`
2. Crie o arquivo: `.agents/skills/{nome}/SKILL.md` com frontmatter correto
3. Adicione uma linha na tabela "Skills Disponíveis" acima
4. Registre a decisão em `MEMORY.md`
