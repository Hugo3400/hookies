import type { NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { withStaffAuth, AuthenticatedRequest } from '@/lib/auth/middleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const reservations = await prisma.reservation.findMany({
        include: { user: { select: { id: true, name: true, email: true, phone: true } } },
        orderBy: { date: 'desc' },
      });
      return res.status(200).json(reservations);
    } catch (error) {
      return res.status(500).json({ error: 'Erreur récupération réservations' });
    }
  }

  if (req.method === 'PATCH') {
    const { id, status } = req.body;
    if (!id || !status) return res.status(400).json({ error: 'id et status requis' });
    try {
      const updated = await prisma.reservation.update({
        where: { id },
        data: { status },
        include: { user: { select: { id: true, name: true, email: true } } },
      });
      return res.status(200).json(updated);
    } catch (error) {
      return res.status(500).json({ error: 'Erreur mise à jour réservation' });
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}

export default withStaffAuth(handler);
