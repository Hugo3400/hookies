import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/db/prisma';

const prismaAny = prisma as any;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Non autorisé' });

  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  if (!id) return res.status(400).json({ error: 'ID adresse manquant' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };

    const address = await prismaAny.userAddress.findUnique({ where: { id } });
    if (!address || address.userId !== decoded.userId) {
      return res.status(404).json({ error: 'Adresse introuvable' });
    }

    if (req.method === 'DELETE') {
      await prismaAny.userAddress.delete({ where: { id } });
      return res.status(200).json({ success: true });
    }

    if (req.method === 'PUT') {
      const { label, street, city, postalCode, country, isDefault } = req.body || {};

      if (isDefault) {
        await prismaAny.userAddress.updateMany({
          where: { userId: decoded.userId },
          data: { isDefault: false },
        });
      }

      const updated = await prismaAny.userAddress.update({
        where: { id },
        data: {
          ...(label !== undefined ? { label } : {}),
          ...(street !== undefined ? { street } : {}),
          ...(city !== undefined ? { city } : {}),
          ...(postalCode !== undefined ? { postalCode } : {}),
          ...(country !== undefined ? { country } : {}),
          ...(isDefault !== undefined ? { isDefault: Boolean(isDefault) } : {}),
        },
      });

      return res.status(200).json(updated);
    }

    return res.status(405).json({ error: 'Méthode non autorisée' });
  } catch {
    return res.status(400).json({ error: 'Requête invalide' });
  }
}
