const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Dev par defaut pour voir les changements en direct sur le domaine.
// Mettre FORCE_DEV=0 pour revenir en mode production sans modifier ce fichier.
const forceDev = process.env.FORCE_DEV !== '0';
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
