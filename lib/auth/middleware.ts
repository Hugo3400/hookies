import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from './auth';
import prisma from '@/lib/db/prisma';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    userId: string;
    role: string;
  };
}

export const withAuth = (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const user = verifyToken(token);

    if (!user) {
      return res.status(401).json({ error: 'Token invalide' });
    }

    req.user = user;
    return handler(req, res);
  };
};

export const withAdminAuth = (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) => {
  return withAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Session invalide' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Utilisateur non autorise' });
    }

    if (user.role !== 'ADMIN' && user.role !== 'WEBMASTER') {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    req.user = {
      userId,
      role: user.role,
    };

    return handler(req, res);
  });
};

// Staff auth: accepts ADMIN + EMPLOYEE roles
export const withStaffAuth = (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) => {
  return withAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Session invalide' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Utilisateur non autorise' });
    }

    if (user.role !== 'ADMIN' && (user.role as string) !== 'EMPLOYEE') {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    req.user = {
      userId,
      role: user.role,
    };

    return handler(req, res);
  });
};
