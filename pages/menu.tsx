import Head from 'next/head';
import Header from '@/components/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/Footer';
import { FaUtensils } from 'react-icons/fa';

export default function MenuPage() {
  return (
    <>
      <Head>
        <title>Menu | Hookies</title>
        <meta
          name="description"
          content="Consultez la carte du restaurant Hookies: burgers signature, recettes marines et creations de la semaine."
        />
      </Head>

      <main className="text-white">
        <Header />
        <section className="px-4 pt-14 md:px-6 md:pt-20">
          <div className="mx-auto w-full max-w-7xl">
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.26em] text-amber-200/80"><FaUtensils /> La carte</p>
            <h1 className="font-display text-4xl font-black text-slate-100 md:text-5xl">Menu Hookies</h1>
            <p className="mt-4 max-w-2xl text-slate-300/85">
              Retrouvez nos plats emblématiques, nos recettes du capitaine et la sélection de la semaine.
            </p>
          </div>
        </section>
        <Menu />
        <Footer />
      </main>
    </>
  );
}
