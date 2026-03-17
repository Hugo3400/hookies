import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { withAuth } from '@/lib/auth/middleware';
import { AuthenticatedRequest } from '@/lib/auth/middleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Récupérer tous les articles du menu
    try {
      const menuItems = await prisma.menuItem.findMany({
        where: { isAvailable: true },
      });
      res.status(200).json(menuItems);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération du menu' });
    }
  } else if (req.method === 'POST') {
    // Ajouter un nouvel article (admin)
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const { name, description, price, category, image, preparationTime } = req.body;

    try {
      const menuItem = await prisma.menuItem.create({
        data: {
          name,
          description,
          price,
          category,
          image,
          preparationTime: preparationTime || 15,
        },
      });
      res.status(201).json(menuItem);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la création du menu' });
    }
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}

export default withAuth(handler);
