import Head from 'next/head';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { FaSyncAlt, FaHandPeace } from 'react-icons/fa';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminNav from '@/components/admin/AdminNav';
import StatsTab from '@/components/admin/StatsTab';
import OrdersTab from '@/components/admin/OrdersTab';
import ReservationsTab from '@/components/admin/ReservationsTab';
import MenuTab from '@/components/admin/MenuTab';
import UsersTab from '@/components/admin/UsersTab';
import WeeklyMenuTab from '@/components/admin/WeeklyMenuTab';
import SettingsTab from '@/components/admin/SettingsTab';
import { useAdmin } from '@/hooks/useAdmin';
import type { AdminTab } from '@/components/admin/types';

type AuthStatus = 'loading' | 'allowed' | 'denied';

const VALID_ADMIN_TABS: AdminTab[] = ['dashboard', 'orders', 'reservations', 'menu', 'users', 'weekly-menu', 'settings'];

function getInitialAdminTab(): AdminTab {
  if (typeof window === 'undefined') return 'dashboard';
  const hash = window.location.hash.replace('#', '') as AdminTab;
  return VALID_ADMIN_TABS.includes(hash) ? hash : 'dashboard';
}

export default function AdminPage() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');
  const [adminName, setAdminName] = useState('');
  const [userRole, setUserRole] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, _setActiveTab] = useState<AdminTab>(getInitialAdminTab);

  const setActiveTab = useCallback((tab: AdminTab) => {
    _setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${tab}`);
    }
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '') as AdminTab;
      if (VALID_ADMIN_TABS.includes(hash)) _setActiveTab(hash);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const admin = useAdmin(token);
  const {
    loadStats,
    loadOrders,
    loadReservations,
    loadMenu,
    loadUsers,
    loadWeeklyMenu,
    loadSettings,
  } = admin;

  const refreshActiveTab = useCallback(() => {
    if (activeTab === 'dashboard') {
      loadStats();
      return;
    }
    if (activeTab === 'orders') {
      loadOrders();
      loadStats();
      return;
    }
    if (activeTab === 'reservations') {
      loadReservations();
      loadStats();
      return;
    }
    if (activeTab === 'menu') {
      loadMenu();
      return;
    }
    if (activeTab === 'users') {
      loadUsers();
      return;
    }
    if (activeTab === 'settings') {
      loadSettings();
      return;
    }
    loadWeeklyMenu();
  }, [
    activeTab,
    loadStats,
    loadOrders,
    loadReservations,
    loadMenu,
    loadUsers,
    loadWeeklyMenu,
    loadSettings,
  ]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('hookies_token');
    if (!stored) { setAuthStatus('denied'); return; }

    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${stored}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        const role = data?.user?.role;
        if (role === 'ADMIN' || role === 'EMPLOYEE') {
          setToken(stored);
          setAdminName(data.user.name || 'Staff');
          setUserRole(role);
          setAuthStatus('allowed');
        } else {
          setAuthStatus('denied');
        }
      })
      .catch(() => setAuthStatus('denied'));
  }, []);

  useEffect(() => {
    if (authStatus !== 'allowed') return;
    loadStats();
  }, [authStatus, loadStats]);

  return (
    <>
      <Head>
        <title>Admin | Hookies</title>
        <meta name="description" content="Panneau administrateur Hookies." />
      </Head>
      <main className="text-white">
        <Header />
        <section className="px-4 py-12 md:px-6">
          {authStatus === 'loading' && (
            <div className="mx-auto max-w-7xl rounded-2xl border border-amber-700/30 bg-black/20 p-8 text-slate-300">
              Vérification des droits administrateur…
            </div>
          )}
          {authStatus === 'denied' && (
            <div className="mx-auto max-w-7xl rounded-2xl border border-red-700/40 bg-red-950/25 p-8">
              <h1 className="font-display text-3xl font-bold text-red-200">Accès refusé</h1>
              <p className="mt-3 text-red-100/90">Cette page est réservée aux administrateurs.</p>
              <Link href="/espace-client" className="mt-6 inline-block rounded-xl border border-amber-500/40 bg-amber-500/15 px-5 py-2.5 text-sm font-semibold text-amber-100 hover:bg-amber-500/30">
                Espace client
              </Link>
            </div>
          )}
          {authStatus === 'allowed' && (
            <div className="mx-auto max-w-7xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-amber-200/70">Back-office</p>
                  <h1 className="font-display text-4xl font-black text-slate-100">Panel administrateur</h1>
                  <p className="mt-1 text-sm text-slate-400">Bonjour {adminName} <FaHandPeace className="inline text-amber-300" /></p>
                </div>
                <button onClick={refreshActiveTab} className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10">
                  <FaSyncAlt /> Rafraîchir
                </button>
              </div>

              {admin.error && (
                <div className="mb-4 rounded-xl border border-red-700/40 bg-red-900/20 px-4 py-3 text-sm text-red-300">
                  {admin.error}
                </div>
              )}
              {admin.success && (
                <div className="mb-4 rounded-xl border border-green-700/40 bg-green-900/20 px-4 py-3 text-sm text-green-300">
                  {admin.success}
                </div>
              )}

              <AdminNav
                activeTab={activeTab}
                onChange={setActiveTab}
                pendingOrders={admin.stats?.pendingOrders}
                pendingReservations={admin.stats?.pendingReservations}
              />

              {activeTab === 'dashboard' && (
                <StatsTab stats={admin.stats} loading={admin.loading.stats} onLoad={admin.loadStats} />
              )}
              {activeTab === 'orders' && (
                <OrdersTab
                  orders={admin.orders}
                  loading={admin.loading.orders}
                  onLoad={admin.loadOrders}
                  onUpdateStatus={admin.updateOrderStatus}
                />
              )}
              {activeTab === 'reservations' && (
                <ReservationsTab
                  reservations={admin.reservations}
                  loading={admin.loading.reservations}
                  onLoad={admin.loadReservations}
                  onUpdateStatus={admin.updateReservationStatus}
                />
              )}
              {activeTab === 'menu' && (
                <MenuTab
                  items={admin.menuItems}
                  loading={admin.loading.menu}
                  onLoad={admin.loadMenu}
                  onSave={admin.saveMenuItem}
                  onDelete={admin.deleteMenuItem}
                />
              )}
              {activeTab === 'users' && (
                <UsersTab
                  users={admin.users}
                  loading={admin.loading.users}
                  onLoad={admin.loadUsers}
                  onRoleChange={admin.updateUserRole}
                />
              )}
              {activeTab === 'weekly-menu' && (
                <WeeklyMenuTab
                  weeklyMenu={admin.weeklyMenu}
                  loading={admin.loading.weekly}
                  onLoad={admin.loadWeeklyMenu}
                  onSave={admin.saveWeeklyMenu}
                />
              )}
              {activeTab === 'settings' && (
                <SettingsTab
                  data={admin.settingsData}
                  loading={admin.loading.settings}
                  onLoad={admin.loadSettings}
                  onSave={admin.saveSettings}
                />
              )}
            </div>
          )}
        </section>
        <Footer />
      </main>
    </>
  );
}
