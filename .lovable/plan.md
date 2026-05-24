## Refactor archi par feature + Étape 5

Deux blocs séquentiels : (A) refactor archi, (B) page détail thème.

---

## A. Refactor — création de la feature `contests`

### A.1 Nouvelle arborescence

```text
src/
  features/
    contests/
      types.ts                  ← Contest, CreateContestInput, ContestContextValue
      ContestContext.tsx        ← Provider seul
      useContests.ts            ← hook
      mocks/
        contests.mocks.ts       ← ex src/dev/mockDatas.ts (renommé)
      index.ts                  ← barrel: re-export Contest, CreateContestInput,
                                   ContestProvider, useContests, DEV_SCENARIO_CHANGE_EVENT
  context/                       ← supprimé (vide)
  dev/
    mockDatas.ts                 ← supprimé
    mockScenarios.ts             ← import mis à jour vers @/features/contests/mocks/contests.mocks
    DevMenu.tsx                  ← import mis à jour vers @/features/contests
```

### A.2 Détail des déplacements

- **`src/context/ContestContext.tsx`** → split en deux :
  - `src/features/contests/types.ts` : interfaces `Contest`, `CreateContestInput`, `ContestContextValue`.
  - `src/features/contests/ContestContext.tsx` : `createContext`, `ContestProvider`, ré-export de `DEV_SCENARIO_CHANGE_EVENT`. Import des types depuis `./types`, import des mocks depuis `./mocks/contests.mocks`.
