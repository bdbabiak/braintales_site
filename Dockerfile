FROM node:20-alpine
WORKDIR /app

# Use pnpm (match what corepack downloaded earlier)
RUN corepack enable && corepack prepare pnpm@10.18.1 --activate

# 1) Copy lock + manifest (for layer caching)
COPY package.json pnpm-lock.yaml ./

# 2) Copy pnpm patches BEFORE install (so patchedDependencies can resolve)
# If you have a 'patches' folder in the repo (you do), copy it now:
COPY patches ./patches

# 3) Install dependencies (resolves patchedDependencies)
RUN pnpm install --frozen-lockfile

# 4) Copy the rest of the source
COPY . .

# 5) Build (your root build already runs: vite build -> dist/public and esbuild -> dist/index.js)
RUN pnpm run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Server bundle path per your build logs
CMD ["node", "dist/index.js"]
