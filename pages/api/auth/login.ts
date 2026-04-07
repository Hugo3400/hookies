import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { comparePassword, generateToken } from '@/lib/auth/auth';
import { logAction } from '@/lib/admin/logger';
import { rateLimit } from '@/lib/rateLimit';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  if (rateLimit(req, res, { max: 5, windowMs: 60_000, keyPrefix: 'login' })) return;

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  if (typeof email !== 'string' || typeof password !== 'string' || email.length > 255 || password.length > 200) {
    return res.status(400).json({ error: 'Données invalides' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const token = generateToken(user.id, user.role);

    logAction({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'USER_LOGIN',
      target: user.name,
      details: `Email: ${email}`,
      req,
    });

    res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
}
