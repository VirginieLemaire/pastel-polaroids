# Sélecteur de scénarios accessible en production (mode démo)

Objectif : transformer le menu dev réservé au `DEV` en un **panneau de démo** visible par tous les visiteurs du portfolio, avec un discours pédagogique expliquant ce que chaque scénario illustre.

## Ce que verra le visiteur

- Un bouton flottant en haut à droite, libellé de façon explicite (icône + texte court « Mode démo »), toujours visible.
- Au clic, un panneau néo-brutaliste qui contient :
  - un court paragraphe d'intro : données fictives, aucun compte requis, l'état se réinitialise au rechargement ;
  - la liste des 5 scénarios (aucun thème, soumission, vote, 1 actif + anciens, tout clos) avec pour chacun un titre et une phrase expliquant **ce qu'on peut tester** (ex. « phase de vote : notes anonymes, aucun auteur affiché ») ;
  - le scénario actif clairement marqué (coche + fond menthe) ;
  - un bouton de fermeture, fermeture au clic extérieur et à la touche Échap.

## Comportement

- Le choix d'un scénario recharge immédiatement concours + votes (même événement qu'aujourd'hui), sans rechargement de page.
- Le scénario choisi est mémorisé (préférence UI en `localStorage`, usage autorisé : pas de donnée métier).
- Fonctionne à l'identique en dev et en build : plus aucune condition `import.meta.env.DEV`.

## Détails techniques

- `src/dev/DevMenu.tsx` : renommé/déplacé en `src/features/demo/DemoScenarioPanel.tsx`, suppression du garde `import.meta.env.DEV`, ajout des descriptions pédagogiques, du texte d'intro, de la fermeture clavier (Échap) et des attributs a11y (`aria-expanded`, `aria-controls`, rôle de liste de boutons, focus visible).
- `src/dev/mockScenarios.ts` : déplacé en `src/features/demo/scenarios.ts`, descriptions enrichies (une phrase « ce que ça permet de tester » par scénario). Les imports dans `ContestContext.tsx` et `VoteContext.tsx` sont mis à jour.
- `src/features/contests/ContestContext.tsx` et `src/features/votes/VoteContext.tsx` : retrait des conditions `import.meta.env.DEV` pour que l'écoute du changement de scénario et l'initialisation depuis le scénario stocké soient actives en production.
- `src/App.tsx` : `DevMenu` remplacé par `DemoScenarioPanel`.
- Rien d'autre ne change : logique métier, calcul de statut, anonymat et permissions restent intacts.
