import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { RESERVATION_CONTENT } from '@/lib/config/siteContent';

export default function ReservationPage() {
  return (
    <>
      <Head>
        <title>{RESERVATION_CONTENT.pageTitle}</title>
        <meta
          name="description"
          content={RESERVATION_CONTENT.pageDescription}
        />
      </Head>

      <main>
        <Header />

        <section className="px-4 py-16 md:px-6">
          <div className="mx-auto grid w-full max-w-7xl gap-6 md:grid-cols-2">
            <div className="wood-card p-6 md:p-8">
              <h1 className="font-pirate text-4xl text-gold md:text-5xl">{RESERVATION_CONTENT.heading}</h1>
              <p className="mt-4 text-sm text-parchment/70">
                {RESERVATION_CONTENT.intro}
              </p>
              <div className="rope-line mt-5 w-20" />
              <ul className="mt-5 space-y-2 text-sm text-parchment/70">
                {RESERVATION_CONTENT.services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </div>

            <form className="wood-card p-6 md:p-8">
              <h2 className="font-pirate text-2xl text-parchment">{RESERVATION_CONTENT.formTitle}</h2>
              <div className="mt-4 rounded-sm border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-parchment/80">
                Le numero de telephone est obligatoire pour finaliser une reservation.
              </div>
              <div className="mt-5 space-y-4">
                <input type="text" placeholder="Nom" className="w-full rounded-sm border border-rope/30 bg-plank px-4 py-3 text-parchment outline-none placeholder:text-parchment/40" />
                <input type="email" placeholder="Email" className="w-full rounded-sm border border-rope/30 bg-plank px-4 py-3 text-parchment outline-none placeholder:text-parchment/40" />
                <input type="tel" required placeholder="Téléphone obligatoire" className="w-full rounded-sm border border-rope/30 bg-plank px-4 py-3 text-parchment outline-none placeholder:text-parchment/40" />
                <input type="date" className="w-full rounded-sm border border-rope/30 bg-plank px-4 py-3 text-parchment outline-none" />
                <input type="time" className="w-full rounded-sm border border-rope/30 bg-plank px-4 py-3 text-parchment outline-none" />
                <input type="number" min={1} placeholder="Nombre de personnes" className="w-full rounded-sm border border-rope/30 bg-plank px-4 py-3 text-parchment outline-none placeholder:text-parchment/40" />
                <button type="button" className="w-full rounded-sm bg-gold px-6 py-3 font-bold text-plank transition hover:bg-gold-light">
                  {RESERVATION_CONTENT.submitLabel}
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
