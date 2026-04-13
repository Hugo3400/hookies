import React from 'react';
import { FaAnchor, FaFish, FaGlassCheers, FaUsers } from 'react-icons/fa';
import { FEATURES_CONTENT } from '@/lib/config/siteContent';

export default function Features() {
  return (
    <section id="services" className="grain border-t-2 border-rope/20 bg-plank-light px-4 py-16 md:px-6 md:py-20">
      <div className="mx-auto w-full max-w-7xl">
        <h2 className="font-pirate text-center text-4xl text-gold md:text-5xl">{FEATURES_CONTENT.title}</h2>
        <div className="rope-line mx-auto mt-4 w-32" />

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="wood-card h-full p-6">
            <FaAnchor className="text-3xl text-gold" />
            <h3 className="mt-4 font-pirate text-2xl text-parchment">{FEATURES_CONTENT.cards.freshSeafood.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-parchment/70">
              {FEATURES_CONTENT.cards.freshSeafood.description}
            </p>
          </div>

          <div className="wood-card h-full p-6">
            <FaFish className="text-2xl text-gold" />
            <h3 className="mt-3 font-pirate text-2xl text-parchment">{FEATURES_CONTENT.cards.burgers.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-parchment/70">
              {FEATURES_CONTENT.cards.burgers.description}
            </p>
          </div>

          <div className="wood-card h-full p-6">
            <FaGlassCheers className="text-2xl text-gold" />
            <h3 className="mt-3 font-pirate text-2xl text-parchment">{FEATURES_CONTENT.cards.drinks.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-parchment/70">
              {FEATURES_CONTENT.cards.drinks.description}
            </p>
          </div>

          <div className="wood-card h-full p-6">
            <FaUsers className="text-2xl text-gold" />
            <h3 className="mt-3 font-pirate text-2xl text-parchment">{FEATURES_CONTENT.cards.events.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-parchment/70">
              {FEATURES_CONTENT.cards.events.description}
            </p>
          </div>
        </div>

        <div className="mx-auto mt-5 max-w-3xl">
          <div className="wood-card p-6 text-center">
            <h3 className="font-pirate text-2xl text-gold">{FEATURES_CONTENT.openingTitle}</h3>
            <p className="mt-2 text-sm leading-relaxed text-parchment/70">
              {FEATURES_CONTENT.openingDescription}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
