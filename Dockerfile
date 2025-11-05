# ---- simple one-stage build & run ----
FROM node:20-alpine
WORKDIR /app

# Use pnpm; adjust the version if Render logs show a different one
RUN corepack enable && corepack prepare pnpm@10.18.1 --activate

# Copy lockfile + root package.json first for better layer caching
COPY package.json pnpm-lock.yaml ./

# Install workspace deps (your root package.json/lock already references client/server)
RUN pnpm install --frozen-lockfile

# Copy the rest of the source
COPY . .

# Build both client and server as your package.json currently does:
# "build": "vite build && esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"
RUN pnpm run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Your build logs show the bundled server entry is dist/index.js
CMD ["node", "dist/index.js"]
