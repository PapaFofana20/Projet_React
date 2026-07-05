# SENEFLIX Backend API 🎬

Backend API complet pour la plateforme de réservation de billets de cinéma SENEFLIX.

## Fonctionnalités

- **Authentification JWT** - Inscription, connexion, rafraîchissement de token
- **RBAC (Role-Based Access Control)** - Rôles admin et utilisateur
- **Gestion des films** - CRUD complet avec genres, notes, etc.
- **Gestion des séances** - Création, mise à jour, réservation de places
- **Gestion des réservations** - Création, annulation, confirmation de paiement
- **API Météo** - Intégration OpenWeather pour le dashboard
- **Documentation Swagger** - Interface interactive pour tester les endpoints
- **Base de données MySQL** - Avec TypeORM et migrations automatiques

## Prérequis

- Node.js 18+
- MySQL 8.0+
- npm ou yarn

## Installation

1. **Cloner le projet et naviguer vers le dossier backend**

```bash
cd backend
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configurer les variables d'environnement**

```bash
cp .env.example .env
```

Modifier le fichier `.env` avec vos configurations :

```env
# Serveur
PORT=3000
NODE_ENV=development

# Base de données MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=votre_mot_de_passe
DB_DATABASE=seneflix

# JWT
JWT_SECRET=votre_secret_jwt_super_securise_2024
JWT_EXPIRATION=7d

# OpenWeather API (optionnel)
OPENWEATHER_API_KEY=votre_cle_api
OPENWEATHER_DEFAULT_CITY=Dakar
```

4. **Créer la base de données MySQL**

```sql
CREATE DATABASE seneflix CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

5. **Démarrer le serveur en mode développement**

```bash
npm run start:dev
```

L'application va :
- Créer automatiquement les tables dans MySQL
- Peupler la base avec des données de test (films, séances, utilisateurs)

## Démarrage rapide

### Utilisateurs de test créés automatiquement

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| admin@seneflix.com | Admin123! | Admin |
| moussa.diallo@email.com | Password123! | Utilisateur |

### Accès à l'API

- **API**: http://localhost:3000
- **Swagger**: http://localhost:3000/api/docs

## Structure du projet

