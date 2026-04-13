export const CONFIG_KEYS = {
  WEEKLY_MENU: 'WEEKLY_MENU',
  DELIVERY_ZONES: 'DELIVERY_ZONES',
  LOYALTY_CONFIG: 'LOYALTY_CONFIG',
  MAINTENANCE_MODE: 'MAINTENANCE_MODE',
  RESERVATION_PAGE_CONTENT: 'RESERVATION_PAGE_CONTENT',
} as const;

export type WeeklyMenuItem = {
  name: string;
  description: string;
  price: number;
};

export type WeeklyMenuPayload = {
  title: string;
  subtitle: string;
  weekLabel: string;
  items: WeeklyMenuItem[];
};

export type DeliveryZone = {
  name: string;
  description: string;
  fee: number;
};

export type LoyaltyReward = {
  points: number;
  label: string;
};

export type LoyaltyConfig = {
  bonusPercent: number;
  bonusThreshold: number;
  referralEnabled: boolean;
  referralDiscount: number;
  referralPoints: number;
  nextRewardGoal: number;
  rewards: LoyaltyReward[];
};

export type ReservationPageContent = {
  heading: string;
  intro: string;
  services: string[];
  formTitle: string;
  submitLabel: string;
};

export const DEFAULT_WEEKLY_MENU: WeeklyMenuPayload = {
  title: 'Menus de la semaine',
  subtitle: 'La sélection du capitaine',
  weekLabel: 'Semaine en cours',
  items: [
    {
      name: 'Ration du Moussaillon',
      description: 'Fish burger, petite portion de frites et boisson du marin.',
      price: 300,
    },
    {
      name: 'Le Kraken Croustillant',
      description: 'Filet de poisson pane, onion rings dores, salade croquante et sauce citronnee.',
      price: 500,
    },
    {
      name: 'Le Tresor du Capitaine',
      description: 'Double fish burger du capitaine, grande portion de frites et boisson du marin.',
      price: 500,
    },
  ],
};

export const DEFAULT_DELIVERY_ZONES: DeliveryZone[] = [
  { name: 'Los Santos County', description: 'Livraison dans tout le comte de Los Santos.', fee: 2.9 },
  { name: 'Blaine County', description: 'Livraison dans le comte de Blaine.', fee: 4.9 },
];

export const DEFAULT_LOYALTY_CONFIG: LoyaltyConfig = {
  bonusPercent: 10,
  bonusThreshold: 200,
  referralEnabled: true,
  referralDiscount: 5,
  referralPoints: 50,
  nextRewardGoal: 500,
  rewards: [
    { points: 100, label: 'Boisson offerte' },
    { points: 250, label: 'Dessert offert' },
    { points: 500, label: 'Menu offert' },
  ],
};

export const DEFAULT_MAINTENANCE_MODE = false;

export const DEFAULT_RESERVATION_PAGE_CONTENT: ReservationPageContent = {
  heading: 'Reserver une table',
  intro: 'Choisissez votre creneau et le nombre de convives. On vous confirme ca rapidement.',
  services: [
    'Service midi : 11h30 - 14h30',
    'Service soir : 18h30 - 23h30',
    'Groupes & privatisation : appelez-nous',
  ],
  formTitle: 'Formulaire',
  submitLabel: 'Envoyer la demande',
};
