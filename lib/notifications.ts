import prisma from '@/lib/db/prisma';

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
) {
  try {
    await prisma.notification.create({
      data: { userId, type, title, message },
    });
  } catch (err) {
    console.error('[Notif] Erreur création:', (err as Error).message);
  }
}

export async function notifyWelcome(userId: string, name: string) {
  await createNotification(
    userId,
    'WELCOME',
    '🏴‍☠️ Bienvenue chez Hookies !',
    `Ahoy ${name} ! Ton compte vient d'être créé. Tu peux maintenant passer des commandes et réserver une table.`,
  );
}

export async function notifyOrderCreated(userId: string, orderNumber: string, total: number, items: string[]) {
  await createNotification(
    userId,
    'ORDER',
    '🧾 Commande reçue !',
    `Ta commande ${orderNumber} a bien été enregistrée.\nArticles : ${items.join(', ')}\nTotal : $${total.toFixed(2)}\nStatut : En attente`,
  );
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: '⏳ En attente',
  CONFIRMED: '✅ Confirmée',
  PREPARING: '🍳 En préparation',
  READY: '🔔 Prête !',
  DELIVERING: '🚗 En livraison',
  DELIVERED: '📦 Livrée',
  COMPLETED: '✅ Terminée',
  CANCELLED: '❌ Annulée',
};

export async function notifyOrderStatus(userId: string, orderNumber: string, status: string) {
  const label = STATUS_LABELS[status] || status;
  await createNotification(
    userId,
    'ORDER',
    `Commande ${orderNumber}`,
    `Ta commande est maintenant : ${label}`,
  );
}

const RESA_LABELS: Record<string, string> = {
  PENDING: '⏳ En attente',
  CONFIRMED: '✅ Confirmée',
  CANCELLED: '❌ Annulée',
};

export async function notifyReservationCreated(userId: string, name: string, date: string, time: string, guestCount: number) {
  await createNotification(
    userId,
    'RESERVATION',
    '📅 Réservation enregistrée !',
    `Ahoy ${name}, ta réservation a bien été reçue.\nDate : ${date}\nHeure : ${time}\nPersonnes : ${guestCount}`,
  );
}

export async function notifyReservationStatus(userId: string, status: string, date: string, time: string) {
  const label = RESA_LABELS[status] || status;
  await createNotification(
    userId,
    'RESERVATION',
    `Réservation ${label}`,
    `Ta réservation du ${date} à ${time} est maintenant : ${label}`,
  );
}
