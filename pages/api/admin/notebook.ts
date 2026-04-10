import type { NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { withStaffAuth, type AuthenticatedRequest } from '@/lib/auth/middleware';

const NOTEBOOK_KEY = 'ADMIN_NOTEBOOK_V1';

type NotebookNote = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  imageUrls: string[];
  updatedAt: string;
};

type NotebookCategory = {
  id: string;
  name: string;
  notes: NotebookNote[];
};

type NotebookData = {
  categories: NotebookCategory[];
};

const DEFAULT_NOTEBOOK: NotebookData = {
  categories: [{ id: 'cat-general', name: 'General', notes: [] }],
};

function safeString(value: unknown, max = 20000): string {
  if (typeof value !== 'string') return '';
  return value.slice(0, max);
}

function normalizeNote(input: unknown): NotebookNote {
  const obj = input && typeof input === 'object' ? (input as Record<string, unknown>) : {};
  const tagsRaw = Array.isArray(obj.tags) ? obj.tags : [];
  const tags = tagsRaw
    .map((item) => safeString(item, 30).trim())
    .filter((item) => item.length > 0)
    .slice(0, 8);
  const imageRaw = Array.isArray(obj.imageUrls) ? obj.imageUrls : [];
  const imageUrls = imageRaw
    .map((item) => safeString(item, 2000).trim())
    .filter((item) => item.length > 0)
    .slice(0, 20);

  const id = safeString(obj.id, 80).trim() || `note-${Date.now()}`;
  const title = safeString(obj.title, 160).trim() || 'Sans titre';
  const content = safeString(obj.content, 50000);
  const updatedAt = safeString(obj.updatedAt, 80) || new Date().toISOString();

  return { id, title, content, tags, imageUrls, updatedAt };
}

function normalizeCategory(input: unknown): NotebookCategory {
  const obj = input && typeof input === 'object' ? (input as Record<string, unknown>) : {};
  const id = safeString(obj.id, 80).trim() || `cat-${Date.now()}`;
  const name = safeString(obj.name, 80).trim() || 'Categorie';
  const notesRaw = Array.isArray(obj.notes) ? obj.notes : [];
  const notes = notesRaw.map(normalizeNote).slice(0, 500);

  return { id, name, notes };
}

function normalizeNotebook(input: unknown): NotebookData {
  const obj = input && typeof input === 'object' ? (input as Record<string, unknown>) : {};
  const categoriesRaw = Array.isArray(obj.categories) ? obj.categories : [];
  const categories = categoriesRaw.map(normalizeCategory).slice(0, 50);

  if (categories.length === 0) {
    return DEFAULT_NOTEBOOK;
  }

  return { categories };
}

async function readNotebook(): Promise<NotebookData> {
  const row = await prisma.configuration.findUnique({ where: { key: NOTEBOOK_KEY } });
  if (!row) return DEFAULT_NOTEBOOK;

  try {
    const parsed = JSON.parse(row.value) as unknown;
    return normalizeNotebook(parsed);
  } catch {
    return DEFAULT_NOTEBOOK;
  }
}

async function writeNotebook(data: NotebookData) {
  await prisma.configuration.upsert({
    where: { key: NOTEBOOK_KEY },
    create: { key: NOTEBOOK_KEY, value: JSON.stringify(data) },
    update: { value: JSON.stringify(data) },
  });
}

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const notebook = await readNotebook();
      return res.status(200).json(notebook);
    }

    if (req.method === 'PUT') {
      const payload = normalizeNotebook(req.body);
      await writeNotebook(payload);
      return res.status(200).json({ success: true, notebook: payload });
    }

    return res.status(405).json({ error: 'Methode non autorisee' });
  } catch (error) {
    console.error('Erreur admin notebook:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}

export default withStaffAuth(handler);
