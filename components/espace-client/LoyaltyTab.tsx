import { useEffect, useState } from 'react';
import { FaCoins, FaGift, FaPercent, FaUsers } from 'react-icons/fa';

type LoyaltyReward = { points: number; label: string };
type LoyaltyConfig = {
  bonusPercent: number;
  bonusThreshold: number;
  referralDiscount: number;
  referralPoints: number;
  nextRewardGoal: number;
  rewards: LoyaltyReward[];
};

type LoyaltyTabProps = {
  userName?: string;
  points: number;
  referralCode: string;
};

const DEFAULT_CONFIG: LoyaltyConfig = {
  bonusPercent: 10,
  bonusThreshold: 200,
  referralDiscount: 5,
  referralPoints: 50,
  nextRewardGoal: 500,
  rewards: [
    { points: 100, label: 'Boisson offerte' },
    { points: 250, label: 'Dessert offert' },
    { points: 500, label: 'Menu offert' },
  ],
};

export default function LoyaltyTab({ userName, points, referralCode }: LoyaltyTabProps) {
  const [config, setConfig] = useState<LoyaltyConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    fetch('/api/public/loyalty-config')
      .then(r => r.ok ? r.json() : DEFAULT_CONFIG)
      .then(data => setConfig(data))
      .catch(() => {});
  }, []);

  const progress = Math.min(100, Math.floor((points / config.nextRewardGoal) * 100));

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
          <p className="mt-2 text-3xl font-black text-green-300">-{config.bonusPercent}%</p>
          <p className="text-xs text-slate-400">Dès {config.bonusThreshold} points</p>
        </div>
        <div className="rounded-xl border border-amber-700/30 bg-black/20 p-4">
          <p className="flex items-center gap-2 text-sm text-slate-300"><FaUsers /> Code parrainage</p>
          <p className="mt-2 rounded-md bg-slate-900 px-2 py-1 text-lg font-black text-amber-200">{referralCode}</p>
          <p className="text-xs text-slate-400">Ton ami gagne -${config.referralDiscount}, toi +{config.referralPoints} points</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-display text-xl font-bold text-amber-100">Progression vers récompense</h3>
        <p className="mt-2 text-sm text-slate-300">
          Objectif: {config.nextRewardGoal} points pour un menu offert. Il te manque {Math.max(0, config.nextRewardGoal - points)} points.
        </p>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-gradient-to-r from-amber-500 to-green-400" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h4 className="font-display text-lg font-bold text-amber-100">Récompenses disponibles</h4>
        <div className="mt-3 space-y-2">
          {config.rewards.map((reward, i) => (
            <RewardLine key={i} label={`${reward.points} points`} value={reward.label} unlocked={points >= reward.points} />
          ))}
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
