import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { withAuth } from '@/lib/auth/middleware';
import { AuthenticatedRequest } from '@/lib/auth/middleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Récupérer les réservations de l'utilisateur
    try {
      const reservations = await prisma.reservation.findMany({
        where: { userId: req.user?.userId },
      });
      res.status(200).json(reservations);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des réservations' });
    }
  } else if (req.method === 'POST') {
    // Créer une nouvelle réservation
    const { date, time, guestCount, specialRequest } = req.body;

    try {
      const reservation = await prisma.reservation.create({
        data: {
          userId: req.user?.userId || '',
          date: new Date(date),
          time,
          guestCount,
          specialRequest,
        },
      });
      res.status(201).json(reservation);
    } catch (error) {
      console.error('Erreur création réservation:', error);
      res.status(500).json({ error: 'Erreur lors de la création de la réservation' });
    }
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}

export default withAuth(handler);
