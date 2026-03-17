import React from 'react';
import { motion } from 'framer-motion';

export default function Features() {
  const features = [
    {
      icon: '🍴',
      title: 'Menu Unique',
      description: 'Découvrez nos plats thématiques inspirés de l\'univers pirate',
    },
    {
      icon: '🎭',
      title: 'Ambiance Immersive',
      description: 'Une décoration authentique et une atmosphère unique',
    },
    {
      icon: '📅',
      title: 'Réservations Faciles',
      description: 'Réservez votre table en quelques clics',
    },
    {
      icon: '🚚',
      title: 'Livraison à Domicile',
      description: 'Profitez de nos services de livraison rapides',
    },
    {
      icon: '👥',
      title: 'Événements Privés',
      description: 'Organisez vos événements dans notre établissement',
    },
    {
      icon: '⭐',
      title: 'Meilleure Qualité',
      description: 'Des ingrédients frais et une préparation soignée',
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
    <section className="py-20 bg-pirate-skull">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-pirate-gold mb-4 font-pirate">Nos Services</h2>
          <p className="text-gray-300 text-lg">Découvrez tout ce que Hookies a à vous offrir</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-pirate-dark rounded-lg p-8 border-l-4 border-pirate-gold hover:shadow-lg hover:shadow-pirate-gold transition duration-300 transform hover:scale-105"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-pirate-gold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
