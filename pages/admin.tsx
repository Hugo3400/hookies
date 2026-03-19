import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type AdminStatus = 'loading' | 'allowed' | 'denied';

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function AdminPage() {
  const [status, setStatus] = useState<AdminStatus>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = window.localStorage.getItem('hookies_token');
    if (!token) {
      setStatus('denied');
      return;
    }

    const checkAccess = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          setStatus('denied');
          return;
        }

        const data = await response.json();
        const authUser = data?.user as AuthUser | undefined;

        if (authUser?.role === 'ADMIN') {
          setUser(authUser);
          setStatus('allowed');
        } else {
          setStatus('denied');
        }
      } catch {
        setStatus('denied');
      }
    };

    checkAccess();
  }, []);

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
          {status === 'loading' && (
            <div className="mx-auto w-full max-w-7xl rounded-2xl border border-amber-700/30 bg-black/20 p-8 text-slate-200">
              Verification des droits administrateur...
            </div>
          )}

          {status === 'denied' && (
            <div className="mx-auto w-full max-w-7xl rounded-2xl border border-red-700/40 bg-red-950/25 p-8">
              <h1 className="font-display text-3xl font-bold text-red-200">Acces refuse</h1>
              <p className="mt-3 max-w-2xl text-red-100/90">
                Cette page est reservee aux administrateurs. Connectez-vous avec un compte admin pour continuer.
              </p>
              <Link
                href="/espace-client"
                className="mt-6 inline-block rounded-xl border border-amber-500/40 bg-amber-500/15 px-5 py-2.5 text-sm font-semibold text-amber-100 transition hover:bg-amber-500/30"
              >
                Aller a l'espace client
              </Link>
            </div>
          )}

          {status === 'allowed' && (
            <div className="mx-auto w-full max-w-7xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.26em] text-amber-200/80">Back-office</p>
              <h1 className="font-display text-4xl font-black text-slate-100 md:text-5xl">Panel administrateur</h1>
              <p className="mt-4 max-w-2xl text-slate-300/85">
                Bonjour {user?.name}, vous pouvez piloter les menus hebdomadaires, les commandes et les reservations.
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
          )}
        </section>

        <Footer />
      </main>
    </>
  );
}
