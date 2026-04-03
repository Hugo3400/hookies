import { useMemo, useState } from 'react';

type IngredientStock = {
  patate: number;
  salade: number;
  saumon: number;
  pain: number;
};

type Recipe = {
  key: string;
  label: string;
  requirements: IngredientStock;
};

const RECIPES: Recipe[] = [
  {
    key: 'moussaillon',
    label: 'Ration du Moussaillon',
    requirements: { patate: 1, salade: 1, saumon: 1, pain: 1 },
  },
  {
    key: 'kraken',
    label: 'Kraken Croustillant',
    requirements: { patate: 2, salade: 1, saumon: 2, pain: 1 },
  },
  {
    key: 'capitaine',
    label: 'Tresor du Capitaine',
    requirements: { patate: 2, salade: 1, saumon: 2, pain: 2 },
  },
];

export default function IngredientCalculatorTab() {
  const [stock, setStock] = useState<IngredientStock>({ patate: 0, salade: 0, saumon: 0, pain: 0 });

  const results = useMemo(() => {
    return RECIPES.map((recipe) => {
      const capacities = Object.entries(recipe.requirements).map(([ingredient, qty]) => {
        if (qty <= 0) return Number.POSITIVE_INFINITY;
        return Math.floor((stock[ingredient as keyof IngredientStock] || 0) / qty);
      });
      const maxMenus = Math.max(0, Math.min(...capacities));
      return { ...recipe, maxMenus };
    });
  }, [stock]);

  const limitingIngredient = useMemo(() => {
    const ratios = Object.entries(stock).map(([name, qty]) => ({ name, qty }));
    ratios.sort((a, b) => a.qty - b.qty);
    return ratios[0]?.name || 'n/a';
  }, [stock]);

  const setStockValue = (key: keyof IngredientStock, value: string) => {
    const parsed = Number(value);
    setStock((prev) => ({ ...prev, [key]: Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : 0 }));
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h3 className="mb-3 text-lg font-bold text-amber-200">Stock ingredients</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm text-slate-300">
            Patate
            <input type="number" min={0} value={stock.patate} onChange={(e) => setStockValue('patate', e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2" />
          </label>
          <label className="text-sm text-slate-300">
            Salade
            <input type="number" min={0} value={stock.salade} onChange={(e) => setStockValue('salade', e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2" />
          </label>
          <label className="text-sm text-slate-300">
            Saumon
            <input type="number" min={0} value={stock.saumon} onChange={(e) => setStockValue('saumon', e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2" />
          </label>
          <label className="text-sm text-slate-300">
            Pain
            <input type="number" min={0} value={stock.pain} onChange={(e) => setStockValue('pain', e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2" />
          </label>
        </div>
        <p className="mt-3 text-xs text-slate-400">Ingredient limitant actuel: <span className="font-bold text-amber-300">{limitingIngredient}</span></p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h3 className="mb-3 text-lg font-bold text-amber-200">Capacite de production</h3>
        <div className="space-y-2">
          {results.map((result) => (
            <div key={result.key} className="rounded-lg border border-white/10 bg-black/20 p-3">
              <p className="font-semibold text-slate-100">{result.label}</p>
              <p className="text-sm text-slate-400">Recette: patate {result.requirements.patate}, salade {result.requirements.salade}, saumon {result.requirements.saumon}, pain {result.requirements.pain}</p>
              <p className="mt-1 text-sm text-green-300">Menus possibles: <span className="font-black">{result.maxMenus}</span></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
