import React from 'react';
import { FaAnchor, FaFish, FaGlassCheers, FaUsers } from 'react-icons/fa';

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
            <FaAnchor className="text-3xl text-gold" />
            <h3 className="mt-4 font-pirate text-3xl text-parchment">Fruits de mer & poisson frais</h3>
            <p className="mt-3 text-sm leading-relaxed text-parchment/70">
              Huîtres, homard, langouste, moules frites, tartares de saumon et de crabe — tout arrive frais du port.
              Calamars grillés, soupe de poisson, paniers du pêcheur — la mer dans votre assiette.
            </p>
          </div>

          <div className="wood-card p-6">
            <FaFish className="text-2xl text-gold" />
            <h3 className="mt-3 font-pirate text-2xl text-parchment">Fish burgers du capitaine</h3>
            <p className="mt-2 text-sm text-parchment/70">
              Fish burgers croustillants, filet de poisson pané, onion rings dorés et sauces maison. Le classique du port, version Hookies.
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
