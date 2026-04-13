import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { withStaffAuth } from '@/lib/auth/middleware';
import { AuthenticatedRequest } from '@/lib/auth/middleware';
import { notifyOrderStatus } from '@/lib/notifications';
import { maskEmail } from '@/lib/auth/auth';
import { logAction } from '@/lib/admin/logger';
import { sendOrderStatusWebhook } from '@/lib/discordWebhooks';

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

    const VALID_STATUSES = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERING', 'DELIVERED', 'COMPLETED', 'CANCELLED'];
    if (!id || !status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'id et status valide requis' });
    }

    try {
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status },
        include: { user: { select: { id: true, name: true } } },
      });

      // Log
      logAction({
        actorId: req.user?.userId,
        actorName: null,
        actorRole: req.user?.role,
        action: 'ORDER_STATUS_CHANGED',
        target: `Commande #${(updatedOrder as any).orderNumber}`,
        details: `Statut → ${status} | Client: ${(updatedOrder as any).user?.name ?? 'Anonyme'}`,
        req,
      });

      // Notification in-app
      const oUser = (updatedOrder as any).user;
      if (oUser?.id) {
        notifyOrderStatus(oUser.id, (updatedOrder as any).orderNumber, status).catch(() => {});
      }

      sendOrderStatusWebhook({
        orderNumber: (updatedOrder as any).orderNumber,
        status,
        customerName: (updatedOrder as any).user?.name ?? 'Anonyme',
        actorRole: req.user?.role ?? 'STAFF',
      }).catch(() => {});

      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'id requis' });

    try {
      const order = await prisma.order.findUnique({
        where: { id },
        select: { id: true, orderNumber: true, status: true, user: { select: { name: true } } },
      });
      if (!order) return res.status(404).json({ error: 'Commande introuvable' });

      await prisma.order.delete({ where: { id } });

      logAction({
        actorId: req.user?.userId,
        actorRole: req.user?.role,
        action: 'ORDER_DELETED',
        target: `Commande #${(order as any).orderNumber}`,
        details: `Statut: ${order.status} | Client: ${(order as any).user?.name ?? 'Anonyme'}`,
        req,
      });

      sendOrderStatusWebhook({
        orderNumber: (order as any).orderNumber,
        status: 'DELETED',
        customerName: (order as any).user?.name ?? 'Anonyme',
        actorRole: req.user?.role ?? 'STAFF',
      }).catch(() => {});

      return res.status(200).json({ success: true, id, orderNumber: (order as any).orderNumber });
    } catch (error) {
      return res.status(500).json({ error: 'Erreur suppression commande' });
    }
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}

export default withStaffAuth(handler);
