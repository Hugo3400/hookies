import { useEffect } from 'react';
import { FaShoppingBag, FaMoneyBillWave, FaUserFriends, FaCalendarAlt, FaExclamationCircle, FaClock } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { AdminStats } from './types';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from './types';

type Props = {
  stats: AdminStats | null;
  loading: boolean;
  onLoad: () => void;
};

function KpiCard({ label, value, sub, color, icon: Icon }: { label: string; value: string | number; sub?: string; color?: string; icon?: IconType }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-2">
        {Icon && <Icon className={`text-lg ${color || 'text-amber-300'}`} />}
        <p className="text-xs uppercase tracking-widest text-slate-400">{label}</p>
      </div>
      <p className={`mt-2 text-3xl font-black ${color || 'text-amber-300'}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

export default function StatsTab({ stats, loading, onLoad }: Props) {
  useEffect(() => { onLoad(); }, [onLoad]);

  if (loading) return <div className="text-slate-400">Chargement des statistiques...</div>;
  if (!stats) return <div className="text-slate-400">Aucune donnée.</div>;

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Commandes totales" value={stats.totalOrders} sub={`${stats.todayOrders} auj.`} icon={FaShoppingBag} />
        <KpiCard label="CA Total" value={fmt(stats.totalRevenue)} sub={`${fmt(stats.todayRevenue)} auj.`} color="text-green-300" icon={FaMoneyBillWave} />
        <KpiCard label="Clients" value={stats.totalUsers} color="text-blue-300" icon={FaUserFriends} />
        <KpiCard label="Réservations" value={stats.totalReservations} sub={`${stats.pendingReservations} en attente`} color="text-purple-300" icon={FaCalendarAlt} />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-amber-500/30 bg-amber-900/10 p-5">
          <div className="flex items-center gap-2">
            <FaExclamationCircle className="text-amber-200" />
            <p className="text-sm font-semibold text-amber-200">Commandes en cours</p>
          </div>
          <p className="mt-1 text-4xl font-black text-amber-300">{stats.pendingOrders}</p>
          <p className="mt-1 text-xs text-amber-300/60">À traiter maintenant</p>
        </div>
        <div className="rounded-xl border border-purple-500/30 bg-purple-900/10 p-5">
          <div className="flex items-center gap-2">
            <FaClock className="text-purple-200" />
            <p className="text-sm font-semibold text-purple-200">Réservations en attente</p>
          </div>
          <p className="mt-1 text-4xl font-black text-purple-300">{stats.pendingReservations}</p>
          <p className="mt-1 text-xs text-purple-300/60">À confirmer</p>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-200">Dernières commandes</h2>
        <div className="space-y-2">
          {stats.recentOrders.length === 0 && (
            <p className="text-slate-400">Aucune commande.</p>
          )}
          {stats.recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <div>
                <p className="text-sm font-bold text-slate-100">#{order.orderNumber}</p>
                <p className="text-xs text-slate-400">
                  {order.user?.name || 'Client anonyme'} — {order.orderItems.map(i => i.menuItem.name).join(', ')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ORDER_STATUS_COLORS[order.status]}`}>
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
                <span className="text-sm font-bold text-green-300">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.finalPrice)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
