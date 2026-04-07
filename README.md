# Hookies - Restaurant Pirate

Site web complet pour le restaurant thème pirate **Hookies**.

## 🚀 Technologie Stack

- **Framework**: Next.js 14
- **Frontend**: React 18 + Tailwind CSS + Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MySQL avec Prisma ORM
- **Auth**: JWT + NextAuth.js
- **Hosting**: Plesk

## 📋 Fonctionnalités

- 🏪 Site vitrine premium avec animations pirate
- 👤 Système d'authentification client/admin
- 📅 Gestion des réservations
- 🍴 Menu dynamique
- 🛒 Système de commandes (Dine-in, Takeaway, Delivery, Kiosk)
- 💳 Gestion des paiements
- 📊 Dashboard administrateur
- 📱 Design mobile responsive
- 📁 Gestion des uploads de fichiers

## 📦 Installation

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run build
npm start
```

## 🔧 Configuration

Variables d'environnement (`.env.local`):
```
DATABASE_URL="mysql://user:password@localhost:3306/hookies"
NEXTAUTH_SECRET="change-me-with-a-long-random-secret"
JWT_SECRET="change-me-with-at-least-32-random-chars"
NEXTAUTH_URL="https://hookies.nexadev.fr"
MAIL_HOST="smtp.example.com"
MAIL_PORT="587"
MAIL_USER="smtp-user@example.com"
MAIL_PASS="smtp-password"
MAIL_FROM="no-reply@hookies.fr"
MAINTENANCE_MODE="false"
```

Notes:
- `JWT_SECRET` est obligatoire et doit contenir au minimum 32 caracteres.
- Pour l'envoi d'emails, renseigner SMTP complet (`MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`) et idealement `MAIL_FROM`.
- Le mode maintenance est pilotable depuis `Admin > Paramètres` (`/admin#settings`), sans modifier le code.
- `MAINTENANCE_MODE=true` reste disponible comme surcouche d'urgence (force la maintenance au niveau middleware).

## 📚 Structure du projet

```
hookies.nexadev.fr/
├── app/                    # Pages d'application
├── components/             # Composants React
├── pages/
│   └── api/               # Routes API
├── lib/
│   ├── db/               # Configuration Prisma
│   └── auth/             # Authentification
├── prisma/               # Schéma & migrations
├── public/               # Assets statiques
└── styles/               # Styles globaux
```

## 🛠️ Développement

```bash
npm run dev
```

Accéder à: http://localhost:3000

## 📖 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Menu
- `GET /api/menu` - Récupérer le menu
- `POST /api/menu` - Ajouter un article (ADMIN)

### Commandes
- `GET /api/orders` - Mes commandes
- `POST /api/orders` - Créer une commande

### Réservations
- `GET /api/reservations` - Mes réservations
- `POST /api/reservations` - Faire une réservation

### Admin
- `GET /api/admin/orders` - Tous les commandes
- `PATCH /api/admin/orders` - Mettre à jour une commande
- `GET /api/admin/stats` - Statistiques

## 🐙 Git

Repository: https://github.com/Hugo3400/hookies

## 📄 License

Propriétaire
