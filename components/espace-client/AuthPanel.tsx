import { FaDiscord } from 'react-icons/fa';

type AuthPanelProps = {
  error: string | null;
  successMessage: string | null;
};

const DISCORD_BOT_URL = 'https://discord.com/users/1488127187986153534';

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
            Pour t&apos;inscrire ou te connecter, envoie un message privé à notre bot Discord <strong className="text-amber-300">Hookies</strong>.
          </p>

          <div className="mb-6 rounded-lg border border-amber-700/30 bg-black/20 p-4 text-left text-sm text-slate-300">
            <p className="mb-2 font-semibold text-amber-200">Comment faire ?</p>
            <ol className="list-inside list-decimal space-y-1">
              <li>Clique sur le bouton ci-dessous</li>
              <li>Envoie un message au bot</li>
              <li>Utilise <code className="rounded bg-black/40 px-1 text-amber-300">/register</code> pour créer ton compte</li>
              <li>Utilise <code className="rounded bg-black/40 px-1 text-amber-300">/login</code> pour te connecter</li>
            </ol>
          </div>

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
            href={DISCORD_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-3 rounded-lg bg-[#5865F2] py-3 font-semibold text-white transition hover:bg-[#4752C4]"
          >
            <FaDiscord className="text-xl" />
            Ouvrir le bot Discord
          </a>

          <p className="mt-4 text-xs text-slate-400">
            Le bot te donnera un lien sécurisé pour accéder à ton espace client.
          </p>
        </div>
      </div>
    </section>
  );
}
