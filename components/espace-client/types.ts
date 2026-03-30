export type AuthMode = 'login' | 'register';
export type TabKey = 'dashboard' | 'borne' | 'reservations' | 'commandes' | 'profil' | 'fidelite';

export type AuthUser = {
  id: string;
  name: string;
  email?: string;
  discordId?: string;
  discordTag?: string;
  role: string;
  phone?: string;
  loyaltyPoints?: number;
};

export type Promotion = {
  id: string;
  name: string;
  description?: string | null;
  discount: number;
  badge?: string | null;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string | null;
  averageRating?: number | string;
  reviewCount?: number;
  activePromotion?: Promotion | null;
};

export type CartItem = MenuItem & {
  cartQuantity: number;
};

export type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  menuItem?: {
    id: string;
    name: string;
    image?: string | null;
  };
};

export type Order = {
  id: string;
  orderNumber: string;
  totalPrice: number;
  finalPrice?: number;
  discountApplied?: number;
  status: string;
  type: string;
  notes?: string | null;
  deliveryAddress?: string | null;
  scheduledFor?: string | null;
  createdAt: string;
  orderItems?: OrderItem[];
  promoCode?: {
    code: string;
  } | null;
};

export type Reservation = {
  id: string;
  date: string;
  time: string;
  guestCount: number;
  status: string;
  specialRequest?: string | null;
};

export type UserAddress = {
  id: string;
  label: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export type RestaurantSettings = {
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  openingHours: string;
  deliveryFee: number;
  minOrderAmount: number;
  pointsPerEuro: number;
};

export type ReviewPayload = {
  menuItemId: string;
  rating: number;
  comment?: string;
};

export type PromoState = {
  code: string;
  discount: number;
  valid: boolean;
  description?: string;
};
