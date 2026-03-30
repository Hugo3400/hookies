import { useState, useEffect, useCallback } from 'react';
import { FaBell, FaCheckDouble, FaBox, FaCalendarAlt, FaGift, FaSkull } from 'react-icons/fa';

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

type NotificationsTabProps = {
  token: string;
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  ORDER: <FaBox className="text-amber-400" />,
  RESERVATION: <FaCalendarAlt className="text-blue-400" />,
  WELCOME: <FaSkull className="text-amber-200" />,
  PROMO: <FaGift className="text-green-400" />,
};

const TYPE_BORDER: Record<string, string> = {
  ORDER: 'border-l-amber-500',
  RESERVATION: 'border-l-blue-500',
  WELCOME: 'border-l-amber-300',
  PROMO: 'border-l-green-500',
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days}j`;
}

export default function NotificationsTab({ token }: NotificationsTabProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNotifications(await res.json());
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ markAllRead: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  };

  const markRead = async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
    } catch {}
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-amber-200">
          <FaBell />
          Notifications
          {unreadCount > 0 && (
            <span className="ml-1 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
              {unreadCount}
            </span>
          )}
        </h2>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1 rounded-lg border border-amber-500/40 px-3 py-1.5 text-xs font-semibold text-amber-200 transition hover:bg-amber-500/15"
          >
            <FaCheckDouble className="text-xs" />
            Tout marquer comme lu
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="glass-card rounded-xl px-6 py-16 text-center">
          <FaBell className="mx-auto mb-4 text-4xl text-slate-500" />
          <p className="text-slate-400">Aucune notification pour l&apos;instant.</p>
          <p className="mt-1 text-sm text-slate-500">
            Tu recevras ici les mises à jour de tes commandes et réservations.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => !notif.isRead && markRead(notif.id)}
              className={`glass-card cursor-pointer rounded-xl border-l-4 px-4 py-3 transition hover:bg-white/5 ${
                TYPE_BORDER[notif.type] || 'border-l-slate-500'
              } ${notif.isRead ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-lg">
                  {TYPE_ICONS[notif.type] || <FaBell className="text-slate-400" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-sm font-semibold ${notif.isRead ? 'text-slate-400' : 'text-amber-200'}`}>
                      {notif.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      {!notif.isRead && (
                        <span className="h-2 w-2 rounded-full bg-amber-400" />
                      )}
                      <span className="whitespace-nowrap text-xs text-slate-500">
                        {timeAgo(notif.createdAt)}
                      </span>
                    </div>
                  </div>
                  <p className="mt-1 whitespace-pre-line text-xs text-slate-300">
                    {notif.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
