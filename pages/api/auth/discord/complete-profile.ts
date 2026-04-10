import type { NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { withAuth, type AuthenticatedRequest } from '@/lib/auth/middleware';

function normalizeUsPhone(input: string): string | null {
  const digits = input.replace(/\D/g, '');
  const formatted = digits.length === 10 ? `+1${digits}` : digits.length === 11 && digits.startsWith('1') ? `+${digits}` : null;
  if (!formatted) return null;
  if (!/^\+1[2-9]\d{2}[2-9]\d{6}$/.test(formatted)) return null;
  return formatted;
}

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Methode non autorisee' });
  }

  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Session invalide' });
  }

  const { firstName, lastName, phone } = req.body as {
    firstName?: string;
    lastName?: string;
    phone?: string;
  };

  if (!firstName || !lastName || !phone) {
    return res.status(400).json({ error: 'Nom, prenom et telephone sont requis.' });
  }

  if (typeof firstName !== 'string' || typeof lastName !== 'string' || typeof phone !== 'string') {
    return res.status(400).json({ error: 'Format de donnees invalide.' });
  }

  const normalizedFirstName = firstName.trim();
  const normalizedLastName = lastName.trim();
  const normalizedPhone = normalizeUsPhone(phone);

  if (!normalizedFirstName || !normalizedLastName) {
    return res.status(400).json({ error: 'Nom et prenom invalides.' });
  }

  if (normalizedFirstName.length > 60 || normalizedLastName.length > 60) {
    return res.status(400).json({ error: 'Nom et prenom trop longs (max 60).' });
  }

  if (!normalizedPhone) {
    return res.status(400).json({ error: 'Numero US invalide (format +1XXXXXXXXXX attendu).' });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      name: `${normalizedFirstName} ${normalizedLastName}`,
      phone: normalizedPhone,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      loyaltyPoints: true,
    },
  });

  return res.status(200).json({
    user: updated,
    profileCompleted: true,
  });
}

export default withAuth(handler);
