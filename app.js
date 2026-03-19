const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Production par defaut pour la stabilite sur Plesk.
// Mettre FORCE_DEV=1 pour activer le mode developpement sur le domaine.
const forceDev = process.env.FORCE_DEV === '1';
const dev = forceDev || process.env.NODE_ENV !== 'production';
const app = next({
  dev,
  // Evite les conflits de permissions entre build prod (.next) et dev sur Plesk.
  distDir: dev ? '.next-dev' : '.next',
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
