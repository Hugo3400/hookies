import React from 'react';
import { FaAnchor, FaFish, FaGlassCheers, FaUsers } from 'react-icons/fa';
import { FEATURES_CONTENT } from '@/lib/config/siteContent';

export default function Features() {
  return (
    <section id="services" className="grain border-t-2 border-rope/20 bg-plank-light px-4 py-16 md:px-6 md:py-20">
      <div className="mx-auto w-full max-w-7xl">
        <h2 className="font-pirate text-center text-4xl text-gold md:text-5xl">{FEATURES_CONTENT.title}</h2>
        <div className="rope-line mx-auto mt-4 w-32" />

        {/* Asymmetric layout — not a perfect 3x2 grid */}
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Large featured card */}
          <div className="wood-card row-span-2 p-8">
            <FaAnchor className="text-3xl text-gold" />
            <h3 className="mt-4 font-pirate text-3xl text-parchment">{FEATURES_CONTENT.cards.freshSeafood.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-parchment/70">
              {FEATURES_CONTENT.cards.freshSeafood.description}
            </p>
          </div>

          <div className="wood-card p-6">
            <FaFish className="text-2xl text-gold" />
            <h3 className="mt-3 font-pirate text-2xl text-parchment">{FEATURES_CONTENT.cards.burgers.title}</h3>
            <p className="mt-2 text-sm text-parchment/70">
              {FEATURES_CONTENT.cards.burgers.description}
            </p>
          </div>

          <div className="wood-card p-6">
            <FaGlassCheers className="text-2xl text-gold" />
            <h3 className="mt-3 font-pirate text-2xl text-parchment">{FEATURES_CONTENT.cards.drinks.title}</h3>
            <p className="mt-2 text-sm text-parchment/70">
              {FEATURES_CONTENT.cards.drinks.description}
            </p>
          </div>
        </div>

        {/* Bottom row — full width callout */}
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="wood-card p-6">
            <FaUsers className="text-2xl text-gold" />
            <h3 className="mt-3 font-pirate text-2xl text-parchment">{FEATURES_CONTENT.cards.events.title}</h3>
            <p className="mt-2 text-sm text-parchment/70">
              {FEATURES_CONTENT.cards.events.description}
            </p>
          </div>
          <div className="wood-card col-span-1 flex flex-col justify-center p-6 md:col-span-2">
            <h3 className="font-pirate text-2xl text-gold">{FEATURES_CONTENT.openingTitle}</h3>
            <p className="mt-2 text-sm text-parchment/70">
              {FEATURES_CONTENT.openingDescription}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
