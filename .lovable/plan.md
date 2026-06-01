## Fix layout : `<main>` + `BottomNav` = 100% du viewport

### Recommandations

**Portée → globale (wrapper dans `App.tsx`).**
Raison : la `BottomNav` est présente sur toutes les routes. Si chaque page recalcule sa hauteur de son côté, on duplique la règle et on prend le risque d'oublier une page. Une seule source de vérité dans `App.tsx`, chaque page reste libre de scroller si son contenu dépasse (overflow naturel).

**Hauteur BottomNav → figée + variable CSS.**
Best practice front mobile : la hauteur d'une nav statique (icône + label) ne change jamais à l'usage. Un `ResizeObserver` ajouterait du JS pour zéro bénéfice réel et un risque de flash au premier render. Le standard (utilisé par iOS Safari, Material, Tailwind UI) c'est : hauteur figée + token CSS partagé entre la nav et le wrapper de contenu.

### Changements

1. **`src/index.css`** — ajouter dans `:root` :
   ```css
   --bottom-nav-h: 4rem; /* 64px, hauteur figée de BottomNav */
   ```

2. **`src/shared/ui/components/BottomNav.tsx`** — figer la hauteur :
   ```tsx
   className="fixed bottom-0 ... h-[var(--bottom-nav-h)] ..."
   ```
   (et nettoyer le `py-2` qui devient redondant — centrage via `items-center`).

3. **`src/App.tsx`** — remplacer le wrapper actuel `<div className="pb-16">` par un conteneur qui réserve exactement la zone utile :
   ```tsx
   <div className="min-h-[calc(100dvh-var(--bottom-nav-h))]">
     <Routes>…</Routes>
   </div>
   ```
   - `100dvh` (dynamic viewport height) plutôt que `100vh` → gère correctement la barre d'URL mobile qui apparaît/disparaît au scroll.
   - `min-h` (pas `h`) → si une page a beaucoup de contenu, elle scrolle normalement ; sinon elle remplit la zone.

4. **`src/features/home/HomePage.tsx`** — retirer `min-h-screen` du `<main>`. Garder `flex flex-col` + `flex-1` sur la section centrale : elle prendra naturellement toute la hauteur disponible héritée du wrapper, sans déborder.

5. **`src/features/contests/ContestDetailPage.tsx`** — même nettoyage : retirer `min-h-screen` du `<main>` (devenu inutile, géré par le wrapper).

### Bénéfices

- Plus aucun chevauchement avec la BottomNav, sur tous les écrans, toutes les pages.
- Une seule constante (`--bottom-nav-h`) à modifier si la nav change un jour.
- Zéro JS ajouté, aucune dépendance, conforme à l'objectif éco-conception.
- `100dvh` corrige aussi le bug iOS Safari où `100vh` inclut la zone sous la barre d'URL.

### Hors-scope

- Pas de refonte du contenu de HomePage ni de la nav.
- Pas de gestion du safe-area iOS (`env(safe-area-inset-bottom)`) — à ajouter plus tard si on cible vraiment les iPhone à encoche, ça se branchera sur la même variable.
