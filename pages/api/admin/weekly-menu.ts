import type { NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { withAdminAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { CONFIG_KEYS, DEFAULT_WEEKLY_MENU, type WeeklyMenuPayload, type WeeklyMenuItem } from '@/lib/config/siteDefaults';

function toNumberPrice(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const normalized = value.replace(',', '.').replace(/[^0-9.\-]/g, '').trim();
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function normalizePayload(payload: unknown): WeeklyMenuPayload | null {
  if (!payload || typeof payload !== 'object') return null;

  const data = payload as {
    title?: unknown;
    subtitle?: unknown;
    weekLabel?: unknown;
    items?: Array<{ name?: unknown; description?: unknown; price?: unknown }>;
  };

  if (
    typeof data.title !== 'string' ||
    typeof data.subtitle !== 'string' ||
    typeof data.weekLabel !== 'string' ||
    !Array.isArray(data.items) ||
    data.items.length === 0
  ) {
    return null;
  }

  const items: WeeklyMenuItem[] = [];

  for (const item of data.items) {
    if (!item || typeof item !== 'object') return null;
    if (typeof item.name !== 'string' || typeof item.description !== 'string') return null;
    const price = toNumberPrice(item.price);
    if (price == null) return null;
    items.push({ name: item.name, description: item.description, price });
  }

  return {
    title: data.title,
    subtitle: data.subtitle,
    weekLabel: data.weekLabel,
    items,
  };
}

function parseStoredPayload(value: string): WeeklyMenuPayload {
  try {
    const parsed = JSON.parse(value);
    const normalized = normalizePayload(parsed);
    return normalized || DEFAULT_WEEKLY_MENU;
  } catch {
    return DEFAULT_WEEKLY_MENU;
  }
}

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const config = await prisma.configuration.findUnique({
        where: { key: CONFIG_KEYS.WEEKLY_MENU },
      });

      if (!config) {
        return res.status(200).json(DEFAULT_WEEKLY_MENU);
      }

      return res.status(200).json(parseStoredPayload(config.value));
    } catch (error) {
      console.error('Erreur weekly-menu admin GET:', error);
      return res.status(200).json(DEFAULT_WEEKLY_MENU);
    }
  }

  if (req.method === 'PUT') {
    const cleanPayload = normalizePayload(req.body);

    if (!cleanPayload) {
      return res.status(400).json({ error: 'Payload weekly menu invalide' });
    }

    try {
      const saved = await prisma.configuration.upsert({
        where: { key: CONFIG_KEYS.WEEKLY_MENU },
        create: {
          key: CONFIG_KEYS.WEEKLY_MENU,
          value: JSON.stringify(cleanPayload),
        },
        update: {
          value: JSON.stringify(cleanPayload),
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
