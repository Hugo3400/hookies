import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';

const DEFAULT_LOYALTY = {
  bonusPercent: 10,
  bonusThreshold: 200,
  referralEnabled: true,
  referralDiscount: 5,
  referralPoints: 50,
  nextRewardGoal: 500,
  rewards: [
    { points: 100, label: 'Boisson offerte' },
    { points: 250, label: 'Dessert offert' },
    { points: 500, label: 'Menu offert' },
  ],
};

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const row = await prisma.configuration.findUnique({ where: { key: 'LOYALTY_CONFIG' } });
    if (!row) return res.json(DEFAULT_LOYALTY);
    try {
      return res.json(JSON.parse(row.value));
    } catch {
      return res.json(DEFAULT_LOYALTY);
    }
  } catch {
    return res.json(DEFAULT_LOYALTY);
  }
}
