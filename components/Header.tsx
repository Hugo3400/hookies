import React, { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';
import { SITE_BRAND, SITE_NAV_LINKS } from '@/lib/config/siteContent';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = SITE_NAV_LINKS;

  return (
    <header className="sticky top-0 z-50 border-b-2 border-rope/30 bg-plank/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <img src="/favicon.png" alt="Hookies" className="h-12 w-12 rounded-sm" />
          <div>
            <span className="font-pirate text-3xl text-gold md:text-4xl">{SITE_BRAND.name}</span>
            <p className="font-subtitle text-[9px] tracking-[0.3em] text-parchment/60">{SITE_BRAND.tagline}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="text-sm text-parchment/80 transition hover:text-gold">
              {l.label}
            </Link>
          ))}
          <Link href="/espace-client" className="rounded-sm border-2 border-gold/50 bg-gold/10 px-5 py-2 text-sm font-bold text-gold transition hover:bg-gold/20">
            Mon Compte
          </Link>
        </nav>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-gold md:hidden"
        >
          {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <nav className="mx-4 mb-4 space-y-1 border-t border-rope/20 bg-plank pt-3 md:hidden">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="block rounded px-4 py-2.5 text-parchment/90 hover:bg-rum">
              {l.label}
            </Link>
          ))}
          <Link href="/espace-client" onClick={() => setMobileMenuOpen(false)} className="block rounded px-4 py-2.5 text-gold hover:bg-rum">
            Mon Compte
          </Link>
          <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block rounded px-4 py-2.5 text-parchment/60 hover:bg-rum">
            Admin
          </Link>
        </nav>
      )}
    </header>
  );
}
