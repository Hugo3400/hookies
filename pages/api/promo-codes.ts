import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/auth/auth';

const prisma = new PrismaClient();
const prismaAny = prisma as any;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Valider un code promo
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ error: 'Non autorisé' });

      const decoded = verifyToken(token);
      if (!decoded) return res.status(401).json({ error: 'Non autorisé' });
      const { code, orderAmount } = req.body;

      if (!code) return res.status(400).json({ error: 'Code requis' });

      const promoCode = await prismaAny.promoCode.findUnique({
        where: { code: code.toUpperCase() },
      });

      if (!promoCode) {
        return res.status(404).json({ error: 'Code invalide' });
      }

      // Vérifier si actif
      if (!promoCode.isActive) {
        return res.status(400).json({ error: 'Code inactif' });
      }

      // Vérifier l'expiration
      if (promoCode.expiresAt && new Date() > promoCode.expiresAt) {
        return res.status(400).json({ error: 'Code expiré' });
      }

      // Vérifier les utilisations
      if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) {
        return res.status(400).json({ error: 'Code limite atteinte' });
      }

      // Vérifier le montant minimum
      if (orderAmount < promoCode.minOrderAmount) {
        return res.status(400).json({
          error: `Montant minimum: $${promoCode.minOrderAmount}`,
        });
      }

      // Calculer la réduction
      const discount = promoCode.isPercentage
        ? (orderAmount * promoCode.discount) / 100
        : promoCode.discount;

      return res.status(200).json({
        valid: true,
        discount,
        isPercentage: promoCode.isPercentage,
        description: promoCode.description,
      });
    } catch {
      return res.status(400).json({ error: 'Erreur validation code' });
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}
