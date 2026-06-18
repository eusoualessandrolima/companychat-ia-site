# Agentes.md — Agentes Disponíveis no Projeto

> Catálogo de agentes e skills ativáveis neste projeto. Atualizar sempre que um novo agente ou skill for adicionado.

---

## Como Ativar

### Skills locais do projeto
Skills ficam em `.agents/skills/{nome}/SKILL.md` e são ativadas via slash command no Claude Code:

```
/frontend-design
```

### Skills globais do Claude Code
Ativadas via `/skill-name` — disponíveis em qualquer projeto.

### Agentes AIOX (quando o contexto exige)
Ativados com `@nome-do-agente` ou `/AIOX:agents:nome`:

```
@dev      → implementação de código
@qa       → revisão de qualidade
@ux-design-expert  → decisões de UI/UX
```

---

## Agentes e Skills deste Projeto

### Skills Locais

| Nome | Comando | Quando Usar |
|------|---------|-------------|
| `frontend-design` | `/frontend-design` | Criar ou melhorar qualquer componente, seção ou layout. Garante alta qualidade estética, evitando padrões genéricos de IA. |

---

### Skills Globais Relevantes para este Projeto

| Nome | Comando | Quando Usar |
|------|---------|-------------|
| `ui-ux-pro-max` | `/ui-ux-pro-max` | Decisões avançadas de UX, fluxo de usuário, hierarquia visual |
| `copy-chief` | `/copy-chief` | Melhorar textos da landing page — headlines, CTAs, microcopy |
| `stop-slop` | `/stop-slop` | Revisar e eliminar escrita genérica ou fraca no conteúdo |
| `text-quality` | `/text-quality` | Auditoria de qualidade textual em qualquer seção |
| `brainstorming` | `/brainstorming` | Geração de ideias para novas seções ou abordagens criativas |
| `canvas-design` | `/canvas-design` | Criação de artefatos visuais, mockups ou composições |
| `applying-brand-guidelines` | `/applying-brand-guidelines` | Garantir consistência de marca em componentes e textos |
| `tech-search` | `/tech-search` | Pesquisa de soluções técnicas, bibliotecas e padrões |
| `security-review` | `/security-review` | Revisão de segurança no código (formulários, APIs, env vars) |
| `code-review` | `/code-review` | Revisão de qualidade do código antes de commit |
| `verify` | `/verify` | Verificar que uma mudança funciona corretamente no browser |
| `run` | `/run` | Iniciar e observar a aplicação em execução |

---

### Agentes AIOX (uso contextual)

Ativar apenas quando a complexidade do trabalho justificar.

| Agente | Comando | Responsabilidade neste projeto |
|--------|---------|-------------------------------|
| `@dev` (Dex) | `@dev` | Implementação de componentes, refatoração, correção de bugs |
| `@qa` (Quinn) | `@qa` | Revisão de qualidade, testes, checklist de entrega |
| `@ux-design-expert` (Uma) | `@ux-design-expert` | Decisões de UX, wireframes, acessibilidade, design system |
| `@analyst` (Alex) | `@analyst` | Pesquisa de concorrentes, análise de mercado, benchmarks |
| `@sm` (River) | `@sm` | Criação de stories de desenvolvimento quando necessário |

---

## Quando Usar Cada Agente

### Para trabalho de front-end (mais comum neste projeto)

```
Tarefa simples (componente, ajuste visual)
  → /frontend-design  (skill local)

Tarefa de UX/fluxo complexo
  → /ui-ux-pro-max  ou  @ux-design-expert

Melhoria de copy / texto da landing
  → /copy-chief  ou  /stop-slop

Revisão antes de commitar
  → /code-review  ou  /verify
```

### Para gestão do projeto

```
Planejar próxima etapa de desenvolvimento
  → @sm  (criar story)  →  @dev  (implementar)  →  @qa  (revisar)
```

---

## Processo de Adição de Nova Skill Local

1. Criar pasta: `.agents/skills/{nome-da-skill}/`
2. Criar `SKILL.md` com frontmatter:
   ```yaml
   ---
   name: nome-da-skill
   description: Descrição objetiva. Responde "use quando..." e "faz o quê".
   license: Complete terms in LICENSE.txt
   ---
   ```
3. Adicionar linha na tabela de `SKILLS.md`
4. Adicionar linha na tabela de Skills Locais acima
5. Registrar decisão em `MEMORY.md`

---

## Histórico de Agentes

| Data | Evento |
|------|--------|
| 2026-03-10 | Skill `frontend-design` adicionada ao projeto |
| 2026-06-18 | Criação deste arquivo `Agentes.md` para centralizar o catálogo de agentes |
