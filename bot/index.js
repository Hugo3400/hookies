const { Client, GatewayIntentBits, Partials, REST, Routes, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SITE_URL = process.env.SITE_URL || 'https://hookies.nexadev.fr';
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('❌ DISCORD_BOT_TOKEN manquant dans .env.local');
  process.exit(1);
}

// --- Slash commands (fonctionnent en DM) ---
const commands = [
  new SlashCommandBuilder()
    .setName('register')
    .setDescription('Créer ton compte Hookies')
    .addStringOption(opt => opt.setName('nom').setDescription('Ton nom / pseudo').setRequired(true))
    .setDMPermission(true),

  new SlashCommandBuilder()
    .setName('login')
    .setDescription('Recevoir un lien de connexion au site Hookies')
    .setDMPermission(true),

  new SlashCommandBuilder()
    .setName('menu')
    .setDescription('Voir la carte Hookies')
    .setDMPermission(true),

  new SlashCommandBuilder()
    .setName('points')
    .setDescription('Voir tes points de fidélité')
    .setDMPermission(true),

  new SlashCommandBuilder()
    .setName('profil')
    .setDescription('Voir ton profil Hookies')
    .setDMPermission(true),

  new SlashCommandBuilder()
    .setName('help')
    .setDescription('Voir les commandes disponibles')
    .setDMPermission(true),
];

// --- Client setup (DM only) ---
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel, Partials.Message],
});

// --- Register slash commands ---
async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);
  try {
    console.log('🔄 Enregistrement des commandes slash...');
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: commands.map(c => c.toJSON()),
    });
    console.log('✅ Commandes slash enregistrées');
  } catch (err) {
    console.error('❌ Erreur enregistrement commandes:', err);
  }
}

// --- Helpers ---
function generateLoginToken(userId, role) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '24h' });
}

function hookiesEmbed() {
  return new EmbedBuilder().setColor(0xc9952b).setFooter({ text: 'Hookies — Taverne & Fruits de mer' });
}

// --- Help embed ---
function helpEmbed() {
  return hookiesEmbed()
    .setTitle('🏴‍☠️ Hookies — Bot de la Taverne')
    .setDescription(
      'Ahoy ! Je suis le bot de **Hookies — Taverne & Fruits de mer**.\n' +
      'Utilise les commandes ci-dessous en message privé :\n\n' +
      '`/register` — Créer ton compte\n' +
      '`/login` — Recevoir un lien de connexion\n' +
      '`/menu` — Voir la carte\n' +
      '`/points` — Voir tes points de fidélité\n' +
      '`/profil` — Voir ton profil\n' +
      '`/help` — Afficher ce message'
    );
}

// --- Events ---
client.once('ready', async () => {
  console.log(`🏴‍☠️ Bot Hookies connecté : ${client.user.tag}`);
  await registerCommands();
});

// --- Accueil DM (message texte) ---
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  // Uniquement les DMs
  if (message.guild) return;

  const embed = helpEmbed();
  await message.reply({ embeds: [embed] });
});

