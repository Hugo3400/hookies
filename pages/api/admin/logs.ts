import type { NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { withAdminAuth, AuthenticatedRequest } from '@/lib/auth/middleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const page = parseInt((req.query.page as string) || '1', 10);
    const limit = parseInt((req.query.limit as string) || '50', 10);
    const action = req.query.action as string | undefined;
    const skip = (page - 1) * limit;

    const where = action ? { action } : {};

    const [logs, total] = await Promise.all([
      (prisma as any).adminLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Math.min(limit, 200),
      }),
      (prisma as any).adminLog.count({ where }),
    ]);

    return res.status(200).json({ logs, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    return res.status(500).json({ error: 'Erreur récupération logs' });
  }
}

export default withAdminAuth(handler);
