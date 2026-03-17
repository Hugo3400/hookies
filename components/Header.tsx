import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-pirate-skull border-b-4 border-pirate-gold sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <div className="text-4xl">🏴‍☠️</div>
            <h1 className="text-3xl font-bold text-pirate-gold font-pirate">HOOKIES</h1>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            <Link href="#accueil" className="hover:text-pirate-gold transition duration-300">
              Accueil
            </Link>
            <Link href="#menu" className="hover:text-pirate-gold transition duration-300">
              Menu
            </Link>
            <Link href="#reservation" className="hover:text-pirate-gold transition duration-300">
              Réservation
            </Link>
            <Link href="#contact" className="hover:text-pirate-gold transition duration-300">
              Contact
            </Link>
            <button className="bg-pirate-red px-6 py-2 rounded-lg font-bold hover:bg-pirate-blood transition duration-300">
              Se connecter
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-pirate-gold text-2xl"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden flex flex-col gap-4 mt-4 pt-4 border-t border-pirate-gold"
          >
            <Link href="#accueil" className="hover:text-pirate-gold transition">
              Accueil
            </Link>
            <Link href="#menu" className="hover:text-pirate-gold transition">
              Menu
            </Link>
            <Link href="#reservation" className="hover:text-pirate-gold transition">
              Réservation
            </Link>
            <Link href="#contact" className="hover:text-pirate-gold transition">
              Contact
            </Link>
            <button className="bg-pirate-red px-6 py-2 rounded-lg font-bold">
              Se connecter
            </button>
          </motion.nav>
        )}
      </div>
    </header>
  );
}
