import type { AdminTab } from './types';
import { FaChartPie, FaHamburger, FaCalendarCheck, FaClipboardList, FaUsers, FaCalendarWeek, FaCog } from 'react-icons/fa';
import type { IconType } from 'react-icons';

const TABS: { key: AdminTab; label: string; icon: IconType; adminOnly?: boolean }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: FaChartPie },
  { key: 'orders', label: 'Commandes', icon: FaHamburger },
  { key: 'reservations', label: 'Réservations', icon: FaCalendarCheck },
  { key: 'menu', label: 'Menu', icon: FaClipboardList, adminOnly: true },
  { key: 'users', label: 'Clients', icon: FaUsers, adminOnly: true },
  { key: 'weekly-menu', label: 'Menu semaine', icon: FaCalendarWeek, adminOnly: true },
  { key: 'settings', label: 'Paramètres', icon: FaCog, adminOnly: true },
];

type Props = {
  activeTab: AdminTab;
  onChange: (tab: AdminTab) => void;
  pendingOrders?: number;
  pendingReservations?: number;
  userRole?: string;
};

export default function AdminNav({ activeTab, onChange, pendingOrders = 0, pendingReservations = 0, userRole = 'ADMIN' }: Props) {
  const visibleTabs = TABS.filter(tab => !tab.adminOnly || userRole === 'ADMIN' || userRole === 'WEBMASTER');

  return (
    <nav className="mb-8 flex flex-wrap gap-2">
      {visibleTabs.map((tab) => {
        const badge =
          tab.key === 'orders' ? pendingOrders
          : tab.key === 'reservations' ? pendingReservations
          : 0;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`relative flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              activeTab === tab.key
                ? 'bg-amber-500 text-black'
                : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <tab.icon className="text-sm" />
            <span>{tab.label}</span>
            {badge > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {badge > 9 ? '9+' : badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
