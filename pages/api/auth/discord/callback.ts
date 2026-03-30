import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { generateToken } from '@/lib/auth/auth';
import { notifyWelcome } from '@/lib/notifications';

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || '';
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || 'https://hookies.nexadev.fr/api/auth/discord/callback';
const SITE_URL = process.env.SITE_URL || 'https://hookies.nexadev.fr';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, error: discordError, error_description } = req.query;

  // Discord redirige avec ?error= si le scope ou la config est invalide
  if (discordError) {
    console.error('[Discord OAuth] Erreur retournée par Discord:', discordError, error_description);
    return res.redirect(`${SITE_URL}/espace-client?error=discord_rejected&detail=${encodeURIComponent(String(error_description || discordError))}`);
  }

  if (!code || typeof code !== 'string') {
    return res.redirect(`${SITE_URL}/espace-client?error=missing_code`);
  }

  try {
    // Échanger le code contre un access token
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!tokenRes.ok) {
      console.error('Discord token error:', await tokenRes.text());
      return res.redirect(`${SITE_URL}/espace-client?error=discord_token`);
    }

    const tokenData = await tokenRes.json();

    // Récupérer les infos de l'utilisateur Discord
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userRes.ok) {
      console.error('Discord user error:', await userRes.text());
      return res.redirect(`${SITE_URL}/espace-client?error=discord_user`);
    }

    const discordUser = await userRes.json();
    const discordId = discordUser.id;
    const discordTag = discordUser.username;

    // Chercher ou créer l'utilisateur en base
    let user = await prisma.user.findUnique({ where: { discordId } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          discordId,
          discordTag,
          name: discordUser.global_name || discordUser.username,
          role: 'CLIENT',
          discordAccessToken: tokenData.access_token,
          discordRefreshToken: tokenData.refresh_token || null,
        },
      });

      // Notification de bienvenue in-app
      notifyWelcome(user.id, user.name).catch(() => {});
    } else {
      // Mettre à jour le tag Discord et les tokens OAuth
      await prisma.user.update({
        where: { id: user.id },
        data: {
          discordTag,
          discordAccessToken: tokenData.access_token,
          discordRefreshToken: tokenData.refresh_token || user.discordRefreshToken,
        },
      });
    }

    if (!user.isActive) {
      return res.redirect(`${SITE_URL}/espace-client?error=account_disabled`);
    }

    // Générer un JWT
    const jwt = generateToken(user.id, user.role);

    // Rediriger vers l'espace client avec le token
    return res.redirect(`${SITE_URL}/espace-client?token=${jwt}`);
  } catch (err) {
    console.error('Discord OAuth error:', err);
    return res.redirect(`${SITE_URL}/espace-client?error=server_error`);
  }
}
