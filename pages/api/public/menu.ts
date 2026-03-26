import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const menuItems = await prisma.menuItem.findMany({
      where: { isAvailable: true },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        category: true,
        image: true,
        preparationTime: true,
      },
    });
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du menu' });
  }
}
