type DiscordField = {
  name: string;
  value: string;
  inline?: boolean;
};

const REQUEST_TIMEOUT_MS = 5000;

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 3)}...`;
}

async function postWebhook(url: string | undefined, title: string, color: number, fields: DiscordField[]): Promise<void> {
  if (!url) return;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Hookies Logs',
        embeds: [
          {
            title,
            color,
            fields,
            timestamp: new Date().toISOString(),
          },
        ],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Discord webhook error ${response.status}`);
    }
  } catch (error) {
    console.error('[Discord webhook] Envoi impossible:', (error as Error).message);
  } finally {
    clearTimeout(timeout);
  }
}

type OrderCreatedPayload = {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  orderType: string;
  total: number;
  itemsSummary: string;
};

type OrderStatusPayload = {
  orderNumber: string;
  status: string;
  customerName: string;
  actorRole: string;
};

export async function sendOrderCreatedWebhook(payload: OrderCreatedPayload): Promise<void> {
  await postWebhook(
    process.env.DISCORD_WEBHOOK_ORDERS,
    'Nouvelle commande client',
    0xD4A017,
    [
      { name: 'Commande', value: payload.orderNumber, inline: true },
      { name: 'Client', value: payload.customerName || 'Anonyme', inline: true },
      { name: 'Telephone', value: payload.customerPhone || 'Non renseigne', inline: true },
      { name: 'Type', value: payload.orderType || 'Non precise', inline: true },
      { name: 'Total', value: `$${payload.total.toFixed(2)}`, inline: true },
      { name: 'Articles', value: truncate(payload.itemsSummary || 'Aucun detail', 1024) },
    ]
  );
}

export async function sendOrderStatusWebhook(payload: OrderStatusPayload): Promise<void> {
  await postWebhook(
    process.env.DISCORD_WEBHOOK_ORDERS,
    'Mise a jour commande',
    0x3BA55D,
    [
      { name: 'Commande', value: payload.orderNumber, inline: true },
      { name: 'Statut', value: payload.status, inline: true },
      { name: 'Client', value: payload.customerName || 'Anonyme', inline: true },
      { name: 'Action par', value: payload.actorRole || 'SYSTEME', inline: true },
    ]
  );
}

type ReservationCreatedPayload = {
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  guestCount: number;
  specialRequest?: string;
};

type ReservationStatusPayload = {
  reservationId: string;
  status: string;
  customerName: string;
  date: string;
  time: string;
  actorRole: string;
};

export async function sendReservationCreatedWebhook(payload: ReservationCreatedPayload): Promise<void> {
  await postWebhook(
    process.env.DISCORD_WEBHOOK_RESERVATIONS,
    'Nouvelle reservation client',
    0x1E90FF,
    [
      { name: 'Client', value: payload.customerName || 'Anonyme', inline: true },
      { name: 'Telephone', value: payload.customerPhone || 'Non renseigne', inline: true },
      { name: 'Date', value: payload.date, inline: true },
      { name: 'Heure', value: payload.time, inline: true },
      { name: 'Couverts', value: String(payload.guestCount), inline: true },
      { name: 'Demande speciale', value: truncate(payload.specialRequest || 'Aucune', 1024) },
    ]
  );
}

export async function sendReservationStatusWebhook(payload: ReservationStatusPayload): Promise<void> {
  await postWebhook(
    process.env.DISCORD_WEBHOOK_RESERVATIONS,
    'Mise a jour reservation',
    0x7B68EE,
    [
      { name: 'Reservation', value: payload.reservationId, inline: true },
      { name: 'Statut', value: payload.status, inline: true },
      { name: 'Client', value: payload.customerName || 'Anonyme', inline: true },
      { name: 'Date', value: payload.date, inline: true },
      { name: 'Heure', value: payload.time, inline: true },
      { name: 'Action par', value: payload.actorRole || 'SYSTEME', inline: true },
    ]
  );
}
