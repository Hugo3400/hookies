import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t-2 border-rope/20 bg-plank px-4 py-12 md:px-6">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <span className="font-pirate text-3xl text-gold">Hookies</span>
            <p className="mt-3 text-sm text-parchment/50">
              Restaurant pirate &amp; grillades au feu de bois. Ouvert 7j/7 de 11h30 à 23h30.
            </p>
          </div>

          <div>
            <p className="font-subtitle text-xs tracking-[0.15em] text-gold/80">Plan du site</p>
            <ul className="mt-3 space-y-1.5 text-sm text-parchment/60">
              <li><Link href="/" className="transition hover:text-gold">Accueil</Link></li>
              <li><Link href="/menu" className="transition hover:text-gold">La Carte</Link></li>
              <li><Link href="/reservation" className="transition hover:text-gold">Réserver</Link></li>
              <li><Link href="/livraison" className="transition hover:text-gold">Livraison</Link></li>
              <li><Link href="/contact" className="transition hover:text-gold">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-subtitle text-xs tracking-[0.15em] text-gold/80">Nous trouver</p>
            <ul className="mt-3 space-y-1.5 text-sm text-parchment/60">
              <li>+33 (0)1 23 45 67 89</li>
              <li>contact@hookies.fr</li>
              <li>12 Rue de la Mer, 75000</li>
              <li>Lun – Dim : 11h30 – 23h30</li>
            </ul>
          </div>
        </div>

        <div className="rope-line my-8" />

        <div className="flex flex-col items-center justify-between gap-2 text-xs text-parchment/35 md:flex-row">
          <p>&copy; 2026 Hookies. Tous droits réservés.</p>
          <p>Taverne &amp; Grillades au feu de bois.</p>
        </div>
      </div>
    </footer>
  );
}
