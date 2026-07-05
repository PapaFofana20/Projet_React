# SENEFLIX - Documentation API Admin

## Vue d'ensemble

Cette documentation décrit l'ensemble des endpoints de l'API d'administration de la plateforme SENEFLIX. Toutes les routes sont protégées par authentification JWT et contrôlées par le système RBAC.

**Base URL:** `/api/admin`

**Headers requis:**
```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

---

## Système de Rôles et Permissions

### Rôles disponibles

| Rôle | Niveau | Description |
|------|--------|-------------|
| `super_admin` | 100 | Accès complet à toutes les fonctionnalités |
| `admin` | 50 | Gestion complète d'un cinéma |
| `agent` | 20 | Opérations de vente et réservations |
| `user` | 1 | Utilisateur standard (clients) |

### Permissions par rôle

#### Super Admin
- Toutes les permissions

#### Admin
- Utilisateurs: vue, modification du statut
- Cinémas: vue, création, modification
- Salles: vue, création, modification
- Films: vue, création, modification, mise en avant
- Séances: vue, création, modification, suppression
- Réservations: vue, création, modification, annulation
- Rapports: vue, export

#### Agent
- Films: vue uniquement
- Salles: vue uniquement
- Séances: vue uniquement
- Réservations: vue, création, modification (propres réservations)

---

## Table des Routes

### 1. Tableau de Bord & Statistiques

| Méthode | Endpoint | Permissions | Description |
|---------|----------|-------------|-------------|
| GET | `/admin/dashboard` | Admin, SuperAdmin | Statistiques globales du tableau de bord |
| GET | `/admin/stats/monthly` | Admin, SuperAdmin | Statistiques mensuelles (12 derniers mois) |
| GET | `/admin/stats/realtime` | Admin, SuperAdmin | Statistiques en temps réel |

---

### 2. Gestion des Utilisateurs

| Méthode | Endpoint | Permissions | Description |
|---------|----------|-------------|-------------|
| GET | `/admin/users` | Admin, SuperAdmin | Liste des utilisateurs (paginé) |
| GET | `/admin/users/:id` | Admin, SuperAdmin | Détails d'un utilisateur |
| POST | `/admin/users` | SuperAdmin | Créer un nouvel utilisateur |
| PUT | `/admin/users/:id/status` | Admin, SuperAdmin | Modifier le statut (active/inactive/suspended) |
| PUT | `/admin/users/:id/roles` | SuperAdmin | Assigner des rôles |
| DELETE | `/admin/users/:id` | SuperAdmin | Supprimer un utilisateur |

**Paramètres de requête pour GET /admin/users:**
- `page` (number, optional): Numéro de page
- `limit` (number, optional): Nombre d'éléments par page
- `status` (string, optional): Filtrer par statut
- `role` (string, optional): Filtrer par rôle

---

### 3. Gestion des Cinémas

| Méthode | Endpoint | Permissions | Description |
|---------|----------|-------------|-------------|
| GET | `/admin/cinemas` | Admin, SuperAdmin | Liste des cinémas |
| GET | `/admin/cinemas/:id` | Admin, SuperAdmin | Détails d'un cinéma avec salles |
| POST | `/admin/cinemas` | SuperAdmin | Créer un nouveau cinéma |
| PUT | `/admin/cinemas/:id` | Admin, SuperAdmin | Modifier un cinéma |
| DELETE | `/admin/cinemas/:id` | SuperAdmin | Supprimer un cinéma |

---

### 4. Gestion des Salles

| Méthode | Endpoint | Permissions | Description |
|---------|----------|-------------|-------------|
| GET | `/admin/halls` | Admin, SuperAdmin | Liste des salles |
| GET | `/admin/halls?cinemaId=X` | Admin, SuperAdmin | Salles d'un cinéma spécifique |
| GET | `/admin/halls/:id` | Admin, SuperAdmin | Détails d'une salle |
| POST | `/admin/halls` | Admin, SuperAdmin | Créer une salle (grille auto) |
| PUT | `/admin/halls/:id` | Admin, SuperAdmin | Modifier une salle |
| DELETE | `/admin/halls/:id` | SuperAdmin | Supprimer une salle |
| GET | `/admin/halls/:id/seats` | Admin, SuperAdmin, Agent | Disposition des sièges |
| PUT | `/admin/halls/:id/seats/:seatId` | Admin, SuperAdmin | Bloquer/débloquer un siège |

**Notes sur la création de salle:**
- La grille de sièges est générée automatiquement
- Les X dernières rangées sont标记ées VIP (configurable)
- Le prix VIP peut être défini séparément

---

### 5. Gestion des Films

| Méthode | Endpoint | Permissions | Description |
|---------|----------|-------------|-------------|
| GET | `/admin/movies` | Tous | Liste des films |
| GET | `/admin/movies?status=now_showing` | Tous | Films actuellement à l'affiche |
| GET | `/admin/movies?status=upcoming` | Tous | Films à venir |
| GET | `/admin/movies/:id` | Tous | Détails d'un film |
| POST | `/admin/movies` | Admin, SuperAdmin | Ajouter un film |
| PUT | `/admin/movies/:id` | Admin, SuperAdmin | Modifier un film |
| PUT | `/admin/movies/:id/featured` | Admin, SuperAdmin | Définir en avant |
| PUT | `/admin/movies/:id/status` | Admin, SuperAdmin | Changer le statut |
| DELETE | `/admin/movies/:id` | SuperAdmin | Supprimer un film |

**Statuts disponibles pour les films:**
- `now_showing`: À l'affiche
- `upcoming`: Prochainement
- `archive`: Archive

---

### 6. Gestion des Séances (Programmation)

| Méthode | Endpoint | Permissions | Description |
|---------|----------|-------------|-------------|
| GET | `/admin/sessions` | Tous | Liste des séances |
| GET | `/admin/sessions/:id` | Tous | Détails d'une séance |
| POST | `/admin/sessions` | Admin, SuperAdmin | **Créer une séance** ⭐ |
| POST | `/admin/sessions/validate` | Admin, SuperAdmin | Valider avant création |
| PUT | `/admin/sessions/:id` | Admin, SuperAdmin | Modifier une séance |
| DELETE | `/admin/sessions/:id` | Admin, SuperAdmin | Supprimer une séance |
| GET | `/admin/sessions/calendar/:cinemaId` | Admin, SuperAdmin | Calendrier complet |
| GET | `/admin/sessions/gaps/:hallId` | Admin, SuperAdmin | Créneaux disponibles |

⭐ **Route importante: Création de séance avec calcul automatique**

**Calcul de l'heure de fin:**
```
Date_Heure_Fin = Date_Heure_Debut + Durée_du_film + 20 minutes (nettoyage)
```

**Exemple:**
- Film: 2h15 (135 minutes)
- Heure de début: 14:00
- Heure de fin: 14:00 + 135 + 20 = 16:35

**Paramètres de requête pour GET /admin/sessions:**
- `cinemaId` (number, optional): Filtrer par cinéma
- `hallId` (number, optional): Filtrer par salle
- `movieId` (number, optional): Filtrer par film
- `date` (string, optional): Format YYYY-MM-DD
- `status` (string, optional): Statut de la séance

---

### 7. Gestion des Réservations

| Méthode | Endpoint | Permissions | Description |
|---------|----------|-------------|-------------|
| GET | `/admin/bookings` | Tous | Liste des réservations |
| GET | `/admin/bookings/:id` | Tous | Détails d'une réservation |
| PUT | `/admin/bookings/:id/status` | Admin, SuperAdmin | Modifier le statut |
| POST | `/admin/bookings/:id/refund` | Admin, SuperAdmin | Effectuer un remboursement |

**Statuts de réservation:**
- `pending`: En attente de paiement
- `confirmed`: Confirmée et payée
- `cancelled`: Annulée
- `completed`: Séance terminée

---

### 8. Rapports & Exports

| Méthode | Endpoint | Permissions | Description |
|---------|----------|-------------|-------------|
| GET | `/admin/reports/sales` | Admin, SuperAdmin | Rapport des ventes |
| GET | `/admin/reports/occupancy` | Admin, SuperAdmin | Taux d'occupation |
| GET | `/admin/reports/top-movies` | Admin, SuperAdmin | Top films populaires |

---

## Détails des Entités

### Cinéma (Cinema)

```json
{
  "id": 1,
  "name": "SENEFLIX Dakar",
  "city": "Dakar",
  "address": "123 Avenue de la République",
  "phone": "+221 33 123 4567",
  "email": "contact@seneflix.sn",
  "imageUrl": "https://...",
  "latitude": 14.6928,
  "longitude": -17.4467,
  "openingHours": [...],
  "isActive": true,
  "halls": [...],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### Salle (Hall)

```json
{
  "id": 1,
  "cinemaId": 1,
  "name": "Salle 1 - VIP",
  "capacity": 150,
  "screenType": "IMAX",
  "rowCount": 10,
  "seatsPerRow": 15,
  "basePrice": 5000,
  "vipPrice": 8000,
  "description": "Salle premium avec écran IMAX",
  "isActive": true,
  "seatLayouts": [...],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### Film (Movie)

```json
{
  "id": 1,
  "title": "Oppenheimer",
  "synopsis": "L'histoire du scientifique J. Robert Oppenheimer...",
  "posterUrl": "https://...",
  "trailerUrl": "https://...",
  "genres": ["Drama", "History"],
  "duration": 180,
  "releaseYear": 2023,
  "director": "Christopher Nolan",
  "rating": "R",
  "cast": "Cillian Murphy, Emily Blunt...",
  "language": "English",
  "subtitles": "French",
  "isShowing": true,
  "isFeatured": true,
  "averageRating": 4.5,
  "createdAt": "2024-01-15T10:00:00Z"
}
```

### Séance (Session)

```json
{
  "id": 1,
  "movieId": 1,
  "hallId": 1,
  "startTime": "2024-01-20T14:00:00Z",
  "endTime": "2024-01-20T17:20:00Z",
  "price": 5000,
  "totalSeats": 150,
  "availableSeats": 120,
  "reservedSeats": ["A1", "A2", "B3"],
  "isActive": true,
  "roomName": "Salle 1 - VIP",
  "screenType": "IMAX",
  "sessionType": "IMAX",
  "movie": {...},
  "createdAt": "2024-01-15T10:00:00Z"
}
```

### Réservation (Booking)

```json
{
  "id": 1,
  "bookingCode": "SNFLX-2024-00001",
  "userId": 1,
  "sessionId": 1,
  "status": "confirmed",
  "seats": ["A5", "A6"],
  "ticketCount": 2,
  "totalPrice": 10000,
  "paymentMethod": "orange_money",
  "transactionId": "TXN123456",
  "paymentPhone": "+221 77 123 4567",
  "qrCode": "base64_encoded_qr...",
  "viewerName": "John Doe",
  "viewerEmail": "john@example.com",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

### Utilisateur (User)

```json
{
  "id": 1,
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@seneflix.sn",
  "phone": "+221 77 123 4567",
  "status": "active",
  "avatarUrl": "https://...",
  "dateOfBirth": "1990-05-15",
  "roles": [
    { "id": 1, "name": "admin", "level": 50 }
  ],
  "lastLoginAt": "2024-01-15T10:00:00Z",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

## Codes d'erreur

| Code | Description |
|------|-------------|
| 200 | Succès |
| 201 | Créé avec succès |
| 204 | Supprimé avec succès |
| 400 | Mauvaise requête (validation échouée) |
| 401 | Non authentifié |
| 403 | Accès refusé (permissions insuffisantes) |
| 404 | Ressource non trouvée |
| 409 | Conflit (ex: séance qui chevauche) |
| 500 | Erreur serveur interne |

---

## Exemples d'utilisation

### Créer une séance

```bash
curl -X POST http://localhost:3000/api/admin/sessions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "movieId": 1,
    "hallId": 1,
    "startTime": "2024-01-20T14:00:00Z"
  }'
```

**Réponse:**
```json
{
  "session": {
    "id": 5,
    "movieId": 1,
    "hallId": 1,
    "startTime": "2024-01-20T14:00:00Z",
    "endTime": "2024-01-20T17:20:00Z",
    "price": 5000,
    "totalSeats": 150,
    "availableSeats": 150,
    "reservedSeats": [],
    "isActive": true
  },
  "validation": {
    "isValid": true,
    "conflicts": [],
    "calculatedEndTime": "2024-01-20T17:20:00Z",
    "warnings": []
  }
}
```

### Valider une séance avant création

```bash
curl -X POST http://localhost:3000/api/admin/sessions/validate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "movieId": 1,
    "hallId": 1,
    "startTime": "2024-01-20T16:00:00Z"
  }'
