import { useEffect, useState } from 'react';
import { FaChevronUp, FaChevronDown, FaArrowRight } from 'react-icons/fa';
import type { AdminOrder, OrderStatus } from './types';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from './types';

const ALL_STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];
const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

type Props = {
  orders: AdminOrder[];
  loading: boolean;
  onLoad: () => void;
  onUpdateStatus: (id: string, status: OrderStatus) => Promise<void>;
};

export default function OrdersTab({ orders, loading, onLoad, onUpdateStatus }: Props) {
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { onLoad(); }, [onLoad]);

  const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);
  const fmt = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);
  const fmtDate = (d: string) =>
    new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {(['ALL', ...ALL_STATUSES] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              filter === s ? 'bg-amber-500 text-black' : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            {s === 'ALL' ? `Toutes (${orders.length})` : `${ORDER_STATUS_LABELS[s]} (${orders.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      {loading && <p className="text-slate-400">Chargement...</p>}
      {!loading && filtered.length === 0 && <p className="text-slate-400">Aucune commande.</p>}

      <div className="space-y-2">
        {filtered.map(order => (
          <div key={order.id} className="rounded-xl border border-white/10 bg-white/5">
            <div
              className="flex cursor-pointer items-center justify-between px-4 py-3"
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
            >
              <div className="min-w-0">
                <span className="font-bold text-slate-100">#{order.orderNumber}</span>
                <span className="ml-3 text-xs text-slate-400">{order.user?.name || 'Anonyme'} — {fmtDate(order.createdAt)}</span>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ORDER_STATUS_COLORS[order.status]}`}>
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
                <span className="font-bold text-green-300">{fmt(order.finalPrice)}</span>
                <span className="text-slate-400">{expanded === order.id ? <FaChevronUp /> : <FaChevronDown />}</span>
              </div>
            </div>

            {expanded === order.id && (
              <div className="border-t border-white/10 px-4 py-3">
                <div className="mb-3 grid grid-cols-2 gap-4 text-sm lg:grid-cols-4">
                  <div><p className="text-xs text-slate-400">Type</p><p className="text-slate-200">{order.type}</p></div>
                  <div><p className="text-xs text-slate-400">Client</p><p className="text-slate-200">{order.user?.email || '—'}</p></div>
                  {order.discountApplied > 0 && (
                    <div><p className="text-xs text-slate-400">Remise</p><p className="text-green-300">-{fmt(order.discountApplied)}</p></div>
                  )}
                  {order.scheduledFor && (
                    <div><p className="text-xs text-slate-400">Prévu</p><p className="text-amber-300">{fmtDate(order.scheduledFor)}</p></div>
                  )}
                </div>
                <div className="mb-3">
                  <p className="mb-1 text-xs text-slate-400">Articles</p>
                  <ul className="space-y-1">
                    {order.orderItems.map(item => (
                      <li key={item.id} className="flex justify-between text-sm text-slate-300">
                        <span>{item.menuItem.name} ×{item.quantity}</span>
                        <span>{fmt(item.price * item.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {order.notes && <p className="mb-3 text-xs text-slate-400">Note: {order.notes}</p>}
                {NEXT_STATUSES[order.status].length > 0 && (
                  <div className="flex gap-2">
                    {NEXT_STATUSES[order.status].map(next => (
                      <button
                        key={next}
                        onClick={() => onUpdateStatus(order.id, next)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                          next === 'CANCELLED' ? 'bg-red-900/40 text-red-300 hover:bg-red-900/60' : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                        }`}
                      >
                        <FaArrowRight className="inline text-[10px]" /> {ORDER_STATUS_LABELS[next]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
