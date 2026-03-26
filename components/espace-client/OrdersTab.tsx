import { FaBox, FaClock, FaListUl, FaCheck, FaHourglass, FaFire, FaBell, FaTimesCircle, FaTruck, FaUtensils, FaStore } from 'react-icons/fa';
import type { Order } from './types';

type OrdersTabProps = {
  loadingData: boolean;
  orders: Order[];
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string) => void;
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmée',
  PREPARING: 'En préparation',
  READY: 'Prête',
  COMPLETED: 'Terminée',
  CANCELLED: 'Annulée',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-300',
  CONFIRMED: 'bg-blue-500/20 text-blue-300',
  PREPARING: 'bg-orange-500/20 text-orange-300',
  READY: 'bg-green-500/20 text-green-300',
  COMPLETED: 'bg-emerald-500/20 text-emerald-300',
  CANCELLED: 'bg-red-500/20 text-red-300',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  PENDING: <FaHourglass className="text-yellow-400" />,
  CONFIRMED: <FaCheck className="text-blue-400" />,
  PREPARING: <FaFire className="text-orange-400" />,
  READY: <FaBell className="text-green-400" />,
  COMPLETED: <FaCheck className="text-emerald-400" />,
  CANCELLED: <FaTimesCircle className="text-red-400" />,
};

const TYPE_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  DINE_IN: { label: 'Sur place', icon: <FaUtensils className="text-amber-300" /> },
  TAKEOUT: { label: 'À emporter', icon: <FaStore className="text-amber-300" /> },
  DELIVERY: { label: 'Livraison', icon: <FaTruck className="text-amber-300" /> },
};

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'];

function getStatusLabel(status: string) {
  return STATUS_LABELS[status?.toUpperCase()] || status;
}

function getStatusColor(status: string) {
  return STATUS_COLORS[status?.toUpperCase()] || 'bg-slate-500/20 text-slate-300';
}

