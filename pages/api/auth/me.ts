import type { NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/auth/middleware';

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
        discordId: true,
        discordTag: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Utilisateur non autorise' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Erreur auth/me:', error);
    return res.status(500).json({ error: 'Erreur interne' });
  }
}

export default withAuth(handler);
