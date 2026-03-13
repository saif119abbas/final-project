FROM --platform=linux/amd64 node:22-slim AS builder

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production image
FROM node:22-slim AS runtime
WORKDIR /usr/src/app

# Copy built dist
COPY --from=builder /usr/src/app/dist ./dist
# Copy package files
COPY --from=builder /usr/src/app/package*.json ./
# Copy drizzle config and schema files
COPY --from=builder /usr/src/app/drizzle.config.ts ./
COPY --from=builder /usr/src/app/src ./src

RUN npm ci --only=production && npm cache clean --force

USER node
CMD ["node", "dist/api.js"]
