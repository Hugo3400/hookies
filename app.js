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
const AUTH_COOKIE_NAME = 'hookies_auth_token';
const AUTHENTICATED_READ_BYPASS = new Set([
  '/api/menu-enriched',
  '/api/orders',
  '/api/reservations',
  '/api/favorites',
  '/api/user/profile',
]);

function parseCookies(req) {
  const raw = req.headers.cookie;
  if (!raw) return {};

  return raw.split(';').reduce((acc, item) => {
    const separatorIndex = item.indexOf('=');
    if (separatorIndex === -1) return acc;

    const key = item.slice(0, separatorIndex).trim();
    const value = item.slice(separatorIndex + 1).trim();
    if (!key) return acc;

    acc[key] = decodeURIComponent(value);
    return acc;
  }, {});
}

function isWebmasterRequest(req) {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim().length < 32) return false;

  const token = parseCookies(req)[AUTH_COOKIE_NAME];
  if (!token) return false;

  try {
    const payload = require('jsonwebtoken').verify(token, secret);
    return payload && typeof payload === 'object' && payload.role === 'WEBMASTER';
  } catch {
    return false;
  }
}

function hasBearerToken(req) {
  const authorization = req.headers.authorization;
  return typeof authorization === 'string' && authorization.startsWith('Bearer ') && authorization.length > 7;
}

function shouldBypassAuthenticatedRead(pathname, req) {
  const method = (req.method || 'GET').toUpperCase();
  if (method !== 'GET' && method !== 'HEAD') return false;
  if (!hasBearerToken(req)) return false;
  return AUTHENTICATED_READ_BYPASS.has(pathname);
}

function shouldBypass(pathname, req) {
  if (isWebmasterRequest(req)) return true;
  if (BYPASS_EXACT.has(pathname)) return true;
  for (const prefix of BYPASS_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(prefix)) return true;
  }
  return shouldBypassAuthenticatedRead(pathname, req);
}

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const pathname = parsedUrl.pathname || '/';

    if (isMaintenanceEnabled() && !shouldBypass(pathname, req)) {
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
