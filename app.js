const { createServer } = require('http');
const { parse } = require('url');
const fs = require('fs');
const path = require('path');
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
const MAINTENANCE_FLAG = path.join(__dirname, '.maintenance-flag');

function isMaintenanceEnabled() {
  if (process.env.MAINTENANCE_MODE === 'true') return true;
  try {
    return fs.readFileSync(MAINTENANCE_FLAG, 'utf-8').trim() === 'true';
  } catch {
    return false;
  }
}

const BYPASS_PREFIXES = [
  '/maintenance',
  '/admin',
  '/_next',
  '/images',
  '/da',
  '/api/admin/',
  '/api/auth/',
  '/api/public/',
];
const BYPASS_EXACT = new Set(['/favicon.ico', '/favicon.png', '/robots.txt', '/sitemap.xml']);

function shouldBypass(pathname) {
  if (BYPASS_EXACT.has(pathname)) return true;
  for (const prefix of BYPASS_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(prefix)) return true;
  }
  return false;
}

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const pathname = parsedUrl.pathname || '/';

    if (isMaintenanceEnabled() && !shouldBypass(pathname)) {
      if (pathname.startsWith('/api')) {
        res.writeHead(503, {
          'Content-Type': 'application/json',
          'Retry-After': '3600',
        });
        res.end(JSON.stringify({ error: 'Service indisponible pour maintenance', maintenance: true }));
        return;
      }
      res.writeHead(302, { Location: '/maintenance' });
      res.end();
      return;
    }

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
