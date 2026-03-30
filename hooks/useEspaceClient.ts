import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  authSubmit,
  createAddress as apiCreateAddress,
  createOrder,
  createReservation as apiCreateReservation,
  deleteAddress as apiDeleteAddress,
  fetchFavorites,
  fetchMenuEnriched,
  fetchOrders,
  fetchReservations,
  fetchSettings,
  fetchUserProfile,
  saveFavorite,
  saveReview,
  setDefaultAddress as apiSetDefaultAddress,
  updateProfile as apiUpdateProfile,
  validatePromoCode,
} from '@/lib/espace-client/clientApi';
import type {
  AuthMode,
  AuthUser,
  CartItem,
  MenuItem,
  PromoState,
  RestaurantSettings,
  TabKey,
} from '@/components/espace-client/types';

const MENU_IMAGE_FALLBACKS = ['/da/hero-bg-clean.png', '/da/logo.png', '/da/hero-bg-clean.png'];

const VALID_TABS: TabKey[] = ['dashboard', 'borne', 'reservations', 'commandes', 'profil', 'fidelite'];

function getInitialTab(): TabKey {
  if (typeof window === 'undefined') return 'dashboard';
  const hash = window.location.hash.replace('#', '') as TabKey;
  return VALID_TABS.includes(hash) ? hash : 'dashboard';
}

