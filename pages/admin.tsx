import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AdminPage() {
  return (
    <>
      <Head>
        <title>Admin | Hookies</title>
        <meta
          name="description"
          content="Panneau administrateur Hookies pour gerer menus, commandes, reservations et contenus." 
        />
      </Head>

      <main className="text-white">
        <Header />

        <section className="px-4 py-16 md:px-6">
          <div className="mx-auto w-full max-w-7xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.26em] text-amber-200/80">Back-office</p>
            <h1 className="font-display text-4xl font-black text-slate-100 md:text-5xl">Panel administrateur</h1>
            <p className="mt-4 max-w-2xl text-slate-300/85">
              Espace de gestion central pour piloter les menus hebdomadaires, les commandes et les reservations.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="glass-card rounded-xl p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300/80">Menus</p>
                <p className="mt-2 font-semibold text-amber-100">Gerer la carte</p>
              </div>
              <div className="glass-card rounded-xl p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300/80">Reservations</p>
                <p className="mt-2 font-semibold text-amber-100">Suivi des tables</p>
              </div>
              <div className="glass-card rounded-xl p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300/80">Commandes</p>
                <p className="mt-2 font-semibold text-amber-100">Flux en temps reel</p>
              </div>
              <div className="glass-card rounded-xl p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300/80">Clients</p>
                <p className="mt-2 font-semibold text-amber-100">Gestion comptes</p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
