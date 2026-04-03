import { useEffect, useMemo, useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

type QuoteStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED';

type QuoteLine = {
  label: string;
  quantity: number;
  unitPrice: number;
};

type Quote = {
  id: string;
  customerName: string;
  customerContact?: string;
  status: QuoteStatus;
  items: QuoteLine[];
  total: number;
  notes?: string;
  createdAt: string;
};

type Props = {
  token: string;
};

const formatUsd = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

function computeTotal(lines: QuoteLine[]) {
  return lines.reduce((sum, line) => sum + Number(line.quantity || 0) * Number(line.unitPrice || 0), 0);
}

export default function QuotesTab({ token }: Props) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [notes, setNotes] = useState('');
  const [lines, setLines] = useState<QuoteLine[]>([{ label: '', quantity: 1, unitPrice: 0 }]);

  const total = useMemo(() => computeTotal(lines), [lines]);

  const loadQuotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/quotes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = response.ok ? await response.json() : [];
      setQuotes(Array.isArray(payload) ? payload : []);
    } catch {
      setError('Erreur chargement devis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadQuotes();
  }, []);

  const saveQuote = async () => {
    setError(null);
    if (!customerName.trim()) {
      setError('Nom client requis.');
      return;
    }
    if (lines.length === 0 || lines.some((line) => !line.label.trim() || line.quantity <= 0 || line.unitPrice < 0)) {
      setError('Lignes devis invalides.');
      return;
    }

    try {
      const response = await fetch('/api/admin/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ customerName, customerContact, notes, items: lines }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        setError(payload?.error || 'Creation devis impossible.');
        return;
      }
      setQuotes((prev) => [payload, ...prev]);
      setCustomerName('');
      setCustomerContact('');
      setNotes('');
      setLines([{ label: '', quantity: 1, unitPrice: 0 }]);
    } catch {
      setError('Erreur reseau creation devis.');
    }
  };

  const updateStatus = async (id: string, status: QuoteStatus) => {
    try {
      const response = await fetch('/api/admin/quotes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        setError(payload?.error || 'Maj statut devis impossible.');
        return;
      }
      setQuotes((prev) => prev.map((quote) => (quote.id === id ? payload : quote)));
    } catch {
      setError('Erreur reseau mise a jour devis.');
    }
  };

  const removeQuote = async (id: string) => {
    try {
      const response = await fetch('/api/admin/quotes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setError(payload?.error || 'Suppression devis impossible.');
        return;
      }
      setQuotes((prev) => prev.filter((quote) => quote.id !== id));
    } catch {
      setError('Erreur reseau suppression devis.');
    }
  };

  return (
    <div>
      <h3 className="mb-4 text-xl font-black text-amber-200">Espace devis direction</h3>
      {error && <p className="mb-3 text-sm text-red-300">{error}</p>}

      <div className="mb-4 rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="grid gap-2 md:grid-cols-2">
          <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Nom client" className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm" />
          <input value={customerContact} onChange={(e) => setCustomerContact(e.target.value)} placeholder="Contact client" className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm" />
        </div>

        <div className="mt-3 space-y-2">
          {lines.map((line, idx) => (
            <div key={idx} className="grid gap-2 md:grid-cols-12">
              <input value={line.label} onChange={(e) => setLines((prev) => prev.map((it, i) => i === idx ? { ...it, label: e.target.value } : it))} placeholder="Article" className="md:col-span-6 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm" />
              <input type="number" min={1} value={line.quantity} onChange={(e) => setLines((prev) => prev.map((it, i) => i === idx ? { ...it, quantity: Number(e.target.value || 0) } : it))} className="md:col-span-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm" />
              <input type="number" min={0} step="0.01" value={line.unitPrice} onChange={(e) => setLines((prev) => prev.map((it, i) => i === idx ? { ...it, unitPrice: Number(e.target.value || 0) } : it))} className="md:col-span-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm" />
              <button type="button" onClick={() => setLines((prev) => prev.filter((_, i) => i !== idx))} className="md:col-span-1 rounded-lg border border-red-700/40 bg-red-900/20 p-2 text-red-300 hover:bg-red-900/40">
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <button type="button" onClick={() => setLines((prev) => [...prev, { label: '', quantity: 1, unitPrice: 0 }])} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10">
          <FaPlus /> Ajouter une ligne
        </button>

        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes devis" rows={2} className="mt-3 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm" />

        <div className="mt-3 flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-900/15 px-4 py-3">
          <span className="text-sm text-amber-100">Total devis</span>
          <span className="text-xl font-black text-amber-300">{formatUsd(total)}</span>
        </div>

        <button type="button" onClick={saveQuote} className="mt-3 w-full rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-black hover:bg-amber-400">
          Creer le devis
        </button>
      </div>

      {loading && <p className="text-sm text-slate-400">Chargement...</p>}

      <div className="space-y-2">
        {quotes.map((quote) => (
          <div key={quote.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-bold text-slate-100">{quote.customerName}</p>
                <p className="text-xs text-slate-400">{quote.customerContact || 'Sans contact'} | {new Date(quote.createdAt).toLocaleString('fr-FR')}</p>
                <p className="text-sm text-amber-200">Total: {formatUsd(quote.total)}</p>
              </div>
              <div className="flex items-center gap-2">
                <select value={quote.status} onChange={(e) => updateStatus(quote.id, e.target.value as QuoteStatus)} className="rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-xs">
                  <option value="DRAFT">Brouillon</option>
                  <option value="SENT">Envoye</option>
                  <option value="ACCEPTED">Accepte</option>
                  <option value="REJECTED">Refuse</option>
                </select>
                <button type="button" onClick={() => removeQuote(quote.id)} className="rounded-lg border border-red-700/40 bg-red-900/20 p-2 text-red-300 hover:bg-red-900/40">
                  <FaTrash />
                </button>
              </div>
            </div>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-300">
              {quote.items.map((item, idx) => (
                <li key={idx}>{item.label} x{item.quantity} @ {formatUsd(item.unitPrice)}</li>
              ))}
            </ul>
            {quote.notes && <p className="mt-2 text-xs text-slate-400">Note: {quote.notes}</p>}
          </div>
        ))}
        {!loading && quotes.length === 0 && <p className="text-sm text-slate-400">Aucun devis pour le moment.</p>}
      </div>
    </div>
  );
}
