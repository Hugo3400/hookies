const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Force production mode - always use the compiled .next build on this server.
// To run in dev mode locally, use `npm run dev` directly instead.
const dev = false;
const app = next({
  dev,
  distDir: '.next',
});
const handle = app.getRequestHandler();
const handleUpgrade = app.getUpgradeHandler();

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Necessaire en mode dev pour que le client Next se connecte a /_next/webpack-hmr.
  server.on('upgrade', (req, socket, head) => {
    handleUpgrade(req, socket, head);
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT} (Mode: ${dev ? 'DÉVELOPPEMENT 🚀' : 'PRODUCTION'})`);
  });
});
