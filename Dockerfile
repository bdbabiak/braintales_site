FROM node:20-alpine
WORKDIR /app

# Use pnpm
RUN corepack enable && corepack prepare pnpm@10.18.1 --activate

# Copy manifests first (for layer cache)
COPY package.json pnpm-lock.yaml ./
# copy patches before install (you have `patches/wouter@3.7.1.patch`)
COPY patches ./patches

# IMPORTANT: allow build scripts so esbuild can install its binary
RUN pnpm config set ignore-scripts false \
 && pnpm config set allow-scripts "@esbuild/.*" "@tailwindcss/oxide" \
 && pnpm install --frozen-lockfile

# Now copy the rest and build
COPY . .
RUN pnpm run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "dist/index.js"]
