import type { NextApiResponse } from 'next';
import { randomUUID } from 'crypto';
import prisma from '@/lib/db/prisma';
import { withAdminAuth, AuthenticatedRequest } from '@/lib/auth/middleware';

type QuoteStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED';

type QuoteLine = {
  label: string;
  quantity: number;
  unitPrice: number;
};

type Quote = {
  id: string;
  customerName: string;
  customerContact?: string;
  status: QuoteStatus;
  items: QuoteLine[];
  total: number;
  notes?: string;
  createdAt: string;
};

const QUOTES_KEY = 'SALES_QUOTES';

async function getQuotes(): Promise<Quote[]> {
  const row = await prisma.configuration.findUnique({ where: { key: QUOTES_KEY } });
  if (!row) return [];
  try {
    const data = JSON.parse(row.value) as Quote[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function setQuotes(items: Quote[]) {
  await prisma.configuration.upsert({
    where: { key: QUOTES_KEY },
    create: { key: QUOTES_KEY, value: JSON.stringify(items) },
    update: { value: JSON.stringify(items) },
  });
}

function computeTotal(lines: QuoteLine[]) {
  return lines.reduce((sum, line) => sum + Number(line.quantity || 0) * Number(line.unitPrice || 0), 0);
}

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const items = await getQuotes();
    return res.status(200).json(items);
  }

  if (req.method === 'POST') {
    const { customerName, customerContact, items, notes } = req.body || {};
    if (!customerName || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'customerName et items requis' });
    }

    const normalized = items
      .map((line: QuoteLine) => ({
        label: String(line.label || '').trim(),
        quantity: Math.max(0, Math.floor(Number(line.quantity || 0))),
        unitPrice: Number(line.unitPrice || 0),
      }))
      .filter((line: QuoteLine) => line.label && line.quantity > 0 && line.unitPrice >= 0);

    if (normalized.length === 0) {
      return res.status(400).json({ error: 'Lignes devis invalides' });
    }

    const quote: Quote = {
      id: randomUUID(),
      customerName,
      customerContact,
      status: 'DRAFT',
      items: normalized,
      total: computeTotal(normalized),
      notes,
      createdAt: new Date().toISOString(),
    };

    const current = await getQuotes();
    const next = [quote, ...current];
    await setQuotes(next);
    return res.status(201).json(quote);
  }

  if (req.method === 'PUT') {
    const { id, status } = req.body || {};
    if (!id || !status) return res.status(400).json({ error: 'id et status requis' });

    const current = await getQuotes();
    const index = current.findIndex((item) => item.id === id);
    if (index === -1) return res.status(404).json({ error: 'Devis introuvable' });

    current[index] = { ...current[index], status };
    await setQuotes(current);
    return res.status(200).json(current[index]);
  }

  if (req.method === 'DELETE') {
    const { id } = req.body || {};
    if (!id) return res.status(400).json({ error: 'id requis' });

    const current = await getQuotes();
    const next = current.filter((item) => item.id !== id);
    await setQuotes(next);
    return res.status(200).json({ success: true, id });
  }

  return res.status(405).json({ error: 'Methode non autorisee' });
}

export default withAdminAuth(handler);
