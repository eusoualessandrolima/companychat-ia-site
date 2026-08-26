# Imagem do site para o Coolify. Três estágios para a imagem final levar
# só o servidor compilado, sem node_modules de build.

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# O Next precisa das devDependencies para compilar, então não dá para omitir
# o grupo inteiro. O Playwright (usado só em tests/responsivo.mjs) baixaria
# ~150 MB de browsers no postinstall: aqui só o pacote é instalado.
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variáveis com prefixo NEXT_PUBLIC_ são embutidas no JavaScript durante o
# build, não lidas em tempo de execução: precisam chegar aqui. No Coolify,
# marque cada uma como "Build Variable".
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_WHATSAPP_NUMBER
ARG NEXT_PUBLIC_WHATSAPP_SUPORTE
ARG NEXT_PUBLIC_LOGIN_URL
ARG NEXT_PUBLIC_META_PIXEL_ID
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_WHATSAPP_NUMBER=$NEXT_PUBLIC_WHATSAPP_NUMBER \
    NEXT_PUBLIC_WHATSAPP_SUPORTE=$NEXT_PUBLIC_WHATSAPP_SUPORTE \
    NEXT_PUBLIC_LOGIN_URL=$NEXT_PUBLIC_LOGIN_URL \
    NEXT_PUBLIC_META_PIXEL_ID=$NEXT_PUBLIC_META_PIXEL_ID \
    NEXT_TELEMETRY_DISABLED=1

RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
# `TZ` porque o container roda em UTC por padrão, e tudo que o servidor
# formata (a exportação CSV do painel, hoje) sairia três horas adiantado —
# um lead das 21h virava meia-noite do dia seguinte. O banco continua
# guardando `timestamptz`; isto muda só como o servidor apresenta.
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    TZ=America/Sao_Paulo \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
