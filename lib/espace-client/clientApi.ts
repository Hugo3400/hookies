import type { AuthMode, AuthUser, MenuItem, RestaurantSettings } from '@/components/espace-client/types';

type ApiError = Error & { status?: number };

async function parseJson(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const payload = await parseJson(response);

  if (!response.ok) {
    const err = new Error((payload as { error?: string } | null)?.error || 'Erreur API') as ApiError;
    err.status = response.status;
    throw err;
  }

  return payload as T;
}

export async function fetchMenuEnriched(headers?: HeadersInit) {
  return requestJson<MenuItem[]>('/api/menu-enriched', { headers });
}

export async function fetchOrders(headers: HeadersInit) {
  if (!headers || !('Authorization' in headers)) return [];
  return requestJson<any[]>('/api/orders', { headers });
}

export async function fetchReservations(headers: HeadersInit) {
  if (!headers || !('Authorization' in headers)) return [];
  return requestJson<any[]>('/api/reservations', { headers });
}

export async function fetchFavorites(headers: HeadersInit) {
  if (!headers || !('Authorization' in headers)) return [];
  return requestJson<MenuItem[]>('/api/favorites', { headers });
}

export async function fetchUserProfile(headers: HeadersInit) {
  if (!headers || !('Authorization' in headers)) return null;
  return requestJson<any>('/api/user/profile', { headers });
}

export async function fetchSettings() {
  return requestJson<RestaurantSettings>('/api/public/settings');
}

export async function authSubmit(mode: AuthMode, payload: Record<string, unknown>) {
  const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
  return requestJson<{ token: string; user: AuthUser }>(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function saveFavorite(headers: HeadersInit, menuItemId: string, remove = false) {
  return requestJson<{ success: boolean }>('/api/favorites', {
    method: remove ? 'DELETE' : 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ menuItemId }),
  });
}

export async function saveReview(
  headers: HeadersInit,
  payload: { menuItemId: string; rating: number; comment?: string }
) {
  return requestJson('/api/reviews/items', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function validatePromoCode(headers: HeadersInit, code: string, orderAmount: number) {
  return requestJson<{ valid: boolean; discount: number; description?: string }>(
    '/api/promo-codes',
    {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, orderAmount }),
    }
  );
}

export async function createOrder(headers: HeadersInit, payload: Record<string, unknown>) {
  return requestJson<any>('/api/orders', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function createReservation(headers: HeadersInit, payload: Record<string, unknown>) {
  return requestJson<any>('/api/reservations', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function updateProfile(headers: HeadersInit, payload: Record<string, unknown>) {
  return requestJson<any>('/api/user/profile', {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function createAddress(headers: HeadersInit, payload: Record<string, unknown>) {
  return requestJson<any>('/api/user/address', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function deleteAddress(headers: HeadersInit, id: string) {
  return requestJson<{ success: boolean }>(`/api/user/address/${id}`, {
    method: 'DELETE',
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}

export async function setDefaultAddress(headers: HeadersInit, id: string) {
  return requestJson<any>(`/api/user/address/${id}`, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ isDefault: true }),
  });
}
