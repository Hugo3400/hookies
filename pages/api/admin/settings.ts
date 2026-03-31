import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { verifyToken } from '@/lib/auth/auth';

async function getAdmin(req: NextApiRequest) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return null;

  const payload = verifyToken(auth.slice(7)) as { userId: string; role: string } | null;
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, role: true, isActive: true },
  });

  if (!user || !user.isActive) return null;
  return (user.role === 'ADMIN' || user.role === 'EMPLOYEE' || user.role === 'WEBMASTER')
    ? { userId: user.id, role: user.role }
    : null;
}

// Config keys
const DELIVERY_ZONES_KEY = 'DELIVERY_ZONES';
const LOYALTY_CONFIG_KEY = 'LOYALTY_CONFIG';

export type DeliveryZone = {
  name: string;
  description: string;
  fee: number;
};

export type LoyaltyReward = {
  points: number;
  label: string;
};

export type LoyaltyConfig = {
  bonusPercent: number;
  bonusThreshold: number;
  referralEnabled: boolean;
  referralDiscount: number;
  referralPoints: number;
  nextRewardGoal: number;
  rewards: LoyaltyReward[];
};

const DEFAULT_ZONES: DeliveryZone[] = [
  { name: 'Los Santos County', description: 'Livraison dans tout le comté de Los Santos.', fee: 2.90 },
  { name: 'Blaine County', description: 'Livraison dans le comté de Blaine.', fee: 4.90 },
];

const DEFAULT_LOYALTY: LoyaltyConfig = {
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

async function getConfig<T>(key: string, fallback: T): Promise<T> {
  const row = await prisma.configuration.findUnique({ where: { key } });
  if (!row) return fallback;
  try { return JSON.parse(row.value) as T; } catch { return fallback; }
}

async function setConfig(key: string, value: unknown) {
  await prisma.configuration.upsert({
    where: { key },
    create: { key, value: JSON.stringify(value) },
    update: { value: JSON.stringify(value) },
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = await getAdmin(req);
  if (!admin) return res.status(401).json({ error: 'Non autorisé' });

  try {
    if (req.method === 'GET') {
      const [deliveryZones, loyaltyConfig] = await Promise.all([
        getConfig(DELIVERY_ZONES_KEY, DEFAULT_ZONES),
        getConfig(LOYALTY_CONFIG_KEY, DEFAULT_LOYALTY),
      ]);
      return res.json({ deliveryZones, loyaltyConfig });
    }

    if (req.method === 'PUT') {
      if (admin.role !== 'ADMIN' && admin.role !== 'WEBMASTER') return res.status(403).json({ error: 'Réservé aux administrateurs' });
      const { deliveryZones, loyaltyConfig } = req.body;
      if (deliveryZones) await setConfig(DELIVERY_ZONES_KEY, deliveryZones);
      if (loyaltyConfig) await setConfig(LOYALTY_CONFIG_KEY, loyaltyConfig);
      return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Méthode non autorisée' });
  } catch (error) {
    console.error('Erreur admin settings:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
