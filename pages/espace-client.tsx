import Head from 'next/head';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  menuItem?: {
    name: string;
  };
};

type Order = {
  id: string;
  orderNumber: string;
  totalPrice: number;
  status: string;
  type: string;
  createdAt: string;
  orderItems: OrderItem[];
};

type Reservation = {
  id: string;
  date: string;
  time: string;
  guestCount: number;
  status: string;
};

export default function EspaceClientPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalOrders = orders.length;
  const totalReservations = reservations.length;
  const totalSpent = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0),
    [orders]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedToken = window.localStorage.getItem('hookies_token');
    const savedUser = window.localStorage.getItem('hookies_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        window.localStorage.removeItem('hookies_token');
        window.localStorage.removeItem('hookies_user');
      }
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchClientData = async () => {
      setLoadingData(true);
      setError(null);

      try {
        const [ordersRes, reservationsRes] = await Promise.all([
          fetch('/api/orders', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('/api/reservations', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (ordersRes.status === 401 || reservationsRes.status === 401) {
          handleLogout();
          setError('Session expiree, reconnectez-vous.');
          return;
        }

        if (!ordersRes.ok || !reservationsRes.ok) {
          setError('Impossible de charger vos informations client.');
          return;
        }

        const ordersData = (await ordersRes.json()) as Order[];
        const reservationsData = (await reservationsRes.json()) as Reservation[];

        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setReservations(Array.isArray(reservationsData) ? reservationsData : []);
      } catch {
        setError('Erreur reseau lors du chargement de votre espace client.');
      } finally {
        setLoadingData(false);
      }
    };

    fetchClientData();
  }, [token]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoadingLogin(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || 'Connexion impossible.');
        return;
      }

      setToken(data.token);
      setUser(data.user);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem('hookies_token', data.token);
        window.localStorage.setItem('hookies_user', JSON.stringify(data.user));
      }
    } catch {
      setError('Erreur reseau pendant la connexion.');
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setOrders([]);
    setReservations([]);

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('hookies_token');
      window.localStorage.removeItem('hookies_user');
    }
  };

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

              {user && (
                <div className="mt-6 rounded-xl border border-amber-700/30 bg-black/20 p-4">
                  <p className="text-sm text-slate-300">Connecte en tant que</p>
                  <p className="mt-1 text-lg font-semibold text-amber-100">{user.name}</p>
                  <p className="text-sm text-slate-300">{user.email}</p>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-4 rounded-lg border border-amber-500/40 px-4 py-2 text-sm font-semibold text-amber-200 transition hover:bg-amber-500/15"
                  >
                    Se deconnecter
                  </button>
                </div>
              )}
            </div>

            {!token ? (
              <form onSubmit={handleLogin} className="glass-card rounded-2xl p-6 md:p-8">
                <h2 className="font-display text-2xl font-bold text-amber-100">Connexion</h2>
                <div className="mt-5 space-y-4">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full rounded-xl border border-amber-700/30 bg-black/20 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-400"
                  />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mot de passe"
                    className="w-full rounded-xl border border-amber-700/30 bg-black/20 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    disabled={loadingLogin}
                    className="rounded-xl bg-amber-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-60"
                  >
                    {loadingLogin ? 'Connexion...' : 'Se connecter'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="glass-card rounded-2xl p-6 md:p-8">
                <h2 className="font-display text-2xl font-bold text-amber-100">Tableau de bord</h2>
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-amber-700/30 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-300/70">Commandes</p>
                    <p className="mt-2 text-2xl font-bold text-amber-200">{totalOrders}</p>
                  </div>
                  <div className="rounded-xl border border-amber-700/30 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-300/70">Reservations</p>
                    <p className="mt-2 text-2xl font-bold text-amber-200">{totalReservations}</p>
                  </div>
                  <div className="rounded-xl border border-amber-700/30 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-300/70">Total depense</p>
                    <p className="mt-2 text-2xl font-bold text-amber-200">{totalSpent.toFixed(2)} EUR</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mx-auto mt-5 w-full max-w-7xl rounded-xl border border-red-600/50 bg-red-950/30 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {token && (
            <div className="mx-auto mt-6 grid w-full max-w-7xl gap-6 lg:grid-cols-2">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display text-2xl font-bold text-amber-100">Dernieres commandes</h3>
                {loadingData ? (
                  <p className="mt-4 text-slate-300">Chargement des commandes...</p>
                ) : orders.length === 0 ? (
                  <p className="mt-4 text-slate-300">Aucune commande pour le moment.</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="rounded-xl border border-amber-700/30 bg-black/20 p-4">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-amber-100">{order.orderNumber}</p>
                          <p className="text-sm text-amber-200">{Number(order.totalPrice).toFixed(2)} EUR</p>
                        </div>
                        <p className="mt-1 text-sm text-slate-300">Statut: {order.status}</p>
                        <p className="text-sm text-slate-300">Type: {order.type}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display text-2xl font-bold text-amber-100">Dernieres reservations</h3>
                {loadingData ? (
                  <p className="mt-4 text-slate-300">Chargement des reservations...</p>
                ) : reservations.length === 0 ? (
                  <p className="mt-4 text-slate-300">Aucune reservation pour le moment.</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {reservations.slice(0, 5).map((reservation) => (
                      <div key={reservation.id} className="rounded-xl border border-amber-700/30 bg-black/20 p-4">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-amber-100">{reservation.time}</p>
                          <p className="text-sm text-amber-200">{reservation.guestCount} pers.</p>
                        </div>
                        <p className="mt-1 text-sm text-slate-300">Date: {new Date(reservation.date).toLocaleDateString('fr-FR')}</p>
                        <p className="text-sm text-slate-300">Statut: {reservation.status}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        <Footer />
      </main>
    </>
  );
}
