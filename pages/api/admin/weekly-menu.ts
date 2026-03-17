import type { NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { withAdminAuth, AuthenticatedRequest } from '@/lib/auth/middleware';

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
      price: '18 EUR',
    },
    {
      name: 'Menu Kraken',
      description: 'Filet de poisson pane, potatoes rustiques et salade croquante.',
      price: '21 EUR',
    },
    {
      name: 'Menu Capitaine',
      description: 'Double burger premium, cheddar affine et oignons carameles.',
      price: '24 EUR',
    },
  ],
};

function isValidPayload(payload: WeeklyMenuPayload): boolean {
  return (
    typeof payload?.title === 'string' &&
    typeof payload?.subtitle === 'string' &&
    typeof payload?.weekLabel === 'string' &&
    Array.isArray(payload?.items) &&
    payload.items.length > 0 &&
    payload.items.every(
      (item) =>
        typeof item?.name === 'string' &&
        typeof item?.description === 'string' &&
        typeof item?.price === 'string'
    )
  );
}

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const config = await prisma.configuration.findUnique({
        where: { key: 'WEEKLY_MENU' },
      });

      if (!config) {
        return res.status(200).json(DEFAULT_WEEKLY_MENU);
      }

      return res.status(200).json(JSON.parse(config.value));
    } catch (error) {
      console.error('Erreur weekly-menu admin GET:', error);
      return res.status(200).json(DEFAULT_WEEKLY_MENU);
    }
  }

  if (req.method === 'PUT') {
    const payload = req.body as WeeklyMenuPayload;

    if (!isValidPayload(payload)) {
      return res.status(400).json({ error: 'Payload weekly menu invalide' });
    }

    try {
      const saved = await prisma.configuration.upsert({
        where: { key: 'WEEKLY_MENU' },
        create: {
          key: 'WEEKLY_MENU',
          value: JSON.stringify(payload),
        },
        update: {
          value: JSON.stringify(payload),
        },
      });

      return res.status(200).json({ message: 'Menu hebdomadaire mis a jour', updatedAt: saved.updatedAt });
    } catch (error) {
      console.error('Erreur weekly-menu admin PUT:', error);
      return res.status(500).json({ error: 'Erreur lors de la sauvegarde du menu hebdomadaire' });
    }
  }

  return res.status(405).json({ error: 'Methode non autorisee' });
}

export default withAdminAuth(handler);
