# Banco dos leads

Os leads capturados em `/comecar` e no funil de `/teste-gratis` ficam num Postgres
próprio, na VPS com Coolify, no mesmo banco e com a mesma `DATABASE_URL`.

| Arquivo | Tabelas | De quem |
|---|---|---|
| `leads_site.sql` | `leads_site` | quiz `/comecar` e LPs de nicho |
| `teste_gratis.sql` | `teste_gratis_leads`, `teste_gratis_jobs`, `teste_gratis_eventos` | funil de teste grátis |

O `npm run db:verificar` aplica os dois. O DDL do funil é todo `if not exists`,
então rodar de novo é inofensivo e serve para publicar índice novo.

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

Se preferir criar as tabelas na mão:

```bash
psql "postgresql://postgres:SENHA@SEU_HOST:PORTA/companychat" -f db/leads_site.sql
psql "postgresql://postgres:SENHA@SEU_HOST:PORTA/companychat" -f db/teste_gratis.sql
```

## Variável de ambiente

Na Vercel (**Settings → Environment Variables**) e no `.env.local`:

```
DATABASE_URL=postgresql://postgres:SENHA@SEU_HOST:PORTA/companychat?sslmode=require
```

Sem essa variável o quiz continua funcionando e o lead segue para o WhatsApp,
mas nada é gravado e o painel `/leads` avisa que o banco não está configurado.

No funil de teste grátis a ausência da variável tem um custo maior: a página
continua respondendo e mostra a confirmação, mas o lead não é persistido e o
follow-up não é agendado, porque o agendamento **é** a linha no banco. O log do
container registra `DATABASE_URL ausente, solicitação não persistida`.

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
