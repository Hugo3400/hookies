import type { NextApiRequest, NextApiResponse } from 'next';

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || '';
const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || 'https://hookies.nexadev.fr/api/auth/discord/callback';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'identify',
  });

  res.redirect(`https://discord.com/api/oauth2/authorize?${params.toString()}`);
}
