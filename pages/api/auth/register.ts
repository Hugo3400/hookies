import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { hashPassword, generateToken } from '@/lib/auth/auth';
import { rateLimit } from '@/lib/rateLimit';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  if (rateLimit(req, res, { max: 3, windowMs: 60_000, keyPrefix: 'register' })) return;

  const { email, password, name, phone } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Données manquantes' });
  }

  if (typeof email !== 'string' || typeof password !== 'string' || typeof name !== 'string') {
    return res.status(400).json({ error: 'Données invalides' });
  }

  if (email.length > 255 || name.length > 100 || password.length < 6 || password.length > 200) {
    return res.status(400).json({ error: 'Email (max 255), nom (max 100), mot de passe (6-200 caractères)' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Format email invalide' });
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Utilisateur déjà existant' });
    }

    // Créer l'utilisateur
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone: phone || null,
        role: 'CLIENT',
      },
    });

    // Générer le token
    const token = generateToken(user.id, user.role);

    res.status(201).json({
      message: 'Inscription réussie',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
}
