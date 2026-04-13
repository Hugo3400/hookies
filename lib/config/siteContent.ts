export const SITE_BRAND = {
  name: 'Hookies',
  tagline: '',
  legalLine: 'Tous droits reserves.',
  year: 2026,
};

export const SITE_NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/experience', label: "L'Aventure" },
  { href: '/menu', label: 'La Carte' },
  { href: '/reservation', label: 'Reserver' },
  { href: '/livraison', label: 'Livraison' },
  { href: '/contact', label: 'Contact' },
] as const;

export const SITE_CONTACT = {
  phone: '+33 (0)1 23 45 67 89',
  email: 'contact@hookies.fr',
  address: '12 Rue de la Mer, 75000',
  openingHours: 'Lun - Dim : 11h30 - 23h30',
};

export const HERO_CONTENT = {
  headingLine1: 'Bienvenue a bord,',
  headingAccent: 'moussaillon.',
  description: 'Fish burgers, fruits de mer, huitres, moules frites et ambiance de corsaire. On vous attend 7j/7 de 11h30 a 23h30.',
  ctaReservation: 'Reserver une table',
  ctaMenu: 'Voir la carte',
};

export const FEATURES_CONTENT = {
  title: 'Pourquoi choisir Hookies ?',
  cards: {
    freshSeafood: {
      title: 'Fruits de mer & poisson frais',
      description: 'Chaque arrivage est prepare le jour meme: huitres, homard, langouste, moules frites et assiettes marines genereuses.',
    },
    burgers: {
      title: 'Fish burgers du capitaine',
      description: 'Pain moelleux, filet croustillant, garniture bien dosee et sauces maison. Une recette franche, sans bla-bla.',
    },
    drinks: {
      title: 'Boissons & Cocktails',
      description: 'Cocktails signatures, softs frais, recettes maison et options sans alcool pour toute la table.',
    },
    events: {
      title: 'Soirees & Groupes',
      description: 'Anniversaires, pots de depart et groupes: espace dedie sur demande avec organisation simple et rapide.',
    },
  },
  openingTitle: 'Ouvert tous les jours',
  openingDescription: 'Midi : 11h30 - 14h30 - Soir : 18h30 - 23h30 - Happy hour de 17h a 19h du lundi au jeudi.',
};

export const MENU_CONTENT = {
  pageTitle: 'La Carte | Hookies',
  pageDescription: 'Carte du restaurant Hookies : fish burgers, fruits de mer, huitres, moules frites et sauces maison.',
  heading: 'La Carte',
  intro: 'Fish burgers, fruits de mer, huitres, moules frites et sauces maison.',
  loadingLabel: 'Chargement...',
  emptyLabel: 'Aucun plat disponible pour le moment.',
  allCategoriesLabel: 'Tout',
  orderCtaLabel: 'Commander',
};

export const EXPERIENCE_CONTENT = {
  pageTitle: "L'Aventure | Hookies",
  pageDescription: "Decouvrez l'univers Hookies : fruits de mer, decor de taverne, cocktails maison et soirees pirates.",
  heading: "L'Aventure Hookies",
  intro: 'Decor de taverne, cuisine visible et soirees pirates. Voila ce qui vous attend.',
};

export const RESERVATION_CONTENT = {
  pageTitle: 'Reserver | Hookies',
  pageDescription: 'Reservez votre table au restaurant Hookies. Ouvert 7j/7, midi et soir.',
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

export const CONTACT_PAGE_CONTENT = {
  pageTitle: 'Contact | Hookies',
  pageDescription: "Contactez Hookies pour une reservation, un evenement prive ou toute demande d'information.",
  heading: 'Contact',
  intro: 'Reservations, groupes, evenements - on vous repond vite.',
  formTitle: 'Envoyer un message',
  placeholders: {
    name: 'Nom',
    email: 'Email',
    message: 'Votre message',
  },
  feedback: {
    sendError: "Impossible d'envoyer le message.",
    sendSuccess: 'Message envoye. Nous revenons vers vous rapidement.',
    networkError: "Erreur reseau pendant l'envoi du message.",
    sending: 'Envoi...',
    send: 'Envoyer',
  },
};

export const EMAIL_CONTENT = {
  brandTitle: 'HOOKIES',
  brandSubtitle: 'Pirate Tavern',
  footerLine: 'HOOKIES - Quai des Corsaires, Paris',
  footerSignoff: 'Bon voilage!',
  contact: {
    title: 'Nouveau Message',
    subtitle: 'Un client souhaite etre recontacte',
    intro: 'Un nouveau message a ete recu depuis le formulaire de contact.',
    subjectPrefix: '[Hookies] Nouveau message contact -',
    textHeader: 'Nouveau message depuis la page contact:',
  },
  reservationCustomer: {
    title: 'Reservation Confirmee!',
    subtitle: 'Votre table vous attend a bord de HOOKIES',
    introPrefix: 'Ahoy',
    introBody: 'Votre reservation est enregistree. Notre equipage de corsaires confirme votre arrivee tres bientot.',
    detailsTitle: 'Vos Details',
    followup: 'Si vous devez modifier votre reservation, repondez simplement a cet email.',
    textRegistered: 'Votre reservation a bien ete enregistree.',
    textConfirmSoon: 'Nous vous confirmerons rapidement.',
    textTeam: 'Equipe Hookies',
    subject: '[Hookies] Reservation recue',
  },
  reservationAdmin: {
    title: 'Nouvelle Reservation',
    subtitle: 'Action admin recommandee - Verifier et confirmer',
    intro: 'Alerte! Une nouvelle reservation a traiter immediatement.',
    clientInfoTitle: 'Informations Client',
    actionHint: 'Action recommandee: Verifier la disponibilite et confirmer rapidement.',
    subjectPrefix: '[Hookies] Nouvelle reservation -',
    textHeader: 'Nouvelle reservation client:',
  },
};

export const CONTACT_API_CONTENT = {
  methodNotAllowed: 'Methode non autorisee',
  missingFields: 'Nom, email et message sont requis',
  missingAdminEmail: 'Email admin non configure',
  smtpMissing: 'SMTP non configure',
  emailSendFailure: 'Echec envoi email',
};

export const RESERVATION_API_CONTENT = {
  methodNotAllowed: 'Methode non autorisee',
  getError: 'Erreur lors de la recuperation des reservations',
  createError: 'Erreur lors de la creation de la reservation',
  logTargetPrefix: 'Reservation',
  logDetailsPrefix: 'Couverts',
  logDetailsClientLabel: 'Client',
  logAnonymous: 'Anonyme',
  noSpecialRequest: 'Aucune',
};
