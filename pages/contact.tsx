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

      <main>
        <Header />

        <section className="px-4 py-16 md:px-6">
          <div className="mx-auto grid w-full max-w-7xl gap-6 md:grid-cols-2">
            <div className="wood-card p-6 md:p-8">
              <h1 className="font-pirate text-4xl text-gold md:text-5xl">Contact</h1>
              <p className="mt-4 text-sm text-parchment/70">
                Réservations, groupes, événements — on vous répond vite.
              </p>
              <div className="rope-line mt-5 w-20" />
              <ul className="mt-5 space-y-2 text-sm text-parchment/70">
                <li>+33 (0)1 23 45 67 89</li>
                <li>contact@hookies.fr</li>
                <li>12 Rue de la Mer, 75000</li>
                <li>Lun – Dim : 11h30 – 23h30</li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="wood-card p-6 md:p-8">
              <h2 className="font-pirate text-2xl text-parchment">Envoyer un message</h2>
              <div className="mt-5 space-y-4">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nom"
                  className="w-full rounded-sm border border-rope/30 bg-plank px-4 py-3 text-parchment outline-none placeholder:text-parchment/40"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full rounded-sm border border-rope/30 bg-plank px-4 py-3 text-parchment outline-none placeholder:text-parchment/40"
                />
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Votre message"
                  rows={5}
                  className="w-full rounded-sm border border-rope/30 bg-plank px-4 py-3 text-parchment outline-none placeholder:text-parchment/40"
                />

                {error && <p className="text-sm text-red-300">{error}</p>}
                {success && <p className="text-sm text-green-300">{success}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-sm bg-gold px-6 py-3 font-bold text-plank transition hover:bg-gold-light disabled:opacity-60"
                >
                  {loading ? 'Envoi...' : 'Envoyer'}
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
