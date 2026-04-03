import type { NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { withAdminAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { logAction } from '@/lib/admin/logger';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const items = await prisma.menuItem.findMany({
        orderBy: [{ category: 'asc' }, { name: 'asc' }],
      });
      return res.status(200).json(items);
    } catch (error) {
      return res.status(500).json({ error: 'Erreur récupération menu' });
    }
  }

  if (req.method === 'POST') {
    const { name, description, price, category, image, isAvailable, preparationTime } = req.body;
    if (!name || !description || price == null || !category) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }
    try {
      const item = await prisma.menuItem.create({ data: { name, description, price: parseFloat(price), category, image: image || null, isAvailable: isAvailable !== false, preparationTime: preparationTime ? parseInt(preparationTime) : 15 } });
      logAction({ actorId: req.user?.userId, actorRole: req.user?.role, action: 'MENU_ITEM_CREATED', target: name, details: `Catégorie: ${category} | Prix: $${price}`, req });
      return res.status(201).json(item);
    } catch (error) {
      return res.status(500).json({ error: 'Erreur création article' });
    }
  }

  if (req.method === 'PUT') {
    const { id, name, description, price, category, image, isAvailable, preparationTime } = req.body;
    if (!id) return res.status(400).json({ error: 'id requis' });
    try {
      const item = await prisma.menuItem.update({
        where: { id },
        data: {
          ...(name != null && { name }),
          ...(description != null && { description }),
          ...(price != null && { price: parseFloat(price) }),
          ...(category != null && { category }),
          ...(image !== undefined && { image: image || null }),
          ...(isAvailable !== undefined && { isAvailable }),
          ...(preparationTime != null && { preparationTime: parseInt(preparationTime) }),
        },
      });
      logAction({ actorId: req.user?.userId, actorRole: req.user?.role, action: 'MENU_ITEM_UPDATED', target: item.name, details: null, req });
      return res.status(200).json(item);
    } catch (error) {
      return res.status(500).json({ error: 'Erreur mise à jour article' });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'id requis' });
    try {
      const item = await prisma.menuItem.findUnique({ where: { id }, select: { name: true } });
      await prisma.menuItem.delete({ where: { id } });
      logAction({ actorId: req.user?.userId, actorRole: req.user?.role, action: 'MENU_ITEM_DELETED', target: item?.name ?? id, details: null, req });
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Erreur suppression article' });
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}

export default withAdminAuth(handler);
