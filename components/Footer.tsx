import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-amber-700/30 bg-slate-950/70 px-4 py-14 md:px-6">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="font-display text-3xl font-black tracking-[0.12em] text-amber-200">HOOKIES</h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-300/80">
              Le restaurant pirate nouvelle generation. Experience immersive, carte creative et service premium.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-amber-200">Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-300/85">
              <li><Link href="/" className="transition hover:text-amber-300">Accueil</Link></li>
              <li><Link href="/experience" className="transition hover:text-amber-300">Experience</Link></li>
              <li><Link href="/menu" className="transition hover:text-amber-300">Carte</Link></li>
              <li><Link href="/reservation" className="transition hover:text-amber-300">Reservation</Link></li>
              <li><Link href="/livraison" className="transition hover:text-amber-300">Livraison</Link></li>
              <li><Link href="/espace-client" className="transition hover:text-amber-300">Espace client</Link></li>
              <li><Link href="/contact" className="transition hover:text-amber-300">Contact</Link></li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-amber-200">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-300/85">
              <li>+33 (0)1 23 45 67 89</li>
              <li>contact@hookies.fr</li>
              <li>12 Rue de la Mer, 75000 Paris</li>
              <li>Lun - Dim: 11h30 - 23h30</li>
            </ul>
          </motion.div>

        </div>

        <div className="my-6 border-t border-amber-700/30" />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-between gap-3 text-sm text-slate-400 md:flex-row"
        >
          <p>&copy; 2026 Hookies. Tous droits reserves.</p>
          <p>Restaurant Hookies - Univers pirate, cuisine signature.</p>
        </motion.div>
      </div>
    </footer>
  );
}
