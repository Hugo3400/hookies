import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { RESERVATION_CONTENT } from '@/lib/config/siteContent';

type ReservationPageContent = {
  heading: string;
  intro: string;
  services: string[];
  formTitle: string;
  submitLabel: string;
};

export default function ReservationPage() {
  const [dynamicContent, setDynamicContent] = useState<ReservationPageContent | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/public/settings')
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (cancelled) return;
        const content = payload?.reservationPageContent;
        if (!content) return;
        setDynamicContent(content);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const content = useMemo(() => {
    if (!dynamicContent) return RESERVATION_CONTENT;
    return {
      ...RESERVATION_CONTENT,
      heading: dynamicContent.heading || RESERVATION_CONTENT.heading,
      intro: dynamicContent.intro || RESERVATION_CONTENT.intro,
      services: Array.isArray(dynamicContent.services) && dynamicContent.services.length > 0
        ? dynamicContent.services
        : RESERVATION_CONTENT.services,
      formTitle: dynamicContent.formTitle || RESERVATION_CONTENT.formTitle,
      submitLabel: dynamicContent.submitLabel || RESERVATION_CONTENT.submitLabel,
    };
  }, [dynamicContent]);

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
              <h1 className="font-pirate text-4xl text-gold md:text-5xl">{content.heading}</h1>
              <p className="mt-4 text-sm text-parchment/70">
                {content.intro}
              </p>
              <div className="rope-line mt-5 w-20" />
              <ul className="mt-5 space-y-2 text-sm text-parchment/70">
                {content.services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </div>

            <form className="wood-card p-6 md:p-8">
              <h2 className="font-pirate text-2xl text-parchment">{content.formTitle}</h2>
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
                  {content.submitLabel}
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
