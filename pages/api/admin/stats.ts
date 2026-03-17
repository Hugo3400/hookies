import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { withAdminAuth } from '@/lib/auth/middleware';
import { AuthenticatedRequest } from '@/lib/auth/middleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Récupérer les statistiques du restaurant
    try {
      const totalOrders = await prisma.order.count();
      const totalRevenue = await prisma.order.aggregate({
        _sum: { totalPrice: true },
      });
      const totalUsers = await prisma.user.count();
      const totalReservations = await prisma.reservation.count();

      res.status(200).json({
        totalOrders,
        totalRevenue: totalRevenue._sum.totalPrice || 0,
        totalUsers,
        totalReservations,
      });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}

export default withAdminAuth(handler);
