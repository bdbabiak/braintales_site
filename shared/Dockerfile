# Use glibc-based Node to match esbuild's linux-x64 binary
FROM node:20-bookworm-slim
WORKDIR /app

# Optional: certs & minimal tooling
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# pnpm
RUN corepack enable && corepack prepare pnpm@10.18.1 --activate

# 1) Copy manifests for layer cache
COPY package.json pnpm-lock.yaml ./

# 2) Copy pnpm patches BEFORE install (you have patches/wouter@3.7.1.patch)
COPY patches ./patches

# 3) Allow build scripts so esbuild/tailwind-oxide can install their native binaries
RUN pnpm config set ignore-scripts false \
 && pnpm config set allow-scripts "@esbuild/.*" "@tailwindcss/oxide" \
 && pnpm install --frozen-lockfile

# 4) Copy the rest
COPY . .

# 5) Build: Vite -> dist/public, esbuild -> dist/index.js
RUN pnpm run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Start the bundled server (per your build logs)
CMD ["node", "dist/index.js"]
