#!/usr/bin/env bash
# Dispara quando um arquivo de conteúdo comercial do site é editado.
# Objetivo: lembrar que a base de conhecimento da Jade (agente em produção no WhatsApp)
# foi extraída desses arquivos e NÃO se atualiza sozinha.

set -uo pipefail

payload=$(cat)
arquivo=$(printf '%s' "$payload" | jq -r '.tool_input.file_path // .tool_response.filePath // empty' 2>/dev/null)

[ -z "$arquivo" ] && exit 0

# Arquivos que alimentam a base de conhecimento da Jade
case "$arquivo" in
  *planos-data.ts|*pricing.ts|*Faq.tsx|*FAQ.tsx|*Planos*.tsx|*Incluso.tsx|*TabelaPlanos.tsx\
  |*Capacidades.tsx|*Recursos.tsx|*NossasSolucoes.tsx|*Servicos.tsx|*Categorias.tsx\
  |*Janela24h.tsx|*Nichos.tsx|*Hero.tsx|*Beneficios.tsx|*Solucao.tsx|*ComoFunciona.tsx\
  |*company-ai-data.ts|*CompanyAi.tsx|*OqueConstruimos.tsx|*ComoTrabalhamos.tsx|*Origem.tsx)
    nome=$(basename "$arquivo")
    jq -n --arg n "$nome" '{
      systemMessage: ("Conteúdo comercial alterado (" + $n + "). A base de conhecimento da Jade não se atualiza sozinha."),
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        additionalContext: ("O arquivo " + $n + " alimenta a base de conhecimento do agente Jade, que está em produção no WhatsApp da CompanyChat IA. Se preço, prazo, o que está incluso ou descrição de produto mudou, ofereça ao usuário atualizar a base: tenant companychat-ia, knowledge base id 2, documentos 6 (Planos e preços), 7 (Assistente de IA), 8 (API Oficial), 9 (Disparo e CRM) e 13 (Company AI: consultoria e projetos sob medida). Use as ferramentas MCP fazer-ai. Se a mudança foi só visual (estilo, animação, layout), não há o que atualizar.")
      }
    }'
    ;;
esac

exit 0
