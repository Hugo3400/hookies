import prisma from '@/lib/db/prisma';
import type { NextApiRequest } from 'next';

export interface LogPayload {
  actorId?: string | null;
  actorName?: string | null;
  actorRole?: string | null;
  action: string;
  target?: string | null;
  details?: string | null;
  req?: NextApiRequest;
}

function getIp(req?: NextApiRequest): string | null {
  if (!req) return null;
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return (req.socket as any)?.remoteAddress ?? null;
}

export async function logAction(payload: LogPayload): Promise<void> {
  try {
    await (prisma as any).adminLog.create({
      data: {
        actorId: payload.actorId ?? null,
        actorName: payload.actorName ?? null,
        actorRole: payload.actorRole ?? null,
        action: payload.action,
        target: payload.target ?? null,
        details: payload.details ?? null,
        ip: getIp(payload.req),
      },
    });
  } catch {
    // Ne jamais bloquer la requête principale sur un échec de log
  }
}
