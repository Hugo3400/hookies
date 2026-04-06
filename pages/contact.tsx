import Head from 'next/head';
import { FormEvent, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CONTACT_PAGE_CONTENT, SITE_CONTACT } from '@/lib/config/siteContent';

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
        setError(data?.error || CONTACT_PAGE_CONTENT.feedback.sendError);
        return;
      }

      setSuccess(CONTACT_PAGE_CONTENT.feedback.sendSuccess);
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setError(CONTACT_PAGE_CONTENT.feedback.networkError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{CONTACT_PAGE_CONTENT.pageTitle}</title>
        <meta
          name="description"
          content={CONTACT_PAGE_CONTENT.pageDescription}
        />
      </Head>

      <main>
        <Header />

        <section className="px-4 py-16 md:px-6">
          <div className="mx-auto grid w-full max-w-7xl gap-6 md:grid-cols-2">
            <div className="wood-card p-6 md:p-8">
              <h1 className="font-pirate text-4xl text-gold md:text-5xl">{CONTACT_PAGE_CONTENT.heading}</h1>
              <p className="mt-4 text-sm text-parchment/70">
                {CONTACT_PAGE_CONTENT.intro}
              </p>
              <div className="rope-line mt-5 w-20" />
              <ul className="mt-5 space-y-2 text-sm text-parchment/70">
                <li>{SITE_CONTACT.phone}</li>
                <li>{SITE_CONTACT.email}</li>
                <li>{SITE_CONTACT.address}</li>
                <li>{SITE_CONTACT.openingHours}</li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="wood-card p-6 md:p-8">
              <h2 className="font-pirate text-2xl text-parchment">{CONTACT_PAGE_CONTENT.formTitle}</h2>
              <div className="mt-5 space-y-4">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={CONTACT_PAGE_CONTENT.placeholders.name}
                  className="w-full rounded-sm border border-rope/30 bg-plank px-4 py-3 text-parchment outline-none placeholder:text-parchment/40"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={CONTACT_PAGE_CONTENT.placeholders.email}
                  className="w-full rounded-sm border border-rope/30 bg-plank px-4 py-3 text-parchment outline-none placeholder:text-parchment/40"
                />
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={CONTACT_PAGE_CONTENT.placeholders.message}
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
                  {loading ? CONTACT_PAGE_CONTENT.feedback.sending : CONTACT_PAGE_CONTENT.feedback.send}
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
