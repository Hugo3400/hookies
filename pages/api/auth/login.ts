import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  return res.status(410).json({
    error: 'Connexion classique desactivee. Utilisez /api/auth/discord/start.',
  });
}
