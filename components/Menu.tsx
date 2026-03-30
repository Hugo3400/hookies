import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { IconType } from 'react-icons';
import { FaHamburger, FaCocktail, FaIceCream, FaPepperHot, FaUtensils } from 'react-icons/fa';

type MenuCategory = 'BURGER' | 'SIDE' | 'DRINK' | 'DESSERT' | 'SAUCE';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image?: string;
  preparationTime: number;
};

const CATEGORY_LABELS: Record<MenuCategory, string> = {
  BURGER: 'Burgers',
  SIDE: 'Accompagnements',
  DRINK: 'Boissons',
  DESSERT: 'Desserts',
  SAUCE: 'Sauces',
};

const CATEGORY_ICONS: Record<MenuCategory, IconType> = {
  BURGER: FaHamburger,
  SIDE: FaPepperHot,
  DRINK: FaCocktail,
  DESSERT: FaIceCream,
  SAUCE: FaPepperHot,
};

export default function Menu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<MenuCategory | 'ALL'>('ALL');

  useEffect(() => {
    fetch('/api/public/menu')
      .then(r => r.ok ? r.json() : [])
      .then((data: MenuItem[]) => setItems(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? items : items.filter(i => i.category === filter);
  const categories = Array.from(new Set(items.map(i => i.category)));

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  return (
    <section id="menu" className="px-4 py-16 md:px-6 md:py-20">
      <div className="mx-auto w-full max-w-7xl">
        <h2 className="font-pirate text-center text-4xl text-gold md:text-5xl">La Carte</h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-sm text-parchment/60">
          Burgers au feu de bois, poisson frais, rhums et desserts maison.
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
            Tout
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-sm px-4 py-2 text-xs font-bold transition ${
                filter === cat ? 'bg-gold text-plank' : 'border border-rope/30 text-parchment/70 hover:border-gold/50 hover:text-gold'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {loading && (
          <p className="mt-10 text-center text-parchment/50">Chargement...</p>
        )}

        {!loading && filtered.length === 0 && (
          <p className="mt-10 text-center text-parchment/50">Aucun plat disponible pour le moment.</p>
        )}

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(item => {
            const Icon = CATEGORY_ICONS[item.category] || FaUtensils;
            return (
              <div key={item.id} className="wood-card p-5">
                {item.image && (
                  <img src={item.image} alt={item.name} className="mb-4 h-40 w-full rounded-sm object-cover" />
                )}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-gold/80">
                    <Icon className="text-[11px]" /> {CATEGORY_LABELS[item.category]}
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
                    Commander
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
