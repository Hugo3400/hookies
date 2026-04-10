import type { AdminTab } from './types';
import {
  FaChartPie,
  FaHamburger,
  FaCalendarCheck,
  FaClipboardList,
  FaUsers,
  FaCalendarWeek,
  FaCog,
  FaStream,
  FaCashRegister,
  FaCalculator,
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaBookOpen,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';

type TabDef = { key: AdminTab; label: string; icon: IconType; adminOnly?: boolean };

const TABS: TabDef[] = [
  { key: 'dashboard', label: 'Dashboard', icon: FaChartPie },
  { key: 'orders', label: 'Commandes', icon: FaHamburger },
  { key: 'reservations', label: 'Réservations', icon: FaCalendarCheck },
  { key: 'notebook', label: 'Bloc-notes', icon: FaBookOpen },
  { key: 'cash-register', label: 'Caisse', icon: FaCashRegister },
  { key: 'ingredients', label: 'Ingrédients', icon: FaCalculator },
  { key: 'agenda', label: 'Agenda', icon: FaCalendarAlt },
  { key: 'quotes', label: 'Devis', icon: FaFileInvoiceDollar, adminOnly: true },
  { key: 'menu', label: 'Menu', icon: FaClipboardList, adminOnly: true },
  { key: 'users', label: 'Clients', icon: FaUsers, adminOnly: true },
  { key: 'weekly-menu', label: 'Menu semaine', icon: FaCalendarWeek, adminOnly: true },
  { key: 'settings', label: 'Paramètres', icon: FaCog, adminOnly: true },
  { key: 'logs', label: 'Journaux', icon: FaStream, adminOnly: true },
];

const TAB_GROUPS: { title: string; keys: AdminTab[] }[] = [
  { title: 'Pilotage', keys: ['dashboard', 'orders', 'reservations', 'notebook', 'cash-register', 'ingredients', 'agenda'] },
  { title: 'Administration', keys: ['quotes', 'menu', 'users', 'weekly-menu', 'settings', 'logs'] },
];

type Props = {
  activeTab: AdminTab;
  onChange: (tab: AdminTab) => void;
  pendingOrders?: number;
  pendingReservations?: number;
  userRole?: string;
};

export default function AdminNav({ activeTab, onChange, pendingOrders = 0, pendingReservations = 0, userRole = 'ADMIN' }: Props) {
  const canSeeAdminTabs = userRole === 'ADMIN' || userRole === 'WEBMASTER';
  const visibleTabs = TABS.filter((tab) => !tab.adminOnly || canSeeAdminTabs);
  const visibleTabMap = new Map<AdminTab, TabDef>(visibleTabs.map((tab) => [tab.key, tab]));

  const getBadgeCount = (key: AdminTab) => {
    if (key === 'orders') return pendingOrders;
    if (key === 'reservations') return pendingReservations;
    return 0;
  };

  return (
    <nav className="mb-8 rounded-2xl border border-amber-700/30 bg-gradient-to-br from-black/40 to-amber-950/10 p-3 md:p-4">
      <div className="space-y-3">
        {TAB_GROUPS.map((group) => {
          const groupTabs = group.keys
            .map((key) => visibleTabMap.get(key))
            .filter((tab): tab is TabDef => Boolean(tab));

          if (groupTabs.length === 0) return null;

          return (
            <div key={group.title}>
              <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200/75">
                {group.title}
              </p>
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                {groupTabs.map((tab) => {
                  const badge = getBadgeCount(tab.key);
                  const isActive = activeTab === tab.key;

                  return (
                    <button
                      key={tab.key}
                      onClick={() => onChange(tab.key)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`relative inline-flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-semibold transition ${
                        isActive
                          ? 'border-amber-300/90 bg-amber-400 text-black shadow-[0_0_0_1px_rgba(0,0,0,0.25)_inset]'
                          : 'border-white/10 bg-white/[0.04] text-slate-200 hover:border-amber-500/35 hover:bg-white/[0.08]'
                      }`}
                    >
                      <tab.icon className="text-xs" />
                      <span>{tab.label}</span>
                      {badge > 0 && (
                        <span className="ml-1 inline-flex min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[11px] font-bold leading-none text-white">
                          {badge > 99 ? '99+' : badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
