import React from 'react';
import { motion } from 'framer-motion';

export default function Menu() {
  const menuItems = [
    {
      name: 'Cote Flibustier',
      description: 'Boeuf maturé, jus corsé au poivre long et pommes grenaille croustillantes.',
      price: '28 EUR',
      tag: 'Viande',
    },
    {
      name: 'Poisson du Tresor',
      description: 'Filet de ligne, beurre citron fumé, legumes de saison glaces.',
      price: '24 EUR',
      tag: 'Ocean',
    },
    {
      name: 'Poulpe Farouche',
      description: 'Tentacules snackees, puree d ail confit et huile pimentee maison.',
      price: '22 EUR',
      tag: 'Signature',
    },
    {
      name: 'Soupe du Capitaine',
      description: 'Bouillon de crustaces, herbes fraiches et croutons rotis au beurre.',
      price: '12 EUR',
      tag: 'Entree',
    },
    {
      name: 'Rhum Epice Hookies',
      description: 'Assemblage exclusif de rhums, epices chaudes et zeste d orange.',
      price: '8 EUR',
      tag: 'Bar',
    },
    {
      name: 'Tresor Chocolat Noir',
      description: 'Ganache intense, coeur coulant et praline salee minute.',
      price: '7 EUR',
      tag: 'Dessert',
    },
  ];

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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-6 transition duration-300 hover:-translate-y-1"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="rounded-full border border-amber-500/35 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
                  {item.tag}
                </span>
                <span className="text-lg font-extrabold text-amber-200">{item.price}</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-100">{item.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300/80">{item.description}</p>
              <div className="mt-6 flex justify-end">
                <button className="rounded-lg border border-amber-500/40 bg-amber-500/15 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-500/30">
                  Ajouter
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="rounded-xl bg-amber-500 px-8 py-4 text-base font-semibold text-slate-950 transition hover:bg-amber-400">
            Consulter le menu complet
          </button>
        </motion.div>
      </div>
    </section>
  );
}
