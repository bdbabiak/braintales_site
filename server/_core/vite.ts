// server/_core/vite.ts
import path from "path";
import fs from "fs";
import express from "express";

export function serveStatic(app: express.Express) {
  // Always use the top-level dist/public produced by Vite
  const distPath = path.resolve(import.meta.dirname, "../..", "dist", "public");

  if (!fs.existsSync(distPath)) {
    console.error(`Could not find the build directory: ${distPath}, make sure to build the client first`);
  }

  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

