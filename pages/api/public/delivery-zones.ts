import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { CONFIG_KEYS, DEFAULT_DELIVERY_ZONES } from '@/lib/config/siteDefaults';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const row = await prisma.configuration.findUnique({ where: { key: CONFIG_KEYS.DELIVERY_ZONES } });
    if (!row) return res.json(DEFAULT_DELIVERY_ZONES);
    try {
      return res.json(JSON.parse(row.value));
    } catch {
      return res.json(DEFAULT_DELIVERY_ZONES);
    }
  } catch {
    return res.json(DEFAULT_DELIVERY_ZONES);
  }
}
