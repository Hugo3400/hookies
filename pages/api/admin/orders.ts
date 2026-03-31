import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { withStaffAuth } from '@/lib/auth/middleware';
import { AuthenticatedRequest } from '@/lib/auth/middleware';
import { notifyOrderStatus } from '@/lib/notifications';
import { maskEmail } from '@/lib/auth/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const isWebmaster = req.user?.role === 'WEBMASTER';

  if (req.method === 'GET') {
    // Récupérer toutes les commandes (admin)
    try {
      const orders = await prisma.order.findMany({
        include: { 
          user: true,
          orderItems: { include: { menuItem: true } },
          payment: true 
        },
      });
      if (!isWebmaster) {
        return res.status(200).json(
          orders.map((o: any) => ({
            ...o,
            user: o.user ? { ...o.user, email: maskEmail(o.user.email) } : o.user,
          }))
        );
      }
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
    }
  } else if (req.method === 'PATCH') {
    // Mettre à jour une commande
    const { id, status } = req.body;

    try {
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status },
        include: { user: { select: { discordId: true } } },
      });

      // Notification in-app
      const oUser = (updatedOrder as any).user;
      if (oUser?.id) {
        notifyOrderStatus(oUser.id, (updatedOrder as any).orderNumber, status).catch(() => {});
      }

      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}

export default withStaffAuth(handler);