- **`src/context/useContests.ts`** → `src/features/contests/useContests.ts` (inchangé hormis l'import du Context).
- **`src/dev/mockDatas.ts`** → `src/features/contests/mocks/contests.mocks.ts` (contenu identique, juste l'import `Contest` qui passe en `@/features/contests`).
- **`src/features/contests/index.ts`** (barrel) :
  ```ts
  export type { Contest, CreateContestInput, ContestContextValue } from "./types";
  export { ContestProvider, DEV_SCENARIO_CHANGE_EVENT } from "./ContestContext";
  export { useContests } from "./useContests";
  ```

### A.3 Mise à jour des imports (consommateurs)

Tous les `@/context/useContests` et `@/context/ContestContext` deviennent `@/features/contests`.
Fichiers à patcher : `App.tsx` (ou `main.tsx` selon montage du Provider), `pages/Home.tsx`, `pages/Contest.tsx`, `components/CreateContestForm.tsx`, `components/StatusBadge.tsx` si concerné, `lib/contestStatus.ts`, `dev/mockScenarios.ts`, `dev/DevMenu.tsx`.

### A.4 Suppressions

- `src/context/ContestContext.tsx`, `src/context/useContests.ts`, dossier `src/context/`.
- `src/dev/mockDatas.ts`.

### A.5 Critère de validation refactor

- Build OK, app identique en preview (Home + Contest fonctionnent, DevMenu switch toujours les scénarios).
- Plus aucun import qui pointe vers `@/context/*` ou `@/dev/mockDatas`.

---

## B. Étape 5 — Page détail d'un thème

(Inchangé par rapport à ce qu'on avait cadré, mais désormais aligné sur l'archi feature.)

### B.1 Feature `user` (user mock unique)

```text
src/features/user/
  types.ts          ← interface User { id, name, email, avatarSeed }
  mockUser.ts       ← CURRENT_USER constant (id "user-1", name "Camille")
  UserContext.tsx   ← Provider exposant { currentUser }
  useCurrentUser.ts ← hook
  index.ts          ← barrel
```

Monté dans `App.tsx` autour de `ContestProvider`.

### B.2 Compat Airtable sur `Contest`

- Ajouter `authorId: string` à l'interface (`features/contests/types.ts`).
- Tous les mocks de `contests.mocks.ts` reçoivent `authorId: "user-1"`, sauf **« Noël 2025 »** qui reçoit `authorId: "user-other"` (test du masquage du bouton Éditer).
- `createContest` injecte automatiquement `authorId: currentUser.id`. → le Provider lit `useCurrentUser()`.

Aucun champ `status` introduit — calcul dynamique conservé.

### B.3 Avatar DiceBear

- **Demande de confirmation install** avant tout : `@dicebear/core` + `@dicebear/collection` (collection `thumbs` proposée, neutre et légère). Si refus, fallback initiales sur un disque pastel.
- Helper `src/shared/avatar.ts` : `getAvatarDataUri(seed: string): string` (SVG inline, zéro requête réseau).

### B.4 Permissions

`src/features/contests/permissions.ts` :
```ts
export const canEditContest = (contest: Contest, userId: string) =>
  contest.authorId === userId;
```
(`canEditPhoto`, `canUserSubmit` viendront avec la feature `photos`.)

### B.5 Page `Contest.tsx` redesignée

Layout mobile-first :

```text
[ ← Retour ]
[ Cover pleine largeur, brutal-border, ratio 4/3, placeholder hachuré si absente ]
[ Avatar (DiceBear, 40px) │ "Créé par <Nom>" │ <StatusBadge> ]
[ BrutalCard (color butter, rotation -1deg) :
    <h1> nom </h1>
    <p>  description si présente </p>
    Soumission : Xj  •  Vote : Yj
    Créé le …  ·  Phase actuelle se termine le …
    0 photo soumise pour l'instant
]
[ CTA pleine largeur selon statut :
    submission → "Soumettre une photo"  (mint)
    vote       → "Voter"                 (butter)
    closed     → "Voir le palmarès"     (lavender)
  → tous routent vers /contest/:id/photos (lien mort jusqu'à l'étape 6)
]
[ Si canEditContest : bouton "Éditer le thème" (sky, sm) → console.log + toast placeholder ]
```

### B.6 Barre de navigation basse

`src/components/BottomNav.tsx` : fixed bottom, 2 entrées (`Accueil`, `Galerie`). Montée dans `App.tsx`, visible sur toutes les routes. Galerie = lien mort.

### B.7 Accessibilité / éco-conception

- `<img>` cover : `width`/`height`, `loading="lazy"`, `alt` = nom du thème.
- Avatar SVG inline, `width`/`height` fixes, `alt=""` (décoratif, nom rendu à côté).
- `<h1>` unique. Bouton Retour = vrai `<Link>`.
- Contrastes pastel/foreground OK.

### B.8 Hors-scope (rappels)

- Pas d'édition réelle du thème (modale plus tard).
- Pas de page photos (étape 6).
- Pas de switcher multi-users (étape ultérieure).

### B.9 Critère de validation étape 5

- Scénario `one-active-rest-closed`, `/contest/mock-1` : cover placeholder, avatar Camille, badge « Soumission », post-it, CTA « Soumettre une photo », bouton « Éditer le thème » visible.
- `/contest/mock-2` (Noël, `authorId: "user-other"`) : bouton « Éditer » absent.
- Switch DevMenu → badge change, aucune trace de champ `status` dans le code.
- Build OK, aucune erreur console.

---

## Fichiers touchés (récap)

**Créés** : `src/features/contests/{types.ts, ContestContext.tsx, useContests.ts, permissions.ts, index.ts}`, `src/features/contests/mocks/contests.mocks.ts`, `src/features/user/{types.ts, mockUser.ts, UserContext.tsx, useCurrentUser.ts, index.ts}`, `src/shared/avatar.ts`, `src/components/BottomNav.tsx`.

**Modifiés** : `src/App.tsx`, `src/pages/Home.tsx`, `src/pages/Contest.tsx`, `src/components/CreateContestForm.tsx`, `src/components/StatusBadge.tsx` (si import concerné), `src/lib/contestStatus.ts`, `src/dev/mockScenarios.ts`, `src/dev/DevMenu.tsx`, `package.json` (DiceBear, après confirmation).

**Supprimés** : `src/context/` (dossier entier), `src/dev/mockDatas.ts`.