// --- Slash commands handler ---
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, user: discordUser } = interaction;

  // Bloquer l'usage sur serveur — DM uniquement
  if (interaction.guild) {
    return interaction.reply({ content: '⚓ Ce bot fonctionne uniquement en message privé ! Envoie-moi un DM.', flags: 64 });
  }

  // --- /help ---
  if (commandName === 'help') {
    return interaction.reply({ embeds: [helpEmbed()], flags: 64 });
  }

  // --- /register ---
  if (commandName === 'register') {
    const nom = interaction.options.getString('nom', true);

    try {
      const existing = await prisma.user.findUnique({ where: { discordId: discordUser.id } });
      if (existing) {
        const embed = hookiesEmbed()
          .setTitle('⚓ Déjà inscrit !')
          .setDescription(`Tu as déjà un compte Hookies sous le nom **${existing.name}**.\nUtilise \`/login\` pour te connecter.`);
        return interaction.reply({ embeds: [embed], flags: 64 });
      }

      const newUser = await prisma.user.create({
        data: {
          discordId: discordUser.id,
          discordTag: discordUser.tag,
          name: nom,
          role: 'CLIENT',
        },
      });

      const token = generateLoginToken(newUser.id, newUser.role);
      const loginUrl = `${SITE_URL}/espace-client?token=${token}`;

      const embed = hookiesEmbed()
        .setTitle('🏴‍☠️ Bienvenue chez Hookies !')
        .setDescription(`Compte créé avec succès, **${nom}** !\n\nClique ci-dessous pour accéder à ton espace client.`)
        .addFields(
          { name: 'Nom', value: nom, inline: true },
          { name: 'Points', value: '0', inline: true },
        );

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel('Accéder à mon espace').setStyle(ButtonStyle.Link).setURL(loginUrl),
      );

      return interaction.reply({ embeds: [embed], components: [row], flags: 64 });
    } catch (err) {
      console.error('Erreur /register:', err);
      return interaction.reply({ content: '❌ Erreur lors de l\'inscription.', flags: 64 });
    }
  }

  // --- /login ---
  if (commandName === 'login') {
    try {
      const user = await prisma.user.findUnique({ where: { discordId: discordUser.id } });
      if (!user) {
        const embed = hookiesEmbed()
          .setTitle('❌ Pas de compte')
          .setDescription('Tu n\'as pas encore de compte Hookies.\nUtilise `/register` pour en créer un.');
        return interaction.reply({ embeds: [embed], flags: 64 });
      }

      if (!user.isActive) {
        return interaction.reply({ content: '❌ Ton compte est désactivé.', flags: 64 });
      }

      const token = generateLoginToken(user.id, user.role);
      const loginUrl = `${SITE_URL}/espace-client?token=${token}`;

      const embed = hookiesEmbed()
        .setTitle('🔑 Connexion Hookies')
        .setDescription(`Salut **${user.name}** ! Clique ci-dessous pour te connecter.\n\n⚠️ Ce lien expire dans 24h.`);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel('Se connecter').setStyle(ButtonStyle.Link).setURL(loginUrl),
      );

      return interaction.reply({ embeds: [embed], components: [row], flags: 64 });
    } catch (err) {
      console.error('Erreur /login:', err);
      return interaction.reply({ content: '❌ Erreur lors de la connexion.', flags: 64 });
    }
  }

  // --- /menu ---
  if (commandName === 'menu') {
    try {
      const items = await prisma.menuItem.findMany({
        where: { isAvailable: true },
        orderBy: { category: 'asc' },
        take: 15,
      });

      if (items.length === 0) {
        return interaction.reply({ content: 'Le menu est vide pour le moment.', flags: 64 });
      }

      const grouped = {};
      for (const item of items) {
        if (!grouped[item.category]) grouped[item.category] = [];
        grouped[item.category].push(item);
      }

      const embed = hookiesEmbed()
        .setTitle('🍔 La Carte Hookies')
        .setDescription('Voici nos plats disponibles :');

      for (const [cat, catItems] of Object.entries(grouped)) {
        const lines = catItems.map(i => `**${i.name}** — $${i.price.toFixed(2)}\n${i.description}`);
        embed.addFields({ name: cat, value: lines.join('\n\n').slice(0, 1024) });
      }

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel('Voir la carte complète').setStyle(ButtonStyle.Link).setURL(`${SITE_URL}/menu`),
      );

      return interaction.reply({ embeds: [embed], components: [row], flags: 64 });
    } catch (err) {
      console.error('Erreur /menu:', err);
      return interaction.reply({ content: '❌ Erreur lors du chargement du menu.', flags: 64 });
    }
  }

  // --- /points ---
  if (commandName === 'points') {
    try {
      const user = await prisma.user.findUnique({ where: { discordId: discordUser.id } });
      if (!user) {
        return interaction.reply({ content: 'Tu n\'as pas de compte Hookies. Utilise `/register`.', flags: 64 });
      }

      const embed = hookiesEmbed()
        .setTitle('⭐ Points de fidélité')
        .addFields(
          { name: 'Points', value: `**${user.loyaltyPoints}**`, inline: true },
          { name: 'Statut', value: user.loyaltyPoints >= 200 ? '🟢 Bonus actif' : '🔴 Pas encore de bonus', inline: true },
        );

      return interaction.reply({ embeds: [embed], flags: 64 });
    } catch (err) {
      console.error('Erreur /points:', err);
      return interaction.reply({ content: '❌ Erreur.', flags: 64 });
    }
  }

  // --- /profil ---
  if (commandName === 'profil') {
    try {
      const user = await prisma.user.findUnique({
        where: { discordId: discordUser.id },
        include: { _count: { select: { orders: true, reservations: true } } },
      });
      if (!user) {
        return interaction.reply({ content: 'Tu n\'as pas de compte Hookies. Utilise `/register`.', flags: 64 });
      }

      const embed = hookiesEmbed()
        .setTitle(`🏴‍☠️ Profil de ${user.name}`)
        .addFields(
          { name: 'Rôle', value: user.role, inline: true },
          { name: 'Points', value: `${user.loyaltyPoints}`, inline: true },
          { name: 'Commandes', value: `${user._count.orders}`, inline: true },
          { name: 'Réservations', value: `${user._count.reservations}`, inline: true },
          { name: 'Membre depuis', value: user.createdAt.toLocaleDateString('fr-FR'), inline: true },
        );

      const token = generateLoginToken(user.id, user.role);
      const loginUrl = `${SITE_URL}/espace-client?token=${token}`;

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel('Mon espace client').setStyle(ButtonStyle.Link).setURL(loginUrl),
      );

      return interaction.reply({ embeds: [embed], components: [row], flags: 64 });
    } catch (err) {
      console.error('Erreur /profil:', err);
      return interaction.reply({ content: '❌ Erreur.', flags: 64 });
    }
  }
});

// --- Start ---
client.login(BOT_TOKEN);
