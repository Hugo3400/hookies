import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaHamburger, FaFish, FaCocktail, FaIceCream, FaPepperHot, FaUtensils, FaPlus } from 'react-icons/fa';
import type { IconType } from 'react-icons';

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
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);

  return (
    <section id="menu" className="px-4 py-20 md:px-6">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.26em] text-amber-200/80">Carte du bord</p>
          <h2 className="font-display text-4xl font-black text-slate-100 md:text-5xl">Des assiettes pensees pour marquer les esprits</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300/85">Une cuisine franche, genereuse et visuelle, entre feu, iode et notes epicees.</p>
        </motion.div>

        {/* Filtres par catégorie */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setFilter('ALL')}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition ${
              filter === 'ALL' ? 'bg-amber-500 text-black' : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <FaUtensils className="text-[10px]" /> Tout
          </button>
          {categories.map(cat => {
            const Icon = CATEGORY_ICONS[cat] || FaUtensils;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition ${
                  filter === cat ? 'bg-amber-500 text-black' : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <Icon className="text-[10px]" /> {CATEGORY_LABELS[cat]}
              </button>
            );
          })}
        </div>

        {loading && (
          <p className="text-center text-slate-400">Chargement du menu...</p>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-slate-400">Aucun plat disponible pour le moment.</p>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, index) => {
            const Icon = CATEGORY_ICONS[item.category] || FaUtensils;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl p-6 transition duration-300 hover:-translate-y-1"
              >
                {item.image && (
                  <img src={item.image} alt={item.name} className="mb-4 h-36 w-full rounded-xl object-cover" />
                )}
                <div className="mb-5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/35 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
                    <Icon className="text-[10px]" /> {CATEGORY_LABELS[item.category]}
                  </span>
                  <span className="text-lg font-extrabold text-amber-200">{fmt(item.price)}</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-slate-100">{item.name}</h3>
                {item.description && (
                  <p className="mt-3 text-sm leading-relaxed text-slate-300/80">{item.description}</p>
                )}
                <div className="mt-6 flex justify-end">
                  <Link
                    href="/espace-client"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/15 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-500/30"
                  >
                    <FaPlus className="text-xs" /> Commander
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
