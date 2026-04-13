import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

export default function MaintenancePage() {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState('');

  const nextPath = useMemo(() => {
    const value = router.query.next;
    if (typeof value !== 'string') return '/';
    return value.startsWith('/') ? value : '/';
  }, [router.query.next]);

  useEffect(() => {
    if (!router.isReady || typeof window === 'undefined') return;

    const storedToken = window.localStorage.getItem('hookies_token');
    if (!storedToken) return;

    let cancelled = false;
    setStatusMessage('Verification de votre acces staff...');

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (cancelled || !data?.user) return;

        if (data?.token) {
          window.localStorage.setItem('hookies_token', data.token);
        }

        if (data.user.role === 'WEBMASTER') {
          window.location.replace(nextPath || '/');
          return;
        }

        setStatusMessage('Maintenance active. Acces reserve temporairement au webmaster.');
      })
      .catch(() => {
        if (!cancelled) {
          setStatusMessage('Maintenance active.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [nextPath, router.isReady]);

  return (
    <>
      <Head>
        <title>Hookies - Maintenance en cours</title>
        <meta
          name="description"
          content="Le site Hookies est temporairement indisponible pour maintenance."
        />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(201,149,43,0.18),transparent_45%),linear-gradient(180deg,#1c1209_0%,#120b06_100%)] px-6 py-16 text-center text-[#f0e6d3]">
        <div className="pointer-events-none absolute inset-0 opacity-20 grain" />

        <section className="relative mx-auto max-w-2xl rounded-md border border-[rgba(201,149,43,0.45)] bg-[linear-gradient(165deg,rgba(61,37,18,0.88),rgba(28,18,9,0.92))] p-8 shadow-[0_16px_60px_rgba(0,0,0,0.45)] sm:p-12">
          <p className="font-subtitle text-xs tracking-[0.25em] text-[#dbb44a] sm:text-sm">
            Hookies Restaurant
          </p>

          <h1 className="mt-4 text-5xl leading-none text-[#f0e6d3] sm:text-6xl">
            Maintenance en cours
          </h1>

          <div className="mx-auto my-7 h-[3px] w-28 rope-line" />

          <p className="mx-auto max-w-xl text-base text-[#e8d5b5] sm:text-lg">
            L equipage est en train d effectuer quelques reglages pour ameliorer
            votre experience. Le service revient tres vite.
          </p>

          <p className="mt-6 text-sm uppercase tracking-[0.2em] text-[#c9952b]">
            Merci pour votre patience
          </p>

          {statusMessage ? (
            <p className="mt-4 text-xs uppercase tracking-[0.14em] text-[#d8c39a]">
              {statusMessage}
            </p>
          ) : null}
        </section>
      </main>
    </>
  );
}