const distPath = path.resolve(import.meta.dirname, "../..", "dist", "public");
app.use(express.static(distPath));
app.use("*", (_req, res) => res.sendFile(path.resolve(distPath, "index.html")));

