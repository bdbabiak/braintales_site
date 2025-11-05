# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Use pnpm (adjust if you use npm/yarn)
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

# Install deps
COPY package.json pnpm-lock.yaml ./
# If you have workspaces, copy their manifests so pnpm can resolve them:
# (these exist in your repo based on earlier zips)
COPY client/package.json server/package.json ./
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build client and server (adjust if your scripts differ)
# Typical monorepo: client outputs to client/dist; server compiles TS to server/dist
RUN pnpm -r build

# ---- Runtime stage ----
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Bring runtime files
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/drizzle ./drizzle

# The compiled server entry from your codebase:
# (earlier we verified server/_core/index.ts is the entry)
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server/dist/_core/index.js"]
