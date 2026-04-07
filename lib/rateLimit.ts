import type { NextApiRequest, NextApiResponse } from 'next';

const ipHits = new Map<string, { count: number; resetAt: number }>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of ipHits) {
    if (val.resetAt < now) ipHits.delete(key);
  }
}, 5 * 60 * 1000).unref();

function getClientIp(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return (req.socket as any)?.remoteAddress ?? 'unknown';
}

export function rateLimit(
  req: NextApiRequest,
  res: NextApiResponse,
  { max = 10, windowMs = 60_000, keyPrefix = '' } = {},
): boolean {
  const ip = getClientIp(req);
  const key = `${keyPrefix}:${ip}`;
  const now = Date.now();

  const entry = ipHits.get(key);
  if (!entry || entry.resetAt < now) {
    ipHits.set(key, { count: 1, resetAt: now + windowMs });
    return false; // not limited
  }

  entry.count++;
  if (entry.count > max) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    res.setHeader('Retry-After', String(retryAfter));
    res.status(429).json({ error: 'Trop de requêtes, réessayez plus tard.' });
    return true; // limited
  }

  return false;
}