export default function OrdersTab({ loadingData, orders, selectedOrderId, setSelectedOrderId }: OrdersTabProps) {
  const selectedOrder = orders.find((order) => order.id === selectedOrderId) || null;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="glass-card rounded-2xl p-6 lg:col-span-2">
        <h2 className="mb-4 flex items-center gap-2 font-display text-2xl font-bold text-amber-100">
          <FaBox /> Suivi des commandes
        </h2>

        {loadingData ? (
          <p className="text-slate-300">Chargement...</p>
        ) : orders.length === 0 ? (
          <p className="text-slate-300">Aucune commande pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const isCancelled = order.status?.toUpperCase() === 'CANCELLED';
              const typeInfo = TYPE_LABELS[order.type?.toUpperCase()] || { label: order.type, icon: null };
              return (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`w-full rounded-lg border p-4 text-left transition ${
                    selectedOrderId === order.id
                      ? 'border-amber-500 bg-amber-500/10'
                      : isCancelled
                        ? 'border-red-700/30 bg-black/20 opacity-60 hover:opacity-80'
                        : 'border-amber-700/30 bg-black/20 hover:bg-amber-500/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-amber-100">{order.orderNumber}</p>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        {typeInfo.icon} {typeInfo.label}
                      </span>
                    </div>
                    <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {STATUS_ICONS[order.status?.toUpperCase()]}
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-300">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR')} • {Number(order.finalPrice || order.totalPrice).toFixed(2)} €
                  </p>
                  {order.scheduledFor && (
                    <p className="mt-1 text-xs text-slate-400">
                      Prévue le {new Date(order.scheduledFor).toLocaleString('fr-FR')}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-amber-100">
          <FaListUl /> Détail commande
        </h3>

        {!selectedOrder ? (
          <p className="text-slate-300">Sélectionne une commande pour voir les détails.</p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Numéro</p>
                <p className="font-semibold text-amber-100">{selectedOrder.orderNumber}</p>
              </div>
              <span className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${getStatusColor(selectedOrder.status)}`}>
                {STATUS_ICONS[selectedOrder.status?.toUpperCase()]}
                {getStatusLabel(selectedOrder.status)}
              </span>
            </div>

            {/* Type de commande */}
            {selectedOrder.type && (
              <div className="flex items-center gap-2 rounded-lg border border-amber-700/20 bg-black/20 px-3 py-2 text-sm">
                {TYPE_LABELS[selectedOrder.type?.toUpperCase()]?.icon}
                <span className="text-amber-100">{TYPE_LABELS[selectedOrder.type?.toUpperCase()]?.label || selectedOrder.type}</span>
              </div>
            )}

            {/* Progression */}
            {selectedOrder.status?.toUpperCase() !== 'CANCELLED' && (
              <div>
                <p className="mb-3 text-sm text-slate-300">Progression</p>
                <div className="relative ml-3">
                  {STATUS_STEPS.map((step, index) => {
                    const currentIndex = STATUS_STEPS.indexOf((selectedOrder.status || '').toUpperCase());
                    const done = index <= currentIndex;
                    const isCurrent = index === currentIndex;
                    const isLast = index === STATUS_STEPS.length - 1;
                    return (
                      <div key={step} className="relative flex items-start gap-3 pb-4">
                        {/* Vertical line */}
                        {!isLast && (
                          <div className={`absolute left-[5px] top-3 h-full w-0.5 ${done && index < currentIndex ? 'bg-green-400' : 'bg-slate-600'}`} />
                        )}
                        {/* Dot */}
                        <div className={`relative z-10 mt-0.5 flex h-3 w-3 shrink-0 items-center justify-center rounded-full ${
                          isCurrent ? 'bg-amber-400 ring-2 ring-amber-400/30' : done ? 'bg-green-400' : 'bg-slate-600'
                        }`}>
                          {isCurrent && <span className="absolute h-3 w-3 animate-ping rounded-full bg-amber-400/50" />}
                        </div>
                        {/* Label */}
                        <span className={`text-sm ${isCurrent ? 'font-semibold text-amber-200' : done ? 'text-green-200' : 'text-slate-500'}`}>
                          {STATUS_LABELS[step]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Annulée */}
            {selectedOrder.status?.toUpperCase() === 'CANCELLED' && (
              <div className="rounded-lg border border-red-700/30 bg-red-500/10 p-3 text-center">
                <FaTimesCircle className="mx-auto mb-1 text-2xl text-red-400" />
                <p className="text-sm font-semibold text-red-300">Commande annulée</p>
              </div>
            )}

            <div>
              <p className="mb-2 text-sm text-slate-300">Articles</p>
              <div className="space-y-2">
                {(selectedOrder.orderItems || []).map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-md border border-amber-700/20 bg-black/20 p-2.5">
                    <div>
                      <p className="text-sm font-medium text-amber-100">{item.menuItem?.name || 'Plat'}</p>
                      <p className="text-xs text-slate-400">×{item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-amber-200">{(item.price * item.quantity).toFixed(2)} €</p>
                  </div>
                ))}
              </div>
            </div>

            {selectedOrder.promoCode && (
              <p className="text-xs text-green-300">Code promo utilisé : {selectedOrder.promoCode.code}</p>
            )}

            <div className="rounded-lg border border-amber-700/20 bg-black/20 p-3">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Sous-total</span>
                <span>{Number(selectedOrder.totalPrice).toFixed(2)} €</span>
              </div>
              {Number(selectedOrder.discountApplied || 0) > 0 && (
                <div className="flex items-center justify-between text-xs text-green-300">
                  <span>Réduction</span>
                  <span>−{Number(selectedOrder.discountApplied || 0).toFixed(2)} €</span>
                </div>
              )}
              <div className="mt-2 flex items-center justify-between border-t border-amber-700/20 pt-2 text-base font-semibold text-amber-200">
                <span>Total</span>
                <span>{Number(selectedOrder.finalPrice || selectedOrder.totalPrice).toFixed(2)} €</span>
              </div>
            </div>

            <p className="flex items-center gap-2 text-xs text-slate-400">
              <FaClock /> Mise à jour auto toutes les 20 secondes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
