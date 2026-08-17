import { isoDaysAgo } from "@/shared/utils/dateUtils";
import type { Contest } from "@/features/contests";

/**
 * Source unique des thèmes de démonstration : le contenu (titre, description,
 * image, auteur, durées) est défini une seule fois. Les scénarios ne font que
 * déplacer la date de création pour placer chaque thème dans la phase voulue
 * (le statut n'est jamais stocké, il est toujours calculé).
 */
const baseContests = {
  "mock-1": {
    id: "mock-1",
    name: "Vacances d'été",
    description: "Les meilleurs souvenirs de l'été en famille.",
    coverImage:
      "https://images.unsplash.com/photo-1564419431636-fe02f0eff7aa?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    submissionDays: 7,
    voteDays: 3,
    authorId: "user-1",
    photos: [],
  },
  "mock-2": {
    id: "mock-2",
    name: "Noël 2025",
    description: "Photos de Noël en famille.",
    coverImage:
      "https://images.unsplash.com/photo-1545048702-79362596cdc9?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    submissionDays: 5,
    voteDays: 2,
    authorId: "user-2",
    photos: [],
  },
  "mock-3": {
    id: "mock-3",
    name: "Anniversaire de Mamie",
    description: "Souvenirs des 80 ans de Mamie.",
    coverImage:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    submissionDays: 4,
    voteDays: 3,
    authorId: "user-3",
    photos: [],
  },
} as const satisfies Record<string, Omit<Contest, "createdAt">>;

type MockContestId = keyof typeof baseContests;

/** Construit un thème de démo daté pour tomber dans la phase souhaitée. */
const buildContest = (id: MockContestId, createdDaysAgo: number): Contest => ({
  ...baseContests[id],
  photos: [],
  createdAt: isoDaysAgo(createdDaysAgo),
});

export const noContests: Contest[] = [];

export const oneActiveSubmissionOnly: Contest[] = [buildContest("mock-1", 1)];

export const oneActiveVoteOnly: Contest[] = [buildContest("mock-1", 8)];

export const oneActiveRestClosed: Contest[] = [
  buildContest("mock-1", 1),
  buildContest("mock-2", 30),
  buildContest("mock-3", 60),
];

export const allClosed: Contest[] = [
  buildContest("mock-1", 30),
  buildContest("mock-2", 50),
  buildContest("mock-3", 70),
];
