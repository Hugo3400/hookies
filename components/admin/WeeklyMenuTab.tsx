import { useEffect, useState } from 'react';
import { FaTimes, FaPlus, FaSave } from 'react-icons/fa';
import type { WeeklyMenuPayload, WeeklyMenuItem } from './types';

type Props = {
  weeklyMenu: WeeklyMenuPayload | null;
  loading: boolean;
  onLoad: () => void;
  onSave: (data: WeeklyMenuPayload) => Promise<void>;
};

const EMPTY_ITEM = (): WeeklyMenuItem => ({ name: '', description: '', price: 0 });
const EMPTY_MENU = (): WeeklyMenuPayload => ({
  title: 'Menu de la semaine', subtitle: '', weekLabel: '', items: [EMPTY_ITEM()],
});

export default function WeeklyMenuTab({ weeklyMenu, loading, onLoad, onSave }: Props) {
  const [form, setForm] = useState<WeeklyMenuPayload>(EMPTY_MENU());
  const [saving, setSaving] = useState(false);

  useEffect(() => { onLoad(); }, [onLoad]);

  useEffect(() => {
    if (weeklyMenu) setForm(weeklyMenu);
  }, [weeklyMenu]);

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  const setItem = (idx: number, key: keyof WeeklyMenuItem, value: string | number) =>
    setForm(f => ({ ...f, items: f.items.map((it, i) => i === idx ? { ...it, [key]: value } : it) }));

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, EMPTY_ITEM()] }));
  const removeItem = (idx: number) => setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      {loading && <p className="text-slate-400">Chargement...</p>}

      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="mb-4 font-bold text-slate-200">Informations générales</h2>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-slate-400">Titre</label>
            <input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-400">Sous-titre</label>
            <input
              value={form.subtitle}
              onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-400">Label semaine (ex: "Semaine du 12/05")</label>
            <input
              value={form.weekLabel}
              onChange={e => setForm(f => ({ ...f, weekLabel: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-slate-200">Articles du menu ({form.items.length})</h2>
          <button
            onClick={addItem}
            className="rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/30"
          >
            <FaPlus className="inline" /> Ajouter un article
          </button>
        </div>
        <div className="space-y-3">
          {form.items.map((item, idx) => (
            <div key={idx} className="rounded-lg border border-white/10 bg-black/20 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Article #{idx + 1}</span>
                {form.items.length > 1 && (
                  <button onClick={() => removeItem(idx)} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"><FaTimes /> Supprimer</button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-slate-400">Nom *</label>
                  <input
                    value={item.name}
                    onChange={e => setItem(idx, 'name', e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-400">Prix ($)</label>
                  <input
                    type="number" step="0.01"
                    value={item.price}
                    onChange={e => setItem(idx, 'price', parseFloat(e.target.value))}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="mb-1 block text-xs text-slate-400">Description</label>
                <input
                  value={item.description || ''}
                  onChange={e => setItem(idx, 'description', e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              {item.name && (
                <p className="mt-2 text-xs text-slate-500">
                  Aperçu : <span className="text-amber-300">{item.name}</span>
                  {item.price > 0 && <> — {fmt(item.price)}</>}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-xl bg-amber-500 py-3 font-bold text-black hover:bg-amber-400 disabled:opacity-50"
      >
        {saving ? 'Sauvegarde en cours...' : <><FaSave className="mr-2 inline" /> Sauvegarder le menu semaine</>}
      </button>
    </div>
  );
}
