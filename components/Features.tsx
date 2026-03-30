import React from 'react';
import { FaFire, FaDrumstickBite, FaGlassCheers, FaUsers } from 'react-icons/fa';

export default function Features() {
  return (
    <section id="services" className="grain border-t-2 border-rope/20 bg-plank-light px-4 py-16 md:px-6 md:py-20">
      <div className="mx-auto w-full max-w-7xl">
        <h2 className="font-pirate text-center text-4xl text-gold md:text-5xl">Pourquoi Hookies ?</h2>
        <div className="rope-line mx-auto mt-4 w-32" />

        {/* Asymmetric layout — not a perfect 3x2 grid */}
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Large featured card */}
          <div className="wood-card row-span-2 p-8">
            <FaFire className="text-3xl text-gold" />
            <h3 className="mt-4 font-pirate text-3xl text-parchment">Grill au feu de bois</h3>
            <p className="mt-3 text-sm leading-relaxed text-parchment/70">
              Nos viandes sont grillées à la flamme dans notre cuisine ouverte. Vous sentez la braise depuis la salle.
              Côte de boeuf maturée, ribs fumés, poulet mariné — tout est cuit sous vos yeux.
            </p>
          </div>

          <div className="wood-card p-6">
            <FaDrumstickBite className="text-2xl text-gold" />
            <h3 className="mt-3 font-pirate text-2xl text-parchment">Fish &amp; Chips de la cale</h3>
            <p className="mt-2 text-sm text-parchment/70">
              Poisson frais pané à la bière, frites épaisses et sauce tartare maison. Le classique du port, version Hookies.
            </p>
          </div>

          <div className="wood-card p-6">
            <FaGlassCheers className="text-2xl text-gold" />
            <h3 className="mt-3 font-pirate text-2xl text-parchment">Rhums &amp; Cocktails</h3>
            <p className="mt-2 text-sm text-parchment/70">
              Carte de 30 rhums arrangés et cocktails tiki. Le Dark Storm, le Captain's Punch — ça se mérite.
            </p>
          </div>
        </div>

        {/* Bottom row — full width callout */}
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="wood-card p-6">
            <FaUsers className="text-2xl text-gold" />
            <h3 className="mt-3 font-pirate text-2xl text-parchment">Soirées &amp; Groupes</h3>
            <p className="mt-2 text-sm text-parchment/70">
              Anniversaires, pots de départ, enterrements de vie — on privatise une partie de la salle. Appelez-nous.
            </p>
          </div>
          <div className="wood-card col-span-1 flex flex-col justify-center p-6 md:col-span-2">
            <h3 className="font-pirate text-2xl text-gold">Ouvert tous les jours</h3>
            <p className="mt-2 text-sm text-parchment/70">
              Midi : 11h30 – 14h30 &middot; Soir : 18h30 – 23h30 &middot; Happy hour de 17h à 19h du lundi au jeudi.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
