## Backlog — Concours photo de famille

### Règles de statut (défaut)
- Soumission : 15 jours à partir de la date de création
- Vote : 3 jours après la fin de soumission
- Clôturé : après la fin de la période de vote
- Date de création hardcodée pour le moment (ex : `new Date()` au moment de la création du thème)
- Durées personnalisables à la création (et plus tard à l'édition)

---

### Étape 1A — Home, cas A (aucun concours en cours)

Objectif : refondre uniquement l'état « vide » de la home et brancher le formulaire de création via modale.

- Layout vertical centré, mobile-first
  - Logo + sous-titre discret « Concours photo de famille » (Space Mono)
  - Zone centrale : gros bouton `+` avec label « Nouveau thème » en dessous
- Composant `Modal` accessible et réutilisable
  - `createPortal` vers `document.body`
  - Overlay cliquable pour fermer
  - Bouton `×` de fermeture
  - Fermeture via touche `Escape`
  - Focus trap + `aria-modal="true"` + `role="dialog"` + `aria-labelledby`
  - Blocage du scroll `body` pendant l'ouverture
- Composant `CreateContestForm` (rendu dans la modale)
  - Champ : nom du thème (requis)
  - Champ : durée de soumission en jours (défaut 15, modifiable)
  - Champ : durée de vote en jours (défaut 3, modifiable)
  - Mention visible des valeurs par défaut
  - Bouton « Créer le thème »
- `ContestContext`
  - Adapter `createContest` pour accepter `{ name, submissionDays, voteDays }`
  - Stocker `createdAt`, `submissionDays`, `voteDays` (calcul des bornes dérivé)
  - `createContest` retourne l'ID du thème créé
- Comportement après validation
  - Fermeture de la modale
  - Redirection vers la page de détail du thème (placeholder temporaire qui renvoie vers `/gallery` tant que l'étape 2 n'est pas faite)
- Nettoyage
  - Suppression de `src/pages/CreateContest.tsx`
  - Suppression de la route `/create` dans `App.tsx`

Hors périmètre 1A : cas B (concours en cours), édition de thème, image de couverture.

---

### Étape 1B — Home, cas B (un concours en cours)

- Carte cliquable du concours en cours
  - Image de couverture (placeholder en attendant le champ dédié)
  - Nom du thème
  - Badge de statut (Soumission / Vote / Clôturé) calculé depuis les dates
- Bouton « Autres thèmes » uniquement si au moins un autre concours existe
- Clic carte → page de détail du thème (étape 2)

---

### Étape 2 — Page détail d'un thème

- Image de couverture + avatar du créateur
- Carte post-it : description, statut, dates clés (fin soumission, fin vote)
- **Compteur de photos soumises (par tous)** affiché en évidence
- Boutons contextuels selon statut
  - Soumission : « Soumettre une photo », « Voir les photos »
  - Vote : « Voter »
  - Clôturé : « Voir le palmarès »
- **Bouton « Éditer le thème »** visible uniquement pour le créateur
  - Ouvre une modale d'édition (réutilise `CreateContestForm`)
  - Permet de modifier les durées (donc les bornes de statut)
- Barre de navigation basse fixe

Pas de boutons admin de passage manuel entre statuts.

---

### Étape 3 — Page photos d'un thème

- Grille polaroïd
- Interactions selon statut
  - Soumission : utilisateur ne voit/édite que ses propres photos, icônes éditer/supprimer
  - Vote : toutes les photos, système d'étoiles
  - Clôturé : note moyenne, couronne sur la/les gagnante(s)
- Modale plein écran au clic

---

### Étape 4 — Galerie « toutes les photos »

- Mosaïque de toutes les photos, tous concours confondus
- Tag thème visible sur chaque photo
- **Filtres (sélection multiple)**
  - Par thème (chips multi-sélection)
  - Filtre « Photos gagnantes uniquement »
  - Combinables entre eux

---

### Étape 5 — Polish

- États vides soignés
- Transitions de modale
- Responsive desktop
- Micro-animations légères
- Passe d'accessibilité

---

### Étape 6 — Automatisations

- Transitions automatiques de statut selon les dates calculées (`createdAt + submissionDays`, puis `+ voteDays`)
- Détermination automatique de la/les photo(s) gagnante(s) à la clôture
  - Règle à confirmer : moyenne d'étoiles la plus haute ? nombre de votes minimum requis ? gestion des ex-aequo (plusieurs gagnantes possibles) ?
- Recalcul des statuts au chargement (pas de backend pour l'instant, donc évaluation côté client à chaque mount)
- Préparer la structure pour de futures notifications (hors scope code pour le moment)

Points à clarifier avant d'attaquer l'étape 6 : règle exacte de désignation des gagnantes et seuil minimum de votes.

---

On commence par **l'étape 1A** une fois ce plan validé.