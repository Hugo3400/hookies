import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { withAuth } from '@/lib/auth/middleware';
import { AuthenticatedRequest } from '@/lib/auth/middleware';
import { sendEmail } from '@/lib/email/mailer';

function formatReservationDate(value: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(value);
}

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

      const client = await prisma.user.findUnique({
        where: { id: req.user?.userId },
        select: { name: true, email: true },
      });

      if (client?.email) {
        const reservationDate = formatReservationDate(reservation.date);
        const adminEmail = process.env.MAIL_ADMIN_TO;

        const customerText = [
          `Bonjour ${client.name},`,
          '',
          'Votre reservation a bien ete enregistree.',
          `Date: ${reservationDate}`,
          `Heure: ${reservation.time}`,
          `Nombre de personnes: ${reservation.guestCount}`,
          `Demande speciale: ${reservation.specialRequest || 'Aucune'}`,
          '',
          'Nous vous confirmerons rapidement.',
          'Equipe Hookies',
        ].join('\n');

        const tasks: Promise<boolean>[] = [
          sendEmail({
            to: client.email,
            subject: '[Hookies] Reservation recue',
            text: customerText,
          }),
        ];

        if (adminEmail) {
          const adminText = [
            'Nouvelle reservation client:',
            `Client: ${client.name}`,
            `Email: ${client.email}`,
            `Date: ${reservationDate}`,
            `Heure: ${reservation.time}`,
            `Couverts: ${reservation.guestCount}`,
            `Demande speciale: ${reservation.specialRequest || 'Aucune'}`,
          ].join('\n');

          tasks.push(
            sendEmail({
              to: adminEmail,
              subject: `[Hookies] Nouvelle reservation - ${client.name}`,
              text: adminText,
            })
          );
        }

        await Promise.allSettled(tasks);
      }

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
