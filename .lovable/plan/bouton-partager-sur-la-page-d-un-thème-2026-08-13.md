# Bouton « Partager » sur la page d'un thème

## Ce que ça donne

Un bouton « Partager » sur `ContestDetailPage`, à côté d'Éditer / Supprimer (visible par tous, pas seulement l'auteur).

Au clic :
- **Mobile / navigateurs compatibles** : ouverture du panneau de partage natif du système (WhatsApp, Signal, Messages, Mail…) via l'API Web Share.
- **Sinon (desktop Firefox, etc.)** : le texte + le lien sont copiés dans le presse-papiers, avec un retour visuel « Lien copié ! ».

Texte partagé, selon le statut calculé :
- Soumission : « Concours en cours, viens poster tes soumissions pour le thème *Nom* avant le 28 août 2026 »
- Vote : « Viens voter pour les photos du concours *Nom* avant le 31 août 2026 »
- Clos : « Le concours *Nom* est terminé, viens découvrir les photos gagnantes ! »

La description du thème (si présente) est ajoutée en seconde ligne, puis l'URL de la page du thème.

## À propos de l'Open Graph (la « carte d'affichage »)

C'est la bonne idée, mais elle ne peut pas fonctionner telle quelle sur ce projet, et il faut être clair là-dessus :

L'application est une SPA Vite : le seul `<head>` que voient WhatsApp, Signal, Facebook ou LinkedIn est celui du fichier `index.html` statique. Ces robots n'exécutent pas JavaScript. Donc une carte **par thème** (titre du thème, sa photo, son statut) est techniquement impossible sans rendu serveur — quel que soit le thème partagé, tous les liens afficheraient la même carte.

Ce qui est faisable maintenant, et que le plan inclut :
- Une carte de partage **générique et soignée au niveau du site** dans `index.html` (titre, description, `og:type`, `twitter:card`) : le lien partagé affiche une vignette propre « Concours Photo Familial » au lieu d'un lien nu.
- Le texte du message, lui, est bien contextualisé par thème (c'est ce que l'utilisateur lit en premier dans WhatsApp/Signal).

Si les cartes par thème deviennent importantes, l'app peut obtenir le rendu serveur en passant au dernier template Lovable — tapez « / » dans le chat et choisissez « Migrate to TanStack Start », ou demandez-moi de le faire ([ce que l'upgrade apporte](https://lovable.dev/blog/building-apps-using-tanstack-start)). Ce n'est pas nécessaire pour le reste du plan.

À noter aussi : l'image de couverture d'un thème créé en démo est une image locale/temporaire, donc non accessible aux robots externes de toute façon.

## Détails techniques

1. `src/features/contests/utils.ts`
   - `getPhaseEndDate(contest, status)` : réutilise le calcul déjà présent dans `getNextStepText` (createdAt + submissionDays, + voteDays) pour exposer la date de fin de phase.
   - `buildShareText(contest, status)` : retourne `{ title, text }` selon les trois formulations ci-dessus, description ajoutée si présente. Aucune logique dans le composant.

2. Nouveau `src/shared/ui/components/ShareButton.tsx`
   - Props : `title`, `text`, `url`.
   - `navigator.share` si disponible (`canShare`), sinon `navigator.clipboard.writeText`.
   - Ignore silencieusement l'annulation du panneau natif (`AbortError`) — pas de message d'erreur pour un abandon volontaire.
   - Feedback : libellé du bouton qui passe à « Lien copié ! » pendant ~2 s, + `aria-live="polite"` pour les lecteurs d'écran.
   - Basé sur `BrutalButton` (icône `Share2` de lucide-react), couleur `lavender`.

3. `src/features/contests/ContestDetailPage.tsx`
   - Ajout du `ShareButton` dans la barre d'actions, avec `url = window.location.href`.

4. `index.html`
   - Titre et description réels + `og:title`, `og:description`, `og:type`, `twitter:card` au niveau du site (pas d'`og:image` : l'hébergement Lovable en injecte une au moment du service).

Pas de nouvelle dépendance, pas de changement de données ni de règles métier.
