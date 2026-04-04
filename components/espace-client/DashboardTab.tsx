import { FaBox, FaCalendarAlt, FaCoins, FaDollarSign, FaCog } from 'react-icons/fa';
import type { Order, Reservation } from './types';

const STAFF_ROLES = ['ADMIN', 'EMPLOYEE', 'WEBMASTER'];

type DashboardTabProps = {
  userName?: string;
  userRole?: string;
  loyaltyPoints: number;
  orders: Order[];
  reservations: Reservation[];
  openingLabel: string;
  isOpen: boolean;
  onGoBorne: () => void;
};

export default function DashboardTab({
  userName,
  userRole,
  loyaltyPoints,
  orders,
  reservations,
  openingLabel,
  isOpen,
  onGoBorne,
}: DashboardTabProps) {
  const totalSpent = orders.reduce((sum, order) => sum + Number(order.finalPrice || order.totalPrice || 0), 0);
  const lastOrders = orders.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-black text-amber-100">Salut {userName || 'Capitaine'}</h2>
            <p className="mt-2 text-slate-300">Ton espace client premium est prêt.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onGoBorne}
              className="rounded-lg bg-amber-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-amber-400"
            >
              Commander maintenant
            </button>
            {userRole && STAFF_ROLES.includes(userRole) && (
              <a
                href="/admin"
                className="flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-5 py-2.5 font-semibold text-amber-200 transition hover:bg-amber-500/20"
              >
                <FaCog className="h-4 w-4" /> Administration
              </a>
            )}
          </div>
        </div>
        <p className={`mt-4 text-sm font-semibold ${isOpen ? 'text-green-300' : 'text-red-300'}`}>{openingLabel}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-amber-700/30 bg-black/20 p-4">
          <p className="flex items-center gap-2 text-sm text-slate-300"><FaBox /> Commandes</p>
          <p className="mt-2 text-2xl font-bold text-amber-200">{orders.length}</p>
        </div>
        <div className="rounded-xl border border-amber-700/30 bg-black/20 p-4">
          <p className="flex items-center gap-2 text-sm text-slate-300"><FaCalendarAlt /> Réservations</p>
          <p className="mt-2 text-2xl font-bold text-amber-200">{reservations.length}</p>
        </div>
        <div className="rounded-xl border border-amber-700/30 bg-black/20 p-4">
          <p className="flex items-center gap-2 text-sm text-slate-300"><FaDollarSign /> Dépensé</p>
          <p className="mt-2 text-2xl font-bold text-amber-200">${totalSpent.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-amber-700/30 bg-black/20 p-4">
          <p className="flex items-center gap-2 text-sm text-slate-300"><FaCoins /> Points</p>
          <p className="mt-2 text-2xl font-bold text-amber-200">{loyaltyPoints}</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-display text-xl font-bold text-amber-100">Dernières commandes</h3>
        {lastOrders.length === 0 ? (
          <p className="mt-3 text-slate-300">Aucune commande pour le moment.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {lastOrders.map((order) => (
              <div key={order.id} className="rounded-lg border border-amber-700/30 bg-black/20 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-amber-100">{order.orderNumber}</p>
                  <span className="rounded-full bg-amber-500/20 px-2 py-1 text-xs font-semibold text-amber-200">
                    {order.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-300">
                  {new Date(order.createdAt).toLocaleDateString('fr-FR')} • ${Number(order.finalPrice || order.totalPrice).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
