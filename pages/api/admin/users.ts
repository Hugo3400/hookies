import type { NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { withAdminAuth, AuthenticatedRequest } from '@/lib/auth/middleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany({
        include: { _count: { select: { orders: true, reservations: true } } },
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(
        users.map((user) => {
          const userRecord = user as typeof user & Record<string, unknown>;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            role: user.role,
            loyaltyPoints: Number(userRecord.loyaltyPoints ?? 0),
            createdAt: user.createdAt,
            _count: user._count,
          };
        })
      );
    } catch (error) {
      return res.status(500).json({ error: 'Erreur récupération utilisateurs' });
    }
  }

  if (req.method === 'PATCH') {
    const { id, role } = req.body;
    if (!id || !role) return res.status(400).json({ error: 'id et role requis' });
    const validRoles = ['CLIENT', 'ADMIN', 'DELIVERY', 'KIOSK'];
    if (!validRoles.includes(role)) return res.status(400).json({ error: 'Rôle invalide' });
    try {
      const updated = await prisma.user.update({
        where: { id },
        data: { role },
        select: { id: true, email: true, name: true, role: true },
      });
      return res.status(200).json(updated);
    } catch (error) {
      return res.status(500).json({ error: 'Erreur mise à jour utilisateur' });
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}

export default withAdminAuth(handler);
