import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section
      id="accueil"
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-pirate-blood to-pirate-dark"
    >
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-8xl animate-pulse">⚓</div>
        <div className="absolute bottom-10 right-10 text-8xl animate-pulse" style={{ animationDelay: '0.5s' }}>
          🏴‍☠️
        </div>
        <div className="absolute top-1/2 right-20 text-7xl animate-sail">🗡️</div>
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-bold mb-6 font-pirate text-pirate-gold drop-shadow-lg"
        >
          HOOKIES
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-2xl md:text-4xl mb-4 text-white font-bold"
        >
          Bienvenue dans l'univers pirate! 🏴‍☠️
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl mb-12 text-gray-200 max-w-2xl mx-auto"
        >
          Découvrez une expérience gastronomique unique et immersive. Dégustez nos plats délicieux dans une ambiance pirate authentique.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <button className="bg-pirate-gold text-pirate-dark px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition duration-300 transform hover:scale-105">
            Réserver une table
          </button>
          <button className="border-2 border-pirate-gold text-pirate-gold px-8 py-4 rounded-lg font-bold text-lg hover:bg-pirate-gold hover:text-pirate-dark transition duration-300">
            Consulter le menu
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          <div className="border-l-2 border-pirate-gold pl-4">
            <div className="text-4xl font-bold text-pirate-gold">50+</div>
            <div className="text-sm text-gray-300">Plats savoureux</div>
          </div>
          <div className="border-l-2 border-pirate-gold pl-4">
            <div className="text-4xl font-bold text-pirate-gold">10k+</div>
            <div className="text-sm text-gray-300">Clients satisfaits</div>
          </div>
          <div className="border-l-2 border-pirate-gold pl-4">
            <div className="text-4xl font-bold text-pirate-gold">2023</div>
            <div className="text-sm text-gray-300">Depuis l'année</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
