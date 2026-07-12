# Contexte du projet : pastel-polaroids

*Dernière mise à jour : 12 juillet 2026*

---

## 📌 Identité du projet
- **Nom** : Photo de Famille
- **Concept** : Application de **concours photo familiale** avec un thème à la fois.
- **Slogan** : *"Concours photo en famille, un thème à la fois."*

Ce projet fictif est destiné à être présenté dans un portfolio. Afin qu'il puisse être fonctionnel sans problème de sécurité ou de surcharge serveur / BDD, toutes les données sont mockées avec utilisation du Context avec des scenarii stockés en localStorage.

Il s'agit d'une adaptation d'un projet existant avec une stack Airtable / Softr qui n'apporte pas beaucoup de possiblités de personnalisations à moindre coûts.

Dans un second temps, le projet sera forké pour devenir le projet réel, en production avec base de données, authentification et migration vers Next.js (à garder en ligne de mire pour avoir le moins de modifications possibles).

---

## 🛠 Stack technique

| Type | Technologies |
|------|-------------|
| **Framework** | React 18 + Vite |
| **Langage** | TypeScript |
| **UI** | Tailwind CSS + [shadcn-ui](https://ui.shadcn.com/) (composants personnalisés) |
| **Routing** | react-router-dom v6 |
| **Validation** | Zod (schémas) |
| **Icons** | lucide-react |
| **Avatars** | DiceBear (@dicebear/collection + core) |
| **Tests** | Vitest + @testing-library/react + @testing-library/user-event + @vitest/coverage-v8 + jsdom |
| **Documentation** | Storybook 10.5 + addons (Docs, A11y, Vitest) |

---

## 🏗 Architecture

Organisée en **features** (dossier `src/features/`) :
- **`contests/`** : Gestion des thèmes (création, édition, suppression, statuts).
- **`photos/`** : Soumission, édition, affichage des photos (limite de 3 photos/utilisateur par concours).
- **`votes/`** : Système de vote et calcul des gagnants (notes, classement, ex-aequo).
- **`user/`** : Contexte utilisateur (mocké pour le moment).
- **`shared/`** : Composants UI réutilisables (boutons "brutalistes", cartes, modales, etc.) et utilitaires.

**Autres dossiers** :
- `src/dev/` : Menu de développement et scénarios de mock.
- `src/public/` : Assets statiques.
- `.storybook/` : Configuration Storybook pour la documentation des composants.

---

## 🎯 Fonctionnalités clés

### 1. Concours (Contests)
- **Création** : Nom, description, image de couverture, durée de soumission et de vote (en jours).
- **Statuts** :
  - `submission` → Phase de soumission des photos.
  - `vote` → Phase de vote.
  - `closed` → Résultats finaux.
- **Permissions** : Seul l’auteur peut éditer/supprimer son concours.

### 2. Photos
- **Soumission** : Titre, description, URL d’image (limite de 3 photos/utilisateur par concours).
- **Visibilité** :
  - En phase `submission` : seules les photos de l’utilisateur sont visibles.
  - En phase `vote`/`closed` : toutes les photos sont visibles.
- **Actions** : Édition/suppression possibles si l’utilisateur est l’auteur **et** que le concours est en phase `submission`.

### 3. Votes
- **Mécanisme** : Chaque votant (auteur d’une photo dans le concours) note toutes les photos **sauf les siennes** (note de 1 à 5 étoiles).
- **Résultats** :
  - Calcul de la **moyenne** par photo.
  - Détection des **gagnants** (ex-aequo possibles).
  - Affichage des notes et badges "Gagnant" en phase `closed`.

### 4. UI/UX
- **Design** : Style **"brutaliste"** avec des couleurs pastel (mint, sky, butter, pink).
- **Composants custom** :
  - `PolaroidCard` : Carte en forme de polaroïd pour les concours.
  - `BrutalButton`/`BrutalCard` : Boutons et cartes avec bordures épaisses et ombres marquées.
  - `PhotoGrid` : Grille responsive pour afficher les photos.
  - `StatusBadge` : Badge indiquant le statut du concours.
  - `DisplayStars` : Affichage des étoiles pour les notes.
  - `VoteStars` : Composant interactif pour voter avec des étoiles.
  - `PhotoDetailModal` : Modale affichant les détails d'une photo (note, gagnant, etc.).
  - `WinnerBadge` : Badge "Gagnant" pour les photos victorieuses.
  - `CoverImage` : Composant pour l'image de couverture des concours.
  - `ImagePlaceHolder` : Placeholder pour les images.
  - `Modal` : Composant de modale réutilisable.
- **Navigation** : Barre de navigation en bas (`BottomNav`).
- **Documentation** : Tous les composants UI sont documentés avec des **stories Storybook** (10 stories générées).

---

## 📱 Pages principales

| Route | Description |
|-------|-------------|
| `/` | Accueil : Liste le concours en cours (ou bouton pour en créer un) + anciens concours. |
| `/contest/:id` | Détail d’un concours : couverture, description, auteur, statut, CTA vers les photos. |
| `/contest/:id/photos` | Galerie des photos : soumission (si phase `submission`), vote (si phase `vote`), ou résultats (si phase `closed`). |
| `/photos` | Toutes les photos soumises (page de résultats globaux). |

---

## 📊 Données (Mockées)
- **Utilisateurs** : Générés via `mockUser.ts` (id, nom, avatar DiceBear).
- **Concours** : Exemples dans `contests.mocks.ts` (ex: "Nature", "Portrait", "Ville").
- **Photos** : Mocks dans `photos.mocks.ts` avec images placeholder (picsum.photos).
- **Votes** : Mocks dans `votes.mocks.ts`.

---

## 🔧 État actuel (d’après les commits)
- **Derniers commits** :
  - `921aa73` : `fix(Storybook): placehorlder URL and types` (12 juillet 2026)
  - `ee0b2b3` : `doc(Storybook): add autodocs`
  - `d71bc5e` : `fix(Storybook) : accessibility issues`
  - `d779256` : `doc(Storybook) : generate all stories with AI (mistral Vibe)`
  - `ff38af3` : `chore(storybook) : init empty Storybook`
  - `020183e` : `docs: update contexte_projet.md with current test status and commits`
  - `6e00f9f` : `fix(contests test) : remove unused imports`
  - `cd3097f` : `test(votes) unit tests vote feature`
  - `4c9cfad` : `refactor(DAY_MS): another DAY_MS created by AI instead of importing it`
  - `990327c` : `fix(error on contest tests): error after modifying dateUtils - needs some modifications`
  - `1402c77` : `test(photos): unit test for photos permission, visibility and some schemas rules`
  - `9ee9468` : `test(contest): init tests and unit test contest feature`
  - `bbd0f0c` : `fix: align @vitest/coverage-v8 version with vitest@3.x`
- **Statut** : Projet **fonctionnel** avec **149 tests** (104 tests Vitest + 45 tests Storybook) couvrant votes, concours, photos et composants UI (tout est mocké, pas de backend).
- **Documentation** : **Storybook** configuré et opérationnel avec 10 stories documentant tous les composants UI principaux.
- **Déploiement** : Configuré pour [Lovable](https://lovable.dev) (référencé dans le README).

---

## 🎨 Points remarquables
1. **Design cohérent** : Thème pastel + brutalisme, typographie `font-mono`.
2. **Logique métier solide** :
   - Gestion des phases de concours (dates calculées dynamiquement).
   - Règles de vote strictes (pas de vote pour ses propres photos).
   - Gestion des ex-aequo pour les gagnants.
3. **Accessibilité** : ARIA labels, boutons désactivés avec `title`, navigation claire.
4. **Responsive** : Adapté mobile (barre de navigation en bas) et desktop.
5. **Documentation complète** : Tous les composants UI sont documentés avec Storybook, incluant autodocs et tests d'accessibilité.

---

## 🔍 Ce qui manque (à prioriser)
- **Backend** : Actuellement, toutes les données sont en mémoire (via `useState` et `Context`). Il faudrait :
  - Un serveur (Node.js/Express, Firebase, etc.).
  - Une base de données (PostgreSQL, Supabase, etc.).
  - Une API pour persister concours/photos/votes.
- **Authentification** : Le `UserContext` utilise un utilisateur mocké (`mockUser`). Intégrer Firebase Auth ou NextAuth.
- **Upload d’images** : Les `imageUrl` pointent vers des URLs externes (picsum). Ajouter un système d’upload (Cloudinary, Supabase Storage).
- **Tests E2E** : Tests unitaires complets (149 tests : 104 Vitest + 45 Storybook). À compléter avec des tests E2E (Cypress, Playwright).