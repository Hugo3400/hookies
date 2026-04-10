import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

function firstHeaderValue(value: string | string[] | undefined): string {
  if (!value) return '';
  if (Array.isArray(value)) return value[0] || '';
  return value.split(',')[0]?.trim() || '';
}

function isLocalHost(value: string): boolean {
  return /localhost|127\.0\.0\.1/i.test(value);
}

function normalizeHost(rawHost: string): string {
  const host = rawHost.trim().toLowerCase();
  if (!host || host.includes('/') || host.includes(' ')) return '';
  return host;
}

function getBaseUrl(req: NextApiRequest): string {
  const configured = (process.env.APP_URL || process.env.NEXTAUTH_URL || '').trim();
  const requestHost = normalizeHost(firstHeaderValue(req.headers['x-forwarded-host']) || firstHeaderValue(req.headers.host));
  const forwardedProto = firstHeaderValue(req.headers['x-forwarded-proto']).toLowerCase();
  const proto = forwardedProto === 'http' || forwardedProto === 'https' ? forwardedProto : 'https';

  if (configured) {
    try {
      const configuredUrl = new URL(configured);
      const configuredOrigin = configuredUrl.origin.replace(/\/$/, '');
      const configuredHost = normalizeHost(configuredUrl.host);

      // Prefer explicit non-localhost origin from env in production.
      if (!isLocalHost(configuredHost)) {
        return configuredOrigin;
      }

      // If env is localhost but request clearly targets a public host, trust request host.
      if (requestHost && !isLocalHost(requestHost)) {
        return `${proto}://${requestHost}`;
      }

      return configuredOrigin;
    } catch {
      // Ignore invalid configured URL and fallback to request-derived origin.
    }
  }

  if (!requestHost) {
    throw new Error('Host manquant pour construire l\'URL Discord OAuth.');
  }
  return `${proto}://${requestHost}`;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Methode non autorisee' });
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  if (!clientId) {
    return res.status(500).json({ error: 'DISCORD_CLIENT_ID manquant' });
  }

  const baseUrl = getBaseUrl(req);
  const redirectUri = `${baseUrl}/api/auth/discord/callback`;
  const state = crypto.randomBytes(24).toString('hex');
  const protoHeader = req.headers['x-forwarded-proto'];
  const secure = (typeof protoHeader === 'string' && protoHeader.includes('https')) || baseUrl.startsWith('https://');

  const cookie = [
    `discord_oauth_state=${state}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=600',
    secure ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ');

  res.setHeader('Set-Cookie', cookie);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'identify email',
    state,
    prompt: 'consent',
  });

  return res.redirect(`https://discord.com/oauth2/authorize?${params.toString()}`);
}
