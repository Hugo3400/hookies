import { FormEvent } from 'react';

type DiscordProfileCompletionProps = {
  error: string | null;
  successMessage: string | null;
  form: { firstName: string; lastName: string; phone: string };
  setForm: (form: { firstName: string; lastName: string; phone: string }) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  onLogout: () => void;
};

export default function DiscordProfileCompletion({
  error,
  successMessage,
  form,
  setForm,
  onSubmit,
  loading,
  onLogout,
}: DiscordProfileCompletionProps) {
  return (
    <section className="px-4 py-12 md:px-6">
      <div className="mx-auto max-w-xl rounded-2xl border border-amber-700/30 bg-black/20 p-6 md:p-8">
        <h1 className="font-display text-3xl font-black text-amber-200">Finaliser ton compte</h1>
        <p className="mt-2 text-sm text-slate-300">
          Premiere connexion Discord detectee. Merci de renseigner nom, prenom et numero US.
        </p>

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

        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              required
              autoComplete="given-name"
              placeholder="Prenom"
              value={form.firstName}
              onChange={(event) => setForm({ ...form, firstName: event.target.value })}
              className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
            />
            <input
              type="text"
              required
              autoComplete="family-name"
              placeholder="Nom"
              value={form.lastName}
              onChange={(event) => setForm({ ...form, lastName: event.target.value })}
              className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <input
            type="tel"
            required
            autoComplete="tel"
            placeholder="Numero US (ex: +14155552671)"
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-amber-500 py-3 font-semibold text-slate-900 transition hover:bg-amber-400 disabled:opacity-50"
          >
            {loading ? 'Validation...' : 'Valider mon profil'}
          </button>
        </form>

        <button
          type="button"
          onClick={onLogout}
          className="mt-4 text-sm text-amber-300 underline"
        >
          Se deconnecter
        </button>
      </div>
    </section>
  );
}