```
backend/
├── src/
│   ├── auth/                 # Module dauthentification
│   │   ├── dto/             # DTOs de validation
│   │   ├── entities/        # Entité Role
│   │   ├── guards/          # Guards JWT et RBAC
│   │   ├── strategies/     # Stratégie Passport JWT
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   ├── users/               # Module de gestion des utilisateurs
│   │   ├── dto/
│   │   ├── entities/       # Entité User
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   ├── movies/              # Module de gestion des films
│   │   ├── dto/
│   │   ├── entities/       # Entité Movie
│   │   ├── movies.controller.ts
│   │   ├── movies.module.ts
│   │   └── movies.service.ts
│   ├── sessions/            # Module de gestion des séances
│   │   ├── dto/
│   │   ├── entities/       # Entité Session
│   │   ├── sessions.controller.ts
│   │   ├── sessions.module.ts
│   │   └── sessions.service.ts
│   ├── bookings/            # Module de gestion des réservations
│   │   ├── dto/
│   │   ├── entities/       # Entité Booking
│   │   ├── bookings.controller.ts
│   │   ├── bookings.module.ts
│   │   └── bookings.service.ts
│   ├── weather/             # Module météo (OpenWeather)
│   │   ├── weather.controller.ts
│   │   ├── weather.module.ts
│   │   └── weather.service.ts
│   ├── common/              # Décorateurs et interfaces partagés
│   │   └── decorators/
│   ├── database/            # Configuration de la base de données
│   │   └── seeds/          # Seeders pour données initiales
│   ├── app.module.ts
│   └── main.ts
├── .env.example
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## API Endpoints

### Authentification

| Méthode | Endpoint | Description | Accès |
|---------|----------|-------------|-------|
| POST | `/auth/register` | Inscription | Public |
| POST | `/auth/login` | Connexion | Public |
| POST | `/auth/refresh` | Rafraîchir le token | Auth |
| GET | `/auth/profile` | Profil utilisateur | Auth |
| POST | `/auth/change-password` | Changer le mot de passe | Auth |

### Utilisateurs

| Méthode | Endpoint | Description | Accès |
|---------|----------|-------------|-------|
| GET | `/users` | Liste des utilisateurs | Admin |
| GET | `/users/:id` | Détails utilisateur | Auth |
| PATCH | `/users/:id` | Modifier utilisateur | Auth |
| DELETE | `/users/:id` | Supprimer utilisateur | Admin |
| GET | `/users/:id/stats` | Statistiques utilisateur | Auth |

### Films

| Méthode | Endpoint | Description | Accès |
|---------|----------|-------------|-------|
| GET | `/movies` | Liste des films | Public |
| GET | `/movies/featured` | Films en avant | Public |
| GET | `/movies/now-showing` | Films à laffiche | Public |
| GET | `/movies/genre/:genre` | Films par genre | Public |
| GET | `/movies/:id` | Détails film | Public |
| POST | `/movies` | Créer film | Admin |
| PATCH | `/movies/:id` | Modifier film | Admin |
| DELETE | `/movies/:id` | Supprimer film | Admin |

### Séances

| Méthode | Endpoint | Description | Accès |
|---------|----------|-------------|-------|
| GET | `/sessions` | Liste des séances | Public |
| GET | `/sessions/movie/:movieId` | Séances dun film | Public |
| GET | `/sessions/date/:date` | Séances par date | Public |
| GET | `/sessions/:id` | Détails séance | Public |
| POST | `/sessions` | Créer séance | Admin |
| PATCH | `/sessions/:id` | Modifier séance | Admin |
| POST | `/sessions/:id/reserve-seats` | Réserver places | Public |
| POST | `/sessions/:id/release-seats` | Libérer places | Admin |
| DELETE | `/sessions/:id` | Supprimer séance | Admin |

### Réservations

| Méthode | Endpoint | Description | Accès |
|---------|----------|-------------|-------|
| POST | `/bookings` | Créer réservation | Auth |
| GET | `/bookings` | Liste des réservations | Admin |
| GET | `/bookings/my-bookings` | Mes réservations | Auth |
| GET | `/bookings/my-stats` | Mes statistiques | Auth |
| GET | `/bookings/code/:code` | Réservation par code | Public |
| GET | `/bookings/:id` | Détails réservation | Auth |
| PATCH | `/bookings/:id` | Modifier réservation | Admin |
| POST | `/bookings/:id/cancel` | Annuler réservation | Auth |
| POST | `/bookings/:id/confirm-payment` | Confirmer paiement | Admin |
| POST | `/bookings/:id/complete` | Marquer complétée | Admin |

### Météo

| Méthode | Endpoint | Description | Accès |
|---------|----------|-------------|-------|
| GET | `/weather` | Météo actuelle | Public |
| GET | `/weather?city=Dakar` | Météo par ville | Public |
| GET | `/weather/forecast` | Prévisions | Public |
| GET | `/weather/default-city` | Ville par défaut | Public |

## Authentification

L'API utilise JWT pour l'authentification. Pour accéder aux endpoints protégés :

1. Connectez-vous via `/auth/login` pour obtenir un token
2. Ajoutez le header `Authorization: Bearer <votre_token>`
3. Le token expire après 15 minutes (rafraîchissez via `/auth/refresh`)

## Rôles et Permissions

### Admin
- Accès complet à toutes les fonctionnalités
- Gestion des films, séances, réservations
- Gestion des utilisateurs

### Utilisateur
- Consultation des films et séances
- Création de réservations
- Gestion de son propre profil

## Scripts disponibles

```bash
# Développement
npm run start:dev      # Démarrer en mode watch
npm run start:debug    # Démarrer en mode debug

# Production
npm run build           # Compiler TypeScript
npm run start:prod      # Démarrer en production

# Tests
npm run test            # Exécuter les tests
npm run test:watch      # Tests en mode watch
npm run test:cov        # Couverture des tests

# Outils
npm run lint            # Linting du code
npm run format          # Formatage Prettier
```

## Génération QR Code

Les réservations incluent automatiquement un QR code pour les billets.

## Intégration API Externe

### OpenWeather API

Pour activer la météo sur le dashboard :

1. Créer un compte sur [OpenWeather](https://openweathermap.org/api)
2. Obtenir une clé API gratuite
3. Ajouter la clé dans `.env`

## Support et Contribution

Pour toute question ou suggestion, contactez l'équipe de développement.

## Licence

MIT License
