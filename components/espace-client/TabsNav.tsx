import {
  FaBell,
  FaBox,
  FaCalendarAlt,
  FaGift,
  FaHome,
  FaUserCircle,
  FaUtensils,
} from 'react-icons/fa';
import type { TabKey } from './types';

type TabsNavProps = {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
};

const tabs: Array<{ key: TabKey; label: string; icon: JSX.Element }> = [
  { key: 'dashboard', label: 'Dashboard', icon: <FaHome /> },
  { key: 'borne', label: 'Borne', icon: <FaUtensils /> },
  { key: 'reservations', label: 'Réservations', icon: <FaCalendarAlt /> },
  { key: 'commandes', label: 'Commandes', icon: <FaBox /> },
  { key: 'profil', label: 'Profil', icon: <FaUserCircle /> },
  { key: 'notifications', label: 'Notifs', icon: <FaBell /> },
  { key: 'fidelite', label: 'Fidélité', icon: <FaGift /> },
];

export default function TabsNav({ activeTab, setActiveTab }: TabsNavProps) {
  return (
    <div className="mb-8 grid grid-cols-2 gap-2 rounded-lg border border-amber-700/30 bg-black/20 p-1 md:grid-cols-7">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
            activeTab === tab.key
              ? 'bg-amber-500 text-slate-950'
              : 'text-amber-200 hover:bg-amber-500/10'
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
