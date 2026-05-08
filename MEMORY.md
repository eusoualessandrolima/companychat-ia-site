# MEMORY.md — Memória Persistente do Projeto

> Registro de contexto, decisões, histórico e próximos passos. Atualizar sempre que houver decisão relevante.

---

## Contexto do Projeto

**Projeto:** Site institucional / landing page da CompanyChat IA
**Propósito:** Apresentar a plataforma de atendimento automatizado via WhatsApp com IA para empresas brasileiras
**Audiência-alvo:** Donos de pequenas e médias empresas (clínicas, academias, imobiliárias, advocacia, etc.)
**Status atual:** Em desenvolvimento ativo

---

## Stack Técnica

| Tecnologia | Versão | Papel |
|------------|--------|-------|
| Next.js | 16.1.6 | Framework principal |
| React | 19.2.3 | UI library |
| TypeScript | ^5 | Tipagem |
| Tailwind CSS | ^4 | Estilização |
| Framer Motion | ^12.34.3 | Animações |
| Lucide React | ^0.575.0 | Ícones |

---

## Decisões Tomadas

### 2026-03-20
- **Criação dos arquivos de gestão:** CLAUDE.md, MEMORY.md e SKILLS.md criados na raiz do projeto para estruturar o trabalho com o Claude Code
- **Padrão de skills:** Confirmado uso de `.agents/skills/{nome}/SKILL.md` com frontmatter padronizado
- **Skill existente:** `frontend-design` — skill para criação de interfaces frontend de alta qualidade, evitando estética genérica de IA

---

## Componentes Existentes

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| Header | `Header.tsx` | Navegação principal |
| Hero | `Hero.tsx` | Seção inicial/destaque |
| Problemas | `Problemas.tsx` | Problemas que a plataforma resolve |
| Servicos | `Servicos.tsx` | Serviços oferecidos |
| Beneficios | `Beneficios.tsx` | Benefícios da plataforma |
| Nichos | `Nichos.tsx` | Segmentos de mercado atendidos |
| Sobre | `Sobre.tsx` | Sobre a empresa |
| FAQ | `FAQ.tsx` | Perguntas frequentes |
| Contato | `Contato.tsx` | Formulário/CTA de contato |
| Footer | `Footer.tsx` | Rodapé |
| Logo | `Logo.tsx` | Componente de logo |
| WhatsAppButton | `WhatsAppButton.tsx` | Botão flutuante do WhatsApp |

---

## Aprendizados e Padrões

- Projeto usa Tailwind v4 (sem `tailwind.config.js` — configuração via CSS diretamente)
- Animações com Framer Motion estão disponíveis como dependência
- Ícones via Lucide React (não usar outras bibliotecas de ícones)
- Estrutura de componentes: um arquivo por seção da landing page

---

## Próximos Passos

- [ ] Revisar e documentar o estado atual dos componentes existentes
- [ ] Verificar se há componentes que precisam de melhorias de design
- [ ] Avaliar necessidade de novas skills além de `frontend-design`

---

## Histórico de Sessões

### Sessão 2026-03-20
- Criação da estrutura de gestão (CLAUDE.md, MEMORY.md, SKILLS.md)
- Mapeamento dos componentes existentes
- Identificação da stack técnica completa
