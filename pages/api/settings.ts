import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let settings = await prisma.restaurantSettings.findFirst();

    // Créer si n'existe pas
    if (!settings) {
      settings = await prisma.restaurantSettings.create({
        data: {
          name: 'Hookies',
          phone: '+33 1 23 45 67 89',
          email: 'contact@hookies.fr',
          address: '12 Rue de la Mer, 75000 Paris',
        },
      });
    }

    if (req.method === 'GET') {
      return res.status(200).json(settings);
    }

    if (req.method === 'PUT') {
      // Admin only - mettre à jour les paramètres
      const { name, phone, email, address, openingHours, deliveryFee, minOrderAmount, pointsPerEuro } = req.body;

      const updated = await prisma.restaurantSettings.update({
        where: { id: settings.id },
        data: {
          ...(name && { name }),
          ...(phone && { phone }),
          ...(email && { email }),
          ...(address && { address }),
          ...(openingHours && { openingHours: JSON.stringify(openingHours) }),
          ...(deliveryFee && { deliveryFee: parseFloat(deliveryFee) }),
          ...(minOrderAmount && { minOrderAmount: parseFloat(minOrderAmount) }),
          ...(pointsPerEuro && { pointsPerEuro: parseFloat(pointsPerEuro) }),
        },
      });

      return res.status(200).json(updated);
    }

    return res.status(405).json({ error: 'Méthode non autorisée' });
  } catch (error) {
    console.error('Erreur settings:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
