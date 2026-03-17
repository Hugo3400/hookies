import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-amber-700/35 bg-[#1e140f]/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <img src="/da/logo.png" alt="Hookies logo" className="h-11 w-11 rounded-xl border border-amber-500/35 bg-amber-200/10 p-1" />
            <div>
              <h1 className="font-display text-2xl font-black tracking-[0.16em] text-amber-200 md:text-3xl">HOOKIES</h1>
              <p className="text-[10px] uppercase tracking-[0.34em] text-[#d8b38d]/85 md:text-xs">Repaire du Capitaine</p>
            </div>
          </motion.div>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-sm font-medium text-amber-50 transition hover:text-amber-300">
              Accueil
            </Link>
            <Link href="/experience" className="text-sm font-medium text-amber-50 transition hover:text-amber-300">
              Expérience
            </Link>
            <Link href="/menu" className="text-sm font-medium text-amber-50 transition hover:text-amber-300">
              Menu
            </Link>
            <Link href="/reservation" className="text-sm font-medium text-amber-50 transition hover:text-amber-300">
              Reservation
            </Link>
            <Link href="/livraison" className="text-sm font-medium text-amber-50 transition hover:text-amber-300">
              Livraison
            </Link>
            <Link href="/contact" className="text-sm font-medium text-amber-50 transition hover:text-amber-300">
              Contact
            </Link>
            <Link href="/espace-client" className="rounded-xl border border-amber-400/40 bg-amber-500/15 px-5 py-2.5 text-sm font-semibold text-amber-100 transition hover:bg-amber-500/30">
              Espace client
            </Link>
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border border-amber-600/40 p-2 text-amber-200 md:hidden"
          >
            ☰
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mb-4 space-y-2 rounded-xl border border-amber-700/30 bg-slate-950/90 p-4 md:hidden"
        >
          <Link href="/" className="block rounded-lg px-3 py-2 text-slate-100 hover:bg-amber-500/15">
            Accueil
          </Link>
          <Link href="/experience" className="block rounded-lg px-3 py-2 text-slate-100 hover:bg-amber-500/15">
            Expérience
          </Link>
          <Link href="/menu" className="block rounded-lg px-3 py-2 text-slate-100 hover:bg-amber-500/15">
            Menu
          </Link>
          <Link href="/reservation" className="block rounded-lg px-3 py-2 text-slate-100 hover:bg-amber-500/15">
            Reservation
          </Link>
          <Link href="/livraison" className="block rounded-lg px-3 py-2 text-slate-100 hover:bg-amber-500/15">
            Livraison
          </Link>
          <Link href="/contact" className="block rounded-lg px-3 py-2 text-slate-100 hover:bg-amber-500/15">
            Contact
          </Link>
          <Link href="/espace-client" className="block rounded-lg px-3 py-2 text-slate-100 hover:bg-amber-500/15">
            Espace client
          </Link>
          <Link href="/admin" className="block rounded-lg px-3 py-2 text-slate-100 hover:bg-amber-500/15">
            Admin
          </Link>
        </motion.nav>
      )}
    </header>
  );
}
