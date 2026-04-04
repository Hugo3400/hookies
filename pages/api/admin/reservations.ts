import type { NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { withStaffAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { notifyReservationStatus } from '@/lib/notifications';
import { maskEmail } from '@/lib/auth/auth';
import { logAction } from '@/lib/admin/logger';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const isWebmaster = req.user?.role === 'WEBMASTER';

  if (req.method === 'GET') {
    try {
      const reservations = await prisma.reservation.findMany({
        include: { user: { select: { id: true, name: true, email: true, phone: true } } },
        orderBy: { date: 'desc' },
      });
      if (!isWebmaster) {
        return res.status(200).json(
          reservations.map((r: any) => ({
            ...r,
            user: r.user ? { ...r.user, email: maskEmail(r.user.email) } : r.user,
          }))
        );
      }
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

      // Notification in-app
      if ((updated as any).user?.id) {
        const d = new Intl.DateTimeFormat('fr-FR').format(updated.date);
        notifyReservationStatus((updated as any).user.id, status, d, updated.time).catch(() => {});
      }

      if (!isWebmaster && (updated as any).user?.email) {
        (updated as any).user.email = maskEmail((updated as any).user.email);
      }

      // Log
      logAction({
        actorId: req.user?.userId,
        actorRole: req.user?.role,
        action: 'RESERVATION_STATUS_CHANGED',
        target: `Réservation #${updated.id.slice(-6).toUpperCase()}`,
        details: `Statut → ${status} | Client: ${(updated as any).user?.name ?? 'Anonyme'}`,
        req,
      });

      return res.status(200).json(updated);
    } catch (error) {
      return res.status(500).json({ error: 'Erreur mise à jour réservation' });
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}

export default withStaffAuth(handler);
