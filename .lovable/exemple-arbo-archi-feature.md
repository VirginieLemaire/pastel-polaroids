# Exemple d'arborescence d'une architecture par fonctionnalité

src/
├── features/
│   ├── user/
│   │   ├── components/
│   │   │   ├── Avatar.tsx        <-- Si l'avatar est lié à l'utilisateur
│   │   │   └── UserProfile.tsx
│   │   └── types.ts
│   └── concours/
│       ├── types/
│       │   └── status.ts         <-- Les statuts ici (ou dans shared/types si vraiment générique)
│       ├── components/
│       │   └── StatusBadge.tsx
│       └── hooks/
│           └── useConcoursStatus.ts
├── shared/
│   ├── ui/
│   │   ├── Avatar.tsx            <-- Si c'est un composant générique utilisé partout (ex: pour les commentaires, les users, les concours)
│   │   └── Button.tsx
│   └── utils/
│       ├── dicebear.ts           <-- La logique pure d'appel à l'API Dicebear
│       └── date.ts               <-- Autres utilitaires génériques
├── lib/                          <-- Garder pour les wrappers de libs tierces ou utilitaires très bas niveau
│   ├── api.ts
│   └── storage.ts