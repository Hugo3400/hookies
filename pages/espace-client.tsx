import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function EspaceClientPage() {
  return (
    <>
      <Head>
        <title>Espace Client | Hookies</title>
        <meta
          name="description"
          content="Connectez-vous a votre espace client Hookies pour suivre commandes, reservations et historique."
        />
      </Head>

      <main className="text-white">
        <Header />

        <section className="px-4 py-16 md:px-6">
          <div className="mx-auto grid w-full max-w-7xl gap-6 md:grid-cols-2">
            <div className="glass-card rounded-2xl p-6 md:p-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.26em] text-amber-200/80">Portail client</p>
              <h1 className="font-display text-4xl font-black text-slate-100 md:text-5xl">Espace client</h1>
              <p className="mt-4 text-slate-300/85">
                Retrouvez vos commandes, reservations et informations personnelles dans votre tableau de bord.
              </p>
            </div>

            <form className="glass-card rounded-2xl p-6 md:p-8">
              <h2 className="font-display text-2xl font-bold text-amber-100">Connexion</h2>
              <div className="mt-5 space-y-4">
                <input type="email" placeholder="Email" className="w-full rounded-xl border border-amber-700/30 bg-black/20 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-400" />
                <input type="password" placeholder="Mot de passe" className="w-full rounded-xl border border-amber-700/30 bg-black/20 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-400" />
                <button type="button" className="rounded-xl bg-amber-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-400">Se connecter</button>
              </div>
            </form>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
