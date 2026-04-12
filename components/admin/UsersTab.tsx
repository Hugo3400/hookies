import { FormEvent, useEffect, useMemo, useState } from 'react';
import { FaUser, FaEnvelope, FaShieldAlt, FaCoins, FaShoppingCart, FaCalendarAlt, FaCalendarCheck, FaTrash, FaSave } from 'react-icons/fa';
import type { AdminUserEntry } from './types';

type Props = {
  users: AdminUserEntry[];
  loading: boolean;
  onLoad: () => void;
  onRoleChange: (id: string, role: string) => Promise<void>;
  onPointsChange: (id: string, loyaltyPoints: number) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onCreate: (payload: { name: string; email: string; password: string; phone?: string; loyaltyPoints?: number }) => Promise<unknown>;
};

export default function UsersTab({ users, loading, onLoad, onRoleChange, onPointsChange, onDelete, onCreate }: Props) {
  useEffect(() => { onLoad(); }, [onLoad]);
  const [pointsDraft, setPointsDraft] = useState<Record<string, string>>({});
  const [creating, setCreating] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', email: '', password: '', phone: '', loyaltyPoints: '0' });

  const pointsById = useMemo(() => {
    const map: Record<string, string> = {};
    users.forEach((user) => {
      map[user.id] = pointsDraft[user.id] ?? String(user.loyaltyPoints ?? 0);
    });
    return map;
  }, [pointsDraft, users]);

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const getRoleClassName = (role: string) => {
    if (role === 'WEBMASTER') return 'bg-fuchsia-900/40 text-fuchsia-200';
    if (role === 'ADMIN') return 'bg-amber-900/40 text-amber-300';
    if (role === 'EMPLOYEE') return 'bg-blue-900/40 text-blue-300';
    return 'bg-slate-700/40 text-slate-300';
  };

  const handleDelete = async (user: AdminUserEntry) => {
    if (user.role !== 'CLIENT') return;
    if (!window.confirm(`Supprimer définitivement le client ${user.name || user.email} ?`)) return;
    await onDelete(user.id);
  };

  const handleSavePoints = async (user: AdminUserEntry) => {
    const raw = (pointsById[user.id] ?? '').trim();
    const parsed = Number(raw);
    if (!Number.isFinite(parsed) || parsed < 0 || !Number.isInteger(parsed)) {
      window.alert('Points invalides: entrez un entier >= 0.');
      return;
    }
    if (parsed === user.loyaltyPoints) return;
    await onPointsChange(user.id, parsed);
    setPointsDraft((prev) => ({ ...prev, [user.id]: String(parsed) }));
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newClient.name.trim();
    const email = newClient.email.trim();
    const password = newClient.password;
    const phone = newClient.phone.trim();
    const pointsRaw = newClient.loyaltyPoints.trim();
    const loyaltyPoints = Number(pointsRaw || '0');

    if (!name || !email || !password) {
      window.alert('Nom, email et mot de passe sont obligatoires.');
      return;
    }
    if (!Number.isFinite(loyaltyPoints) || loyaltyPoints < 0 || !Number.isInteger(loyaltyPoints)) {
      window.alert('Points invalides: entrez un entier >= 0.');
      return;
    }

    setCreating(true);
    try {
      await onCreate({ name, email, password, phone: phone || undefined, loyaltyPoints });
      setNewClient({ name: '', email: '', password: '', phone: '', loyaltyPoints: '0' });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div className="mb-5 rounded-xl border border-amber-500/25 bg-amber-900/10 p-4">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-200">Créer un client</h3>
        <form onSubmit={(event) => void handleCreate(event)}>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
            <input
              type="text"
              value={newClient.name}
              onChange={(e) => setNewClient((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Nom"
              className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100"
            />
            <input
              type="email"
              value={newClient.email}
              onChange={(e) => setNewClient((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Email"
              className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100"
            />
            <input
              type="password"
              value={newClient.password}
              onChange={(e) => setNewClient((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="Mot de passe"
              className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100"
            />
            <input
              type="text"
              value={newClient.phone}
              onChange={(e) => setNewClient((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="Téléphone (optionnel)"
              className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100"
            />
            <input
              type="number"
              min={0}
              step={1}
              value={newClient.loyaltyPoints}
              onChange={(e) => setNewClient((prev) => ({ ...prev, loyaltyPoints: e.target.value }))}
              placeholder="Points"
              className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100"
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-emerald-600/40 bg-emerald-900/25 px-4 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-900/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? 'Création...' : 'Créer le client'}
          </button>
        </form>
      </div>

      <p className="mb-4 text-sm text-slate-400">{users.length} client(s) enregistré(s)</p>
      {loading && <p className="text-slate-400">Chargement...</p>}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase tracking-widest text-slate-400">
              <th className="px-4 py-3"><span className="inline-flex items-center gap-1.5"><FaUser className="text-[10px]" /> Client</span></th>
              <th className="px-4 py-3"><span className="inline-flex items-center gap-1.5"><FaEnvelope className="text-[10px]" /> Email</span></th>
              <th className="px-4 py-3"><span className="inline-flex items-center gap-1.5"><FaShieldAlt className="text-[10px]" /> Rôle</span></th>
              <th className="px-4 py-3 text-center"><span className="inline-flex items-center gap-1.5"><FaCoins className="text-[10px]" /> Points</span></th>
              <th className="px-4 py-3 text-center"><span className="inline-flex items-center gap-1.5"><FaShoppingCart className="text-[10px]" /> Commandes</span></th>
              <th className="px-4 py-3 text-center"><span className="inline-flex items-center gap-1.5"><FaCalendarAlt className="text-[10px]" /> Réservations</span></th>
              <th className="px-4 py-3"><span className="inline-flex items-center gap-1.5"><FaCalendarCheck className="text-[10px]" /> Inscrit le</span></th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={user.id} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                <td className="px-4 py-3 font-semibold text-slate-100">{user.name || '—'}</td>
                <td className="px-4 py-3 text-slate-300">{user.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={user.role}
                    onChange={e => onRoleChange(user.id, e.target.value)}
                    disabled={user.role === 'WEBMASTER'}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold focus:outline-none disabled:cursor-not-allowed disabled:opacity-90 ${getRoleClassName(user.role)}`}
                  >
                    <option value="CLIENT">CLIENT</option>
                    <option value="EMPLOYEE">EMPLOYÉ</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-center">
                  {user.role === 'CLIENT' ? (
                    <div className="inline-flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={pointsById[user.id]}
                        onChange={(e) => setPointsDraft((prev) => ({ ...prev, [user.id]: e.target.value }))}
                        className="w-24 rounded-lg border border-amber-500/30 bg-black/20 px-2 py-1 text-center text-amber-200"
                      />
                      <button
                        type="button"
                        onClick={() => void handleSavePoints(user)}
                        className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-900/20 px-2 py-1 text-xs font-semibold text-amber-200 hover:bg-amber-900/35"
                      >
                        <FaSave className="text-[11px]" /> Sauver
                      </button>
                    </div>
                  ) : (
                    <span className="text-amber-300">{user.loyaltyPoints}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center text-slate-300">{user._count.orders}</td>
                <td className="px-4 py-3 text-center text-slate-300">{user._count.reservations}</td>
                <td className="px-4 py-3 text-slate-400">{fmtDate(user.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  {user.role === 'CLIENT' ? (
                    <button
                      type="button"
                      onClick={() => void handleDelete(user)}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-700/40 bg-red-900/20 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-900/35"
                    >
                      <FaTrash className="text-[11px]" /> Supprimer
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500">Protégé</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && users.length === 0 && (
          <p className="px-4 py-6 text-center text-slate-400">Aucun client.</p>
        )}
      </div>
    </div>
  );
}
