import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { IconType } from 'react-icons';
import { FaHamburger, FaCocktail, FaIceCream, FaPepperHot, FaUtensils } from 'react-icons/fa';
import { MENU_CONTENT } from '@/lib/config/siteContent';

type MenuCategory = 'BURGER' | 'PLAT' | 'SIDE' | 'DRINK' | 'DESSERT' | 'SAUCE';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  preparationTime: number;
};

const CATEGORY_LABELS: Record<MenuCategory, string> = {
  BURGER: 'Fish Burgers',
  PLAT: 'Plats',
  SIDE: 'Accompagnements',
  DRINK: 'Boissons',
  DESSERT: 'Desserts',
  SAUCE: 'Sauces',
};

const CATEGORY_ICONS: Record<MenuCategory, IconType> = {
  BURGER: FaHamburger,
  PLAT: FaUtensils,
  SIDE: FaPepperHot,
  DRINK: FaCocktail,
  DESSERT: FaIceCream,
  SAUCE: FaPepperHot,
};

const CATEGORY_ORDER: MenuCategory[] = ['BURGER', 'PLAT', 'SIDE', 'DRINK', 'DESSERT', 'SAUCE'];

function normalizeCategory(category: string): string {
  return String(category || '').trim().toUpperCase();
}

function getCategoryLabel(category: string): string {
  const normalized = normalizeCategory(category);
  return CATEGORY_LABELS[normalized as MenuCategory] || normalized || 'Autres';
}

export default function Menu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | 'ALL'>('ALL');

  useEffect(() => {
    fetch('/api/public/menu')
      .then(r => r.ok ? r.json() : [])
      .then((data: MenuItem[]) => setItems(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = CATEGORY_ORDER.filter(cat => items.some(i => normalizeCategory(i.category) === cat));
  const filtered = filter === 'ALL' ? items : items.filter(i => normalizeCategory(i.category) === filter);

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  return (
    <section id="menu" className="px-4 py-16 md:px-6 md:py-20">
      <div className="mx-auto w-full max-w-7xl">
        <h2 className="font-pirate text-center text-4xl text-gold md:text-5xl">{MENU_CONTENT.heading}</h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-sm text-parchment/60">
          {MENU_CONTENT.intro}
        </p>
        <div className="rope-line mx-auto mt-4 w-32" />

        {/* Category filters */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setFilter('ALL')}
            className={`rounded-sm px-4 py-2 text-xs font-bold transition ${
              filter === 'ALL' ? 'bg-gold text-plank' : 'border border-rope/30 text-parchment/70 hover:border-gold/50 hover:text-gold'
            }`}
          >
            {MENU_CONTENT.allCategoriesLabel}
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-sm px-4 py-2 text-xs font-bold transition ${
                filter === cat ? 'bg-gold text-plank' : 'border border-rope/30 text-parchment/70 hover:border-gold/50 hover:text-gold'
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        {loading && (
          <p className="mt-10 text-center text-parchment/50">{MENU_CONTENT.loadingLabel}</p>
        )}

        {!loading && filtered.length === 0 && (
          <p className="mt-10 text-center text-parchment/50">{MENU_CONTENT.emptyLabel}</p>
        )}

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(item => {
            const normalizedCategory = normalizeCategory(item.category);
            const Icon = CATEGORY_ICONS[normalizedCategory as MenuCategory] || FaUtensils;
            return (
              <div key={item.id} className="wood-card p-5">
                {item.image && (
                  <img src={item.image} alt={item.name} className="mb-4 h-40 w-full rounded-sm object-cover" />
                )}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-gold/80">
                    <Icon className="text-[11px]" /> {getCategoryLabel(item.category)}
                  </span>
                  <span className="font-bold text-gold">{fmt(item.price)}</span>
                </div>
                <h3 className="mt-2 font-pirate text-xl text-parchment">{item.name}</h3>
                {item.description && (
                  <p className="mt-1.5 text-sm text-parchment/60">{item.description}</p>
                )}
                <div className="mt-4 flex justify-end">
                  <Link
                    href="/espace-client"
                    className="rounded-sm border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold text-gold transition hover:bg-gold/20"
                  >
                    {MENU_CONTENT.orderCtaLabel}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
