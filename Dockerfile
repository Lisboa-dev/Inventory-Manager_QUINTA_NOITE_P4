# ---- build stage ----
FROM node:25.2-alpine3.21 AS builder

WORKDIR /app

# instalar dependências de forma determinística
COPY package.json package-lock.json ./
RUN npm ci

# copiar fontes e gerar artefatos (ex.: transpilação TypeScript)
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

# gerar client do Prisma e buildar
RUN npm run prisma:generate
RUN npm run build

# ---- production stage ----
FROM node:25.2-alpine3.21 AS runner
WORKDIR /app

ENV NODE_ENV=production

# instalar apenas dependências de produção
COPY package.json package-lock.json ./
RUN npm ci --production

# copiar build e client do prisma do builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 8000

# Ajuste o comando final para o seu entrypoint (ex.: node, pm2 ou outro)
CMD ["node", "dist/server.js"]
