# Mode démo : réutiliser les mocks existants

Constat actuel : `src/features/demo/scenarios.ts` contient ses propres jeux de votes écrits en dur (`vote-1` à `vote-27`), alors que les mocks de votes préparés dans `src/features/votes/mocks/votes.mocks.ts` (`defaultVotes`) ne sont importés nulle part. Les photos (`defaultPhotos`) sont chargées en bloc par `PhotoContext` sans tenir compte du scénario actif.

Objectif : les fichiers de mocks des features deviennent la source unique de vérité, et les scénarios de démo ne font que sélectionner/filtrer ces données.

## Ce qui change

1. **Votes** — Suppression des tableaux de votes en dur dans `scenarios.ts`. Chaque scénario dérive ses votes de `defaultVotes` en les filtrant sur les identifiants des concours qu'il contient (et sur zéro vote pour la phase de soumission, où voter est impossible).
2. **Photos** — `PhotoContext` initialise son état à partir de `defaultPhotos` filtrées sur les concours du scénario actif, et écoute le même événement de changement de scénario que les contextes concours et votes. Un scénario « Aucun thème » n'affiche donc plus de photos orphelines.
3. **Concours** — Les listes de `contests.mocks.ts` restent le socle, mais sont dérivées d'une seule liste de base (titres, descriptions, images, auteurs) dont les scénarios ne modifient que la date de création pour placer chaque concours dans la bonne phase. Fin des duplications de contenu entre `oneActiveSubmissionOnly`, `oneActiveVoteOnly`, `oneActiveRestClosed` et `allClosed`.

## Détails techniques

- `scenarios.ts` : un scénario n'expose plus que `contests` + une fonction/filtrage de votes basé sur les `contestId`; les votes viennent de `@/features/votes/mocks/votes.mocks`.
- `PhotoContext` : mêmes patrons que `VoteContext` (init via `getScenarioById(getStoredScenarioId())` + `useEffect` sur `DEV_SCENARIO_CHANGE_EVENT`), filtrage par `contestId`.
- Les identifiants de mocks (`mock-1..3`, `photo-1..N`, `user-1..3`) restent inchangés pour ne rien casser côté résultats/gagnants.
- Aucun champ `status` stocké : les phases restent calculées à partir de `createdAt` + durées.
- Vérification finale : les 5 scénarios du panneau « Mode démo » affichent des photos et des notes cohérentes (soumission sans note, vote anonyme, clos avec moyennes et gagnants).
