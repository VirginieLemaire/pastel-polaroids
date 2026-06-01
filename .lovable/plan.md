## Étape 1 — Fondations data `features/photos` (read-only)

Note prise en compte : à l'étape 4, on réutilisera **`PolaroidCard`** existant (pas de nouveau composant `PhotoCard`). La logique d'anonymat/visibilité restera dans `visibility.ts` + au niveau de la page, `PolaroidCard` ne recevra que les props déjà filtrées.

### Objectif

Poser le squelette de la feature `photos` : types, mocks, Context read-only, hook, barrel. Aucun changement UI visible. App fonctionnelle et build vert après ce commit.

### Fichiers créés

1. **`src/features/photos/types.ts`**
   - `interface Photo { id; contestId; authorId; title; description?; imageUrl; createdAt }` (ISO string pour `createdAt`, cohérent avec `Contest`).
   - `interface CreatePhotoInput { contestId; title; description?; imageUrl }` (préparé pour étape 5, pas encore utilisé).
   - `interface PhotoContextValue { photos; getPhotosByContest(contestId); getUserPhotosCount(contestId, userId) }`.

2. **`src/features/photos/mocks/photos.mocks.ts`**
   - 2-3 photos rattachées à `mock-1` (auteurs variés : `user-1` et `user-other`) pour pouvoir visualiser dès l'étape 4. URLs Unsplash.
   - Export nommé `defaultPhotos`.

3. **`src/features/photos/PhotoContext.tsx`**
   - `createContext<PhotoContextValue | null>(null)`.
   - `PhotoProvider` : `useState<Photo[]>(defaultPhotos)`. Pour l'instant le state n'est pas muté (mutations arriveront étape 5).
   - `getPhotosByContest` mémoïsé avec `useMemo` (groupBy léger).
   - `getUserPhotosCount` = filter + length.

4. **`src/features/photos/usePhotos.ts`**
   - Hook `useContext(PhotoContext)` + garde `throw new Error("usePhotos must be used within PhotoProvider")`. Cohérent avec `useCurrentUser`.

5. **`src/features/photos/index.ts`** (barrel)
   - Re-export types, `PhotoProvider`, `usePhotos`.

### Fichier modifié

- **`src/App.tsx`** : monter `<PhotoProvider>` à l'intérieur de `<ContestProvider>` (les photos référencent des `contestId`, donc dépendance logique).

### Hors-scope (volontairement)

- Aucune mutation (`submitPhoto`, `updatePhoto`, `deletePhoto`) — étapes 5/6.
- Aucune permission ni helper de visibilité — étape 2.
- Aucun composant ni page — étapes 3+.
- Pas de couplage `Contest.photos` ↔ `Photo` (on garde le `photos: unknown[]` actuel ; à clarifier plus tard, possiblement à supprimer puisque le `PhotoContext` est la source de vérité).

### Critère d'acceptation

- Build TS OK, aucun warning.
- `usePhotos()` accessible depuis n'importe quelle page (vérification rapide avec un `console.log` temporaire si besoin, retiré avant commit).
- Aucune régression visuelle (HomePage, ContestDetailPage identiques).
