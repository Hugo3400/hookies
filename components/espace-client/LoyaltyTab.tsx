import { useEffect, useState } from 'react';
import { FaCoins, FaGift, FaPercent, FaUsers, FaCopy, FaCheck } from 'react-icons/fa';
import { DEFAULT_LOYALTY_CONFIG, type LoyaltyConfig } from '@/lib/config/siteDefaults';

type LoyaltyTabProps = {
  userName?: string;
  points: number;
  referralCode: string;
  token: string;
};

export default function LoyaltyTab({ userName, points, referralCode, token }: LoyaltyTabProps) {
  const [config, setConfig] = useState<LoyaltyConfig>(DEFAULT_LOYALTY_CONFIG);
  const [referralInput, setReferralInput] = useState('');
  const [referralMsg, setReferralMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [referralLoading, setReferralLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/public/loyalty-config')
      .then(r => r.ok ? r.json() : DEFAULT_LOYALTY_CONFIG)
      .then(data => setConfig(data))
      .catch(() => {});
  }, []);

  const handleApplyReferral = async () => {
    if (!referralInput.trim()) return;
    setReferralLoading(true);
    setReferralMsg(null);
    try {
      const res = await fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code: referralInput.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (res.ok) {
        setReferralMsg({ text: data.message, ok: true });
        setReferralInput('');
      } else {
        setReferralMsg({ text: data.error || 'Erreur', ok: false });
      }
    } catch {
      setReferralMsg({ text: 'Erreur réseau.', ok: false });
    } finally {
      setReferralLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

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
        {config.referralEnabled && (
          <div className="rounded-xl border border-amber-700/30 bg-black/20 p-4">
            <p className="flex items-center gap-2 text-sm text-slate-300"><FaUsers /> Code parrainage</p>
            <div className="mt-2 flex items-center gap-2">
              <p className="flex-1 rounded-md bg-slate-900 px-2 py-1 text-lg font-black text-amber-200">{referralCode}</p>
              <button onClick={handleCopy} className="rounded-md bg-slate-800 p-2 text-slate-300 transition hover:bg-slate-700" title="Copier">
                {copied ? <FaCheck className="text-green-400" /> : <FaCopy />}
              </button>
            </div>
            <p className="text-xs text-slate-400">Ton ami gagne -${config.referralDiscount}, toi +{config.referralPoints} points</p>
          </div>
        )}
      </div>

      {config.referralEnabled && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-display text-xl font-bold text-amber-100">Utiliser un code parrainage</h3>
          <p className="mt-1 text-sm text-slate-300">
            Tu as un code d&apos;un ami ? Entre-le ici pour bénéficier d&apos;une réduction de -${config.referralDiscount}.
          </p>
          <div className="mt-4 flex gap-3">
            <input
              type="text"
              placeholder="HOOK-XXXXXX"
              value={referralInput}
              onChange={e => setReferralInput(e.target.value.toUpperCase())}
              className="flex-1 rounded-lg border border-white/10 bg-black/30 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-500/50 focus:outline-none"
              maxLength={20}
            />
            <button
              onClick={handleApplyReferral}
              disabled={referralLoading || !referralInput.trim()}
              className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-black transition hover:bg-amber-400 disabled:opacity-50"
            >
              {referralLoading ? '...' : 'Appliquer'}
            </button>
          </div>
          {referralMsg && (
            <div className={`mt-3 rounded-lg border px-4 py-3 text-sm ${referralMsg.ok ? 'border-green-600/50 bg-green-950/30 text-green-200' : 'border-red-600/50 bg-red-950/30 text-red-200'}`}>
              {referralMsg.text}
            </div>
          )}
        </div>
      )}

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
