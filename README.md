# Photo de Famille

> Concours photo en famille, un thème à la fois.

## À propos du projet

**Photo de Famille** est une application de concours photo familial : on crée un thème (un seul thème en cours à la fois), chaque membre de la famille poste ses photos, le thème passe en mode vote et tout le monde vote, puis les résultats et les gagnants sont révélés.

Le souhait d'intégrer les photos sous le style de polaroîds a naturellement guidé le design system vers un style rétro mélant brutalisme couleurs pastels ave très peu d'arrondis.

Ce projet est uniquement une **démonstration**. C'est une réécriture d'un projet existant initialement construit sur une stack Airtable / Softr, qui offrait peu de possibilités de personnalisation à moindre coût. Ici, l'application est entièrement fonctionnelle mais **sans backend** : toutes les données (concours, photos, votes, utilisateurs) sont mockées et gérées côté client via des Context React, avec la préférence de scénario de démo persistée en `localStorage`. Cela permet de présenter et de tester l'application sans risque (pas de serveur ni de base de données à maintenir) et sans qu'aucune donnée réelle ne soit collectée.

Cette application avait 2 objectifs :
- proposer une version entièrement testable par les membres de la famille ou tout autre visiteur avant de passer à une version réelle, en production, avec une vraie base de données, une authentification et une migration de la stack, en minimisant les changements nécessaires.
- tester des IAs pour mener à bien le projet : 
  - il a été initié avec Lovable, 
  - réorganisé par mes soins 
  - puis j'ai pu testé Mistral Vibe 
  - et enfin j'ai finalisé le projet avevc Claude Code.
Ceci explique les différents dossiers présents dans le code ainsi que l'historique git qui manque de cohérence (un peu d'anglais, un peu de français, un peu de mélange des deux 😅).

L'application est testable à [pastel polaroid](pastel-polaroids.vercel.app).

## Stack technique

- **Framework** : React 19 + [TanStack Start](https://tanstack.com/start) / [TanStack Router](https://tanstack.com/router)
- **Build** : Vite 8 (config partagée via `@lovable.dev/vite-tanstack-config`), Nitro
- **Langage** : TypeScript
- **UI** : Tailwind CSS 4 + composants shadcn-ui personnalisés (style « brutaliste » pastel)
- **Icônes** : lucide-react
- **Avatars** : DiceBear (`@dicebear/collection`, `@dicebear/core`)
- **Validation** : Zod
- **Données serveur** : TanStack Query
- **Tests unitaires** : Vitest, Testing Library, jsdom
- **Tests end-to-end** : Playwright
- **Documentation UI** : Storybook (avec addon d'accessibilité)
- **Qualité de code** : ESLint, Prettier

## Installation

Prérequis : Node.js 20+ et [pnpm](https://pnpm.io/).

```sh
# Cloner le dépôt
git clone <URL_DU_DEPOT>
cd pastel-polaroids

# Installer les dépendances
pnpm install

# Lancer le serveur de développement
pnpm dev
```

L'application est ensuite accessible sur l'URL indiquée dans le terminal (par défaut `http://localhost:3000`).

### Autres commandes utiles

| Commande | Description |
|---|---|
| `pnpm build` | Construit l'application pour la production |
| `pnpm preview` | Prévisualise le build de production |
| `pnpm test` | Lance les tests unitaires (Vitest) |
| `pnpm test:watch` | Lance les tests unitaires en mode watch |
| `pnpm test:coverage` | Lance les tests unitaires avec couverture de code |
| `pnpm test:e2e` | Lance les tests end-to-end (Playwright) |
| `pnpm storybook` | Lance Storybook sur `http://localhost:6006` |
| `pnpm lint` | Vérifie le code avec ESLint |
| `pnpm format` | Formate le code avec Prettier |

## À venir

Liste des chantiers restant à mettre en place pour cette version de démo :

- [ ] Page « À propos » expliquant le fonctionnement du site : le mode démo, les différents scénarios disponibles, et le fait de pouvoir tester toutes les fonctionnalités (création de thème, envoi de photos, vote...) sans aucun risque puisque rien n'est jamais réellement persisté ni partagé.

