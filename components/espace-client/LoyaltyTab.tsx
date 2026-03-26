import { FaCoins, FaGift, FaPercent, FaUsers } from 'react-icons/fa';

type LoyaltyTabProps = {
  userName?: string;
  points: number;
  referralCode: string;
};

export default function LoyaltyTab({ userName, points, referralCode }: LoyaltyTabProps) {
  const nextReward = 500;
  const progress = Math.min(100, Math.floor((points / nextReward) * 100));

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <h2 className="mb-3 flex items-center gap-2 font-display text-2xl font-bold text-amber-100">
          <FaGift /> Fidélité & Parrainage
        </h2>
        <p className="text-slate-300">Programme premium pour {userName || 'toi'}.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-amber-700/30 bg-black/20 p-4">
          <p className="flex items-center gap-2 text-sm text-slate-300"><FaCoins /> Points acquis</p>
          <p className="mt-2 text-3xl font-black text-amber-200">{points}</p>
        </div>
        <div className="rounded-xl border border-amber-700/30 bg-black/20 p-4">
          <p className="flex items-center gap-2 text-sm text-slate-300"><FaPercent /> Bonus actuel</p>
          <p className="mt-2 text-3xl font-black text-green-300">-10%</p>
          <p className="text-xs text-slate-400">Dès 200 points</p>
        </div>
        <div className="rounded-xl border border-amber-700/30 bg-black/20 p-4">
          <p className="flex items-center gap-2 text-sm text-slate-300"><FaUsers /> Code parrainage</p>
          <p className="mt-2 rounded-md bg-slate-900 px-2 py-1 text-lg font-black text-amber-200">{referralCode}</p>
          <p className="text-xs text-slate-400">Ton ami gagne -5€, toi +50 points</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-display text-xl font-bold text-amber-100">Progression vers récompense</h3>
        <p className="mt-2 text-sm text-slate-300">
          Objectif: {nextReward} points pour un menu offert. Il te manque {Math.max(0, nextReward - points)} points.
        </p>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-gradient-to-r from-amber-500 to-green-400" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h4 className="font-display text-lg font-bold text-amber-100">Récompenses disponibles</h4>
        <div className="mt-3 space-y-2">
          <RewardLine label="100 points" value="Boisson offerte" unlocked={points >= 100} />
          <RewardLine label="250 points" value="Dessert offert" unlocked={points >= 250} />
          <RewardLine label="500 points" value="Menu offert" unlocked={points >= 500} />
        </div>
      </div>
    </div>
  );
}

type RewardLineProps = {
  label: string;
  value: string;
  unlocked: boolean;
};

function RewardLine({ label, value, unlocked }: RewardLineProps) {
  return (
    <div className="flex items-center justify-between rounded-md border border-amber-700/20 bg-black/20 px-3 py-2">
      <p className="text-sm text-slate-300">{label} • {value}</p>
      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${unlocked ? 'bg-green-500/20 text-green-200' : 'bg-slate-700 text-slate-300'}`}>
        {unlocked ? 'Débloqué' : 'Verrouillé'}
      </span>
    </div>
  );
}
