import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';

const DEFAULT_ZONES = [
  { name: 'Los Santos County', description: 'Livraison dans tout le comté de Los Santos.', fee: 2.90 },
  { name: 'Blaine County', description: 'Livraison dans le comté de Blaine.', fee: 4.90 },
];

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const row = await prisma.configuration.findUnique({ where: { key: 'DELIVERY_ZONES' } });
    if (!row) return res.json(DEFAULT_ZONES);
    try {
      return res.json(JSON.parse(row.value));
    } catch {
      return res.json(DEFAULT_ZONES);
    }
  } catch {
    return res.json(DEFAULT_ZONES);
  }
}
