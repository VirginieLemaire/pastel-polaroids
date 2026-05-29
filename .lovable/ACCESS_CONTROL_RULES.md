# 📄 Document de Conception : Matrice des Permissions (RBAC Simplifié)
Principe : Ce projet n'utilise pas de "Rôles" globaux (ex: Admin, Modérateur). Les permissions sont basées sur l'État du Concours et la Propriété (Ownership).

## 1. Les Acteurs

*   Visiteur : Utilisateur connecté (tout le monde est connecté dans la v1 mockée).
*   Créateur du Concours : L'utilisateur qui a initié le thème (`contest.creatorId === user.id`).
*   Auteur d'une Photo : L'utilisateur qui a soumis une photo spécifique (`photo.authorId === user.id`).
*   Participant : Utilisateur ayant soumis au moins une photo au concours.

## 2. Matrice des Permissions par Phase

|Action / Ressource|Phase : Soumission|Phase : Vote|Phase : Clos|
|---|---|---|---|
|Voir le Concours|Tous|Tous|Tous|
|Éditer le Concours|✅ Oui (si Créateur)|✅ Oui (si Créateur)*|❌ Non (Verrouillé)|
|Supprimer le Concours|✅ Oui (si Créateur)|✅ Oui (Si Créateur)*|❌ Non (Verrouillé)|
|Voir les photos d'un concours|Restreint (voir seulement les siennes)|Toutes (Anonymisées)|Toutes (Noms , notes et mention gagnante visibles)|
|Soumettre une photo à un concours|✅ Oui (si < 3 photos)|❌ Non|❌ Non|
|Éditer/Supp. sa photo|✅ Oui (si Auteur)|❌ Non (sauf si demande RGPD)|❌ Non (sauf si demande RGPD)|
|Voir l'Auteur d'une photo|✅ Oui (si c'est la sienne) <br> ❌ Non (Si c'est celle d'un autre)|❌ Jamais (Anonymat strict)|✅ Oui (Tous)|
|Voter (1-5 étoiles)|❌ Non|✅ Oui (1 vote/photo/utilisateur)|❌ Non|
|Modifier son Vote|❌ Non|✅ Oui (Si déjà voté)|❌ Non|
|Voir les Scores/Moyennes|❌ Non (Ou seulement les siens ?)|❌ Non (Secret)|✅ Oui (Classement public)|
|Voir le Gagnant|❌ Non|❌ Non|✅ Oui (Badge visible)|

## 3. Règles de Sécurité Implémentées (Checklist Dev)

Pour chaque composant généré, l'IA doit vérifier ces points :
*   Règle d'Or "Anonymat" : En phase `Vote`, la requête ou le filtrage des données NE DOIT PAS renvoyer le champ `authorName` ou `authorAvatar` pour les photos dont `authorId !== currentUserId`.
	*   _Implémentation_ : Soit le filtrage est fait dans le Context avant de passer les props, soit le composant `PhotoCard` a une logique interne stricte pour masquer ces données. Interdiction de faire ça uniquement en CSS (`display: none`).
*   Règle "Propriété" : Les boutons "Éditer" et "Supprimer" sont conditionnés par `if (photo.authorId === currentUser.id)`.
*   Règle "Créateur" : Le bouton "Éditer le Concours" est conditionné par `if (contest.creatorId === currentUser.id)`.
*   Règle "Limite" : Le bouton "Soumettre" est désactivé si `userPhotosCount >= 3`.
#### 4. Évolution vers la v2 (Backend)
*   Airtable/Postgres : Ces règles devront être dupliquées côté serveur (RLS ou Middleware API).
*   Principe : "Never trust the client". Le front-end masque les boutons, le back-end doit rejeter la requête HTTP si la permission n'est pas valide.

