## Reset du projet et nouveau backlog

On repart d'une base propre. Plus question d'adapter l'existant : on supprime tout le code applicatif, on garde uniquement la stack technique minimale, la charte couleurs et l'esprit néo-brutaliste. Le polaroïd cible est celui de la référence fournie (cadre épais, zone photo hachurée, marge basse blanche).

---

### Étape 1 — Nettoyage (à valider avant la suite)

Objectif : un projet vierge qui compile, avec la charte couleurs et les utilitaires brutalistes prêts à l'emploi, mais zéro feature métier.

**Fichiers supprimés**
- `src/pages/Index.tsx`, `SubmitPhoto.tsx`, `Gallery.tsx`, `NotFound.tsx`
- `src/components/PolaroidCard.tsx`, `Modal.tsx`, `CreateContestForm.tsx`
- `src/context/ContestContext.tsx` (dossier `context/` supprimé)
- `.lovable/plan.md` (remplacé par la nouvelle version ci-dessous)
- `src/test/example.test.ts` (on garde `setup.ts` et `vitest.config.ts` pour réintroduire des tests plus tard)

**Fichiers réécrits / réduits**
- `src/App.tsx` : une seule route `/` rendant un composant `Home` quasi vide.
- `src/pages/Home.tsx` : nouveau, placeholder minimal.
- `src/index.css` : fonts Space Grotesk / Space Mono, reset, variables CSS pour les 7 couleurs (HSL), utilitaires `.brutal-border`, `.brutal-shadow`, `.brutal-btn`, `.brutal-input`. Suppression des classes `.polaroid*` (refaites à l'étape 6).
- `tailwind.config.ts` : retrait de toute la config shadcn (sidebar, popover, primary/secondary, radius, accordion, plugin `tailwindcss-animate`). On garde container, fonts, couleurs sémantiques (`background`, `foreground`, `border`, `muted`) et palette `pastel`.
- `package.json` : retrait de `@tailwindcss/typography` (inutilisé).
- `index.html` : titre + meta « Concours photo de famille ».

**Charte couleurs (variables CSS, HSL)**
- `--background` (beige) : `#fffaeb`
- `--pastel-pink` : `#f0c2d1`
- `--pastel-lavender` (violet) : `#d2c6ec`
- `--pastel-mint` (vert) : `#b3e6d5`
- `--pastel-butter` (jaune) : `#f7e8ba`
- `--pastel-sky` (bleu) : `#c2e0f0`
- `--pastel-peach` (beige foncé) : `#f7cfba`
- `--foreground` : noir quasi pur

**Critère de validation étape 1**
- Page beige avec juste le titre, sans erreur console.
- `package.json` réduit au strict nécessaire.
- Classes `bg-pastel-*` et `brutal-*` utilisables.

---

### Étape 2 — Composants de base (design system)

- `BrutalButton` (variantes pastel, taille, icône)
- `BrutalCard` (bordure épaisse + ombre décalée)
- `Modal` accessible (`createPortal`, `Escape`, focus trap, overlay click, `aria-modal`)
- `PolaroidCard` refait d'après la référence : cadre blanc épais bordure noire, ombre décalée, zone image avec motif hachuré en placeholder, marge basse plus large. Props : `imageUrl?`, `title`, `rotation`. Pas de flip à ce stade.
- Page démo `/` affichant un échantillon de chaque composant.

---

### Étape 3 — Home + création de thème (ex-étape 1A)

- Home cas A : logo, sous-titre, gros bouton `+` central, label « Nouveau thème ».
- Modale + formulaire (nom, soumission 15j défaut, vote 3j défaut).
- `ContestContext` en mémoire : `{ id, name, createdAt, submissionDays, voteDays, photos: [] }`.
- Après validation : fermeture modale + redirection placeholder vers `/contest/:id`.

---

### Étape 4 — Home cas B (un concours en cours)

- Carte du concours en cours (cover placeholder, nom, badge de statut).
- Bouton « Autres thèmes » si ≥1 autre concours.
- Clic carte → page détail thème.

---

### Étape 5 — Page détail d'un thème

- Image de couverture + avatar créateur via **DiceBear** (`@dicebear/core` + collection à choisir, seed = identifiant utilisateur fictif).
- Carte post-it : description, statut, dates clés, compteur de photos.
- Boutons contextuels selon statut (Soumettre / Voter / Voir le palmarès).
- Bouton « Éditer le thème » visible uniquement pour le créateur.
- Barre de navigation basse fixe.

---

### Étape 6 — Page photos d'un thème

- Grille de `PolaroidCard`.
- Interactions selon statut :
  - Soumission : seules ses propres photos éditables/supprimables.
  - Vote : toutes les photos, étoiles.
  - Clôturé : note moyenne, couronne sur la/les gagnante(s).
- Modale plein écran au clic sur une photo.

---

### Étape 7 — Galerie « toutes les photos »

- Mosaïque tous concours confondus, tag thème sur chaque photo.
- Filtres multi-sélection : par thème (chips) + « gagnantes uniquement », combinables.

---

### Étape 8 — Polish

- États vides, transitions de modale, responsive desktop, micro-animations, passe accessibilité.
- Compression et recadrage des images uploadées (illustration de thème, photos soumises).

---

### Étape 9 — Automatisations

- Transitions automatiques de statut selon `createdAt + submissionDays`, puis `+ voteDays`.
- Désignation automatique des gagnantes à la clôture (règle à confirmer : meilleure moyenne ? seuil min de votes ? gestion ex-aequo ?).
- **Recalcul uniquement via un cron quotidien à minuit** (pas de recalcul au mount). Implique un backend planifié — choix techno à faire le moment venu (Lovable Cloud + edge function programmée, ou équivalent).
- Préparer la structure pour de futures notifications.

---

On démarre par **l'étape 1** et on ne touche à rien d'autre tant qu'elle n'est pas validée en preview.
