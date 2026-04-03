import type { NextApiResponse } from 'next';
import { randomUUID } from 'crypto';
import prisma from '@/lib/db/prisma';
import { withStaffAuth, AuthenticatedRequest } from '@/lib/auth/middleware';

type AgendaType = 'RESERVATION' | 'LIVRAISON' | 'EVENT';
type AgendaStatus = 'PLANNED' | 'CONFIRMED' | 'DONE' | 'CANCELLED';

type AgendaItem = {
  id: string;
  type: AgendaType;
  title: string;
  customerName?: string;
  startAt: string;
  endAt?: string;
  details?: string;
  status: AgendaStatus;
  createdAt: string;
};

const AGENDA_KEY = 'AGENDA_EVENTS';

async function getAgenda(): Promise<AgendaItem[]> {
  const row = await prisma.configuration.findUnique({ where: { key: AGENDA_KEY } });
  if (!row) return [];
  try {
    const data = JSON.parse(row.value) as AgendaItem[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function setAgenda(items: AgendaItem[]) {
  await prisma.configuration.upsert({
    where: { key: AGENDA_KEY },
    create: { key: AGENDA_KEY, value: JSON.stringify(items) },
    update: { value: JSON.stringify(items) },
  });
}

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const items = await getAgenda();
    return res.status(200).json(items);
  }

  if (req.method === 'POST') {
    const { type, title, customerName, startAt, endAt, details, status } = req.body || {};
    if (!type || !title || !startAt) {
      return res.status(400).json({ error: 'type, title, startAt requis' });
    }

    const entry: AgendaItem = {
      id: randomUUID(),
      type,
      title,
      customerName,
      startAt,
      endAt,
      details,
      status: status || 'PLANNED',
      createdAt: new Date().toISOString(),
    };

    const current = await getAgenda();
    const next = [entry, ...current];
    await setAgenda(next);
    return res.status(201).json(entry);
  }

  if (req.method === 'PUT') {
    const { id, status } = req.body || {};
    if (!id || !status) return res.status(400).json({ error: 'id et status requis' });

    const current = await getAgenda();
    const index = current.findIndex((item) => item.id === id);
    if (index === -1) return res.status(404).json({ error: 'Evenement introuvable' });

    current[index] = { ...current[index], status };
    await setAgenda(current);
    return res.status(200).json(current[index]);
  }

  if (req.method === 'DELETE') {
    const { id } = req.body || {};
    if (!id) return res.status(400).json({ error: 'id requis' });

    const current = await getAgenda();
    const next = current.filter((item) => item.id !== id);
    await setAgenda(next);
    return res.status(200).json({ success: true, id });
  }

  return res.status(405).json({ error: 'Methode non autorisee' });
}

export default withStaffAuth(handler);
