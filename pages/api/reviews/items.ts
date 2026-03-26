import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const prismaAny = prisma as any;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Récupérer les avis pour un plat
    try {
      const { menuItemId } = req.query;
      if (!menuItemId) return res.status(400).json({ error: 'ID requis' });

      const reviews = await prismaAny.itemReview.findMany({
        where: { menuItemId: String(menuItemId) },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      });

      // Calculer la note moyenne
      const avgRating = reviews.length > 0
        ? (reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

      return res.status(200).json({ reviews, averageRating: avgRating });
    } catch {
      return res.status(400).json({ error: 'Erreur récupération avis' });
    }
  }

  if (req.method === 'POST') {
    // Ajouter un avis
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ error: 'Non autorisé' });

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      const { menuItemId, rating, comment } = req.body;

      if (!menuItemId || !rating) {
        return res.status(400).json({ error: 'Données manquantes' });
      }

      // Vérifier si l'utilisateur a déjà noté
      const existingReview = await prismaAny.itemReview.findUnique({
        where: { menuItemId_userId: { menuItemId, userId: decoded.userId } },
      });

      if (existingReview) {
        // Mettre à jour l'avis existant
        const updated = await prismaAny.itemReview.update({
          where: { id: existingReview.id },
          data: { rating: parseInt(rating), comment: comment || null },
        });
        return res.status(200).json(updated);
      }

      // Créer un nouvel avis
      const review = await prismaAny.itemReview.create({
        data: {
          menuItemId,
          userId: decoded.userId,
          rating: parseInt(rating),
          comment: comment || null,
        },
      });

      return res.status(201).json(review);
    } catch {
      return res.status(400).json({ error: 'Erreur création avis' });
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}
