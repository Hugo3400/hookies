import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section id="accueil" className="paper-noise relative overflow-hidden px-4 pb-20 pt-12 md:px-6 md:pt-20">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "linear-gradient(rgba(24,14,10,0.72), rgba(24,14,10,0.86)), url('/da/hero-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
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
            <button className="rounded-xl bg-amber-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-400">
              Monter a bord
            </button>
            <button className="rounded-xl border border-slate-200/25 bg-slate-900/40 px-6 py-3 font-semibold text-slate-100 transition hover:border-amber-400/45 hover:bg-slate-900/70">
              Voir la carte
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-10 grid max-w-xl grid-cols-3 gap-3"
          >
            <div className="glass-card rounded-xl p-4">
              <p className="text-2xl font-extrabold text-amber-300">4.9/5</p>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-300/80">Avis d'equipage</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-2xl font-extrabold text-amber-300">50+</p>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-300/80">Plats de bord</p>
            </div>
            <div className="glass-card rounded-xl p-4">
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
            Signature
          </div>
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-300/75">Cocktail de la semaine</p>
          <h3 className="font-display text-3xl font-bold text-amber-100 md:text-4xl">Le Kraken Dore</h3>
          <p className="mt-4 text-slate-200/85">
            Rhum vieux, ananas roti, citron vert, bitter cacao. Servi fume sous cloche avec eclats de cannelle.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-100/10 bg-slate-900/45 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-300/75">Preparation</p>
              <p className="mt-1 text-lg font-bold text-amber-200">8 min</p>
            </div>
            <div className="rounded-xl border border-slate-100/10 bg-slate-900/45 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-300/75">A partir de</p>
              <p className="mt-1 text-lg font-bold text-amber-200">12 EUR</p>
            </div>
          </div>

          <div className="mt-8 h-36 rounded-2xl border border-amber-400/25 bg-gradient-to-br from-amber-400/20 to-sky-400/15 p-5">
            <p className="text-sm font-semibold text-amber-100">Pont principal - Soiree Live</p>
            <p className="mt-2 text-sm text-slate-100/80">Tous les vendredis 20h30: DJ set marin, flammes cuisine ouverte et menu degustation.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
