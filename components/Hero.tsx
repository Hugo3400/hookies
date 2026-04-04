import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type WeeklyMenuItem = {
  name: string;
  description: string;
  price: string;
};

type WeeklyMenuData = {
  title: string;
  subtitle: string;
  weekLabel: string;
  items: WeeklyMenuItem[];
};

const FALLBACK_WEEKLY_MENU: WeeklyMenuData = {
  title: 'Menus de la semaine',
  subtitle: 'La sélection du capitaine',
  weekLabel: 'Semaine en cours',
  items: [
    {
      name: 'Ration du Moussaillon',
      description: 'Fish burger, petite portion de frites et boisson du marin.',
      price: '$300',
    },
    {
      name: 'Le Kraken Croustillant',
      description: 'Filet de poisson pané, onion rings dorés, salade croquante et sauce citronnée.',
      price: '$500',
    },
    {
      name: 'Le Trésor du Capitaine',
      description: 'Double fish burger du capitaine, grande portion de frites et boisson du marin.',
      price: '$500',
    },
  ],
};

export default function Hero() {
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenuData>(FALLBACK_WEEKLY_MENU);

  useEffect(() => {
    let mounted = true;

    const loadWeeklyMenu = async () => {
      try {
        const response = await fetch('/api/public/weekly-menu');
        if (!response.ok) return;
        const data = (await response.json()) as WeeklyMenuData;
        if (mounted && data?.items?.length) {
          setWeeklyMenu(data);
        }
      } catch (error) {
        console.error('Erreur chargement menu de la semaine:', error);
      }
    };

    loadWeeklyMenu();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="accueil" className="grain relative overflow-hidden">
      {/* Full-width hero background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/da/hero-bg-clean.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-plank/70 via-plank/50 to-plank" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-20 pt-16 md:px-6 md:pt-24">
        <div className="max-w-2xl">
          <h1 className="font-pirate text-5xl leading-tight text-bone md:text-7xl">
            Bienvenue à bord,<br />
            <span className="gold-text">moussaillon.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-parchment/80">
            Fish burgers, fruits de mer, huîtres, moules frites et ambiance de corsaire. On vous attend 7j/7 de 11h30 à 23h30.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/reservation" className="rounded-sm bg-gold px-7 py-3 text-sm font-bold text-plank transition hover:bg-gold-light">
              Réserver une table
            </Link>
            <Link href="/menu" className="rounded-sm border-2 border-parchment/25 px-7 py-3 text-sm font-bold text-parchment transition hover:border-gold/50 hover:text-gold">
              Voir la carte
            </Link>
          </div>
        </div>

        {/* Weekly menu — parchment style */}
        <div className="parchment-card mt-14 max-w-xl p-6 md:p-8">
          <p className="font-subtitle text-[10px] tracking-[0.2em] text-rum/70">{weeklyMenu.subtitle}</p>
          <h3 className="mt-1 text-3xl text-rum md:text-4xl">{weeklyMenu.title}</h3>

          <div className="mt-5 space-y-3">
            {weeklyMenu.items.map((item, index) => (
              <div key={`${item.name}-${index}`} className="flex items-start justify-between gap-4 border-b border-rum/15 pb-3 last:border-0">
                <div>
                  <p className="font-bold text-rum">{item.name}</p>
                  <p className="mt-0.5 text-sm text-rum/70">{item.description}</p>
                </div>
                <p className="whitespace-nowrap font-bold text-blood">{item.price}</p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-rum/50">{weeklyMenu.weekLabel}</p>
        </div>
      </div>
    </section>
  );
}
