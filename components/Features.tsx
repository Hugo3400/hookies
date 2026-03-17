import React from 'react';
import { motion } from 'framer-motion';

export default function Features() {
  const features = [
    {
      title: 'Cuisine Signature',
      description: 'Cuissons braise, marinades maison et dressages haut de gamme inspires des routes maritimes.',
    },
    {
      title: 'Ambiance Cinematographique',
      description: 'Lumiere cuivre, bois sombre et bande-son oceanique pour une immersion totale.',
    },
    {
      title: 'Reservation Instantanee',
      description: 'Places salon, pont principal ou comptoir cocktail disponibles en quelques clics.',
    },
    {
      title: 'Livraison Premium',
      description: 'Vos plats favoris en livraison rapide avec emballage isotherme et suivi en direct.',
    },
    {
      title: 'Evenements Prives',
      description: 'Privatisation partielle ou totale pour anniversaires, equipes et celebrations.',
    },
    {
      title: 'Experience Digitale',
      description: 'Borne de commande, espace client et suivi des reservations depuis mobile.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section id="services" className="px-4 py-20 md:px-6">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.26em] text-amber-200/80">L'experience Hookies</p>
          <h2 className="font-display text-4xl font-black text-slate-100 md:text-5xl">Un restaurant pirate pense comme une marque premium</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300/85">Chaque detail est pense pour meler spectacle, confort et execution culinaire moderne.</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass-card rounded-2xl p-7 transition duration-300 hover:-translate-y-1"
            >
              <div className="mb-4 h-1 w-10 rounded-full bg-amber-400/80" />
              <h3 className="font-display text-2xl font-bold text-amber-100">{feature.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300/80">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
