import prisma from '@/lib/db/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const menuItems = await prisma.menuItem.findMany({
      include: {
        reviews: {
          select: { rating: true },
        },
        promotions: {
          where: {
            isActive: true,
            startsAt: { lte: new Date() },
            endsAt: { gte: new Date() },
          },
        },
      },
    });

    // Ajouter la note moyenne à chaque item
    const enrichedItems = menuItems.map(item => ({
      ...item,
      averageRating: item.reviews.length > 0
        ? (item.reviews.reduce((sum, r) => sum + r.rating, 0) / item.reviews.length).toFixed(1)
        : 0,
      reviewCount: item.reviews.length,
      activePromotion: item.promotions[0] || null,
    }));

    return res.status(200).json(enrichedItems);
  } catch (error) {
    console.error('Erreur menu:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
