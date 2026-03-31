import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { withStaffAuth } from '@/lib/auth/middleware';
import { AuthenticatedRequest } from '@/lib/auth/middleware';
import { maskEmail } from '@/lib/auth/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const isWebmaster = req.user?.role === 'WEBMASTER';

  if (req.method === 'GET') {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      const [
        totalOrders,
        totalRevenue,
        totalUsers,
        totalReservations,
        todayOrders,
        todayRevenue,
        pendingOrders,
        pendingReservations,
        recentOrders,
      ] = await Promise.all([
        prisma.order.count(),
        prisma.order.aggregate({ _sum: { finalPrice: true } }),
        prisma.user.count(),
        prisma.reservation.count(),
        prisma.order.count({ where: { createdAt: { gte: today } } }),
        prisma.order.aggregate({ where: { createdAt: { gte: today } }, _sum: { finalPrice: true } }),
        prisma.order.count({ where: { status: { in: ['PENDING', 'CONFIRMED', 'PREPARING'] } } }),
        prisma.reservation.count({ where: { status: 'PENDING' } }),
        prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { name: true, email: true } },
            orderItems: { include: { menuItem: { select: { name: true } } } },
          },
        }),
      ]);

      return res.status(200).json({
        totalOrders,
        totalRevenue: totalRevenue._sum.finalPrice || 0,
        totalUsers,
        totalReservations,
        todayOrders,
        todayRevenue: todayRevenue._sum.finalPrice || 0,
        pendingOrders,
        pendingReservations,
        recentOrders: isWebmaster
          ? recentOrders
          : recentOrders.map((o: any) => ({
              ...o,
              user: o.user ? { ...o.user, email: maskEmail(o.user.email) } : o.user,
            })),
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
  }
  return res.status(405).json({ error: 'Méthode non autorisée' });
}

export default withStaffAuth(handler);

