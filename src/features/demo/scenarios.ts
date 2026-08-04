import type { Contest } from "@/features/contests";
import type { Vote } from "@/features/votes/types";
import { isoDaysAgo } from "@/shared/utils/dateUtils";
import {
  allClosed,
  noContests,
  oneActiveRestClosed,
  oneActiveSubmissionOnly,
  oneActiveVoteOnly,
} from "@/features/contests/mocks/contests.mocks";

export interface IDemoScenario {
  id: string;
  label: string;
  /** Ce que le visiteur peut tester avec ce scénario. */
  description: string;
  contests: Contest[];
  votes: Vote[];
}

const emptyVotes: Vote[] = [];

// Phase de soumission : aucun vote possible
const oneActiveSubmissionVotes: Vote[] = [];

// Votes pour "one-active-vote" : votes pour mock-1 UNIQUEMENT
const oneActiveVoteVotes: Vote[] = [
  { id: "vote-1", photoId: "photo-2", contestId: "mock-1", voterId: "user-1", rating: 4, createdAt: isoDaysAgo(2), updatedAt: isoDaysAgo(2) },
  { id: "vote-2", photoId: "photo-1", contestId: "mock-1", voterId: "user-2", rating: 5, createdAt: isoDaysAgo(1), updatedAt: isoDaysAgo(1) },
  { id: "vote-3", photoId: "photo-3", contestId: "mock-1", voterId: "user-2", rating: 3, createdAt: isoDaysAgo(3), updatedAt: isoDaysAgo(3) },
];

// Votes pour "one-active-rest-closed" : mock-1 (actif) + mock-2 (clos)
const oneActiveRestClosedVotes: Vote[] = [
  ...oneActiveVoteVotes,
  { id: "vote-4", photoId: "photo-4", contestId: "mock-2", voterId: "user-1", rating: 4, createdAt: isoDaysAgo(10), updatedAt: isoDaysAgo(10) },
  { id: "vote-5", photoId: "photo-6", contestId: "mock-2", voterId: "user-1", rating: 5, createdAt: isoDaysAgo(11), updatedAt: isoDaysAgo(11) },
  { id: "vote-6", photoId: "photo-7", contestId: "mock-2", voterId: "user-1", rating: 3, createdAt: isoDaysAgo(12), updatedAt: isoDaysAgo(12) },
  { id: "vote-7", photoId: "photo-9", contestId: "mock-2", voterId: "user-1", rating: 4, createdAt: isoDaysAgo(13), updatedAt: isoDaysAgo(13) },
  { id: "vote-8", photoId: "photo-5", contestId: "mock-2", voterId: "user-2", rating: 5, createdAt: isoDaysAgo(14), updatedAt: isoDaysAgo(14) },
  { id: "vote-9", photoId: "photo-6", contestId: "mock-2", voterId: "user-2", rating: 4, createdAt: isoDaysAgo(15), updatedAt: isoDaysAgo(15) },
  { id: "vote-10", photoId: "photo-8", contestId: "mock-2", voterId: "user-2", rating: 5, createdAt: isoDaysAgo(16), updatedAt: isoDaysAgo(16) },
  { id: "vote-11", photoId: "photo-9", contestId: "mock-2", voterId: "user-2", rating: 3, createdAt: isoDaysAgo(17), updatedAt: isoDaysAgo(17) },
  { id: "vote-12", photoId: "photo-4", contestId: "mock-2", voterId: "user-3", rating: 4, createdAt: isoDaysAgo(18), updatedAt: isoDaysAgo(18) },
  { id: "vote-13", photoId: "photo-5", contestId: "mock-2", voterId: "user-3", rating: 5, createdAt: isoDaysAgo(19), updatedAt: isoDaysAgo(19) },
  { id: "vote-14", photoId: "photo-7", contestId: "mock-2", voterId: "user-3", rating: 2, createdAt: isoDaysAgo(20), updatedAt: isoDaysAgo(20) },
  { id: "vote-15", photoId: "photo-8", contestId: "mock-2", voterId: "user-3", rating: 4, createdAt: isoDaysAgo(21), updatedAt: isoDaysAgo(21) },
];

