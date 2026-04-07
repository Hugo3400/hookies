import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { CONFIG_KEYS, DEFAULT_MAINTENANCE_MODE } from '@/lib/config/siteDefaults';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const row = await prisma.configuration.findUnique({ where: { key: CONFIG_KEYS.MAINTENANCE_MODE } });
    if (!row) return res.status(200).json({ maintenanceMode: DEFAULT_MAINTENANCE_MODE });

    try {
      const parsed = JSON.parse(row.value);
      return res.status(200).json({ maintenanceMode: Boolean(parsed) });
    } catch {
      return res.status(200).json({ maintenanceMode: DEFAULT_MAINTENANCE_MODE });
    }
  } catch {
    return res.status(200).json({ maintenanceMode: DEFAULT_MAINTENANCE_MODE });
  }
}