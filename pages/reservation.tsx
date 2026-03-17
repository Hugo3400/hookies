import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ReservationPage() {
  return (
    <>
      <Head>
        <title>Reservation | Hookies</title>
        <meta
          name="description"
          content="Reservez votre table chez Hookies en quelques clics pour une experience pirate immersive."
        />
      </Head>

      <main className="text-white">
        <Header />

        <section className="px-4 py-16 md:px-6">
          <div className="mx-auto grid w-full max-w-7xl gap-6 md:grid-cols-2">
            <div className="glass-card rounded-2xl p-6 md:p-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.26em] text-amber-200/80">Reservation</p>
              <h1 className="font-display text-4xl font-black text-slate-100 md:text-5xl">Reserver votre table</h1>
              <p className="mt-4 text-slate-300/85">
                Selectionnez votre date, l'horaire et le nombre de convives. Notre equipage valide rapidement votre demande.
              </p>
              <ul className="mt-6 space-y-2 text-slate-200/90">
                <li>Service midi: 11h30 - 14h30</li>
                <li>Service soir: 18h30 - 23h30</li>
                <li>Groupes et privatisation sur demande</li>
              </ul>
            </div>

            <form className="glass-card rounded-2xl p-6 md:p-8">
              <h2 className="font-display text-2xl font-bold text-amber-100">Formulaire de reservation</h2>
              <div className="mt-5 space-y-4">
                <input type="text" placeholder="Nom" className="w-full rounded-xl border border-amber-700/30 bg-black/20 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-400" />
                <input type="email" placeholder="Email" className="w-full rounded-xl border border-amber-700/30 bg-black/20 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-400" />
                <input type="date" className="w-full rounded-xl border border-amber-700/30 bg-black/20 px-4 py-3 text-slate-100 outline-none" />
                <input type="time" className="w-full rounded-xl border border-amber-700/30 bg-black/20 px-4 py-3 text-slate-100 outline-none" />
                <input type="number" min={1} placeholder="Nombre de personnes" className="w-full rounded-xl border border-amber-700/30 bg-black/20 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-400" />
                <button type="button" className="rounded-xl bg-amber-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-400">Envoyer la demande</button>
              </div>
            </form>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
