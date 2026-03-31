import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'hookies-secret';

function getUser(req: NextApiRequest) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(auth.slice(7), JWT_SECRET) as { userId: string; role: string };
  } catch {
    return null;
  }
}

async function getLoyaltyConfig() {
  const row = await prisma.configuration.findUnique({ where: { key: 'LOYALTY_CONFIG' } });
  const defaults = { referralEnabled: true, referralDiscount: 5, referralPoints: 50 };
  if (!row) return defaults;
  try {
    const parsed = JSON.parse(row.value);
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const session = getUser(req);
  if (!session) return res.status(401).json({ error: 'Non autorisé' });

  const { code } = req.body;
  if (!code || typeof code !== 'string') return res.status(400).json({ error: 'Code requis' });

  try {
    const config = await getLoyaltyConfig();
    if (!config.referralEnabled) {
      return res.status(400).json({ error: 'Le parrainage est actuellement désactivé.' });
    }

    // Extract user ID from code: HOOK-<first6chars of ID>
    const prefix = 'HOOK-';
    if (!code.toUpperCase().startsWith(prefix) || code.length < prefix.length + 1) {
      return res.status(400).json({ error: 'Code parrainage invalide.' });
    }
    const codeFragment = code.slice(prefix.length).toUpperCase();

    // Find referrer by matching start of ID
    const referrer = await prisma.user.findFirst({
      where: {
        id: { startsWith: codeFragment.toLowerCase() },
        isActive: true,
      },
    });

    // Also try case-insensitive since cuid is lowercase
    const referrerFinal = referrer ?? await prisma.user.findFirst({
      where: {
        id: { startsWith: codeFragment },
        isActive: true,
      },
    });

    if (!referrerFinal) {
      return res.status(400).json({ error: 'Code parrainage invalide.' });
    }

    if (referrerFinal.id === session.userId) {
      return res.status(400).json({ error: 'Tu ne peux pas utiliser ton propre code.' });
    }

    // Check if already used
    const existing = await prisma.referral.findUnique({
      where: {
        referrerId_refereeId: {
          referrerId: referrerFinal.id,
          refereeId: session.userId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Tu as déjà utilisé ce code parrainage.' });
    }

    // Check if user has been referred by anyone already
    const anyReferral = await prisma.referral.findFirst({
      where: { refereeId: session.userId },
    });

    if (anyReferral) {
      return res.status(400).json({ error: 'Tu as déjà utilisé un code parrainage.' });
    }

    const pointsToAward = config.referralPoints || 50;
    const discountToAward = config.referralDiscount || 5;

    // Create referral + award points to referrer in a transaction
    await prisma.$transaction([
      prisma.referral.create({
        data: {
          referrerId: referrerFinal.id,
          refereeId: session.userId,
          pointsAwarded: pointsToAward,
          discountAwarded: discountToAward,
        },
      }),
      prisma.user.update({
        where: { id: referrerFinal.id },
        data: { loyaltyPoints: { increment: pointsToAward } },
      }),
    ]);

    return res.json({
      success: true,
      message: `Code appliqué ! ${referrerFinal.name} reçoit +${pointsToAward} points et tu bénéficies de -$${discountToAward} sur ta prochaine commande.`,
      discount: discountToAward,
    });
  } catch (error) {
    console.error('Erreur referral:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
