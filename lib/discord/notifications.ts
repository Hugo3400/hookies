import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';

let client: Client | null = null;
let ready = false;

function getClient(): Client | null {
  if (!process.env.DISCORD_BOT_TOKEN) return null;

  if (!client) {
    client = new Client({ intents: [GatewayIntentBits.Guilds] });

    client.once('ready', () => {
      ready = true;
      console.log('[Discord] Bot notifs connecté:', client?.user?.tag);
    });

    client.login(process.env.DISCORD_BOT_TOKEN).catch((err) => {
      console.error('[Discord] Erreur connexion bot:', err.message);
      client = null;
    });
  }

  return ready ? client : null;
}

function hookiesEmbed() {
  return new EmbedBuilder()
    .setColor(0xc9952b)
    .setFooter({ text: 'Hookies — Taverne & Grillades' });
}

// ---- Notifications ----

export async function notifyWelcome(discordId: string, name: string) {
  const bot = getClient();
  if (!bot) return;

  try {
    const user = await bot.users.fetch(discordId);
    const embed = hookiesEmbed()
      .setTitle('🏴‍☠️ Bienvenue chez Hookies !')
      .setDescription(
        `Ahoy **${name}** ! Ton compte vient d'être créé.\n\n` +
        `Tu peux maintenant passer des commandes et réserver une table sur [hookies.nexadev.fr](https://hookies.nexadev.fr/espace-client).`
      );
    await user.send({ embeds: [embed] });
  } catch (err) {
    console.error('[Discord] Erreur notif bienvenue:', (err as Error).message);
  }
}

export async function notifyOrderCreated(discordId: string, orderNumber: string, total: number, items: string[]) {
  const bot = getClient();
  if (!bot) return;

  try {
    const user = await bot.users.fetch(discordId);
    const embed = hookiesEmbed()
      .setTitle('🧾 Commande reçue !')
      .setDescription(`Ta commande **${orderNumber}** a bien été enregistrée.`)
      .addFields(
        { name: 'Articles', value: items.join('\n').slice(0, 1024) || 'N/A' },
        { name: 'Total', value: `$${total.toFixed(2)}`, inline: true },
        { name: 'Statut', value: '⏳ En attente', inline: true },
      );
    await user.send({ embeds: [embed] });
  } catch (err) {
    console.error('[Discord] Erreur notif commande:', (err as Error).message);
  }
}

const STATUS_LABELS: Record<string, { emoji: string; label: string }> = {
  PENDING: { emoji: '⏳', label: 'En attente' },
  CONFIRMED: { emoji: '✅', label: 'Confirmée' },
  PREPARING: { emoji: '🍳', label: 'En préparation' },
  READY: { emoji: '🔔', label: 'Prête !' },
  DELIVERING: { emoji: '🚗', label: 'En livraison' },
  DELIVERED: { emoji: '📦', label: 'Livrée' },
  COMPLETED: { emoji: '✅', label: 'Terminée' },
  CANCELLED: { emoji: '❌', label: 'Annulée' },
};

export async function notifyOrderStatus(discordId: string, orderNumber: string, status: string) {
  const bot = getClient();
  if (!bot) return;

  const s = STATUS_LABELS[status] || { emoji: '📋', label: status };

  try {
    const user = await bot.users.fetch(discordId);
    const embed = hookiesEmbed()
      .setTitle(`${s.emoji} Commande ${orderNumber}`)
      .setDescription(`Ta commande est maintenant : **${s.label}**`);
    await user.send({ embeds: [embed] });
  } catch (err) {
    console.error('[Discord] Erreur notif statut:', (err as Error).message);
  }
}

const RESA_STATUS_LABELS: Record<string, { emoji: string; label: string }> = {
  PENDING: { emoji: '⏳', label: 'En attente' },
  CONFIRMED: { emoji: '✅', label: 'Confirmée' },
  CANCELLED: { emoji: '❌', label: 'Annulée' },
};

export async function notifyReservationCreated(
  discordId: string,
  name: string,
  date: string,
  time: string,
  guestCount: number,
) {
  const bot = getClient();
  if (!bot) return;

  try {
    const user = await bot.users.fetch(discordId);
    const embed = hookiesEmbed()
      .setTitle('📅 Réservation enregistrée !')
      .setDescription(`Ahoy **${name}**, ta réservation a bien été reçue.`)
      .addFields(
        { name: 'Date', value: date, inline: true },
        { name: 'Heure', value: time, inline: true },
        { name: 'Personnes', value: `${guestCount}`, inline: true },
      );
    await user.send({ embeds: [embed] });
  } catch (err) {
    console.error('[Discord] Erreur notif réservation:', (err as Error).message);
  }
}

export async function notifyReservationStatus(discordId: string, status: string, date: string, time: string) {
  const bot = getClient();
  if (!bot) return;

  const s = RESA_STATUS_LABELS[status] || { emoji: '📋', label: status };

  try {
    const user = await bot.users.fetch(discordId);
    const embed = hookiesEmbed()
      .setTitle(`${s.emoji} Réservation ${s.label}`)
      .setDescription(`Ta réservation du **${date}** à **${time}** est maintenant : **${s.label}**`);
    await user.send({ embeds: [embed] });
  } catch (err) {
    console.error('[Discord] Erreur notif statut résa:', (err as Error).message);
  }
}
