import { FormEvent } from 'react';
import { FaCalendarAlt, FaCheck, FaClock, FaPhone, FaUsers } from 'react-icons/fa';
import type { Reservation } from './types';

type ReservationsTabProps = {
  hasPhone: boolean;
  loadingData: boolean;
  loadingReservation: boolean;
  reservationForm: {
    date: string;
    time: string;
    guestCount: number;
    specialRequest: string;
  };
  setReservationForm: (updater: (prev: {
    date: string;
    time: string;
    guestCount: number;
    specialRequest: string;
  }) => {
    date: string;
    time: string;
    guestCount: number;
    specialRequest: string;
  }) => void;
  reservations: Reservation[];
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function ReservationsTab({
  hasPhone,
  loadingData,
  loadingReservation,
  reservationForm,
  setReservationForm,
  reservations,
  onSubmit,
}: ReservationsTabProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="glass-card rounded-2xl p-6">
        <h2 className="mb-4 flex items-center gap-2 font-display text-2xl font-bold text-amber-100">
          <FaCalendarAlt /> Nouvelle réservation
        </h2>

        {!hasPhone && (
          <div className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            <p className="flex items-center gap-2 font-semibold">
              <FaPhone className="text-amber-300" /> Numéro de téléphone obligatoire
            </p>
            <p className="mt-1 text-amber-100/80">
              Ajoute ton numéro dans l'onglet Profil avant de réserver une table.
            </p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-amber-400" />
            <input
              type="date"
              required
              value={reservationForm.date}
              onChange={(e) => setReservationForm((prev) => ({ ...prev, date: e.target.value }))}
              className="w-full rounded-lg border border-amber-700/30 bg-black/20 px-4 py-3 text-slate-100"
            />
          </div>

          <div className="flex items-center gap-2">
            <FaClock className="text-amber-400" />
            <input
              type="time"
              required
              value={reservationForm.time}
              onChange={(e) => setReservationForm((prev) => ({ ...prev, time: e.target.value }))}
              className="w-full rounded-lg border border-amber-700/30 bg-black/20 px-4 py-3 text-slate-100"
            />
          </div>

          <div className="flex items-center gap-2">
            <FaUsers className="text-amber-400" />
            <input
              type="number"
              min={1}
              max={20}
              required
              value={reservationForm.guestCount}
              onChange={(e) =>
                setReservationForm((prev) => ({ ...prev, guestCount: Number(e.target.value || 1) }))
              }
              className="w-full rounded-lg border border-amber-700/30 bg-black/20 px-4 py-3 text-slate-100"
            />
          </div>

          <textarea
            rows={4}
            value={reservationForm.specialRequest}
            onChange={(e) => setReservationForm((prev) => ({ ...prev, specialRequest: e.target.value }))}
            placeholder="Demandes spéciales"
            className="w-full rounded-lg border border-amber-700/30 bg-black/20 px-4 py-3 text-slate-100"
          />

          <button
            type="submit"
            disabled={loadingReservation || !hasPhone}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-60"
          >
            <FaCheck /> {loadingReservation ? 'Envoi...' : !hasPhone ? 'Ajoute ton numéro dans Profil' : 'Réserver une table'}
          </button>
        </form>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h2 className="mb-4 flex items-center gap-2 font-display text-2xl font-bold text-amber-100">
          <FaCalendarAlt /> Historique des réservations
        </h2>

        {loadingData ? (
          <p className="text-slate-300">Chargement...</p>
        ) : reservations.length === 0 ? (
          <p className="text-slate-300">Aucune réservation pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {reservations.map((reservation) => (
              <div key={reservation.id} className="rounded-lg border border-amber-700/30 bg-black/20 p-4">
                <p className="font-semibold text-amber-100">
                  {new Date(reservation.date).toLocaleDateString('fr-FR')} à {reservation.time}
                </p>
                <p className="mt-1 text-sm text-slate-300">{reservation.guestCount} personnes</p>
                {reservation.specialRequest && (
                  <p className="mt-1 text-xs text-slate-400">{reservation.specialRequest}</p>
                )}
                <span className="mt-2 inline-block rounded-full bg-amber-500/20 px-2 py-1 text-xs font-semibold text-amber-200">
                  {reservation.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
