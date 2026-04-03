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
  subtitle: 'Selection du capitaine',
  weekLabel: 'Semaine en cours',
  items: [
    {
      name: 'Menu Flibustier',
      description: 'Burger signature, frites de cale et sauce epicee maison.',
      price: '$18',
    },
    {
      name: 'Menu Kraken',
      description: 'Filet de poisson pane, potatoes rustiques et salade croquante.',
      price: '$21',
    },
    {
      name: 'Menu Capitaine',
      description: 'Double burger premium, cheddar affine et oignons carameles.',
      price: '$24',
    },
  ],
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Methode non autorisee' });
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
