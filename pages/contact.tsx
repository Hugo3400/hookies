import Head from 'next/head';
import { FormEvent, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || 'Impossible d\'envoyer le message.');
        return;
      }

      setSuccess('Message envoye. Nous revenons vers vous rapidement.');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setError('Erreur reseau pendant l\'envoi du message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact | Hookies</title>
        <meta
          name="description"
          content="Contactez Hookies pour une reservation, un evenement prive ou toute demande d'information."
        />
      </Head>

      <main className="text-white">
        <Header />

        <section className="px-4 py-16 md:px-6">
          <div className="mx-auto grid w-full max-w-7xl gap-6 md:grid-cols-2">
            <div className="glass-card rounded-2xl p-6 md:p-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.26em] text-amber-200/80">Contact</p>
              <h1 className="font-display text-4xl font-black text-slate-100 md:text-5xl">Parlez au capitaine</h1>
              <p className="mt-4 text-slate-300/85">
                Notre equipe vous repond pour les reservations, groupes et evenements prives.
              </p>
              <ul className="mt-6 space-y-2 text-slate-200/90">
                <li>Telephone: +33 (0)1 23 45 67 89</li>
                <li>Email: contact@hookies.fr</li>
                <li>Adresse: 12 Rue de la Mer, 75000 Paris</li>
                <li>Horaires: Lun - Dim, 11h30 - 23h30</li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 md:p-8">
              <h2 className="font-display text-2xl font-bold text-amber-100">Demande rapide</h2>
              <div className="mt-5 space-y-4">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nom complet"
                  className="w-full rounded-xl border border-amber-700/30 bg-black/20 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-400"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full rounded-xl border border-amber-700/30 bg-black/20 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-400"
                />
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Votre message"
                  rows={5}
                  className="w-full rounded-xl border border-amber-700/30 bg-black/20 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-400"
                />

                {error && <p className="text-sm text-red-200">{error}</p>}
                {success && <p className="text-sm text-amber-100">{success}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-amber-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-60"
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer'}
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
