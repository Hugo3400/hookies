import { useEffect } from 'react';
import type { AdminUserEntry } from './types';

type Props = {
  users: AdminUserEntry[];
  loading: boolean;
  onLoad: () => void;
  onRoleChange: (id: string, role: 'USER' | 'ADMIN') => Promise<void>;
};

export default function UsersTab({ users, loading, onLoad, onRoleChange }: Props) {
  useEffect(() => { onLoad(); }, [onLoad]);

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div>
      <p className="mb-4 text-sm text-slate-400">{users.length} client(s) enregistré(s)</p>
      {loading && <p className="text-slate-400">Chargement...</p>}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase tracking-widest text-slate-400">
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Rôle</th>
              <th className="px-4 py-3 text-center">Points</th>
              <th className="px-4 py-3 text-center">Commandes</th>
              <th className="px-4 py-3 text-center">Réservations</th>
              <th className="px-4 py-3">Inscrit le</th>
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
                    onChange={e => onRoleChange(user.id, e.target.value as 'USER' | 'ADMIN')}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold focus:outline-none ${
                      user.role === 'ADMIN'
                        ? 'bg-amber-900/40 text-amber-300'
                        : 'bg-slate-700/40 text-slate-300'
                    }`}
                  >
                    <option value="USER">CLIENT</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-center text-amber-300">{user.loyaltyPoints}</td>
                <td className="px-4 py-3 text-center text-slate-300">{user._count.orders}</td>
                <td className="px-4 py-3 text-center text-slate-300">{user._count.reservations}</td>
                <td className="px-4 py-3 text-slate-400">{fmtDate(user.createdAt)}</td>
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
