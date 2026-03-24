FROM node:22-slim AS builder 

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
RUN npm ci --no-optional   
COPY . .
RUN npm run build
RUN npm prune --production

# ── Runtime (api + worker) ──────────────────────────────────────────
FROM node:22-slim AS runtime
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules

USER node
CMD ["node", "dist/main/api.js"]

# ── Migrate — keeps full node_modules so drizzle-kit is resolvable ──
FROM node:22-slim AS migrate
WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --no-optional                        
COPY . .
# drizzle-kit needs the source config + full node_modules, not dist