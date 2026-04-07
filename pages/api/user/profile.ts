import prisma from '@/lib/db/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import bcryptjs from 'bcryptjs';
import { verifyToken } from '@/lib/auth/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token manquant' });

  try {
    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ error: 'Token invalide' });

    if (req.method === 'GET') {
      // Récupérer profil complet
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          loyaltyPoints: true,
          createdAt: true,
          addresses: true,
        },
      });
      return res.status(200).json(user);
    }

    if (req.method === 'PUT') {
      // Mettre à jour profil
      const { name, phone, newPassword, currentPassword } = req.body;

      if (name && (typeof name !== 'string' || name.length > 100)) {
        return res.status(400).json({ error: 'Nom invalide (max 100)' });
      }

      if (phone && (typeof phone !== 'string' || phone.length > 20)) {
        return res.status(400).json({ error: 'Téléphone invalide' });
      }

      // Vérifier les données
      if (newPassword && !currentPassword) {
        return res.status(400).json({ error: 'Mot de passe actuel requis' });
      }

      if (newPassword && (typeof newPassword !== 'string' || newPassword.length < 6 || newPassword.length > 200)) {
        return res.status(400).json({ error: 'Nouveau mot de passe invalide (6-200 caractères)' });
      }

      // Si changement de mot de passe
      let updateData: any = {};
      if (name) updateData.name = name;
      if (phone) updateData.phone = phone;

      if (newPassword) {
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
        });

        if (!user || !user.password) {
          return res.status(400).json({ error: 'Changement de mot de passe non disponible' });
        }

        const isValid = await bcryptjs.compare(currentPassword, user.password);
        if (!isValid) {
          return res.status(400).json({ error: 'Mot de passe actuel incorrect' });
        }

        const hashedPassword = await bcryptjs.hash(newPassword, 10);
        updateData.password = hashedPassword;
      }

      const updated = await prisma.user.update({
        where: { id: decoded.userId },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          loyaltyPoints: true,
        },
      });

      return res.status(200).json(updated);
    }

    return res.status(405).json({ error: 'Méthode non autorisée' });
  } catch (err) {
    console.error('[profile]', err instanceof Error ? err.message : String(err));
    return res.status(400).json({ error: 'Erreur profil' });
  }
}
