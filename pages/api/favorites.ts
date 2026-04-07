import prisma from '@/lib/db/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/auth/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Récupérer les favoris de l'utilisateur
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ error: 'Token manquant' });

      const decoded = verifyToken(token);
      if (!decoded) return res.status(401).json({ error: 'Token invalide' });
      const favorites = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { favorites: true },
      });

      return res.status(200).json(favorites?.favorites || []);
    } catch (err) {
      console.error('[favorites GET]', err instanceof Error ? err.message : String(err));
      return res.status(400).json({ error: 'Erreur favoris' });
    }
  }

  if (req.method === 'POST') {
    // Ajouter un favori
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ error: 'Token manquant' });

      const decoded = verifyToken(token);
      if (!decoded) return res.status(401).json({ error: 'Token invalide' });
      const { menuItemId } = req.body;

      await prisma.user.update({
        where: { id: decoded.userId },
        data: {
          favorites: {
            connect: { id: menuItemId },
          },
        },
      });

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('[favorites POST]', err instanceof Error ? err.message : String(err));
      return res.status(400).json({ error: 'Erreur ajout favori' });
    }
  }

  if (req.method === 'DELETE') {
    // Retirer un favori
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ error: 'Token manquant' });

      const decoded = verifyToken(token);
      if (!decoded) return res.status(401).json({ error: 'Token invalide' });
      const { menuItemId } = req.body;

      await prisma.user.update({
        where: { id: decoded.userId },
        data: {
          favorites: {
            disconnect: { id: menuItemId },
          },
        },
      });

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('[favorites DELETE]', err instanceof Error ? err.message : String(err));
      return res.status(400).json({ error: 'Erreur retrait favori' });
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}
