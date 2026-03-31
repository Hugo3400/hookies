import { useEffect, useState, useCallback } from 'react';
import { FaSync, FaFilter, FaUser, FaShieldAlt, FaTrash, FaSignInAlt, FaShoppingCart, FaCalendarCheck, FaClipboardList, FaCog, FaExchangeAlt } from 'react-icons/fa';

export type AdminLogEntry = {
  id: string;
  actorId: string | null;
  actorName: string | null;
  actorRole: string | null;
  action: string;
  target: string | null;
  details: string | null;
  ip: string | null;
  createdAt: string;
};

type Props = {
  token: string;
  userRole: string;
};

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  ORDER_PLACED:               { label: 'Commande passée',         color: 'bg-green-900/40 text-green-300' },
  ORDER_STATUS_CHANGED:       { label: 'Statut commande',         color: 'bg-amber-900/40 text-amber-300' },
  ORDER_DELETED:              { label: 'Commande supprimée',      color: 'bg-red-900/40 text-red-300' },
  RESERVATION_PLACED:         { label: 'Réservation créée',       color: 'bg-teal-900/40 text-teal-300' },
  RESERVATION_STATUS_CHANGED: { label: 'Statut réservation',      color: 'bg-amber-900/40 text-amber-300' },
  USER_LOGIN:                 { label: 'Connexion',               color: 'bg-blue-900/40 text-blue-300' },
  USER_ROLE_CHANGED:          { label: 'Rôle modifié',            color: 'bg-purple-900/40 text-purple-300' },
  USER_DELETED:               { label: 'Client supprimé',         color: 'bg-red-900/40 text-red-300' },
  MENU_ITEM_CREATED:          { label: 'Article menu créé',       color: 'bg-emerald-900/40 text-emerald-300' },
  MENU_ITEM_UPDATED:          { label: 'Article menu modifié',    color: 'bg-slate-700/40 text-slate-300' },
  MENU_ITEM_DELETED:          { label: 'Article menu supprimé',   color: 'bg-red-900/40 text-red-300' },
};

const ROLE_COLORS: Record<string, string> = {
  WEBMASTER: 'text-fuchsia-300',
  ADMIN:     'text-amber-300',
  EMPLOYEE:  'text-blue-300',
  CLIENT:    'text-slate-300',
  DELIVERY:  'text-orange-300',
  KIOSK:     'text-cyan-300',
};

const ACTION_ICONS: Record<string, React.ElementType> = {
  ORDER_PLACED:               FaShoppingCart,
  ORDER_STATUS_CHANGED:       FaExchangeAlt,
  ORDER_DELETED:              FaTrash,
  RESERVATION_PLACED:         FaCalendarCheck,
  RESERVATION_STATUS_CHANGED: FaExchangeAlt,
  USER_LOGIN:                 FaSignInAlt,
  USER_ROLE_CHANGED:          FaShieldAlt,
  USER_DELETED:               FaTrash,
  MENU_ITEM_CREATED:          FaClipboardList,
  MENU_ITEM_UPDATED:          FaClipboardList,
  MENU_ITEM_DELETED:          FaTrash,
};

const ALL_ACTIONS = Object.keys(ACTION_LABELS);

export default function LogsTab({ token, userRole: _userRole }: Props) {
  const [logs, setLogs] = useState<AdminLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>('ALL');

  const fetchLogs = useCallback(async (p = 1, action = filter) => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: '50' });
      if (action !== 'ALL') params.set('action', action);
      const res = await fetch(`/api/admin/logs?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setLogs(data.logs);
      setTotal(data.total);
      setPage(data.page);
      setPages(data.pages);
    } finally {
      setLoading(false);
    }
  }, [token, filter]);

  useEffect(() => { fetchLogs(1, filter); }, [filter]);

  const fmtDate = (d: string) =>
    new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-400">{total} entrée(s)</p>
        <div className="flex items-center gap-2">
          <FaFilter className="text-xs text-slate-500" />
          <select
            value={filter}
            onChange={e => { setFilter(e.target.value); setPage(1); }}
            className="rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="ALL">Toutes les actions</option>
            {ALL_ACTIONS.map(a => (
              <option key={a} value={a}>{ACTION_LABELS[a]?.label ?? a}</option>
            ))}
          </select>
          <button
            onClick={() => fetchLogs(page, filter)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10"
          >
            <FaSync className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {loading && <p className="text-slate-400 text-sm">Chargement…</p>}

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase tracking-widest text-slate-400">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Acteur</th>
              <th className="px-4 py-3">Cible</th>
              <th className="px-4 py-3">Détails</th>
              <th className="px-4 py-3">IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">Aucun log.</td>
              </tr>
            )}
            {logs.map((log, i) => {
              const meta = ACTION_LABELS[log.action];
              const Icon = ACTION_ICONS[log.action] ?? FaCog;
              return (
                <tr key={log.id} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                  <td className="whitespace-nowrap px-4 py-2 text-xs text-slate-400">{fmtDate(log.createdAt)}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta?.color ?? 'bg-slate-700/40 text-slate-300'}`}>
                      <Icon className="text-[10px]" />
                      {meta?.label ?? log.action}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`text-xs font-semibold ${ROLE_COLORS[log.actorRole ?? ''] ?? 'text-slate-300'}`}>
                      {log.actorName ?? '—'}
                    </span>
                    {log.actorRole && (
                      <span className="ml-1.5 text-xs text-slate-500">({log.actorRole})</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-300">{log.target ?? '—'}</td>
                  <td className="px-4 py-2 text-xs text-slate-400">{log.details ?? '—'}</td>
                  <td className="px-4 py-2 text-xs text-slate-500 font-mono">{log.ip ?? '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => fetchLogs(page - 1, filter)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10 disabled:opacity-40"
          >
            ← Précédent
          </button>
          <span className="text-xs text-slate-400">Page {page} / {pages}</span>
          <button
            disabled={page >= pages}
            onClick={() => fetchLogs(page + 1, filter)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10 disabled:opacity-40"
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  );
}
