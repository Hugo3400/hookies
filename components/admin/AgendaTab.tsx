import { useEffect, useMemo, useState } from 'react';
import { FaTrash } from 'react-icons/fa';

type AgendaType = 'RESERVATION' | 'LIVRAISON' | 'EVENT';
type AgendaStatus = 'PLANNED' | 'CONFIRMED' | 'DONE' | 'CANCELLED';

type AgendaItem = {
  id: string;
  type: AgendaType;
  title: string;
  customerName?: string;
  startAt: string;
  endAt?: string;
  details?: string;
  status: AgendaStatus;
  createdAt: string;
};

type Props = {
  token: string;
  canEdit: boolean;
};

export default function AgendaTab({ token, canEdit }: Props) {
  const [items, setItems] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    type: 'RESERVATION' as AgendaType,
    title: '',
    customerName: '',
    startAt: '',
    endAt: '',
    details: '',
    status: 'PLANNED' as AgendaStatus,
  });

  const sorted = useMemo(
    () => [...items].sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()),
    [items]
  );

  const loadAgenda = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/agenda', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = response.ok ? await response.json() : [];
      setItems(Array.isArray(payload) ? payload : []);
    } catch {
      setError('Erreur chargement agenda.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAgenda();
  }, []);

  const createItem = async () => {
    if (!canEdit) return;
    setError(null);
    if (!form.title || !form.startAt) {
      setError('Titre et date/heure de debut requis.');
      return;
    }

    try {
      const response = await fetch('/api/admin/agenda', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          endAt: form.endAt || undefined,
          customerName: form.customerName || undefined,
          details: form.details || undefined,
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        setError(payload?.error || 'Creation impossible.');
        return;
      }
      setItems((prev) => [payload, ...prev]);
      setForm({ type: 'RESERVATION', title: '', customerName: '', startAt: '', endAt: '', details: '', status: 'PLANNED' });
    } catch {
      setError('Erreur reseau creation agenda.');
    }
  };

  const updateStatus = async (id: string, status: AgendaStatus) => {
    if (!canEdit) return;
    try {
      const response = await fetch('/api/admin/agenda', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        setError(payload?.error || 'Maj impossible.');
        return;
      }
      setItems((prev) => prev.map((item) => (item.id === id ? payload : item)));
    } catch {
      setError('Erreur reseau mise a jour agenda.');
    }
  };

  const removeItem = async (id: string) => {
    if (!canEdit) return;
    try {
      const response = await fetch('/api/admin/agenda', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setError(payload?.error || 'Suppression impossible.');
        return;
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setError('Erreur reseau suppression agenda.');
    }
  };

  return (
    <div>
      <h3 className="mb-4 text-xl font-black text-amber-200">Agenda (reservations, livraisons, evenements)</h3>
      {error && <p className="mb-3 text-sm text-red-300">{error}</p>}

      <div className="mb-4 grid gap-2 rounded-xl border border-white/10 bg-white/5 p-4 md:grid-cols-2">
        <select value={form.type} onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as AgendaType }))} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm">
          <option value="RESERVATION">Reservation</option>
          <option value="LIVRAISON">Livraison</option>
          <option value="EVENT">Evenement</option>
        </select>
        <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Titre" className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm" />
        <input value={form.customerName} onChange={(e) => setForm((prev) => ({ ...prev, customerName: e.target.value }))} placeholder="Client / entreprise" className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm" />
        <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as AgendaStatus }))} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm">
          <option value="PLANNED">Prevu</option>
          <option value="CONFIRMED">Confirme</option>
          <option value="DONE">Termine</option>
          <option value="CANCELLED">Annule</option>
        </select>
        <input type="datetime-local" value={form.startAt} onChange={(e) => setForm((prev) => ({ ...prev, startAt: e.target.value }))} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm" />
        <input type="datetime-local" value={form.endAt} onChange={(e) => setForm((prev) => ({ ...prev, endAt: e.target.value }))} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm" />
        <textarea value={form.details} onChange={(e) => setForm((prev) => ({ ...prev, details: e.target.value }))} placeholder="Details" className="md:col-span-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm" rows={2} />
        <button type="button" onClick={createItem} disabled={!canEdit} className="md:col-span-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-black hover:bg-amber-400 disabled:opacity-50">
          Ajouter a l'agenda
        </button>
      </div>

      {loading && <p className="text-sm text-slate-400">Chargement...</p>}

      <div className="space-y-2">
        {sorted.map((item) => (
          <div key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-bold text-slate-100">{item.title}</p>
                <p className="text-xs text-slate-400">
                  {item.type} | {new Date(item.startAt).toLocaleString('fr-FR')}
                  {item.endAt ? ` -> ${new Date(item.endAt).toLocaleString('fr-FR')}` : ''}
                </p>
                {item.customerName && <p className="text-xs text-amber-200">{item.customerName}</p>}
                {item.details && <p className="mt-1 text-sm text-slate-300">{item.details}</p>}
              </div>
              <div className="flex items-center gap-2">
                <select value={item.status} onChange={(e) => updateStatus(item.id, e.target.value as AgendaStatus)} disabled={!canEdit} className="rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-xs">
                  <option value="PLANNED">Prevu</option>
                  <option value="CONFIRMED">Confirme</option>
                  <option value="DONE">Termine</option>
                  <option value="CANCELLED">Annule</option>
                </select>
                <button type="button" onClick={() => removeItem(item.id)} disabled={!canEdit} className="rounded-lg border border-red-700/40 bg-red-900/20 p-2 text-red-300 hover:bg-red-900/40 disabled:opacity-50">
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
        {!loading && sorted.length === 0 && <p className="text-sm text-slate-400">Aucun evenement agenda.</p>}
      </div>
    </div>
  );
}
