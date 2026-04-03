import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  AdminStats, AdminOrder, AdminReservation, AdminMenuItem,
  AdminUserEntry, WeeklyMenuPayload, OrderStatus, ReservationStatus,
} from '../components/admin/types';

type DeliveryZone = { name: string; description: string; fee: number };
type LoyaltyReward = { points: number; label: string };
type LoyaltyConfig = { bonusPercent: number; bonusThreshold: number; referralEnabled: boolean; referralDiscount: number; referralPoints: number; nextRewardGoal: number; rewards: LoyaltyReward[] };
type SettingsData = { deliveryZones: DeliveryZone[]; loyaltyConfig: LoyaltyConfig };

async function apiFetch<T>(url: string, token: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(json?.error || 'Erreur API');
  return json as T;
}

export function useAdmin(token: string | null) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [menuItems, setMenuItems] = useState<AdminMenuItem[]>([]);
  const [users, setUsers] = useState<AdminUserEntry[]>([]);
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenuPayload | null>(null);
  const [settingsData, setSettingsData] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState({ stats: false, orders: false, reservations: false, menu: false, users: false, weekly: false, settings: false });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => { return () => { mountedRef.current = false; }; }, []);

  const showError = useCallback((msg: string) => {
    if (!mountedRef.current) return;
    setError(msg);
    setTimeout(() => { if (mountedRef.current) setError(null); }, 4000);
  }, []);

  const showSuccess = useCallback((msg: string) => {
    if (!mountedRef.current) return;
    setSuccess(msg);
    setTimeout(() => { if (mountedRef.current) setSuccess(null); }, 3000);
  }, []);

  const loadStats = useCallback(async () => {
    if (!token) return;
    setLoading(p => ({ ...p, stats: true }));
    try {
      const data = await apiFetch<AdminStats>('/api/admin/stats', token);
      if (mountedRef.current) setStats(data);
    } catch (e) { showError(e instanceof Error ? e.message : 'Erreur stats'); }
    finally { if (mountedRef.current) setLoading(p => ({ ...p, stats: false })); }
  }, [token, showError]);

  const loadOrders = useCallback(async () => {
    if (!token) return;
    setLoading(p => ({ ...p, orders: true }));
    try {
      const data = await apiFetch<AdminOrder[]>('/api/admin/orders', token);
      if (mountedRef.current) setOrders(data);
    } catch (e) { showError(e instanceof Error ? e.message : 'Erreur commandes'); }
    finally { if (mountedRef.current) setLoading(p => ({ ...p, orders: false })); }
  }, [token, showError]);

  const loadReservations = useCallback(async () => {
    if (!token) return;
    setLoading(p => ({ ...p, reservations: true }));
    try {
      const data = await apiFetch<AdminReservation[]>('/api/admin/reservations', token);
      if (mountedRef.current) setReservations(data);
    } catch (e) { showError(e instanceof Error ? e.message : 'Erreur réservations'); }
    finally { if (mountedRef.current) setLoading(p => ({ ...p, reservations: false })); }
  }, [token, showError]);

  const loadMenu = useCallback(async () => {
    if (!token) return;
    setLoading(p => ({ ...p, menu: true }));
    try {
      const data = await apiFetch<AdminMenuItem[]>('/api/admin/menu', token);
      if (mountedRef.current) setMenuItems(data);
    } catch (e) { showError(e instanceof Error ? e.message : 'Erreur menu'); }
    finally { if (mountedRef.current) setLoading(p => ({ ...p, menu: false })); }
  }, [token, showError]);

  const loadUsers = useCallback(async () => {
    if (!token) return;
    setLoading(p => ({ ...p, users: true }));
    try {
      const data = await apiFetch<AdminUserEntry[]>('/api/admin/users', token);
      if (mountedRef.current) setUsers(data);
    } catch (e) { showError(e instanceof Error ? e.message : 'Erreur utilisateurs'); }
    finally { if (mountedRef.current) setLoading(p => ({ ...p, users: false })); }
  }, [token, showError]);

  const loadWeeklyMenu = useCallback(async () => {
    if (!token) return;
    setLoading(p => ({ ...p, weekly: true }));
    try {
      const data = await apiFetch<WeeklyMenuPayload>('/api/admin/weekly-menu', token);
      if (mountedRef.current) setWeeklyMenu(data);
    } catch (e) { showError(e instanceof Error ? e.message : 'Erreur menu semaine'); }
    finally { if (mountedRef.current) setLoading(p => ({ ...p, weekly: false })); }
  }, [token, showError]);

  const updateOrderStatus = useCallback(async (id: string, status: OrderStatus) => {
    if (!token) return;
    try {
      const updated = await apiFetch<AdminOrder>('/api/admin/orders', token, {
        method: 'PATCH', body: JSON.stringify({ id, status }),
      });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: updated.status } : o));
      await loadStats();
      showSuccess('Statut commande mis à jour');
    } catch (e) { showError(e instanceof Error ? e.message : 'Erreur mise à jour'); }
  }, [token, showError, showSuccess, loadStats]);

  const deleteOrder = useCallback(async (id: string) => {
    if (!token) return;
    try {
      const deleted = await apiFetch<{ success: boolean; id: string; orderNumber: string }>('/api/admin/orders', token, {
        method: 'DELETE', body: JSON.stringify({ id }),
      });
      setOrders(prev => prev.filter(o => o.id !== id));
      await loadStats();
      showSuccess(`Commande #${deleted.orderNumber} supprimée`);
    } catch (e) { showError(e instanceof Error ? e.message : 'Erreur suppression'); }
  }, [token, showError, showSuccess, loadStats]);

  const updateReservationStatus = useCallback(async (id: string, status: ReservationStatus) => {
    if (!token) return;
    try {
      const updated = await apiFetch<AdminReservation>('/api/admin/reservations', token, {
        method: 'PATCH', body: JSON.stringify({ id, status }),
      });
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status: updated.status } : r));
      await loadStats();
      showSuccess('Réservation mise à jour');
    } catch (e) { showError(e instanceof Error ? e.message : 'Erreur mise à jour'); }
  }, [token, showError, showSuccess, loadStats]);

  const saveMenuItem = useCallback(async (data: Partial<AdminMenuItem> & { id?: string }) => {
    if (!token) return;
    const isNew = !data.id;
    try {
      const saved = await apiFetch<AdminMenuItem>('/api/admin/menu', token, {
        method: isNew ? 'POST' : 'PUT', body: JSON.stringify(data),
      });
      setMenuItems(prev =>
        isNew ? [saved, ...prev] : prev.map(m => m.id === saved.id ? saved : m)
      );
      showSuccess(isNew ? 'Article créé' : 'Article mis à jour');
      return saved;
    } catch (e) { showError(e instanceof Error ? e.message : 'Erreur sauvegarde'); }
  }, [token, showError, showSuccess]);

  const deleteMenuItem = useCallback(async (id: string) => {
    if (!token) return;
    try {
      await apiFetch('/api/admin/menu', token, {
        method: 'DELETE', body: JSON.stringify({ id }),
      });
      setMenuItems(prev => prev.filter(m => m.id !== id));
      showSuccess('Article supprimé');
    } catch (e) { showError(e instanceof Error ? e.message : 'Erreur suppression'); }
  }, [token, showError, showSuccess]);

  const updateUserRole = useCallback(async (id: string, role: string) => {
    if (!token) return;
    try {
      const updated = await apiFetch<AdminUserEntry>('/api/admin/users', token, {
        method: 'PATCH', body: JSON.stringify({ id, role }),
      });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: updated.role } : u));
      showSuccess('Rôle mis à jour');
    } catch (e) { showError(e instanceof Error ? e.message : 'Erreur mise à jour'); }
  }, [token, showError, showSuccess]);

  const updateUserPoints = useCallback(async (id: string, loyaltyPoints: number) => {
    if (!token) return;
    try {
      const updated = await apiFetch<AdminUserEntry>('/api/admin/users', token, {
        method: 'PATCH', body: JSON.stringify({ id, loyaltyPoints }),
      });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, loyaltyPoints: updated.loyaltyPoints } : u));
      showSuccess('Points fidélité mis à jour');
    } catch (e) { showError(e instanceof Error ? e.message : 'Erreur mise à jour points'); }
  }, [token, showError, showSuccess]);

  const deleteUser = useCallback(async (id: string) => {
    if (!token) return;
    try {
      const deleted = await apiFetch<{ success: boolean; id: string; name: string }>('/api/admin/users', token, {
        method: 'DELETE', body: JSON.stringify({ id }),
      });
      setUsers(prev => prev.filter(u => u.id !== id));
      await loadStats();
      showSuccess(`Client supprimé: ${deleted.name}`);
    } catch (e) { showError(e instanceof Error ? e.message : 'Erreur suppression'); }
  }, [token, showError, showSuccess, loadStats]);

  const saveWeeklyMenu = useCallback(async (payload: WeeklyMenuPayload) => {
    if (!token) return;
    try {
      await apiFetch('/api/admin/weekly-menu', token, {
        method: 'PUT', body: JSON.stringify(payload),
      });
      setWeeklyMenu(payload);
      showSuccess('Menu de la semaine sauvegardé');
    } catch (e) { showError(e instanceof Error ? e.message : 'Erreur sauvegarde'); }
  }, [token, showError, showSuccess]);

  const loadSettings = useCallback(async () => {
    if (!token) return;
    setLoading(p => ({ ...p, settings: true }));
    try {
      const data = await apiFetch<SettingsData>('/api/admin/settings', token);
      if (mountedRef.current) setSettingsData(data);
    } catch (e) { showError(e instanceof Error ? e.message : 'Erreur paramètres'); }
    finally { if (mountedRef.current) setLoading(p => ({ ...p, settings: false })); }
  }, [token, showError]);

  const saveSettings = useCallback(async (payload: Partial<SettingsData>) => {
    if (!token) return;
    try {
      await apiFetch('/api/admin/settings', token, {
        method: 'PUT', body: JSON.stringify(payload),
      });
      if (payload.deliveryZones && settingsData) setSettingsData(prev => prev ? { ...prev, deliveryZones: payload.deliveryZones! } : prev);
      if (payload.loyaltyConfig && settingsData) setSettingsData(prev => prev ? { ...prev, loyaltyConfig: payload.loyaltyConfig! } : prev);
      showSuccess('Paramètres sauvegardés');
    } catch (e) { showError(e instanceof Error ? e.message : 'Erreur sauvegarde'); }
  }, [token, showError, showSuccess, settingsData]);

  return {
    stats, orders, reservations, menuItems, users, weeklyMenu, settingsData,
    loading, error, success,
    loadStats, loadOrders, loadReservations, loadMenu, loadUsers, loadWeeklyMenu, loadSettings,
    updateOrderStatus, deleteOrder, updateReservationStatus,
    saveMenuItem, deleteMenuItem, updateUserRole, updateUserPoints, deleteUser, saveWeeklyMenu, saveSettings,
  };
}
