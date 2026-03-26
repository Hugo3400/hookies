import Head from 'next/head';
import { FaCompass } from 'react-icons/fa';
import Header from '@/components/Header';
import Features from '@/components/Features';
import Footer from '@/components/Footer';

export default function ExperiencePage() {
  return (
    <>
      <Head>
        <title>Experience | Hookies</title>
        <meta
          name="description"
          content="Decouvrez l'experience Hookies: ambiance pirate, cuisine ouverte, service premium et immersion complete."
        />
      </Head>

      <main className="text-white">
        <Header />
        <section className="px-4 pt-14 md:px-6 md:pt-20">
          <div className="mx-auto w-full max-w-7xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.26em] text-amber-200/80">Immersion</p>
            <h1 className="inline-flex items-center gap-3 font-display text-4xl font-black text-slate-100 md:text-5xl"><FaCompass className="text-amber-400" /> L'experience Hookies</h1>
            <p className="mt-4 max-w-2xl text-slate-300/85">
              Une identite pirate forte, un service moderne et des espaces pensés pour une soiree memorable.
            </p>
          </div>
        </section>
        <Features />
        <Footer />
      </main>
    </>
  );
}
