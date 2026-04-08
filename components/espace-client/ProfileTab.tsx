import { FormEvent } from 'react';
import { FaAddressCard, FaCheck, FaEnvelope, FaMapMarkedAlt, FaTrash, FaUser } from 'react-icons/fa';
import type { UserAddress } from './types';

type ProfileTabProps = {
  user: {
    name?: string;
    email?: string;
    role?: string;
    phone?: string;
    loyaltyPoints?: number;
  } | null;
  profileForm: {
    name: string;
    phone: string;
    currentPassword: string;
    newPassword: string;
  };
  setProfileForm: (updater: (prev: {
    name: string;
    phone: string;
    currentPassword: string;
    newPassword: string;
  }) => {
    name: string;
    phone: string;
    currentPassword: string;
    newPassword: string;
  }) => void;
  loadingProfile: boolean;
  onSubmitProfile: (event: FormEvent<HTMLFormElement>) => void;
  addressForm: {
    label: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  };
  setAddressForm: (updater: (prev: {
    label: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }) => {
    label: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }) => void;
  loadingAddress: boolean;
  addresses: UserAddress[];
  onSubmitAddress: (event: FormEvent<HTMLFormElement>) => void;
  onSetDefaultAddress: (id: string) => void;
  onDeleteAddress: (id: string) => void;
};

export default function ProfileTab({
  user,
  profileForm,
  setProfileForm,
  loadingProfile,
  onSubmitProfile,
  addressForm,
  setAddressForm,
  loadingAddress,
  addresses,
  onSubmitAddress,
  onSetDefaultAddress,
  onDeleteAddress,
}: ProfileTabProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <div className="glass-card rounded-2xl p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-2xl font-bold text-amber-100">
            <FaUser /> Mon profil
          </h2>

          <div className="mb-6 space-y-3 rounded-lg border border-amber-700/30 bg-black/20 p-4">
            <p className="text-sm text-slate-300">Nom actuel: <span className="text-amber-100">{user?.name || '-'}</span></p>
            <p className="text-sm text-slate-300">
              <FaEnvelope className="mr-1 inline" /> {user?.email || '-'}
            </p>
            <p className="text-sm text-slate-300">Rôle: {user?.role || 'CLIENT'}</p>
          </div>

          <form onSubmit={onSubmitProfile} className="space-y-3">
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Nom"
              autoComplete="name"
              className="w-full rounded-lg border border-amber-700/30 bg-black/20 px-4 py-3 text-slate-100"
            />
            <input
              type="tel"
              value={profileForm.phone}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="Téléphone"
              autoComplete="tel"
              className="w-full rounded-lg border border-amber-700/30 bg-black/20 px-4 py-3 text-slate-100"
            />
            <input
              type="password"
              value={profileForm.currentPassword}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
              placeholder="Mot de passe actuel (si changement)"
              autoComplete="current-password"
              className="w-full rounded-lg border border-amber-700/30 bg-black/20 px-4 py-3 text-slate-100"
            />
            <input
              type="password"
              value={profileForm.newPassword}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, newPassword: e.target.value }))}
              placeholder="Nouveau mot de passe"
              autoComplete="new-password"
              className="w-full rounded-lg border border-amber-700/30 bg-black/20 px-4 py-3 text-slate-100"
            />

            <button
              type="submit"
              disabled={loadingProfile}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 py-3 font-semibold text-slate-950"
            >
              <FaCheck /> {loadingProfile ? 'Mise à jour...' : 'Enregistrer les modifications'}
            </button>
          </form>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="mb-4 flex items-center gap-2 font-display text-2xl font-bold text-amber-100">
            <FaAddressCard /> Adresses de livraison
          </h3>

          <form onSubmit={onSubmitAddress} className="space-y-2">
            <input
              type="text"
              value={addressForm.label}
              onChange={(e) => setAddressForm((prev) => ({ ...prev, label: e.target.value }))}
              placeholder="Label (Maison, Bureau...)"
              className="w-full rounded-md border border-amber-700/30 bg-black/20 px-3 py-2 text-slate-100"
            />
            <input
              type="text"
              value={addressForm.street}
              onChange={(e) => setAddressForm((prev) => ({ ...prev, street: e.target.value }))}
              placeholder="Adresse"
              className="w-full rounded-md border border-amber-700/30 bg-black/20 px-3 py-2 text-slate-100"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={addressForm.postalCode}
                onChange={(e) => setAddressForm((prev) => ({ ...prev, postalCode: e.target.value }))}
                placeholder="Code postal"
                className="w-full rounded-md border border-amber-700/30 bg-black/20 px-3 py-2 text-slate-100"
              />
              <input
                type="text"
                value={addressForm.city}
                onChange={(e) => setAddressForm((prev) => ({ ...prev, city: e.target.value }))}
                placeholder="Ville"
                className="w-full rounded-md border border-amber-700/30 bg-black/20 px-3 py-2 text-slate-100"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={addressForm.isDefault}
                onChange={(e) => setAddressForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
              />
              Adresse par défaut
            </label>
            <button
              type="submit"
              disabled={loadingAddress}
              className="w-full rounded-md bg-amber-500 py-2 font-semibold text-slate-950"
            >
              {loadingAddress ? 'Ajout...' : 'Ajouter l\'adresse'}
            </button>
          </form>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h4 className="mb-3 flex items-center gap-2 text-lg font-bold text-amber-100">
            <FaMapMarkedAlt /> Mes adresses
          </h4>
          {addresses.length === 0 ? (
            <p className="text-sm text-slate-300">Aucune adresse enregistrée.</p>
          ) : (
            <div className="space-y-2">
              {addresses.map((address) => (
                <div key={address.id} className="rounded-lg border border-amber-700/30 bg-black/20 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-amber-100">
                        {address.label} {address.isDefault && <span className="text-xs text-green-300">(Défaut)</span>}
                      </p>
                      <p className="text-sm text-slate-300">
                        {address.street}, {address.postalCode} {address.city}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!address.isDefault && (
                        <button onClick={() => onSetDefaultAddress(address.id)} className="text-xs text-amber-300 underline">
                          Défaut
                        </button>
                      )}
                      <button onClick={() => onDeleteAddress(address.id)} className="text-red-300">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
