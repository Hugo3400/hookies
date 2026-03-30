import { useEffect } from 'react';
import { FaUser, FaEnvelope, FaShieldAlt, FaCoins, FaShoppingCart, FaCalendarAlt, FaCalendarCheck } from 'react-icons/fa';
import type { AdminUserEntry } from './types';

type Props = {
  users: AdminUserEntry[];
  loading: boolean;
  onLoad: () => void;
  onRoleChange: (id: string, role: string) => Promise<void>;
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
              <th className="px-4 py-3"><span className="inline-flex items-center gap-1.5"><FaUser className="text-[10px]" /> Client</span></th>
              <th className="px-4 py-3"><span className="inline-flex items-center gap-1.5"><FaEnvelope className="text-[10px]" /> Email</span></th>
              <th className="px-4 py-3"><span className="inline-flex items-center gap-1.5"><FaShieldAlt className="text-[10px]" /> Rôle</span></th>
              <th className="px-4 py-3 text-center"><span className="inline-flex items-center gap-1.5"><FaCoins className="text-[10px]" /> Points</span></th>
              <th className="px-4 py-3 text-center"><span className="inline-flex items-center gap-1.5"><FaShoppingCart className="text-[10px]" /> Commandes</span></th>
              <th className="px-4 py-3 text-center"><span className="inline-flex items-center gap-1.5"><FaCalendarAlt className="text-[10px]" /> Réservations</span></th>
              <th className="px-4 py-3"><span className="inline-flex items-center gap-1.5"><FaCalendarCheck className="text-[10px]" /> Inscrit le</span></th>
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
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold focus:outline-none ${
                      user.role === 'ADMIN'
                        ? 'bg-amber-900/40 text-amber-300'
                        : user.role === 'EMPLOYEE'
                        ? 'bg-blue-900/40 text-blue-300'
                        : 'bg-slate-700/40 text-slate-300'
                    }`}
                  >
                    <option value="CLIENT">CLIENT</option>
                    <option value="EMPLOYEE">EMPLOYÉ</option>
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
