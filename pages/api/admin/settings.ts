import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import prisma from '@/lib/db/prisma';
import { verifyToken } from '@/lib/auth/auth';
import {
  CONFIG_KEYS,
  DEFAULT_DELIVERY_ZONES,
  DEFAULT_LOYALTY_CONFIG,
  DEFAULT_MAINTENANCE_MODE,
  type DeliveryZone,
  type LoyaltyConfig,
} from '@/lib/config/siteDefaults';

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

export type { DeliveryZone, LoyaltyConfig } from '@/lib/config/siteDefaults';

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
      const [deliveryZones, loyaltyConfig, maintenanceMode] = await Promise.all([
        getConfig(CONFIG_KEYS.DELIVERY_ZONES, DEFAULT_DELIVERY_ZONES),
        getConfig(CONFIG_KEYS.LOYALTY_CONFIG, DEFAULT_LOYALTY_CONFIG),
        getConfig(CONFIG_KEYS.MAINTENANCE_MODE, DEFAULT_MAINTENANCE_MODE),
      ]);
      return res.json({ deliveryZones, loyaltyConfig, maintenanceMode: Boolean(maintenanceMode) });
    }

    if (req.method === 'PUT') {
      if (admin.role !== 'ADMIN' && admin.role !== 'WEBMASTER') return res.status(403).json({ error: 'Réservé aux administrateurs' });
      const { deliveryZones, loyaltyConfig, maintenanceMode } = req.body;
      if (deliveryZones) await setConfig(CONFIG_KEYS.DELIVERY_ZONES, deliveryZones);
      if (loyaltyConfig) await setConfig(CONFIG_KEYS.LOYALTY_CONFIG, loyaltyConfig);
      if (typeof maintenanceMode === 'boolean') {
        await setConfig(CONFIG_KEYS.MAINTENANCE_MODE, maintenanceMode);
        try {
          fs.writeFileSync(path.join(process.cwd(), '.maintenance-flag'), String(maintenanceMode));
        } catch (e) {
          console.error('Failed to write maintenance flag file:', e);
        }
      }
      return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Méthode non autorisée' });
  } catch (error) {
    console.error('Erreur admin settings:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
