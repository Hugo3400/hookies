import { FormEvent } from 'react';
import {
  FaCalendarAlt,
  FaCheck,
  FaClock,
  FaHeart,
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaStar,
  FaTag,
  FaTimes,
  FaUtensils,
} from 'react-icons/fa';
import type { CartItem, MenuItem, PromoState, UserAddress } from './types';

type BorneTabProps = {
  loadingMenu: boolean;
  categories: string[];
  selectedCategory: string | null;
  setSelectedCategory: (value: string) => void;
  filteredMenu: MenuItem[];
  favorites: Set<string>;
  onToggleFavorite: (menuItemId: string) => void;
  reviewDrafts: Record<string, { rating: number; comment: string }>;
  onSetReviewDraft: (menuItemId: string, rating: number, comment: string) => void;
  onSubmitReview: (payload: { menuItemId: string; rating: number; comment?: string }) => void;
  onAddToCart: (item: MenuItem) => void;
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  selectedType: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
  onSelectType: (value: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY') => void;
  addresses: UserAddress[];
  selectedAddressId: string;
  onSelectAddress: (value: string) => void;
  promoState: PromoState;
  onApplyPromo: (code: string) => void;
  onClearPromo: () => void;
  cartTotal: number;
  finalTotal: number;
  scheduledFor: string;
  onSetScheduledFor: (value: string) => void;
  loadingPromo: boolean;
  loadingOrder: boolean;
  onSubmitOrder: (event: FormEvent<HTMLFormElement>) => void;
};

const STAR_VALUES = [1, 2, 3, 4, 5];

export default function BorneTab({
  loadingMenu,
  categories,
  selectedCategory,
  setSelectedCategory,
  filteredMenu,
  favorites,
  onToggleFavorite,
  reviewDrafts,
  onSetReviewDraft,
  onSubmitReview,
  onAddToCart,
  cart,
  onUpdateQuantity,
  selectedType,
  onSelectType,
  addresses,
  selectedAddressId,
  onSelectAddress,
  promoState,
  onApplyPromo,
  onClearPromo,
  cartTotal,
  finalTotal,
  scheduledFor,
  onSetScheduledFor,
  loadingPromo,
  loadingOrder,
  onSubmitOrder,
}: BorneTabProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="glass-card rounded-2xl p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-2xl font-bold text-amber-100">
            <FaUtensils /> Borne de commande
          </h2>

          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950'
                    : 'border border-amber-700/30 text-amber-200 hover:bg-amber-500/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loadingMenu ? (
            <p className="text-slate-300">Chargement du menu...</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredMenu.map((item) => {
                const favorite = favorites.has(item.id);
                const draft = reviewDrafts[item.id] || { rating: 5, comment: '' };
                const averageRating = Number(item.averageRating || 0);
                const hasPromo = Boolean(item.activePromotion);
                const discountedPrice = hasPromo
                  ? item.price * (1 - (item.activePromotion?.discount || 0) / 100)
                  : item.price;

                return (
                  <div key={item.id} className="overflow-hidden rounded-xl border border-amber-700/30 bg-black/20">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="h-40 w-full object-cover" />
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-amber-100">{item.name}</h3>
                          <p className="mt-1 text-sm text-slate-300">{item.description}</p>
                        </div>
                        <button
                          onClick={() => onToggleFavorite(item.id)}
                          className={`mt-1 transition ${favorite ? 'text-red-400' : 'text-slate-400 hover:text-red-300'}`}
                          aria-label="toggle favorite"
                        >
                          <FaHeart />
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                        <p className="flex items-center gap-1 text-amber-300">
                          <FaStar /> {averageRating.toFixed(1)} ({item.reviewCount || 0})
                        </p>
                        {hasPromo && (
                          <p className="rounded-full bg-green-500/20 px-2 py-1 text-xs font-semibold text-green-200">
                            <FaTag className="mr-1 inline" />
                            {item.activePromotion?.badge || `-${item.activePromotion?.discount}%`}
                          </p>
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          {hasPromo ? (
                            <>
                              <p className="text-xs text-slate-400 line-through">${item.price.toFixed(2)}</p>
                              <p className="text-lg font-bold text-green-300">${discountedPrice.toFixed(2)}</p>
                            </>
                          ) : (
                            <p className="text-lg font-bold text-amber-200">${item.price.toFixed(2)}</p>
                          )}
                        </div>
                        <button
                          onClick={() => onAddToCart({ ...item, price: discountedPrice })}
                          className="rounded-lg bg-amber-500 px-3 py-1 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
                        >
                          <FaPlus className="mr-1 inline" />Ajouter
                        </button>
                      </div>

                      <div className="mt-4 rounded-lg border border-amber-700/20 bg-black/30 p-3">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-200/80">Ton avis</p>
                        <div className="mb-2 flex gap-1">
                          {STAR_VALUES.map((value) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => onSetReviewDraft(item.id, value, draft.comment)}
                              className={value <= draft.rating ? 'text-amber-300' : 'text-slate-500'}
                            >
                              <FaStar />
                            </button>
                          ))}
                        </div>
                        <textarea
                          value={draft.comment}
                          onChange={(e) => onSetReviewDraft(item.id, draft.rating, e.target.value)}
                          rows={2}
                          placeholder="Commentaire (optionnel)"
                          className="w-full rounded-md border border-amber-700/20 bg-black/20 px-2 py-1 text-sm text-slate-100"
                        />
                        <button
                          type="button"
                          onClick={() => onSubmitReview({ menuItemId: item.id, rating: draft.rating, comment: draft.comment })}
                          className="mt-2 rounded-md bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-900"
                        >
                          Envoyer l'avis
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="glass-card sticky top-24 rounded-2xl p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-2xl font-bold text-amber-100">
            <FaShoppingCart /> Panier
          </h2>

          <div className="mb-4 grid grid-cols-3 gap-2">
            {(['DINE_IN', 'TAKEAWAY', 'DELIVERY'] as const).map((value) => (
              <button
                key={value}
                onClick={() => onSelectType(value)}
                className={`rounded-lg px-2 py-1 text-xs font-semibold ${
                  selectedType === value
                    ? 'bg-amber-500 text-slate-950'
                    : 'border border-amber-700/30 text-amber-200'
                }`}
              >
                {value === 'DINE_IN' ? 'Sur place' : value === 'TAKEAWAY' ? 'À emporter' : 'Livraison'}
              </button>
            ))}
          </div>

          {selectedType === 'DELIVERY' && (
            <div className="mb-4">
              <p className="mb-1 text-xs text-slate-300">Adresse de livraison</p>
              <select
                value={selectedAddressId}
                onChange={(e) => onSelectAddress(e.target.value)}
                className="w-full rounded-md border border-amber-700/30 bg-black/20 px-3 py-2 text-sm text-slate-100"
              >
                <option value="">Choisir une adresse</option>
                {addresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {address.label} - {address.street}
                  </option>
                ))}
              </select>
            </div>
          )}

          {cart.length === 0 ? (
            <p className="text-slate-300">Panier vide...</p>
          ) : (
            <>
              <div className="mb-4 max-h-64 space-y-3 overflow-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="rounded-lg border border-amber-700/30 bg-black/20 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-semibold text-amber-100">{item.name}</p>
                        <p className="text-sm text-amber-200">${(item.price * item.cartQuantity).toFixed(2)}</p>
                      </div>
                      <button onClick={() => onUpdateQuantity(item.id, 0)} className="text-red-400 hover:text-red-300">
                        <FaTimes />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.cartQuantity - 1)}
                        className="rounded bg-slate-700 px-2 py-1 text-sm hover:bg-slate-600"
                      >
                        <FaMinus />
                      </button>
                      <span className="flex-1 text-center">{item.cartQuantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.cartQuantity + 1)}
                        className="rounded bg-slate-700 px-2 py-1 text-sm hover:bg-slate-600"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-3 rounded-lg border border-amber-700/30 bg-black/20 p-3">
                <p className="mb-2 text-xs uppercase tracking-wide text-slate-300">Code promo</p>
                {promoState.valid ? (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-green-300">{promoState.code} appliqué</p>
                    <button onClick={onClearPromo} className="text-xs text-red-300 underline">
                      Retirer
                    </button>
                  </div>
                ) : (
                  <PromoInput onApply={onApplyPromo} loading={loadingPromo} />
                )}
              </div>

              <div className="mb-3 rounded-lg border border-amber-700/30 bg-black/20 p-3">
                <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-slate-300">
                  <FaCalendarAlt /> Pré-commande (optionnel)
                </p>
                <div className="flex items-center gap-2">
                  <FaClock className="text-amber-300" />
                  <input
                    type="datetime-local"
                    value={scheduledFor}
                    onChange={(e) => onSetScheduledFor(e.target.value)}
                    className="w-full rounded-md border border-amber-700/30 bg-black/20 px-2 py-2 text-sm text-slate-100"
                  />
                </div>
              </div>

              <div className="border-t border-amber-700/30 pt-4">
                <div className="mb-1 flex items-center justify-between text-sm text-slate-300">
                  <span>Sous-total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="mb-1 flex items-center justify-between text-sm text-green-300">
                  <span>Réduction</span>
                  <span>-${Math.max(0, cartTotal - finalTotal).toFixed(2)}</span>
                </div>
                <div className="mb-4 flex items-center justify-between text-lg font-bold text-amber-200">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>

                <form onSubmit={onSubmitOrder}>
                  <button
                    type="submit"
                    disabled={loadingOrder}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-60"
                  >
                    <FaCheck /> {loadingOrder ? 'Envoi...' : 'Valider la commande'}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

type PromoInputProps = {
  onApply: (code: string) => void;
  loading: boolean;
};

function PromoInput({ onApply, loading }: PromoInputProps) {
  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const input = form.elements.namedItem('promo') as HTMLInputElement | null;
        if (!input?.value?.trim()) return;
        onApply(input.value.trim().toUpperCase());
      }}
    >
      <input
        name="promo"
        type="text"
        placeholder="HOOKIES10"
        className="w-full rounded-md border border-amber-700/30 bg-black/20 px-2 py-2 text-sm text-slate-100"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-amber-500 px-3 py-2 text-xs font-semibold text-slate-950"
      >
        OK
      </button>
    </form>
  );
}
