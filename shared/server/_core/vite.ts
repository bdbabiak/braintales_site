// server/_core/vite.ts
import * as path from "path";
import * as fs from "fs";
import express from "express";
import { nanoid } from "nanoid";

// Optional: only needed for dev
import { createServer as createViteServer } from "vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

// ---------- Dev setup ----------
export async function setupVite(app: express.Express, server: any) {
  const vite = await createViteServer({
    configFile: false,
    root: path.resolve(process.cwd(), "client"),
    plugins: [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime()],
    server: { middlewareMode: true, hmr: { server } },
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const templatePath = path.resolve(process.cwd(), "client", "index.html");
      let template = await fs.promises.readFile(templatePath, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}

// ---------- Production setup ----------
export function serveStatic(app: express.Express) {
  // Absolute path to your Vite build output (vite build -> dist/public)
  const distPath = path.resolve(process.cwd(), "dist", "public");

  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  // Serve static files and fallback to index.html
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}


