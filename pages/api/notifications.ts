import type { NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/auth/middleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Non authentifié' });

  if (req.method === 'GET') {
    try {
      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
      return res.status(200).json(notifications);
    } catch (error) {
      return res.status(500).json({ error: 'Erreur récupération notifications' });
    }
  }

  if (req.method === 'PATCH') {
    const { id, markAllRead } = req.body;

    try {
      if (markAllRead) {
        await prisma.notification.updateMany({
          where: { userId, isRead: false },
          data: { isRead: true },
        });
        return res.status(200).json({ success: true });
      }

      if (id) {
        await prisma.notification.update({
          where: { id },
          data: { isRead: true },
        });
        return res.status(200).json({ success: true });
      }

      return res.status(400).json({ error: 'id ou markAllRead requis' });
    } catch (error) {
      return res.status(500).json({ error: 'Erreur mise à jour notification' });
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}

export default withAuth(handler);
