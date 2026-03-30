import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { withStaffAuth } from '@/lib/auth/middleware';
import { AuthenticatedRequest } from '@/lib/auth/middleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
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
      });
      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}

export default withStaffAuth(handler);