export function useEspaceClient() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [activeTab, _setActiveTab] = useState<TabKey>(getInitialTab);

  const setActiveTab = useCallback((tab: TabKey) => {
    _setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${tab}`);
    }
  }, []);

  // Sync tab on browser back/forward
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '') as TabKey;
      if (VALID_TABS.includes(hash)) _setActiveTab(hash);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [reservationForm, setReservationForm] = useState({ date: '', time: '', guestCount: 2, specialRequest: '' });
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', currentPassword: '', newPassword: '' });
  const [addressForm, setAddressForm] = useState({
    label: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'France',
    isDefault: false,
  });

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [orders, setOrders] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'DINE_IN' | 'TAKEAWAY' | 'DELIVERY'>('DINE_IN');
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [scheduledFor, setScheduledFor] = useState('');
  const [reviewDrafts, setReviewDrafts] = useState<Record<string, { rating: number; comment: string }>>({});

  const [promoState, setPromoState] = useState<PromoState>({ code: '', discount: 0, valid: false });
  const [loading, setLoading] = useState({
    auth: false,
    menu: false,
    data: false,
    order: false,
    reservation: false,
    profile: false,
    address: false,
    promo: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const authHeaders = useMemo(() => {
    if (!token) return undefined;
    return { Authorization: `Bearer ${token}` };
  }, [token]);

  const showMessage = useCallback((message: string, isError = false) => {
    if (isError) {
      setError(message);
      setTimeout(() => setError(null), 3000);
      return;
    }
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 2200);
  }, []);

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.cartQuantity, 0), [cart]);
  const finalTotal = useMemo(() => Math.max(0, cartTotal - promoState.discount), [cartTotal, promoState.discount]);
  const categories = useMemo(() => Array.from(new Set(menuItems.map((item) => item.category || 'Autres'))), [menuItems]);
  const filteredMenu = useMemo(
    () => (selectedCategory ? menuItems.filter((item) => item.category === selectedCategory) : menuItems),
    [menuItems, selectedCategory]
  );
  const selectedOrder = useMemo(() => orders.find((item) => item.id === selectedOrderId) || null, [orders, selectedOrderId]);
  const defaultAddress = useMemo(() => addresses.find((item) => item.isDefault) || null, [addresses]);

  const openingStatus = useMemo(() => {
    if (!settings?.openingHours) return { label: 'Horaires indisponibles', isOpen: false };
    try {
      const parsed = JSON.parse(settings.openingHours) as Record<string, { open: string; close: string }>;
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const now = new Date();
      const slot = parsed[days[now.getDay()]];
      if (!slot) return { label: 'Fermé aujourd\'hui', isOpen: false };
      const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const isOpen = hhmm >= slot.open && hhmm <= slot.close;
      return { label: isOpen ? `Ouvert (${slot.open}-${slot.close})` : `Fermé (ouvre ${slot.open})`, isOpen };
    } catch {
      return { label: 'Horaires indisponibles', isOpen: false };
    }
  }, [settings]);

  const hydrateMenu = useCallback((item: MenuItem, index: number): MenuItem => {
    if (item.image) return item;
    return { ...item, image: MENU_IMAGE_FALLBACKS[index % MENU_IMAGE_FALLBACKS.length] };
  }, []);

  const handleLogout = useCallback(() => {
    setToken(null);
    setUser(null);
    setCart([]);
    setOrders([]);
    setReservations([]);
    setAddresses([]);
    setFavorites(new Set());
    setPromoState({ code: '', discount: 0, valid: false });
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('hookies_token');
      window.localStorage.removeItem('hookies_user');
    }
  }, []);

  const loadMenu = useCallback(async () => {
    setLoading((prev) => ({ ...prev, menu: true }));
    try {
      const payload = await fetchMenuEnriched(authHeaders);
      const data = (Array.isArray(payload) ? payload : []).map((item, index) => hydrateMenu(item, index));
      setMenuItems(data);
      if (data.length > 0 && !selectedCategory) {
        setSelectedCategory(data[0].category || 'Autres');
      }
    } catch {
      showMessage('Impossible de charger le menu.', true);
    } finally {
      setLoading((prev) => ({ ...prev, menu: false }));
    }
  }, [authHeaders, hydrateMenu, selectedCategory, showMessage]);

  const loadUserData = useCallback(async (sessionToken: string, silent = false) => {
    if (!sessionToken) return;
    
    if (!silent) setLoading((prev) => ({ ...prev, data: true }));
    const headers = { Authorization: `Bearer ${sessionToken}` };
    try {
      const [ordersData, reservationsData, favoritesData, profileData, settingsData] = await Promise.all([
        fetchOrders(headers),
        fetchReservations(headers),
        fetchFavorites(headers),
        fetchUserProfile(headers),
        fetchSettings(),
      ]);

      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setReservations(Array.isArray(reservationsData) ? reservationsData : []);
      setFavorites(new Set((Array.isArray(favoritesData) ? favoritesData : []).map((item: MenuItem) => item.id)));
      setAddresses(Array.isArray(profileData?.addresses) ? profileData.addresses : []);
      setSettings(settingsData);

      setUser((prev) =>
        prev
          ? {
              ...prev,
              name: profileData?.name || prev.name,
              phone: profileData?.phone || '',
              loyaltyPoints: profileData?.loyaltyPoints || 0,
            }
          : prev
      );

      setProfileForm((prev) => ({ ...prev, name: profileData?.name || '', phone: profileData?.phone || '' }));
    } catch {
      showMessage('Erreur chargement des données client.', true);
    } finally {
      if (!silent) setLoading((prev) => ({ ...prev, data: false }));
    }
  }, [showMessage]);

  const saveSession = useCallback((sessionToken: string, sessionUser: AuthUser) => {
    setToken(sessionToken);
    setUser(sessionUser);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('hookies_token', sessionToken);
      window.localStorage.setItem('hookies_user', JSON.stringify(sessionUser));
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Discord OAuth: token in URL query param
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    const urlError = urlParams.get('error');

    if (urlError) {
      window.history.replaceState({}, '', window.location.pathname);
      setError(urlError);
      return;
    }

    if (urlToken) {
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
      // Verify token via /api/auth/me
      fetch('/api/auth/me', { headers: { Authorization: `Bearer ${urlToken}` } })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data?.user) {
            saveSession(urlToken, data.user);
          }
        })
        .catch(() => {});
      return;
    }

    const savedToken = window.localStorage.getItem('hookies_token');
    const savedUser = window.localStorage.getItem('hookies_user');
    if (!savedToken || !savedUser) return;

    try {
      const parsedUser = JSON.parse(savedUser) as AuthUser;
      setToken(savedToken);
      setUser(parsedUser);
      setProfileForm((prev) => ({ ...prev, name: parsedUser.name || '', phone: parsedUser.phone || '' }));
    } catch {
      window.localStorage.removeItem('hookies_token');
      window.localStorage.removeItem('hookies_user');
    }
  }, [saveSession]);

  useEffect(() => {
    void loadMenu();
  }, [loadMenu]);

  useEffect(() => {
    if (!token) return;
    void loadUserData(token);
    const interval = window.setInterval(() => void loadUserData(token, true), 20000);
    return () => window.clearInterval(interval);
  }, [loadUserData, token]);

  useEffect(() => {
    if (defaultAddress && !selectedAddressId) setSelectedAddressId(defaultAddress.id);
  }, [defaultAddress, selectedAddressId]);

  const handleAuthSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading((prev) => ({ ...prev, auth: true }));
    try {
      const payload = authMode === 'login'
        ? { email: authForm.email, password: authForm.password }
        : { ...authForm };
      const data = await authSubmit(authMode, payload);
      saveSession(data.token, data.user);
      showMessage(authMode === 'login' ? 'Connexion réussie.' : 'Compte créé avec succès.');
      if (authMode === 'register') setAuthMode('login');
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'Erreur authentification.', true);
    } finally {
      setLoading((prev) => ({ ...prev, auth: false }));
    }
  }, [authForm, authMode, saveSession, showMessage]);

  const addToCart = useCallback((item: MenuItem) => {
    setCart((prev) => {
      const exists = prev.find((entry) => entry.id === item.id);
      if (exists) return prev.map((entry) => (entry.id === item.id ? { ...entry, cartQuantity: entry.cartQuantity + 1 } : entry));
      return [...prev, { ...item, cartQuantity: 1 }];
    });
    showMessage(`${item.name} ajouté au panier.`);
  }, [showMessage]);

  const updateCartQuantity = useCallback((itemId: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) return prev.filter((item) => item.id !== itemId);
      return prev.map((item) => (item.id === itemId ? { ...item, cartQuantity: quantity } : item));
    });
  }, []);

  const toggleFavorite = useCallback(async (menuItemId: string) => {
    if (!authHeaders) return;
    const current = new Set(favorites);
    const remove = current.has(menuItemId);
    remove ? current.delete(menuItemId) : current.add(menuItemId);
    setFavorites(current);

    try {
      await saveFavorite(authHeaders, menuItemId, remove);
      showMessage(remove ? 'Retiré des favoris.' : 'Ajouté aux favoris.');
    } catch {
      showMessage('Mise à jour favoris impossible.', true);
      setFavorites(favorites);
    }
  }, [authHeaders, favorites, showMessage]);

  const submitReview = useCallback(async (payload: { menuItemId: string; rating: number; comment?: string }) => {
    if (!authHeaders) return;
    try {
      await saveReview(authHeaders, payload);
      showMessage('Avis enregistré.');
      await loadMenu();
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'Erreur avis.', true);
    }
  }, [authHeaders, loadMenu, showMessage]);

  const applyPromoCode = useCallback(async (code: string) => {
    if (!authHeaders) return;
    setLoading((prev) => ({ ...prev, promo: true }));
    try {
      const data = await validatePromoCode(authHeaders, code, cartTotal);
      if (!data.valid) throw new Error('Code promo invalide.');
      setPromoState({ code, discount: Number(data.discount || 0), valid: true, description: data.description });
      showMessage('Code promo appliqué.');
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'Erreur code promo.', true);
    } finally {
      setLoading((prev) => ({ ...prev, promo: false }));
    }
  }, [authHeaders, cartTotal, showMessage]);

  const clearPromoCode = useCallback(() => setPromoState({ code: '', discount: 0, valid: false }), []);

  const submitOrder = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authHeaders || cart.length === 0) return;

    setLoading((prev) => ({ ...prev, order: true }));
    try {
      const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId);
      const deliveryAddress = selectedType === 'DELIVERY' && selectedAddress
        ? `${selectedAddress.street}, ${selectedAddress.postalCode} ${selectedAddress.city}`
        : undefined;

      const order = await createOrder(authHeaders, {
        type: selectedType,
        promoCode: promoState.valid ? promoState.code : undefined,
        scheduledFor: scheduledFor || undefined,
        deliveryAddress,
        items: cart.map((item) => ({ menuItemId: item.id, quantity: item.cartQuantity })),
      });

      setCart([]);
      clearPromoCode();
      setScheduledFor('');
      setSelectedOrderId(order.id);
      setActiveTab('commandes');
      showMessage(`Commande validée: ${order.orderNumber}`);
      if (token) await loadUserData(token);
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'Erreur commande.', true);
    } finally {
      setLoading((prev) => ({ ...prev, order: false }));
    }
  }, [addresses, authHeaders, cart, clearPromoCode, loadUserData, promoState.code, promoState.valid, scheduledFor, selectedAddressId, selectedType, showMessage, token]);

  const createReservation = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authHeaders) return;
    setLoading((prev) => ({ ...prev, reservation: true }));
    try {
      await apiCreateReservation(authHeaders, reservationForm);
      setReservationForm({ date: '', time: '', guestCount: 2, specialRequest: '' });
      showMessage('Réservation enregistrée.');
      if (token) await loadUserData(token);
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'Erreur réservation.', true);
    } finally {
      setLoading((prev) => ({ ...prev, reservation: false }));
    }
  }, [authHeaders, loadUserData, reservationForm, showMessage, token]);

  const updateProfile = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authHeaders) return;
    setLoading((prev) => ({ ...prev, profile: true }));
    try {
      const body: Record<string, string> = { name: profileForm.name, phone: profileForm.phone };
      if (profileForm.newPassword) {
        body.currentPassword = profileForm.currentPassword;
        body.newPassword = profileForm.newPassword;
      }
      const data = await apiUpdateProfile(authHeaders, body);
      setUser((prev) => (prev ? { ...prev, name: data.name, phone: data.phone } : prev));
      setProfileForm((prev) => ({ ...prev, currentPassword: '', newPassword: '' }));
      showMessage('Profil mis à jour.');
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'Erreur profil.', true);
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  }, [authHeaders, profileForm, showMessage]);

  const createAddress = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authHeaders) return;
    setLoading((prev) => ({ ...prev, address: true }));
    try {
      const data = await apiCreateAddress(authHeaders, addressForm);
      setAddresses((prev) => [data, ...prev.filter((item) => !item.isDefault || !data.isDefault)]);
      setAddressForm({ label: '', street: '', city: '', postalCode: '', country: 'France', isDefault: false });
      showMessage('Adresse ajoutée.');
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'Erreur adresse.', true);
    } finally {
      setLoading((prev) => ({ ...prev, address: false }));
    }
  }, [addressForm, authHeaders, showMessage]);

  const deleteAddress = useCallback(async (id: string) => {
    if (!authHeaders) return;
    try {
      await apiDeleteAddress(authHeaders, id);
      setAddresses((prev) => prev.filter((item) => item.id !== id));
      showMessage('Adresse supprimée.');
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'Erreur suppression.', true);
    }
  }, [authHeaders, showMessage]);

  const setDefaultAddress = useCallback(async (id: string) => {
    if (!authHeaders) return;
    try {
      await apiSetDefaultAddress(authHeaders, id);
      setAddresses((prev) => prev.map((item) => ({ ...item, isDefault: item.id === id })));
      setSelectedAddressId(id);
      showMessage('Adresse par défaut mise à jour.');
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'Erreur adresse défaut.', true);
    }
  }, [authHeaders, showMessage]);

  const setReviewDraft = useCallback((menuItemId: string, rating: number, comment: string) => {
    setReviewDrafts((prev) => ({ ...prev, [menuItemId]: { rating, comment } }));
  }, []);

  return {
    authMode,
    setAuthMode,
    activeTab,
    setActiveTab,
    authForm,
    setAuthForm,
    token,
    user,
    menuItems,
    cart,
    favorites,
    orders,
    reservations,
    addresses,
    settings,
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    selectedAddressId,
    setSelectedAddressId,
    selectedOrder,
    selectedOrderId,
    setSelectedOrderId,
    promoState,
    scheduledFor,
    setScheduledFor,
    reviewDrafts,
    reservationForm,
    setReservationForm,
    profileForm,
    setProfileForm,
    addressForm,
    setAddressForm,
    loading,
    error,
    successMessage,
    categories,
    filteredMenu,
    cartTotal,
    finalTotal,
    openingStatus,
    handleAuthSubmit,
    handleLogout,
    addToCart,
    updateCartQuantity,
    toggleFavorite,
    submitReview,
    applyPromoCode,
    clearPromoCode,
    submitOrder,
    createReservation,
    updateProfile,
    createAddress,
    deleteAddress,
    setDefaultAddress,
    setReviewDraft,
  };
}