```

**Réponse (avec conflit):**
```json
{
  "isValid": false,
  "conflicts": [
    {
      "existingSession": {
        "id": 5,
        "startTime": "2024-01-20T14:00:00Z",
        "endTime": "2024-01-20T17:20:00Z"
      },
      "conflictType": "overlap",
      "overlapMinutes": 80
    }
  ],
  "calculatedEndTime": "2024-01-20T19:20:00Z",
  "warnings": [
    "Attention: Cette séance chevauche une séance existante!"
  ]
}
```

### Créer une salle avec grille automatique

```bash
curl -X POST http://localhost:3000/api/admin/halls \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "cinemaId": 1,
    "name": "Salle 3 - Standard",
    "capacity": 120,
    "rowCount": 10,
    "seatsPerRow": 12,
    "screenType": "2D",
    "basePrice": 3500,
    "vipPrice": 5000,
    "vipRows": 2
  }'
```

---

## Notes importantes

1. **Gestion des conflits**: Le système détecte automatiquement les séances qui se chevauchent avec un tampon de 5 minutes.

2. **Calcul automatique de la fin**: L'heure de fin est toujours calculée automatiquement: `début + durée film + 20 min nettoyage`.

3. **Soft delete**: Les cinémas, salles, films et utilisateurs supprimés sont désactivés (soft delete), pas définitivement supprimés.

4. **Pagination**: Les endpoints de liste supportent la pagination avec les paramètres `page` et `limit`.

5. **Filtrage**: Les endpoints supportent plusieurs filtres via query parameters.

---

*Document généré automatiquement - SENEFLIX v1.0*
