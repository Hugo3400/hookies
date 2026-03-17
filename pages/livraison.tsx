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
          content="Commandez en livraison les menus Hookies avec suivi de commande et zones desservies."
        />
      </Head>

      <main className="text-white">
        <Header />

        <section className="px-4 py-16 md:px-6">
          <div className="mx-auto w-full max-w-7xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.26em] text-amber-200/80">Livraison</p>
            <h1 className="font-display text-4xl font-black text-slate-100 md:text-5xl">Service de livraison</h1>
            <p className="mt-4 max-w-2xl text-slate-300/85">
              Recevez vos menus Hookies chez vous avec emballage isotherme et suivi en direct.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-display text-2xl text-amber-100">Zone A</h2>
                <p className="mt-3 text-slate-300/85">Centre-ville et secteurs proches.</p>
                <p className="mt-3 text-sm font-semibold text-amber-200">Frais: 2.90 EUR</p>
              </div>
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-display text-2xl text-amber-100">Zone B</h2>
                <p className="mt-3 text-slate-300/85">Peripherie urbaine.</p>
                <p className="mt-3 text-sm font-semibold text-amber-200">Frais: 4.90 EUR</p>
              </div>
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-display text-2xl text-amber-100">Retrait</h2>
                <p className="mt-3 text-slate-300/85">Click & collect en 20 minutes.</p>
                <p className="mt-3 text-sm font-semibold text-amber-200">Gratuit</p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
