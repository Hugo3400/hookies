import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';

type WeeklyMenuItem = {
  name: string;
  description: string;
  price: string;
};

type WeeklyMenuPayload = {
  title: string;
  subtitle: string;
  weekLabel: string;
  items: WeeklyMenuItem[];
};

const DEFAULT_WEEKLY_MENU: WeeklyMenuPayload = {
  title: 'Menus de la semaine',
  subtitle: 'La sélection du capitaine',
  weekLabel: 'Semaine en cours',
  items: [
    {
      name: 'Ration du Moussaillon',
      description: 'Fish burger, petite portion de frites et boisson du marin.',
      price: '$300',
    },
    {
      name: 'Le Kraken Croustillant',
      description: 'Filet de poisson pané, onion rings dorés, salade croquante et sauce citronnée.',
      price: '$500',
    },
    {
      name: 'Le Trésor du Capitaine',
      description: 'Double fish burger du capitaine, grande portion de frites et boisson du marin.',
      price: '$500',
    },
  ],
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const config = await prisma.configuration.findUnique({
      where: { key: 'WEEKLY_MENU' },
    });

    if (!config) {
      return res.status(200).json(DEFAULT_WEEKLY_MENU);
    }

    const parsed = JSON.parse(config.value) as WeeklyMenuPayload;
    return res.status(200).json(parsed);
  } catch (error) {
    console.error('Erreur weekly-menu public:', error);
    return res.status(200).json(DEFAULT_WEEKLY_MENU);
  }
}
