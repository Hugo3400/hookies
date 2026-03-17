import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { withAuth } from '@/lib/auth/middleware';
import { AuthenticatedRequest } from '@/lib/auth/middleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Récupérer les commandes de l'utilisateur
    try {
      const orders = await prisma.order.findMany({
        where: { userId: req.user?.userId },
        include: { orderItems: { include: { menuItem: true } }, payment: true },
      });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
    }
  } else if (req.method === 'POST') {
    // Créer une nouvelle commande
    const { items, type, deliveryAddress, notes } = req.body;

    try {
      const totalPrice = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      
      const order = await prisma.order.create({
        data: {
          userId: req.user?.userId,
          orderNumber: `ORD-${Date.now()}`,
          totalPrice,
          type,
          deliveryAddress,
          notes,
          orderItems: {
            create: items.map((item: any) => ({
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: { orderItems: true },
      });

      res.status(201).json(order);
    } catch (error) {
      console.error('Erreur création commande:', error);
      res.status(500).json({ error: 'Erreur lors de la création de la commande' });
    }
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}

export default withAuth(handler);
