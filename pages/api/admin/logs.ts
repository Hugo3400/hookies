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

    const actorIds: string[] = Array.from(
      new Set(
        logs
          .map((log: any) => log.actorId)
          .filter((id): id is string => typeof id === 'string' && id.length > 0)
      )
    );

    const actors = actorIds.length
      ? await prisma.user.findMany({
          where: { id: { in: actorIds } },
          select: { id: true, name: true },
        })
      : [];

    const actorNameById = new Map(actors.map((actor) => [actor.id, actor.name]));

    const enrichedLogs = logs.map((log: any) => {
      const resolvedName = (log.actorName || (log.actorId ? actorNameById.get(log.actorId) : null) || '').trim();
      const parts = resolvedName ? resolvedName.split(/\s+/) : [];
      const actorFirstName = parts.length > 0 ? parts[0] : null;
      const actorLastName = parts.length > 1 ? parts.slice(1).join(' ') : null;

      return {
        ...log,
        actorName: resolvedName || null,
        actorFirstName,
        actorLastName,
      };
    });

    return res.status(200).json({ logs: enrichedLogs, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    return res.status(500).json({ error: 'Erreur récupération logs' });
  }
}

export default withAdminAuth(handler);
