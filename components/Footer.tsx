import React from 'react';
import Link from 'next/link';
import { SITE_BRAND, SITE_NAV_LINKS } from '@/lib/config/siteContent';

export default function Footer() {
  return (
    <footer className="border-t-2 border-rope/20 bg-plank px-4 py-12 md:px-6">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <span className="font-pirate text-3xl text-gold">{SITE_BRAND.name}</span>
          </div>

          <div>
            <p className="font-subtitle text-xs tracking-[0.15em] text-gold/80">Plan du site</p>
            <ul className="mt-3 space-y-1.5 text-sm text-parchment/60">
              {SITE_NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-gold">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rope-line my-8" />

        <div className="flex flex-col items-center justify-between gap-2 text-xs text-parchment/35 md:flex-row">
          <p>&copy; {SITE_BRAND.year} {SITE_BRAND.name}. {SITE_BRAND.legalLine}</p>
        </div>
      </div>
    </footer>
  );
}
