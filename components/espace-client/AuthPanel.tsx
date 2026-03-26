import { FormEvent } from 'react';
import { FaCheck } from 'react-icons/fa';
import type { AuthMode } from './types';

type AuthPanelProps = {
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  authForm: {
    name: string;
    email: string;
    password: string;
    phone: string;
  };
  setAuthForm: (updater: (prev: { name: string; email: string; password: string; phone: string }) => {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => void;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function AuthPanel({
  authMode,
  setAuthMode,
  authForm,
  setAuthForm,
  loading,
  error,
  successMessage,
  onSubmit,
}: AuthPanelProps) {
  return (
    <section className="min-h-screen px-4 py-12 md:px-6">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl font-black text-amber-200">HOOKIES</h1>
          <p className="mt-2 text-slate-300">Espace Client</p>
        </div>

        <form onSubmit={onSubmit} className="glass-card rounded-2xl p-8">
          <div className="mb-6 flex gap-2">
            {(['login', 'register'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setAuthMode(mode)}
                className={`flex-1 rounded-lg px-4 py-2 font-semibold transition ${
                  authMode === mode
                    ? 'bg-amber-500 text-slate-950'
                    : 'border border-amber-700/30 text-amber-200 hover:bg-amber-500/10'
                }`}
              >
                {mode === 'login' ? 'Connexion' : 'Inscription'}
              </button>
            ))}
          </div>

          {authMode === 'register' && (
            <>
              <input
                type="text"
                required
                value={authForm.name}
                onChange={(e) => setAuthForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Nom complet"
                className="w-full rounded-lg border border-amber-700/30 bg-black/20 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-400"
              />
              <div className="mt-3" />
            </>
          )}

          <input
            type="email"
            required
            value={authForm.email}
            onChange={(e) => setAuthForm((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="Email"
            autoComplete="email"
            className="w-full rounded-lg border border-amber-700/30 bg-black/20 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-400"
          />

          <div className="mt-3" />

          <input
            type="password"
            required
            value={authForm.password}
            onChange={(e) => setAuthForm((prev) => ({ ...prev, password: e.target.value }))}
            placeholder="Mot de passe"
            autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
            className="w-full rounded-lg border border-amber-700/30 bg-black/20 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-400"
          />

          {authMode === 'register' && (
            <>
              <div className="mt-3" />
              <input
                type="tel"
                value={authForm.phone}
                onChange={(e) => setAuthForm((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="Téléphone (optionnel)"
                className="w-full rounded-lg border border-amber-700/30 bg-black/20 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-400"
              />
            </>
          )}

          {error && (
            <div className="mt-4 rounded-lg border border-red-600/50 bg-red-950/30 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mt-4 rounded-lg border border-green-600/50 bg-green-950/30 px-4 py-3 text-sm text-green-200">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-60"
          >
            <FaCheck />
            {loading ? 'Chargement...' : authMode === 'login' ? 'Se connecter' : 'Créer un compte'}
          </button>
        </form>
      </div>
    </section>
  );
}
