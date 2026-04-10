import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { generateToken } from '@/lib/auth/auth';

type DiscordTokenResponse = {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
  scope: string;
};

type DiscordUserResponse = {
  id: string;
  username: string;
  discriminator?: string;
  global_name?: string | null;
  email?: string | null;
};

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

      if (!isLocalHost(configuredHost)) {
        return configuredOrigin;
      }

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

function parseCookie(req: NextApiRequest, key: string): string | null {
  const raw = req.headers.cookie;
  if (!raw) return null;
  const chunks = raw.split(';').map((item) => item.trim());
  const found = chunks.find((item) => item.startsWith(`${key}=`));
  if (!found) return null;
  return decodeURIComponent(found.slice(key.length + 1));
}

function clearStateCookie(res: NextApiResponse) {
  res.setHeader('Set-Cookie', 'discord_oauth_state=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
}

function toErrorRedirect(baseUrl: string, message: string) {
  return `${baseUrl}/espace-client?error=${encodeURIComponent(message)}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Methode non autorisee' });
  }

  const code = typeof req.query.code === 'string' ? req.query.code : '';
  const state = typeof req.query.state === 'string' ? req.query.state : '';
  const baseUrl = getBaseUrl(req);

  if (!code || !state) {
    clearStateCookie(res);
    return res.redirect(toErrorRedirect(baseUrl, 'Requete Discord invalide.'));
  }

  const savedState = parseCookie(req, 'discord_oauth_state');
  if (!savedState || savedState !== state) {
    clearStateCookie(res);
    return res.redirect(toErrorRedirect(baseUrl, 'Etat OAuth invalide. Merci de reessayer.'));
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    clearStateCookie(res);
    return res.redirect(toErrorRedirect(baseUrl, 'Configuration Discord incomplete.'));
  }

  try {
    const redirectUri = `${baseUrl}/api/auth/discord/callback`;
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }).toString(),
    });

    const tokenPayload = (await tokenResponse.json()) as DiscordTokenResponse | { error?: string };
    if (!tokenResponse.ok || !('access_token' in tokenPayload)) {
      console.error('[discord callback] token exchange failed', {
        status: tokenResponse.status,
        payload: tokenPayload,
      });
      throw new Error('Echec OAuth Discord');
    }

    const meResponse = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenPayload.access_token}` },
    });

    const me = (await meResponse.json()) as DiscordUserResponse;
    if (!meResponse.ok || !me?.id) {
      console.error('[discord callback] user info fetch failed', {
        status: meResponse.status,
        payload: me,
      });
      throw new Error('Profil Discord inaccessible');
    }

    const displayName = (me.global_name || me.username || 'Client Discord').trim().slice(0, 100);
    const discordTag = me.discriminator && me.discriminator !== '0'
      ? `${me.username}#${me.discriminator}`
      : me.username;

    let created = false;
    let user = await prisma.user.findUnique({ where: { discordId: me.id } });

    if (!user && me.email) {
      const linkedByEmail = await prisma.user.findUnique({ where: { email: me.email } });
      if (linkedByEmail) {
        user = await prisma.user.update({
          where: { id: linkedByEmail.id },
          data: {
            discordId: me.id,
            discordTag,
            discordAccessToken: tokenPayload.access_token,
            discordRefreshToken: tokenPayload.refresh_token || null,
          },
        });
      }
    }

    if (!user) {
      created = true;
      user = await prisma.user.create({
        data: {
          email: me.email || null,
          name: displayName || 'Client Discord',
          role: 'CLIENT',
          discordId: me.id,
          discordTag,
          discordAccessToken: tokenPayload.access_token,
          discordRefreshToken: tokenPayload.refresh_token || null,
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          discordTag,
          discordAccessToken: tokenPayload.access_token,
          discordRefreshToken: tokenPayload.refresh_token || null,
          ...(me.email ? { email: me.email } : {}),
        },
      });
    }

    const token = generateToken(user.id, user.role);
    const params = new URLSearchParams({ token });
    if (created) {
      params.set('needsProfile', '1');
    }

    clearStateCookie(res);
    return res.redirect(`${baseUrl}/espace-client?${params.toString()}`);
  } catch (error) {
    console.error('[discord callback] unexpected error', error);
    clearStateCookie(res);
    return res.redirect(toErrorRedirect(baseUrl, 'Connexion Discord impossible.'));
  }
}
