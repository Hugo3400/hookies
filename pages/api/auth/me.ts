import type { NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { generateToken } from '@/lib/auth/auth';
import { withAuth, AuthenticatedRequest } from '@/lib/auth/middleware';

function buildAuthCookie(req: AuthenticatedRequest, token: string) {
  const forwardedProto = Array.isArray(req.headers['x-forwarded-proto'])
    ? req.headers['x-forwarded-proto'][0]
    : req.headers['x-forwarded-proto'];
  const isHttps = String(forwardedProto || '').toLowerCase() === 'https';

  return [
    `hookies_auth_token=${encodeURIComponent(token)}`,
    'Path=/',
    'SameSite=Lax',
    'Max-Age=86400',
    ...(isHttps ? ['Secure'] : []),
  ].join('; ');
}

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Methode non autorisee' });
  }

  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Session invalide' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Utilisateur non autorise' });
    }

    const token = generateToken(user.id, user.role);
    res.setHeader('Set-Cookie', buildAuthCookie(req, token));

    return res.status(200).json({ user, token });
  } catch (error) {
    console.error('Erreur auth/me:', error);
    return res.status(500).json({ error: 'Erreur interne' });
  }
}

export default withAuth(handler);
