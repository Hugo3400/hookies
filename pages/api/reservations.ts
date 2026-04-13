import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { withAuth } from '@/lib/auth/middleware';
import { AuthenticatedRequest } from '@/lib/auth/middleware';
import { sendEmail } from '@/lib/email/mailer';
import {
  buildReservationAdminEmail,
  buildReservationCustomerEmail,
} from '@/lib/email/templates';
import { notifyReservationCreated } from '@/lib/notifications';
import { logAction } from '@/lib/admin/logger';
import { EMAIL_CONTENT, RESERVATION_API_CONTENT } from '@/lib/config/siteContent';

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
      res.status(500).json({ error: RESERVATION_API_CONTENT.getError });
    }
  } else if (req.method === 'POST') {
    // Créer une nouvelle réservation
    const { date, time, guestCount, specialRequest } = req.body;

    try {
      const client = await prisma.user.findUnique({
        where: { id: req.user?.userId },
        select: { name: true, email: true, phone: true },
      });

      if (!client?.phone?.trim()) {
        return res.status(400).json({ error: 'Le numero de telephone est obligatoire pour reserver.' });
      }

      const reservation = await prisma.reservation.create({
        data: {
          userId: req.user?.userId || '',
          date: new Date(date),
          time,
          guestCount,
          specialRequest,
        },
      });
      // Notification in-app
      if (req.user?.userId) {
        const resaDate = formatReservationDate(reservation.date);
        notifyReservationCreated(req.user.userId, client?.name || '', resaDate, reservation.time, reservation.guestCount).catch(() => {});
      }

      if (client?.email) {
        const reservationDate = formatReservationDate(reservation.date);
        const adminEmail = process.env.MAIL_ADMIN_TO;

        const customerText = [
          `Bonjour ${client.name},`,
          '',
          EMAIL_CONTENT.reservationCustomer.textRegistered,
          `Date: ${reservationDate}`,
          `Heure: ${reservation.time}`,
          `Nombre de personnes: ${reservation.guestCount}`,
          `Demande speciale: ${reservation.specialRequest || RESERVATION_API_CONTENT.noSpecialRequest}`,
          '',
          EMAIL_CONTENT.reservationCustomer.textConfirmSoon,
          EMAIL_CONTENT.reservationCustomer.textTeam,
        ].join('\n');

        const tasks: Promise<boolean>[] = [
          sendEmail({
            to: client.email,
            subject: EMAIL_CONTENT.reservationCustomer.subject,
            text: customerText,
            html: buildReservationCustomerEmail({
              name: client.name,
              email: client.email,
              date: reservationDate,
              time: reservation.time,
              guestCount: reservation.guestCount,
              specialRequest: reservation.specialRequest,
            }),
          }),
        ];

        if (adminEmail) {
          const adminText = [
            EMAIL_CONTENT.reservationAdmin.textHeader,
            `Client: ${client.name}`,
            `Email: ${client.email}`,
            `Date: ${reservationDate}`,
            `Heure: ${reservation.time}`,
            `Couverts: ${reservation.guestCount}`,
            `Demande speciale: ${reservation.specialRequest || RESERVATION_API_CONTENT.noSpecialRequest}`,
          ].join('\n');

          tasks.push(
            sendEmail({
              to: adminEmail,
              subject: `${EMAIL_CONTENT.reservationAdmin.subjectPrefix} ${client.name}`,
              text: adminText,
              html: buildReservationAdminEmail({
                name: client.name,
                email: client.email,
                date: reservationDate,
                time: reservation.time,
                guestCount: reservation.guestCount,
                specialRequest: reservation.specialRequest,
              }),
            })
          );
        }

        await Promise.allSettled(tasks);
      }

      logAction({
        actorId: req.user?.userId ?? null,
        actorRole: 'CLIENT',
        action: 'RESERVATION_PLACED',
        target: `${RESERVATION_API_CONTENT.logTargetPrefix} ${formatReservationDate(reservation.date)} ${reservation.time}`,
        details: `${RESERVATION_API_CONTENT.logDetailsPrefix}: ${reservation.guestCount} | ${RESERVATION_API_CONTENT.logDetailsClientLabel}: ${client?.name ?? RESERVATION_API_CONTENT.logAnonymous}`,
        req,
      });

      res.status(201).json(reservation);
    } catch (error) {
      console.error('Erreur création réservation:', error);
      res.status(500).json({ error: RESERVATION_API_CONTENT.createError });
    }
  } else {
    res.status(405).json({ error: RESERVATION_API_CONTENT.methodNotAllowed });
  }
}

export default withAuth(handler);
