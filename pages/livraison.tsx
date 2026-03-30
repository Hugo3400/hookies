import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type DeliveryZone = { name: string; description: string; fee: number };

const DEFAULT_ZONES: DeliveryZone[] = [
  { name: 'Los Santos County', description: 'Livraison dans tout le comté de Los Santos.', fee: 2.90 },
  { name: 'Blaine County', description: 'Livraison dans le comté de Blaine.', fee: 4.90 },
];

export default function LivraisonPage() {
  const [zones, setZones] = useState<DeliveryZone[]>(DEFAULT_ZONES);

  useEffect(() => {
    fetch('/api/public/delivery-zones')
      .then(r => r.ok ? r.json() : DEFAULT_ZONES)
      .then(data => setZones(data))
      .catch(() => {});
  }, []);

  return (
    <>
      <Head>
        <title>Livraison | Hookies</title>
        <meta
          name="description"
          content="Commandez Hookies en livraison : burgers, fish & chips et plats du jour livrés chez vous."
        />
      </Head>

      <main>
        <Header />

        <section className="px-4 py-16 md:px-6">
          <div className="mx-auto w-full max-w-7xl">
            <h1 className="font-pirate text-4xl text-gold md:text-5xl">Livraison</h1>
            <p className="mt-3 max-w-lg text-sm text-parchment/60">
              Vos plats Hookies livrés chauds chez vous, avec emballage isotherme.
            </p>
            <div className="rope-line mt-4 w-24" />

            <div className={`mt-10 grid grid-cols-1 gap-5 ${zones.length > 1 ? 'md:grid-cols-2' : ''}`}>
              {zones.map((zone, i) => (
                <div key={i} className="wood-card p-6">
                  <h2 className="font-pirate text-2xl text-parchment">{zone.name}</h2>
                  <p className="mt-2 text-sm text-parchment/60">{zone.description}</p>
                  <p className="mt-3 font-bold text-gold">${zone.fee.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
