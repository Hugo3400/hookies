import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaStar, FaUtensils, FaDoorOpen, FaAnchor, FaBookOpen } from 'react-icons/fa';

type WeeklyMenuItem = {
  name: string;
  description: string;
  price: string;
};

type WeeklyMenuData = {
  title: string;
  subtitle: string;
  weekLabel: string;
  items: WeeklyMenuItem[];
};

const FALLBACK_WEEKLY_MENU: WeeklyMenuData = {
  title: 'Menus de la semaine',
  subtitle: 'Selection du capitaine',
  weekLabel: 'Semaine en cours',
  items: [
    {
      name: 'Menu Flibustier',
      description: 'Burger signature, frites de cale et sauce epicee maison.',
      price: '18 EUR',
    },
    {
      name: 'Menu Kraken',
      description: 'Filet de poisson pane, potatoes rustiques et salade croquante.',
      price: '21 EUR',
    },
    {
      name: 'Menu Capitaine',
      description: 'Double burger premium, cheddar affine et oignons carameles.',
      price: '24 EUR',
    },
  ],
};

export default function Hero() {
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenuData>(FALLBACK_WEEKLY_MENU);

  useEffect(() => {
    let mounted = true;

    const loadWeeklyMenu = async () => {
      try {
        const response = await fetch('/api/public/weekly-menu');
        if (!response.ok) return;
        const data = (await response.json()) as WeeklyMenuData;
        if (mounted && data?.items?.length) {
          setWeeklyMenu(data);
        }
      } catch (error) {
        console.error('Erreur chargement menu de la semaine:', error);
      }
    };

    loadWeeklyMenu();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="accueil" className="paper-noise relative overflow-hidden px-4 pb-20 pt-12 md:px-6 md:pt-20">
      <div
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage: "linear-gradient(rgba(24,14,10,0.78), rgba(24,14,10,0.9)), url('/da/hero-bg-clean.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply',
        }}
      />
      <div className="map-overlay" />
      <div className="absolute -left-20 top-32 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl" />
      <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex rounded-full border border-amber-500/40 bg-amber-400/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-amber-200"
          >
            Taverne Pirate Premium
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-5xl font-black leading-[1.05] text-slate-100 md:text-6xl xl:text-7xl"
          >
            Le repaire gourmet
            <span className="block copper-text">des capitaines et aventuriers</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-slate-200/85 md:text-lg"
          >
            Hookies transforme chaque service en traversee: viandes flambees, poissons de cale, epices de comptoir et cocktails de pirate dans un decor cinematographique.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-400">
              <FaAnchor /> Monter a bord
            </Link>
            <Link href="/menu" className="inline-flex items-center gap-2 rounded-xl border border-slate-200/25 bg-slate-900/40 px-6 py-3 font-semibold text-slate-100 transition hover:border-amber-400/45 hover:bg-slate-900/70">
              <FaBookOpen /> Voir la carte
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-10 grid max-w-xl grid-cols-3 gap-3"
          >
            <div className="glass-card rounded-xl p-4">
              <FaStar className="mb-1 text-amber-400" />
              <p className="text-2xl font-extrabold text-amber-300">4.9/5</p>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-300/80">Avis d'equipage</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <FaUtensils className="mb-1 text-amber-400" />
              <p className="text-2xl font-extrabold text-amber-300">50+</p>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-300/80">Plats de bord</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <FaDoorOpen className="mb-1 text-amber-400" />
              <p className="text-2xl font-extrabold text-amber-300">7/7</p>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-300/80">Pont ouvert</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card relative rounded-3xl p-6 md:p-8"
        >
          <div className="absolute right-6 top-6 rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-amber-200">
            Admin
          </div>
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-300/75">{weeklyMenu.subtitle}</p>
          <h3 className="font-display text-3xl font-bold text-amber-100 md:text-4xl">{weeklyMenu.title}</h3>

          <div className="mt-6 space-y-3">
            {weeklyMenu.items.map((item, index) => (
              <div key={`${item.name}-${index}`} className="rounded-xl border border-slate-100/10 bg-slate-900/45 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-amber-100">{item.name}</p>
                    <p className="mt-1 text-sm text-slate-200/80">{item.description}</p>
                  </div>
                  <p className="whitespace-nowrap text-sm font-bold text-amber-300">{item.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-amber-400/25 bg-gradient-to-br from-amber-400/20 to-sky-400/15 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-200/80">Publication</p>
            <p className="mt-2 text-sm font-semibold text-amber-100">{weeklyMenu.weekLabel}</p>
            <p className="mt-1 text-xs text-slate-100/80">Contenu synchronise depuis le panel admin.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
