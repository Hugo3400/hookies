import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ReservationPage() {
  return (
    <>
      <Head>
        <title>Réserver | Hookies</title>
        <meta
          name="description"
          content="Réservez votre table au restaurant Hookies. Ouvert 7j/7, midi et soir."
        />
      </Head>

      <main>
        <Header />

        <section className="px-4 py-16 md:px-6">
          <div className="mx-auto grid w-full max-w-7xl gap-6 md:grid-cols-2">
            <div className="wood-card p-6 md:p-8">
              <h1 className="font-pirate text-4xl text-gold md:text-5xl">Réserver une table</h1>
              <p className="mt-4 text-sm text-parchment/70">
                Choisissez votre créneau et le nombre de convives. On vous confirme ça rapidement.
              </p>
              <div className="rope-line mt-5 w-20" />
              <ul className="mt-5 space-y-2 text-sm text-parchment/70">
                <li>Service midi : 11h30 – 14h30</li>
                <li>Service soir : 18h30 – 23h30</li>
                <li>Groupes &amp; privatisation : appelez-nous</li>
              </ul>
            </div>

            <form className="wood-card p-6 md:p-8">
              <h2 className="font-pirate text-2xl text-parchment">Formulaire</h2>
              <div className="mt-5 space-y-4">
                <input type="text" placeholder="Nom" className="w-full rounded-sm border border-rope/30 bg-plank px-4 py-3 text-parchment outline-none placeholder:text-parchment/40" />
                <input type="email" placeholder="Email" className="w-full rounded-sm border border-rope/30 bg-plank px-4 py-3 text-parchment outline-none placeholder:text-parchment/40" />
                <input type="date" className="w-full rounded-sm border border-rope/30 bg-plank px-4 py-3 text-parchment outline-none" />
                <input type="time" className="w-full rounded-sm border border-rope/30 bg-plank px-4 py-3 text-parchment outline-none" />
                <input type="number" min={1} placeholder="Nombre de personnes" className="w-full rounded-sm border border-rope/30 bg-plank px-4 py-3 text-parchment outline-none placeholder:text-parchment/40" />
                <button type="button" className="w-full rounded-sm bg-gold px-6 py-3 font-bold text-plank transition hover:bg-gold-light">
                  Envoyer la demande
                </button>
              </div>
            </form>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
