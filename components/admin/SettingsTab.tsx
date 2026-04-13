import { useEffect, useState } from 'react';
import { FaTruck, FaGift, FaSave, FaPlus, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';

type DeliveryZone = {
  name: string;
  description: string;
  fee: number;
};

type LoyaltyReward = {
  points: number;
  label: string;
};

type LoyaltyConfig = {
  bonusPercent: number;
  bonusThreshold: number;
  referralEnabled: boolean;
  referralDiscount: number;
  referralPoints: number;
  nextRewardGoal: number;
  rewards: LoyaltyReward[];
};

type ReservationPageContent = {
  heading: string;
  intro: string;
  services: string[];
  formTitle: string;
  submitLabel: string;
};

type Props = {
  loading: boolean;
  onLoad: () => void;
  data: {
    deliveryZones: DeliveryZone[];
    loyaltyConfig: LoyaltyConfig;
    maintenanceMode: boolean;
    reservationPageContent: ReservationPageContent;
  } | null;
  onSave: (data: {
    deliveryZones?: DeliveryZone[];
    loyaltyConfig?: LoyaltyConfig;
    maintenanceMode?: boolean;
    reservationPageContent?: ReservationPageContent;
  }) => Promise<void>;
};

export default function SettingsTab({ loading, onLoad, data, onSave }: Props) {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loyalty, setLoyalty] = useState<LoyaltyConfig>({
    bonusPercent: 10,
    bonusThreshold: 200,
    referralEnabled: true,
    referralDiscount: 5,
    referralPoints: 50,
    nextRewardGoal: 500,
    rewards: [],
  });
  const [saving, setSaving] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [reservationPageContent, setReservationPageContent] = useState<ReservationPageContent>({
    heading: 'Reserver une table',
    intro: 'Choisissez votre creneau et le nombre de convives. On vous confirme ca rapidement.',
    services: ['Service midi : 11h30 - 14h30', 'Service soir : 18h30 - 23h30', 'Groupes & privatisation : appelez-nous'],
    formTitle: 'Formulaire',
    submitLabel: 'Envoyer la demande',
  });

  useEffect(() => { onLoad(); }, [onLoad]);

  useEffect(() => {
    if (data) {
      setZones(data.deliveryZones);
      setLoyalty(data.loyaltyConfig);
      setMaintenanceMode(Boolean(data.maintenanceMode));
      setReservationPageContent(data.reservationPageContent);
    }
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        deliveryZones: zones,
        loyaltyConfig: loyalty,
        maintenanceMode,
        reservationPageContent,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-slate-400">Chargement des paramètres...</div>;

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-amber-500/30 bg-amber-900/10 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-amber-100">
          {maintenanceMode ? <FaToggleOn /> : <FaToggleOff />} Mode maintenance
        </h2>
        <p className="mb-4 text-sm text-amber-100/80">
          Quand activé, le site public est redirigé vers la page de maintenance. L admin reste accessible via /admin.
        </p>
        <button
          type="button"
          onClick={() => setMaintenanceMode((prev) => !prev)}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${maintenanceMode ? 'border border-red-600/40 bg-red-900/30 text-red-200 hover:bg-red-900/45' : 'border border-green-500/40 bg-green-700/20 text-green-200 hover:bg-green-700/35'}`}
        >
          {maintenanceMode ? <FaToggleOn className="text-lg" /> : <FaToggleOff className="text-lg" />}
          {maintenanceMode ? 'Maintenance activée' : 'Maintenance désactivée'}
        </button>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 text-xl font-bold text-amber-100">Page publique reservation</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-slate-400">Titre</label>
            <input
              type="text"
              value={reservationPageContent.heading}
              onChange={(e) => setReservationPageContent((prev) => ({ ...prev, heading: e.target.value }))}
              className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-400">Titre formulaire</label>
            <input
              type="text"
              value={reservationPageContent.formTitle}
              onChange={(e) => setReservationPageContent((prev) => ({ ...prev, formTitle: e.target.value }))}
              className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-xs text-slate-400">Texte intro</label>
          <textarea
            rows={3}
            value={reservationPageContent.intro}
            onChange={(e) => setReservationPageContent((prev) => ({ ...prev, intro: e.target.value }))}
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100"
          />
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-xs text-slate-400">Services (une ligne = un item)</label>
          <textarea
            rows={4}
            value={reservationPageContent.services.join('\n')}
            onChange={(e) => setReservationPageContent((prev) => ({
              ...prev,
              services: e.target.value.split('\n').map((line) => line.trim()).filter(Boolean),
            }))}
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100"
          />
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-xs text-slate-400">Libelle bouton</label>
          <input
            type="text"
            value={reservationPageContent.submitLabel}
            onChange={(e) => setReservationPageContent((prev) => ({ ...prev, submitLabel: e.target.value }))}
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100"
          />
        </div>
      </div>

      {/* Delivery zones */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-amber-100">
          <FaTruck /> Zones de livraison
        </h2>
        <div className="space-y-4">
          {zones.map((zone, i) => (
            <div key={i} className="grid grid-cols-1 gap-3 rounded-lg border border-white/10 bg-white/5 p-4 md:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs text-slate-400">Nom</label>
                <input
                  type="text"
                  value={zone.name}
                  onChange={e => {
                    const z = [...zones];
                    z[i] = { ...z[i], name: e.target.value };
                    setZones(z);
                  }}
                  className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs text-slate-400">Description</label>
                <input
                  type="text"
                  value={zone.description}
                  onChange={e => {
                    const z = [...zones];
                    z[i] = { ...z[i], description: e.target.value };
                    setZones(z);
                  }}
                  className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100"
                />
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-slate-400">Frais ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={zone.fee}
                    onChange={e => {
                      const z = [...zones];
                      z[i] = { ...z[i], fee: parseFloat(e.target.value) || 0 };
                      setZones(z);
                    }}
                    className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100"
                  />
                </div>
                <button
                  onClick={() => setZones(zones.filter((_, j) => j !== i))}
                  className="rounded-md border border-red-700/40 bg-red-900/20 p-2 text-red-300 hover:bg-red-900/40"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => setZones([...zones, { name: '', description: '', fee: 0 }])}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
          >
            <FaPlus /> Ajouter une zone
          </button>
        </div>
      </div>

      {/* Loyalty config */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-amber-100">
          <FaGift /> Programme de fidélité
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs text-slate-400">Bonus (%)</label>
            <input
              type="number"
              min="0"
              value={loyalty.bonusPercent}
              onChange={e => setLoyalty({ ...loyalty, bonusPercent: parseInt(e.target.value) || 0 })}
              className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100"
            />
            <p className="mt-1 text-xs text-slate-500">Réduction accordée</p>
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-400">Seuil bonus (points)</label>
            <input
              type="number"
              min="0"
              value={loyalty.bonusThreshold}
              onChange={e => setLoyalty({ ...loyalty, bonusThreshold: parseInt(e.target.value) || 0 })}
              className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100"
            />
            <p className="mt-1 text-xs text-slate-500">Points nécessaires pour activer le bonus</p>
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-400">Objectif récompense (points)</label>
            <input
              type="number"
              min="0"
              value={loyalty.nextRewardGoal}
              onChange={e => setLoyalty({ ...loyalty, nextRewardGoal: parseInt(e.target.value) || 0 })}
              className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100"
            />
            <p className="mt-1 text-xs text-slate-500">Progression vers la prochaine récompense</p>
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-400">Parrainage</label>
            <button
              type="button"
              onClick={() => setLoyalty({ ...loyalty, referralEnabled: !loyalty.referralEnabled })}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${loyalty.referralEnabled ? 'bg-green-600/30 text-green-200 border border-green-500/40' : 'bg-red-900/30 text-red-300 border border-red-600/40'}`}
            >
              {loyalty.referralEnabled ? <FaToggleOn className="text-lg" /> : <FaToggleOff className="text-lg" />}
              {loyalty.referralEnabled ? 'Activé' : 'Désactivé'}
            </button>
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-400">Parrainage : réduction ami ($)</label>
            <input
              type="number"
              min="0"
              value={loyalty.referralDiscount}
              onChange={e => setLoyalty({ ...loyalty, referralDiscount: parseInt(e.target.value) || 0 })}
              className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-400">Parrainage : points parrain</label>
            <input
              type="number"
              min="0"
              value={loyalty.referralPoints}
              onChange={e => setLoyalty({ ...loyalty, referralPoints: parseInt(e.target.value) || 0 })}
              className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100"
            />
          </div>
        </div>

        <h3 className="mb-3 mt-6 text-sm font-semibold text-slate-300">Récompenses disponibles</h3>
        <div className="space-y-3">
          {loyalty.rewards.map((reward, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-32">
                <input
                  type="number"
                  min="0"
                  value={reward.points}
                  onChange={e => {
                    const r = [...loyalty.rewards];
                    r[i] = { ...r[i], points: parseInt(e.target.value) || 0 };
                    setLoyalty({ ...loyalty, rewards: r });
                  }}
                  placeholder="Points"
                  className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={reward.label}
                  onChange={e => {
                    const r = [...loyalty.rewards];
                    r[i] = { ...r[i], label: e.target.value };
                    setLoyalty({ ...loyalty, rewards: r });
                  }}
                  placeholder="Récompense (ex: Boisson offerte)"
                  className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100"
                />
              </div>
              <button
                onClick={() => setLoyalty({ ...loyalty, rewards: loyalty.rewards.filter((_, j) => j !== i) })}
                className="rounded-md border border-red-700/40 bg-red-900/20 p-2 text-red-300 hover:bg-red-900/40"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            onClick={() => setLoyalty({ ...loyalty, rewards: [...loyalty.rewards, { points: 0, label: '' }] })}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
          >
            <FaPlus /> Ajouter une récompense
          </button>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-semibold text-black transition hover:bg-amber-400 disabled:opacity-60"
      >
        <FaSave /> {saving ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
      </button>
    </div>
  );
}
