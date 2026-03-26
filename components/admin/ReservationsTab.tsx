import { useEffect, useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import type { AdminReservation, ReservationStatus } from './types';
import { RESERVATION_STATUS_LABELS, RESERVATION_STATUS_COLORS } from './types';

type Props = {
  reservations: AdminReservation[];
  loading: boolean;
  onLoad: () => void;
  onUpdateStatus: (id: string, status: ReservationStatus) => Promise<void>;
};

const ALL: ReservationStatus[] = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

export default function ReservationsTab({ reservations, loading, onLoad, onUpdateStatus }: Props) {
  const [filter, setFilter] = useState<ReservationStatus | 'ALL'>('ALL');

  useEffect(() => { onLoad(); }, [onLoad]);

  const filtered = filter === 'ALL' ? reservations : reservations.filter(r => r.status === filter);
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {(['ALL', ...ALL] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              filter === s ? 'bg-amber-500 text-black' : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            {s === 'ALL' ? `Toutes (${reservations.length})` : `${RESERVATION_STATUS_LABELS[s]} (${reservations.filter(r => r.status === s).length})`}
          </button>
        ))}
      </div>

      {loading && <p className="text-slate-400">Chargement...</p>}
      {!loading && filtered.length === 0 && <p className="text-slate-400">Aucune réservation.</p>}

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase tracking-widest text-slate-400">
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Heure</th>
              <th className="px-4 py-3">Couverts</th>
              <th className="px-4 py-3">Demande</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((res, i) => (
              <tr
                key={res.id}
                className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}
              >
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-100">{res.user.name}</p>
                  <p className="text-xs text-slate-400">{res.user.email}</p>
                  {res.user.phone && <p className="text-xs text-slate-400">{res.user.phone}</p>}
                </td>
                <td className="px-4 py-3 text-slate-300">{fmtDate(res.date)}</td>
                <td className="px-4 py-3 text-slate-300">{res.time}</td>
                <td className="px-4 py-3 text-center text-slate-200">{res.guestCount}</td>
                <td className="max-w-[180px] px-4 py-3 text-xs text-slate-400">
                  {res.specialRequest || '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${RESERVATION_STATUS_COLORS[res.status]}`}>
                    {RESERVATION_STATUS_LABELS[res.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {res.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => onUpdateStatus(res.id, 'CONFIRMED')}
                          className="rounded-lg bg-green-900/40 px-2 py-1 text-xs font-semibold text-green-300 hover:bg-green-900/60"
                        >
                          <FaCheck className="inline" /> Confirmer
                        </button>
                        <button
                          onClick={() => onUpdateStatus(res.id, 'CANCELLED')}
                          className="rounded-lg bg-red-900/40 px-2 py-1 text-xs font-semibold text-red-300 hover:bg-red-900/60"
                        >
                          <FaTimes className="inline" /> Annuler
                        </button>
                      </>
                    )}
                    {res.status === 'CONFIRMED' && (
                      <>
                        <button
                          onClick={() => onUpdateStatus(res.id, 'COMPLETED')}
                          className="rounded-lg bg-slate-700/40 px-2 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-700/60"
                        >
                          <FaCheck className="inline" /> Terminée
                        </button>
                        <button
                          onClick={() => onUpdateStatus(res.id, 'CANCELLED')}
                          className="rounded-lg bg-red-900/40 px-2 py-1 text-xs font-semibold text-red-300 hover:bg-red-900/60"
                        >
                          <FaTimes className="inline" /> Annuler
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
