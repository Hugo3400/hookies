import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/auth/auth';

const prisma = new PrismaClient();
const prismaAny = prisma as any;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Non autorisé' });

  try {
    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ error: 'Token invalide' });

    if (req.method === 'GET') {
      // Récupérer les adresses de l'utilisateur
      const addresses = await prismaAny.userAddress.findMany({
        where: { userId: decoded.userId },
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(addresses);
    }

    if (req.method === 'POST') {
      // Ajouter une adresse
      const { label, street, city, postalCode, country, isDefault } = req.body;

      if (!label || !street || !city || !postalCode) {
        return res.status(400).json({ error: 'Données manquantes' });
      }

      // Si défaut, retirer d'autres
      if (isDefault) {
        await prismaAny.userAddress.updateMany({
          where: { userId: decoded.userId },
          data: { isDefault: false },
        });
      }

      const address = await prismaAny.userAddress.create({
        data: {
          userId: decoded.userId,
          label,
          street,
          city,
          postalCode,
          country: country || 'France',
          isDefault: isDefault || false,
        },
      });

      return res.status(201).json(address);
    }

    return res.status(405).json({ error: 'Méthode non autorisée' });
  } catch {
    return res.status(400).json({ error: 'Erreur adresse' });
  }
}
