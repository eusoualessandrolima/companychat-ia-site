# Banco dos leads do quiz

Os leads capturados em `/comecar` ficam num Postgres próprio, na VPS com Coolify.
O site continua na Vercel e conecta pela internet.

## Por que não Supabase

O plano gratuito **pausa o projeto após 7 dias sem atividade**. Um anúncio rodando
no fim de semana cairia numa segunda com o banco fora do ar, e a perda de lead só
apareceria depois. A VPS já está paga e ligada.

## Criar o banco no Coolify

1. No projeto do Coolify: **New Resource → Database → PostgreSQL**
2. Nome sugerido: `companychat-leads`
3. Guarde a senha gerada
4. Em **Settings** do banco, ative o acesso externo (**Make it publicly available**)
   e anote a porta pública que o Coolify atribuiu

## Criar a tabela e testar a conexão

Um comando faz as duas coisas: conecta, cria a tabela se faltar, grava um lead
de teste, lê de volta e apaga.

```bash
npm run db:verificar -- "postgresql://postgres:SENHA@SEU_HOST:PORTA/companychat?sslmode=require"
```

Com a `DATABASE_URL` já no `.env.local`, basta `npm run db:verificar`.

Se preferir criar a tabela na mão:

```bash
psql "postgresql://postgres:SENHA@SEU_HOST:PORTA/companychat" -f db/leads_site.sql
```

## Variável de ambiente

Na Vercel (**Settings → Environment Variables**) e no `.env.local`:

```
DATABASE_URL=postgresql://postgres:SENHA@SEU_HOST:PORTA/companychat?sslmode=require
```

Sem essa variável o quiz continua funcionando e o lead segue para o WhatsApp,
mas nada é gravado e o painel `/leads` avisa que o banco não está configurado.

## Segurança

Expor o Postgres na internet exige cuidado, porque a Vercel não tem faixa fixa de
IPs para liberar no firewall:

- **Senha longa e aleatória** (32 caracteres). É a única barreira real.
- **`sslmode=require` na URL.** O código aceita certificado autoassinado do Coolify:
  a conexão continua criptografada, apenas não valida a cadeia.
- **Porta diferente da 5432**, para escapar da varredura automática.
- **Backup ligado no Coolify.** Perder a VPS é perder os leads.

Alternativa mais segura, se um dia fizer sentido: hospedar o próprio site no Coolify.
Aí o banco fica só na rede interna do Docker, sem porta nenhuma exposta.
