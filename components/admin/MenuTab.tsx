import { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import type { AdminMenuItem, MenuCategory } from './types';

const CATEGORIES: MenuCategory[] = ['BURGER', 'SIDE', 'DRINK', 'DESSERT', 'SAUCE'];
const CATEGORY_LABELS: Record<MenuCategory, string> = {
  BURGER: 'Burgers', SIDE: 'Accompagnements', DRINK: 'Boissons', DESSERT: 'Desserts', SAUCE: 'Sauces',
};

const EMPTY_ITEM: Partial<AdminMenuItem> & { id?: string } = {
  name: '', description: '', price: 0, category: 'BURGER', isAvailable: true, image: '', preparationTime: 10,
};

type Props = {
  items: AdminMenuItem[];
  loading: boolean;
  onLoad: () => void;
  onSave: (item: Partial<AdminMenuItem> & { id?: string }) => Promise<unknown>;
  onDelete: (id: string) => Promise<void>;
};

export default function MenuTab({ items, loading, onLoad, onSave, onDelete }: Props) {
  const [catFilter, setCatFilter] = useState<MenuCategory | 'ALL'>('ALL');
  const [editItem, setEditItem] = useState<(Partial<AdminMenuItem> & { id?: string }) | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { onLoad(); }, [onLoad]);

  const filtered = catFilter === 'ALL' ? items : items.filter(i => i.category === catFilter);
  const fmt = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);

  const openEdit = (item?: AdminMenuItem) =>
    setEditItem(item ? { ...item } : { name: '', description: '', price: 0, category: 'BURGER', isAvailable: true, image: '', preparationTime: 10 });

  const handleSave = async () => {
    if (!editItem) return;
    setSaving(true);
    await onSave(editItem);
    setSaving(false);
    setEditItem(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet article ?')) return;
    await onDelete(id);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {(['ALL', ...CATEGORIES] as const).map(c => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                catFilter === c ? 'bg-amber-500 text-black' : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {c === 'ALL' ? 'Tout' : CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
        <button
          onClick={() => openEdit()}
          className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-black hover:bg-amber-400"
        >
          <FaPlus className="inline" /> Ajouter
        </button>
      </div>

      {loading && <p className="text-slate-400">Chargement...</p>}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(item => (
          <div key={item.id} className={`rounded-xl border p-4 ${item.isAvailable ? 'border-white/10 bg-white/5' : 'border-red-900/30 bg-red-900/10 opacity-60'}`}>
            {item.image && (
              <img src={item.image} alt={item.name} className="mb-3 h-28 w-full rounded-lg object-cover" />
            )}
            <div className="mb-1 flex items-start justify-between">
              <div>
                <p className="font-bold text-slate-100">{item.name}</p>
                <p className="text-xs text-amber-300">{CATEGORY_LABELS[item.category]}</p>
              </div>
              <p className="font-bold text-green-300">{fmt(item.price)}</p>
            </div>
            {item.description && <p className="mb-3 line-clamp-2 text-xs text-slate-400">{item.description}</p>}
            <div className="flex items-center justify-between">
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${item.isAvailable ? 'bg-green-900/40 text-green-300' : 'bg-red-900/40 text-red-300'}`}>
                {item.isAvailable ? 'Disponible' : 'Indisponible'}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(item)}
                  className="rounded-lg bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:bg-white/10"
                >
                  <FaEdit className="inline" /> Modifier
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="rounded-lg bg-red-900/30 px-2.5 py-1 text-xs font-semibold text-red-300 hover:bg-red-900/50"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setEditItem(null)}>
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6" onClick={e => e.stopPropagation()}>
            <h2 className="mb-5 text-xl font-black text-amber-300">{editItem.id ? 'Modifier' : 'Ajouter'} un article</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-slate-400">Nom *</label>
                  <input value={editItem.name || ''} onChange={e => setEditItem({...editItem, name: e.target.value})} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-400">Prix (€) *</label>
                  <input type="number" step="0.01" value={editItem.price || 0} onChange={e => setEditItem({...editItem, price: parseFloat(e.target.value)})} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-400">Description</label>
                <textarea value={editItem.description || ''} onChange={e => setEditItem({...editItem, description: e.target.value})} rows={2} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-slate-400">Catégorie</label>
                  <select value={editItem.category || 'BURGER'} onChange={e => setEditItem({...editItem, category: e.target.value as MenuCategory})} className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500">
                    {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-400">Temps prépa (min)</label>
                  <input type="number" value={editItem.preparationTime ?? 10} onChange={e => setEditItem({...editItem, preparationTime: parseInt(e.target.value)})} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-400">URL Image</label>
                <input value={editItem.image || ''} onChange={e => setEditItem({...editItem, image: e.target.value})} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="available" checked={!!editItem.isAvailable} onChange={e => setEditItem({...editItem, isAvailable: e.target.checked})} className="h-4 w-4 rounded" />
                <label htmlFor="available" className="text-sm text-slate-300">Disponible</label>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setEditItem(null)} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5">Annuler</button>
              <button onClick={handleSave} disabled={saving} className="rounded-xl bg-amber-500 px-5 py-2 text-sm font-bold text-black hover:bg-amber-400 disabled:opacity-50">
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
