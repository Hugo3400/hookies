const { createServer } = require('http');
const { parse } = require('url');
const { fork } = require('child_process');
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

// --- Discord Bot (child process) ---
let botProcess = null;

function startBot() {
  const botPath = path.join(__dirname, 'bot', 'index.js');
  botProcess = fork(botPath, [], {
    env: { ...process.env },
    stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
  });

  botProcess.stdout.on('data', (data) => {
    console.log(`[Bot] ${data.toString().trim()}`);
  });

  botProcess.stderr.on('data', (data) => {
    console.error(`[Bot] ${data.toString().trim()}`);
  });

  botProcess.on('exit', (code) => {
    console.log(`[Bot] Processus terminé (code ${code}). Redémarrage dans 5s...`);
    setTimeout(startBot, 5000);
  });

  console.log('[Bot] Discord bot démarré (PID:', botProcess.pid, ')');
}

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

    // Démarrer le bot Discord après le serveur
    if (process.env.DISCORD_BOT_TOKEN) {
      startBot();
    } else {
      console.log('[Bot] DISCORD_BOT_TOKEN absent, bot non démarré.');
    }
  });
});
