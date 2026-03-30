import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LivraisonPage() {
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

            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
              <div className="wood-card p-6">
                <h2 className="font-pirate text-2xl text-parchment">Zone A</h2>
                <p className="mt-2 text-sm text-parchment/60">Centre-ville et alentours.</p>
                <p className="mt-3 font-bold text-gold">2,90 &euro;</p>
              </div>
              <div className="wood-card p-6">
                <h2 className="font-pirate text-2xl text-parchment">Zone B</h2>
                <p className="mt-2 text-sm text-parchment/60">Périphérie.</p>
                <p className="mt-3 font-bold text-gold">4,90 &euro;</p>
              </div>
              <div className="wood-card p-6">
                <h2 className="font-pirate text-2xl text-parchment">Click &amp; Collect</h2>
                <p className="mt-2 text-sm text-parchment/60">Prêt en 20 minutes.</p>
                <p className="mt-3 font-bold text-green-400">Gratuit</p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
