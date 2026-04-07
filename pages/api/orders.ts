import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db/prisma';
import { withAuth } from '@/lib/auth/middleware';
import { AuthenticatedRequest } from '@/lib/auth/middleware';
import { notifyOrderCreated } from '@/lib/notifications';
import { logAction } from '@/lib/admin/logger';

const prismaAny = prisma as any;

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Récupérer les commandes de l'utilisateur
    try {
      const orders = await prismaAny.order.findMany({
        where: { userId: req.user?.userId },
        include: {
          orderItems: { include: { menuItem: true } },
          payment: true,
          promoCode: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
    }
  } else if (req.method === 'POST') {
    // Créer une nouvelle commande
    const { items, type, deliveryAddress, notes, promoCode, scheduledFor } = req.body;

    try {
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Panier vide ou invalide' });
      }

      const itemIds = items.map((item: any) => item.menuItemId);
      const menuItems = await prisma.menuItem.findMany({
        where: { id: { in: itemIds }, isAvailable: true },
      });

      const priceById = new Map(menuItems.map((item) => [item.id, item.price]));
      const normalizedItems = items
        .map((item: any) => {
          const quantity = Number(item.quantity || 1);
          const menuPrice = priceById.get(item.menuItemId);
          if (!menuPrice || quantity <= 0) return null;
          return {
            menuItemId: item.menuItemId,
            quantity,
            price: menuPrice,
          };
        })
        .filter(Boolean) as Array<{ menuItemId: string; quantity: number; price: number }>;

      if (normalizedItems.length === 0) {
        return res.status(400).json({ error: 'Aucun article valide dans la commande' });
      }

      const totalPrice = normalizedItems.reduce(
        (sum: number, item) => sum + item.price * item.quantity,
        0
      );

      let discountApplied = 0;
      let promoCodeId: string | undefined;
      if (promoCode && typeof promoCode === 'string') {
        const promo = await prismaAny.promoCode.findUnique({
          where: { code: promoCode.toUpperCase() },
        });

        if (
          promo &&
          promo.isActive &&
          (!promo.expiresAt || new Date() <= promo.expiresAt) &&
          (!promo.maxUses || promo.usedCount < promo.maxUses) &&
          totalPrice >= promo.minOrderAmount
        ) {
          discountApplied = promo.isPercentage
            ? (totalPrice * promo.discount) / 100
            : promo.discount;
          promoCodeId = promo.id;
        }
      }

      const finalPrice = Math.max(0, totalPrice - discountApplied);

      const order = await prismaAny.order.create({
        data: {
          userId: req.user?.userId || undefined,
          orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
          totalPrice,
          finalPrice,
          discountApplied,
          promoCodeId,
          scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
          type,
          deliveryAddress,
          notes,
          orderItems: {
            create: normalizedItems.map((item) => ({
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          orderItems: { include: { menuItem: true } },
          promoCode: true,
        },
      });

      if (promoCodeId) {
        await prismaAny.promoCode.update({
          where: { id: promoCodeId },
          data: { usedCount: { increment: 1 } },
        });
      }

      if (req.user?.userId) {
        const pointsToAdd = Math.floor(finalPrice);
        if (pointsToAdd > 0) {
          await prismaAny.user.update({
            where: { id: req.user.userId },
            data: { loyaltyPoints: { increment: pointsToAdd } },
          });
        }

        // Notification in-app
        const itemNames = order.orderItems.map((oi: any) => `${oi.quantity}x ${oi.menuItem.name}`);
        notifyOrderCreated(req.user.userId, order.orderNumber, finalPrice, itemNames).catch(() => {});
      }

      logAction({
        actorId: req.user?.userId ?? null,
        actorRole: 'CLIENT',
        action: 'ORDER_PLACED',
        target: `Commande #${order.orderNumber}`,
        details: `Type: ${type} | Total: $${finalPrice.toFixed(2)} | Articles: ${normalizedItems.length}`,
        req,
      });

      res.status(201).json(order);
    } catch (error) {
      console.error('Erreur création commande:', error);
      res.status(500).json({ error: 'Erreur lors de la création de la commande' });
    }
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}

export default withAuth(handler);
