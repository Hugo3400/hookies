import { useMemo, useState } from 'react';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';

type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  isAvailable?: boolean;
};

type CartLine = {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
};

type Props = {
  token: string;
};

export default function CashRegisterTab({ token }: Props) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [orderType, setOrderType] = useState<'DINE_IN' | 'TAKEAWAY' | 'DELIVERY' | 'KIOSK'>('KIOSK');
  const [notes, setNotes] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');
  const [cart, setCart] = useState<CartLine[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category))).filter(Boolean),
    [items]
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const total = useMemo(
    () => cart.reduce((sum, line) => sum + line.price * line.quantity, 0),
    [cart]
  );

  const visibleItems = useMemo(() => {
    if (selectedCategory === 'ALL') return items;
    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  const loadMenu = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/public/menu');
      const data = response.ok ? await response.json() : [];
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError('Impossible de charger le menu.');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((line) => line.menuItemId === item.id);
      if (existing) {
        return prev.map((line) =>
          line.menuItemId === item.id ? { ...line, quantity: line.quantity + 1 } : line
        );
      }
      return [...prev, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const changeQuantity = (menuItemId: string, nextQty: number) => {
    setCart((prev) => {
      if (nextQty <= 0) return prev.filter((line) => line.menuItemId !== menuItemId);
      return prev.map((line) =>
        line.menuItemId === menuItemId ? { ...line, quantity: nextQty } : line
      );
    });
  };

  const submitOrder = async () => {
    setError(null);
    setMessage(null);
    if (cart.length === 0) {
      setError('Panier vide.');
      return;
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: orderType,
          notes: notes || undefined,
          deliveryAddress: orderType === 'DELIVERY' ? deliveryAddress : undefined,
          scheduledFor: scheduledFor || undefined,
          items: cart.map((line) => ({ menuItemId: line.menuItemId, quantity: line.quantity })),
        }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        setError(payload?.error || 'Erreur creation commande.');
        return;
      }

      setMessage(`Commande envoyee: ${payload?.orderNumber || 'OK'}`);
      setCart([]);
      setNotes('');
      setDeliveryAddress('');
      setScheduledFor('');
    } catch {
      setError('Erreur reseau lors de la creation de commande.');
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={loadMenu}
          className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-black hover:bg-amber-400"
        >
          Charger le menu caisse
        </button>
        {loading && <span className="text-sm text-slate-400">Chargement...</span>}
      </div>

      {error && <p className="mb-3 text-sm text-red-300">{error}</p>}
      {message && <p className="mb-3 text-sm text-green-300">{message}</p>}

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategory('ALL')}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${selectedCategory === 'ALL' ? 'bg-amber-500 text-black' : 'bg-white/5 text-slate-300'}`}
        >
          Tout
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${selectedCategory === cat ? 'bg-amber-500 text-black' : 'bg-white/5 text-slate-300'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h3 className="mb-3 text-lg font-bold text-amber-200">Articles</h3>
          <div className="space-y-2">
            {visibleItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                <div>
                  <p className="font-semibold text-slate-100">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.price.toFixed(2)} EUR</p>
                </div>
                <button
                  type="button"
                  onClick={() => addToCart(item)}
                  className="rounded-lg bg-amber-500 px-3 py-1 text-xs font-bold text-black hover:bg-amber-400"
                >
                  Ajouter
                </button>
              </div>
            ))}
            {!loading && visibleItems.length === 0 && (
              <p className="text-sm text-slate-400">Aucun article charge.</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h3 className="mb-3 text-lg font-bold text-amber-200">Caisse</h3>

          <div className="mb-3 grid gap-2 sm:grid-cols-2">
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value as 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY' | 'KIOSK')}
              className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm"
            >
              <option value="KIOSK">Borne</option>
              <option value="DINE_IN">Sur place</option>
              <option value="TAKEAWAY">A emporter</option>
              <option value="DELIVERY">Livraison</option>
            </select>
            <input
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm"
            />
          </div>

          {orderType === 'DELIVERY' && (
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Adresse de livraison"
              className="mb-3 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm"
            />
          )}

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes de commande"
            rows={2}
            className="mb-3 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm"
          />

          <div className="space-y-2">
            {cart.map((line) => (
              <div key={line.menuItemId} className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                <div>
                  <p className="font-semibold text-slate-100">{line.name}</p>
                  <p className="text-xs text-slate-400">{line.price.toFixed(2)} EUR</p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => changeQuantity(line.menuItemId, line.quantity - 1)} className="rounded bg-white/10 p-1">
                    <FaMinus />
                  </button>
                  <span className="w-6 text-center text-sm font-bold">{line.quantity}</span>
                  <button type="button" onClick={() => changeQuantity(line.menuItemId, line.quantity + 1)} className="rounded bg-white/10 p-1">
                    <FaPlus />
                  </button>
                  <button type="button" onClick={() => changeQuantity(line.menuItemId, 0)} className="rounded bg-red-900/30 p-1 text-red-300">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-900/15 px-4 py-3">
            <span className="text-sm text-amber-100">Total</span>
            <span className="text-xl font-black text-amber-300">{total.toFixed(2)} EUR</span>
          </div>

          <button
            type="button"
            onClick={submitOrder}
            className="mt-4 w-full rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-500"
          >
            Envoyer la commande
          </button>
        </div>
      </div>
    </div>
  );
}
