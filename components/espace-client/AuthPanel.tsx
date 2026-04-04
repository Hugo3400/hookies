import { FormEvent } from 'react';
import { FaEnvelope, FaLock, FaUser, FaPhone } from 'react-icons/fa';
import type { AuthMode } from './types';

type AuthPanelProps = {
  error: string | null;
  successMessage: string | null;
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  authForm: { name: string; email: string; password: string; phone: string };
  setAuthForm: (form: { name: string; email: string; password: string; phone: string }) => void;
  handleAuthSubmit: (e: FormEvent<HTMLFormElement>) => void;
  loading: boolean;
};

export default function AuthPanel({
  error,
  successMessage,
  authMode,
  setAuthMode,
  authForm,
  setAuthForm,
  handleAuthSubmit,
  loading,
}: AuthPanelProps) {
  return (
    <section className="min-h-screen px-4 py-12 md:px-6">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl font-black text-amber-200">HOOKIES</h1>
          <p className="mt-2 text-slate-300">Espace Client</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <h2 className="mb-6 text-center text-xl font-bold text-amber-200">
            {authMode === 'login' ? 'Connexion' : 'Créer un compte'}
          </h2>

          {error && (
            <div className="mb-4 rounded-lg border border-red-600/50 bg-red-950/30 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 rounded-lg border border-green-600/50 bg-green-950/30 px-4 py-3 text-sm text-green-200">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div className="relative">
                <FaUser className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Nom"
                  required
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-600 bg-slate-800/50 py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                />
              </div>
            )}

            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3.5 text-slate-400" />
              <input
                type="email"
                placeholder="Email"
                required
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                className="w-full rounded-lg border border-slate-600 bg-slate-800/50 py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-3.5 text-slate-400" />
              <input
                type="password"
                placeholder="Mot de passe"
                required
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                className="w-full rounded-lg border border-slate-600 bg-slate-800/50 py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {authMode === 'register' && (
              <div className="relative">
                <FaPhone className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="tel"
                  placeholder="Téléphone (optionnel)"
                  value={authForm.phone}
                  onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                  className="w-full rounded-lg border border-slate-600 bg-slate-800/50 py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-amber-500 py-3 font-semibold text-slate-900 transition hover:bg-amber-400 disabled:opacity-50"
            >
              {loading ? 'Chargement...' : authMode === 'login' ? 'Se connecter' : "S'inscrire"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            {authMode === 'login' ? (
              <>Pas encore de compte ?{' '}
                <button onClick={() => setAuthMode('register')} className="text-amber-400 hover:underline">Créer un compte</button>
              </>
            ) : (
              <>Déjà un compte ?{' '}
                <button onClick={() => setAuthMode('login')} className="text-amber-400 hover:underline">Se connecter</button>
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
