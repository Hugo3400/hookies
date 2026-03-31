import { useEffect } from 'react';
import { FaUser, FaEnvelope, FaShieldAlt, FaCoins, FaShoppingCart, FaCalendarAlt, FaCalendarCheck, FaTrash } from 'react-icons/fa';
import type { AdminUserEntry } from './types';

type Props = {
  users: AdminUserEntry[];
  loading: boolean;
  onLoad: () => void;
  onRoleChange: (id: string, role: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export default function UsersTab({ users, loading, onLoad, onRoleChange, onDelete }: Props) {
  useEffect(() => { onLoad(); }, [onLoad]);

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

  return (
    <div>
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
                    <option value="WEBMASTER">WEBMASTER</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-center text-amber-300">{user.loyaltyPoints}</td>
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
