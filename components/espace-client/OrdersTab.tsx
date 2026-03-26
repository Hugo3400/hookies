import { FaBox, FaClock, FaListUl } from 'react-icons/fa';
import type { Order } from './types';

type OrdersTabProps = {
  loadingData: boolean;
  orders: Order[];
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string) => void;
};

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'];

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
            {orders.map((order) => (
              <button
                key={order.id}
                onClick={() => setSelectedOrderId(order.id)}
                className={`w-full rounded-lg border p-4 text-left transition ${
                  selectedOrderId === order.id
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-amber-700/30 bg-black/20 hover:bg-amber-500/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-amber-100">{order.orderNumber}</p>
                  <span className="rounded-full bg-amber-500/20 px-2 py-1 text-xs font-semibold text-amber-200">
                    {order.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-300">
                  {new Date(order.createdAt).toLocaleDateString('fr-FR')} • {Number(order.finalPrice || order.totalPrice).toFixed(2)}€
                </p>
                {order.scheduledFor && (
                  <p className="mt-1 text-xs text-slate-400">
                    Prévue le {new Date(order.scheduledFor).toLocaleString('fr-FR')}
                  </p>
                )}
              </button>
            ))}
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
            <div>
              <p className="text-sm text-slate-300">Numéro</p>
              <p className="font-semibold text-amber-100">{selectedOrder.orderNumber}</p>
            </div>

            <div>
              <p className="mb-2 text-sm text-slate-300">Progression</p>
              <div className="space-y-2">
                {STATUS_STEPS.map((step, index) => {
                  const currentIndex = STATUS_STEPS.indexOf((selectedOrder.status || '').toUpperCase());
                  const done = index <= currentIndex;
                  return (
                    <div key={step} className="flex items-center gap-2 text-xs">
                      <span className={`h-2.5 w-2.5 rounded-full ${done ? 'bg-green-400' : 'bg-slate-500'}`} />
                      <span className={done ? 'text-green-200' : 'text-slate-400'}>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm text-slate-300">Items</p>
              <div className="space-y-2">
                {(selectedOrder.orderItems || []).map((item) => (
                  <div key={item.id} className="rounded-md border border-amber-700/20 bg-black/20 p-2">
                    <p className="text-sm text-amber-100">{item.menuItem?.name || 'Plat'}</p>
                    <p className="text-xs text-slate-300">
                      x{item.quantity} • {(item.price * item.quantity).toFixed(2)}€
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {selectedOrder.promoCode && (
              <p className="text-xs text-green-300">Code promo utilisé: {selectedOrder.promoCode.code}</p>
            )}

            <div className="rounded-lg border border-amber-700/20 bg-black/20 p-3">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Sous-total</span>
                <span>{Number(selectedOrder.totalPrice).toFixed(2)}€</span>
              </div>
              <div className="flex items-center justify-between text-xs text-green-300">
                <span>Réduction</span>
                <span>-{Number(selectedOrder.discountApplied || 0).toFixed(2)}€</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-base font-semibold text-amber-200">
                <span>Total payé</span>
                <span>{Number(selectedOrder.finalPrice || selectedOrder.totalPrice).toFixed(2)}€</span>
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
