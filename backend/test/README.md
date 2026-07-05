# Tests API - Module Paiement SENEFLIX

Ce dossier contient les tests automatisés pour le module de paiement du système de réservation SENEFLIX.

## Structure des Tests

```
test/
├── bookings-payment.e2e-spec.ts    # Tests e2e (API completa)
└── jest-e2e.json                  # Configuration Jest pour e2e
```

## Types de Tests

### Tests Unitaires
- **Fichier**: `src/bookings/bookings.service.spec.ts`
- **Couverture**: Logique métier du service Bookings
- **Exécution**: `npm test`

### Tests End-to-End (e2e)
- **Fichier**: `test/bookings-payment.e2e-spec.ts`
- **Couverture**: API endpoints complets avec HTTP requests
- **Exécution**: `npm run test:e2e`

## Scénarios de Test Couvert

### 1. Création de Réservation avec Paiement
- ✅ Orange Money
- ✅ Wave
- ✅ Espèces (Cash)
- ✅ Sans authentification (rejet)
- ✅ Méthode de paiement invalide (rejet)
- ✅ Numéro de téléphone invalide (rejet)

### 2. Confirmation de Paiement (Admin)
- ✅ Admin peut confirmer un paiement
- ✅ Utilisateur normal ne peut pas confirmer
- ✅ Sans authentification (rejet)

### 3. Annulation et Remboursement
- ✅ Utilisateur peut annuler sa réservation
- ✅ Ne peut pas annuler deux fois
- ✅ Admin peut annuler n'importe quelle réservation

### 4. Consultation des Paiements
- ✅ Liste des réservations utilisateur
- ✅ Statistiques utilisateur
- ✅ Détails d'une réservation
- ✅ Recherche par code (public)

### 5. Statistiques de Revenus (Admin)
- ✅ Statistiques globales
- ✅ Filtrage par statut
- ✅ Accès réservé aux admins

### 6. Cas Limites
- ✅ Réservation inexistante (404)
- ✅ Code invalide (404)
- ✅ Mise à jour manuelle du statut

## Configuration

### Variables d'Environnement (optionnel)
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=seneflix_test
```

### Base de Données de Test
- Crée automatiquement via `synchronize: true`
- Nettoyée avant chaque test (`dropSchema: true`)

## Installation des Dépendances

```bash
cd backend
npm install
```

## Exécution des Tests

### Tous les tests unitaires
```bash
npm test
```

### Tests avec couverture
```bash
npm run test:cov
```

### Tests e2e uniquement
```bash
npm run test:e2e
```

### Mode watch (développement)
```bash
npm run test:watch
```

## Exemple de Sortie

```
 PASS  src/bookings/bookings.service.spec.ts
  BookingsService - Tests Unitaires
    Création de réservation
      ✓ devrait créer une réservation avec succès
      ✓ devrait rejeter si la séance est inactive
      ✓ devrait rejeter si pas assez de places disponibles
    Confirmation de paiement
      ✓ devrait confirmer le paiement avec transactionId
      ✓ devrait lancer une erreur si la réservation n'est pas trouvée
    Annulation de réservation
      ✓ devrait annuler une réservation
      ✓ devrait rejeter si l'utilisateur n'est pas le propriétaire
    Statistiques
      ✓ devrait retourner les statistiques globales
      ✓ devrait calculer les revenus totaux

Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
```

## Notes

- Les tests e2e nécessitent une base de données MySQL fonctionnelle
- Créez une base `seneflix_test` avant d'exécuter les tests e2e
- Les tests sont isolés et ne dépendent pas les uns des autres
