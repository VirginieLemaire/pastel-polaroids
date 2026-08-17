# Améliorer l'aperçu de partage sans migrer vers TanStack

## Ce qui se passe aujourd'hui

Le titre et la description Open Graph sont bien présents dans `index.html`. Ce que vous voyez (« Internal Lovable Project », `lovableproject.com`) vient du **lien de preview** : les robots de WhatsApp/Signal ne peuvent pas charger cette URL (elle est protégée par le login Lovable), donc ils affichent le libellé générique du domaine de preview.

C'est donc un problème d'URL partagée, pas de balises manquantes. Aucun rendu serveur n'est nécessaire pour le corriger.

## Ce qu'on fait

1. **Publier l'app** pour obtenir une URL publique (`https://pastel-polaroid.lovable.app`). C'est ce lien qu'il faudra partager : les robots y ont accès et liront les vraies balises.
2. **Compléter le `<head>`** de `index.html` :
   - `og:url` et `<link rel="canonical">` pointant vers le domaine publié,
   - `og:site_name` / `og:locale` (déjà là) conservés,
   - `theme-color` pour la couleur de la barre navigateur sur mobile,
   - JSON-LD `WebSite` (nom + description du site).
3. **Le bouton Partager** continue de partager `window.location.href`. Ajout d'un repli : si l'URL courante est une URL de preview interne, le lien partagé utilise le domaine publié, pour que le message envoyé en démo affiche une carte correcte au lieu du libellé générique.

## Limite à garder en tête

L'image de couverture **par thème** reste impossible sans rendu serveur (les robots ne lisent que le HTML statique). En revanche, une fois l'app publiée, l'hébergement Lovable injecte automatiquement une image d'aperçu au niveau du site : la carte affichera le vrai titre, la vraie description et une vignette du site — plus de « Internal Lovable Project ».

À noter : les robots mettent l'aperçu en cache ; un lien déjà partagé peut garder l'ancienne carte pendant un moment (un débogueur d'aperçu de lien force le rafraîchissement).

## Détails techniques

- `index.html` : ajout de `og:url`, `canonical`, `theme-color`, script `application/ld+json` (type `WebSite`). Pas d'`og:image` codée en dur (l'hébergement s'en charge).
- `src/shared/ui/components/ShareButton.tsx` : la construction de l'URL partagée bascule sur le domaine publié quand `window.location.hostname` correspond à un domaine de preview Lovable. Logique extraite dans une petite fonction utilitaire, pas dans le JSX.
- Aucune dépendance ajoutée, aucun changement de règles métier.
