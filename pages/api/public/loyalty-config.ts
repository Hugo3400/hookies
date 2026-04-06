import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { CONFIG_KEYS, DEFAULT_LOYALTY_CONFIG } from '@/lib/config/siteDefaults';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const row = await prisma.configuration.findUnique({ where: { key: CONFIG_KEYS.LOYALTY_CONFIG } });
    if (!row) return res.json(DEFAULT_LOYALTY_CONFIG);
    try {
      return res.json(JSON.parse(row.value));
    } catch {
      return res.json(DEFAULT_LOYALTY_CONFIG);
    }
  } catch {
    return res.json(DEFAULT_LOYALTY_CONFIG);
  }
}