// Votes pour "all-closed" : mock-1, mock-2, mock-3
const allClosedVotes: Vote[] = [
  ...oneActiveRestClosedVotes,
  { id: "vote-16", photoId: "photo-11", contestId: "mock-3", voterId: "user-1", rating: 5, createdAt: isoDaysAgo(25), updatedAt: isoDaysAgo(25) },
  { id: "vote-17", photoId: "photo-12", contestId: "mock-3", voterId: "user-1", rating: 4, createdAt: isoDaysAgo(24), updatedAt: isoDaysAgo(24) },
  { id: "vote-18", photoId: "photo-14", contestId: "mock-3", voterId: "user-1", rating: 3, createdAt: isoDaysAgo(23), updatedAt: isoDaysAgo(23) },
  { id: "vote-19", photoId: "photo-15", contestId: "mock-3", voterId: "user-1", rating: 5, createdAt: isoDaysAgo(22), updatedAt: isoDaysAgo(22) },
  { id: "vote-20", photoId: "photo-10", contestId: "mock-3", voterId: "user-2", rating: 4, createdAt: isoDaysAgo(26), updatedAt: isoDaysAgo(26) },
  { id: "vote-21", photoId: "photo-12", contestId: "mock-3", voterId: "user-2", rating: 5, createdAt: isoDaysAgo(27), updatedAt: isoDaysAgo(27) },
  { id: "vote-22", photoId: "photo-13", contestId: "mock-3", voterId: "user-2", rating: 3, createdAt: isoDaysAgo(28), updatedAt: isoDaysAgo(28) },
  { id: "vote-23", photoId: "photo-15", contestId: "mock-3", voterId: "user-2", rating: 4, createdAt: isoDaysAgo(29), updatedAt: isoDaysAgo(29) },
  { id: "vote-24", photoId: "photo-10", contestId: "mock-3", voterId: "user-3", rating: 5, createdAt: isoDaysAgo(30), updatedAt: isoDaysAgo(30) },
  { id: "vote-25", photoId: "photo-11", contestId: "mock-3", voterId: "user-3", rating: 4, createdAt: isoDaysAgo(31), updatedAt: isoDaysAgo(31) },
  { id: "vote-26", photoId: "photo-13", contestId: "mock-3", voterId: "user-3", rating: 5, createdAt: isoDaysAgo(32), updatedAt: isoDaysAgo(32) },
  { id: "vote-27", photoId: "photo-14", contestId: "mock-3", voterId: "user-3", rating: 3, createdAt: isoDaysAgo(33), updatedAt: isoDaysAgo(33) },
];

export const DEMO_SCENARIOS: IDemoScenario[] = [
  {
    id: "empty",
    label: "Aucun thème",
    description:
      "Point de départ : la page d'accueil propose de créer un thème via le formulaire.",
    contests: noContests,
    votes: emptyVotes,
  },
  {
    id: "one-active-submission",
    label: "Thème en phase de soumission",
    description:
      "Envoi de photos (3 maximum par personne), avec modification et suppression de ses propres photos.",
    contests: oneActiveSubmissionOnly,
    votes: oneActiveSubmissionVotes,
  },
  {
    id: "one-active-vote",
    label: "Thème en phase de vote",
    description:
      "Notation de 1 à 5 étoiles, en anonymat total : aucun auteur ni note des autres n'est affiché.",
    contests: oneActiveVoteOnly,
    votes: oneActiveVoteVotes,
  },
  {
    id: "one-active-rest-closed",
    label: "Un thème en cours + anciens thèmes",
    description:
      "Navigation entre le thème du moment et les thèmes déjà terminés depuis l'accueil.",
    contests: oneActiveRestClosed,
    votes: oneActiveRestClosedVotes,
  },
  {
    id: "all-closed",
    label: "Tous les thèmes clos",
    description:
      "Résultats visibles : auteurs révélés, notes moyennes et photos gagnantes.",
    contests: allClosed,
    votes: allClosedVotes,
  },
];

export const DEFAULT_SCENARIO_ID = "one-active-rest-closed";

// Préférence d'interface uniquement (aucune donnée métier stockée)
const STORAGE_KEY = "demo:scenario";

export const getStoredScenarioId = (): string => {
  if (typeof window === "undefined") return DEFAULT_SCENARIO_ID;
  return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_SCENARIO_ID;
};

export const setStoredScenarioId = (id: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, id);
};

export const getScenarioById = (id: string): IDemoScenario =>
  DEMO_SCENARIOS.find((s) => s.id === id) ??
  DEMO_SCENARIOS.find((s) => s.id === DEFAULT_SCENARIO_ID)!;
