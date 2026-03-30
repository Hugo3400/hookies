import { FaDiscord } from 'react-icons/fa';

type AuthPanelProps = {
  error: string | null;
  successMessage: string | null;
};

export default function AuthPanel({
  error,
  successMessage,
}: AuthPanelProps) {
  return (
    <section className="min-h-screen px-4 py-12 md:px-6">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl font-black text-amber-200">HOOKIES</h1>
          <p className="mt-2 text-slate-300">Espace Client</p>
        </div>

        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#5865F2]/20">
            <FaDiscord className="text-4xl text-[#5865F2]" />
          </div>

          <h2 className="mb-3 text-xl font-bold text-amber-200">Connexion via Discord</h2>
          <p className="mb-6 text-sm text-slate-300">
            Connecte-toi avec ton compte Discord pour accéder à ton espace client Hookies.
          </p>

          {error && (
            <div className="mb-4 rounded-lg border border-red-600/50 bg-red-950/30 px-4 py-3 text-sm text-red-200">
              {error === 'missing_code' && 'Erreur de connexion Discord. Réessaye.'}
              {error === 'discord_token' && 'Impossible de vérifier ton compte Discord.'}
              {error === 'discord_user' && 'Impossible de récupérer tes infos Discord.'}
              {error === 'account_disabled' && 'Ton compte est désactivé.'}
              {error === 'server_error' && 'Erreur serveur. Réessaye plus tard.'}
              {error === 'discord_rejected' && 'Discord a refusé la connexion. Vérifie la config du scope.'}
              {!['missing_code', 'discord_token', 'discord_user', 'account_disabled', 'server_error', 'discord_rejected'].includes(error) && error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 rounded-lg border border-green-600/50 bg-green-950/30 px-4 py-3 text-sm text-green-200">
              {successMessage}
            </div>
          )}

          <a
            href="/api/auth/discord"
            className="inline-flex w-full items-center justify-center gap-3 rounded-lg bg-[#5865F2] py-3 font-semibold text-white transition hover:bg-[#4752C4]"
          >
            <FaDiscord className="text-xl" />
            Se connecter avec Discord
          </a>

          <p className="mt-4 text-xs text-slate-400">
            Un compte Hookies sera automatiquement créé si c&apos;est ta première connexion.
          </p>
        </div>
      </div>
    </section>
  );
}
