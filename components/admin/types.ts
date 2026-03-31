// Types partagés pour le panel administrateur

export type AdminTab = 'dashboard' | 'orders' | 'reservations' | 'menu' | 'users' | 'weekly-menu' | 'settings' | 'logs';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
export type OrderType = 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY' | 'KIOSK';
export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export type AdminOrder = {
  id: string;
  orderNumber: string;
  totalPrice: number;
  finalPrice: number;
  discountApplied: number;
  status: OrderStatus;
  type: OrderType;
  deliveryAddress?: string;
  notes?: string;
  scheduledFor?: string;
  createdAt: string;
  user?: { id: string; name: string; email: string } | null;
  orderItems: Array<{
    id: string;
    quantity: number;
    price: number;
    menuItem: { name: string };
  }>;
};

export type AdminReservation = {
  id: string;
  date: string;
  time: string;
  guestCount: number;
  specialRequest?: string;
  status: ReservationStatus;
  createdAt: string;
  user: { id: string; name: string; email: string; phone?: string };
};

export type MenuCategory = 'BURGER' | 'SIDE' | 'DRINK' | 'DESSERT' | 'SAUCE';

export type AdminMenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image?: string;
  isAvailable: boolean;
  preparationTime: number;
  _count?: { orderItems: number; reviews: number };
};

export type AdminUserEntry = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
  loyaltyPoints: number;
  createdAt: string;
  _count: { orders: number; reservations: number };
};

export type AdminStats = {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalReservations: number;
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  pendingReservations: number;
  recentOrders: AdminOrder[];
};

export type WeeklyMenuItem = { name: string; description: string; price: number };

export type WeeklyMenuPayload = {
  title: string;
  subtitle: string;
  weekLabel: string;
  items: WeeklyMenuItem[];
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmée',
  PREPARING: 'En préparation',
  READY: 'Prête',
  COMPLETED: 'Terminée',
  CANCELLED: 'Annulée',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: 'text-amber-300 bg-amber-900/30',
  CONFIRMED: 'text-blue-300 bg-blue-900/30',
  PREPARING: 'text-orange-300 bg-orange-900/30',
  READY: 'text-green-300 bg-green-900/30',
  COMPLETED: 'text-slate-300 bg-slate-700/30',
  CANCELLED: 'text-red-300 bg-red-900/30',
};

export const RESERVATION_STATUS_LABELS: Record<ReservationStatus, string> = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmée',
  CANCELLED: 'Annulée',
  COMPLETED: 'Terminée',
};

export const RESERVATION_STATUS_COLORS: Record<ReservationStatus, string> = {
  PENDING: 'text-amber-300 bg-amber-900/30',
  CONFIRMED: 'text-green-300 bg-green-900/30',
  CANCELLED: 'text-red-300 bg-red-900/30',
  COMPLETED: 'text-slate-300 bg-slate-700/30',
};
