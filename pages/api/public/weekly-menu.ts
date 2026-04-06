import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { CONFIG_KEYS, DEFAULT_WEEKLY_MENU } from '@/lib/config/siteDefaults';

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

function toPublicWeeklyMenu(payload = DEFAULT_WEEKLY_MENU): WeeklyMenuPayload {
  return {
    title: payload.title,
    subtitle: payload.subtitle,
    weekLabel: payload.weekLabel,
    items: payload.items.map((item) => ({
      name: item.name,
      description: item.description,
      price: formatPublicPrice(item.price),
    })),
  };
}

function formatPublicPrice(value: unknown): string {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `$${value}`;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return '$0';
    return trimmed.startsWith('$') ? trimmed : `$${trimmed}`;
  }

  return '$0';
}

function normalizePublicPayload(payload: unknown): WeeklyMenuPayload | null {
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

    items.push({
      name: item.name,
      description: item.description,
      price: formatPublicPrice(item.price),
    });
  }

  return {
    title: data.title,
    subtitle: data.subtitle,
    weekLabel: data.weekLabel,
    items,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const config = await prisma.configuration.findUnique({
      where: { key: CONFIG_KEYS.WEEKLY_MENU },
    });

    if (!config) {
      return res.status(200).json(toPublicWeeklyMenu());
    }

    const parsed = JSON.parse(config.value);
    const normalized = normalizePublicPayload(parsed);
    return res.status(200).json(normalized || toPublicWeeklyMenu());
  } catch (error) {
    console.error('Erreur weekly-menu public:', error);
    return res.status(200).json(toPublicWeeklyMenu());
  }
}
