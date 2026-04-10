import { FaDiscord } from 'react-icons/fa';

type AuthPanelProps = {
  error: string | null;
  successMessage: string | null;
  discordLoginUrl: string;
};

export default function AuthPanel({
  error,
  successMessage,
  discordLoginUrl,
}: AuthPanelProps) {
  return (
    <section className="min-h-screen px-4 py-12 md:px-6">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl font-black text-amber-200">HOOKIES</h1>
          <p className="mt-2 text-slate-300">Espace Client</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <h2 className="mb-2 text-center text-xl font-bold text-amber-200">Connexion</h2>
          <p className="mb-6 text-center text-sm text-slate-300">
            Authentification uniquement via Discord.
          </p>

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

          <a
            href={discordLoginUrl}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#5865F2] py-3 font-semibold text-white transition hover:bg-[#4d59d6]"
          >
            <FaDiscord className="h-5 w-5" /> Continuer avec Discord
          </a>
          <p className="mt-4 text-center text-xs text-slate-400">
            A la premiere inscription Discord, nom, prenom et numero US seront demandes.
          </p>
        </div>
      </div>
    </section>
  );
}
