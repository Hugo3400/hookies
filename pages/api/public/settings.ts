import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import {
  CONFIG_KEYS,
  DEFAULT_RESERVATION_PAGE_CONTENT,
  type ReservationPageContent,
} from '@/lib/config/siteDefaults';

async function getReservationPageContent(): Promise<ReservationPageContent> {
  const row = await prisma.configuration.findUnique({ where: { key: CONFIG_KEYS.RESERVATION_PAGE_CONTENT } });
  if (!row) return DEFAULT_RESERVATION_PAGE_CONTENT;

  try {
    return JSON.parse(row.value) as ReservationPageContent;
  } catch {
    return DEFAULT_RESERVATION_PAGE_CONTENT;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Methode non autorisee' });
  }

  try {
    let settings = await prisma.restaurantSettings.findFirst({
      select: {
        name: true,
        phone: true,
        email: true,
        address: true,
        openingHours: true,
        deliveryFee: true,
        minOrderAmount: true,
        pointsPerEuro: true,
      },
    });

    if (!settings) {
      settings = await prisma.restaurantSettings.create({
        data: {
          name: 'Hookies',
          phone: '+33 1 23 45 67 89',
          email: 'contact@hookies.fr',
          address: '12 Rue de la Mer, 75000 Paris',
        },
        select: {
          name: true,
          phone: true,
          email: true,
          address: true,
          openingHours: true,
          deliveryFee: true,
          minOrderAmount: true,
          pointsPerEuro: true,
        },
      });
    }

    const reservationPageContent = await getReservationPageContent();
    return res.status(200).json({ ...settings, reservationPageContent });
  } catch (error) {
    console.error('Erreur public settings:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
