import type { Contest } from "@/features/contests";
import type { Vote } from "@/features/votes/types";
import {
  allClosed,
  noContests,
  oneActiveRestClosed,
  oneActiveSubmissionOnly,
  oneActiveVoteOnly,
} from "@/features/contests/mocks/contests.mocks";

export interface MockScenario {
  id: string;
  label: string;
  description: string;
  contests: Contest[];
  votes: Vote[];
}

/**
 * Helper pour créer des timestamps cohérents
 */
const iso = (daysAgo: number) => new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

// Votes pour chaque scénario
const emptyVotes: Vote[] = [];

// Votes pour "one-active-submission" : aucun vote (phase de soumission)
const oneActiveSubmissionVotes: Vote[] = [];

// Votes pour "one-active-vote" : votes par user-2 et user-3 UNIQUEMENT
// (user-1 = Camille ne vote pas pour pouvoir tester le vote en dev)
const oneActiveVoteVotes: Vote[] = [
  // Photo 1 de mock-1
  { id: "vote-1", photoId: "photo-1", contestId: "mock-1", voterId: "user-2", rating: 4, createdAt: iso(2), updatedAt: iso(2) },
  { id: "vote-2", photoId: "photo-1", contestId: "mock-1", voterId: "user-3", rating: 5, createdAt: iso(1), updatedAt: iso(1) },
  // Photo 2 de mock-1
  { id: "vote-3", photoId: "photo-2", contestId: "mock-1", voterId: "user-2", rating: 3, createdAt: iso(3), updatedAt: iso(3) },
  { id: "vote-4", photoId: "photo-2", contestId: "mock-1", voterId: "user-3", rating: 5, createdAt: iso(2), updatedAt: iso(2) },
  // Photo 3 de mock-1
  { id: "vote-5", photoId: "photo-3", contestId: "mock-1", voterId: "user-2", rating: 4, createdAt: iso(4), updatedAt: iso(4) },
  { id: "vote-6", photoId: "photo-3", contestId: "mock-1", voterId: "user-3", rating: 5, createdAt: iso(1), updatedAt: iso(1) },
];

// Votes pour "one-active-rest-closed" : votes pour mock-1 (actif) + mock-2 (fermé)
const oneActiveRestClosedVotes: Vote[] = [
  ...oneActiveVoteVotes,
  // Votes pour mock-2 (photos 4 et 5)
  { id: "vote-7", photoId: "photo-4", contestId: "mock-2", voterId: "user-1", rating: 4, createdAt: iso(10), updatedAt: iso(10) },
  { id: "vote-8", photoId: "photo-4", contestId: "mock-2", voterId: "user-2", rating: 5, createdAt: iso(11), updatedAt: iso(11) },
  { id: "vote-9", photoId: "photo-4", contestId: "mock-2", voterId: "user-3", rating: 3, createdAt: iso(12), updatedAt: iso(12) },
  { id: "vote-10", photoId: "photo-5", contestId: "mock-2", voterId: "user-1", rating: 5, createdAt: iso(13), updatedAt: iso(13) },
  { id: "vote-11", photoId: "photo-5", contestId: "mock-2", voterId: "user-2", rating: 4, createdAt: iso(14), updatedAt: iso(14) },
  { id: "vote-12", photoId: "photo-5", contestId: "mock-2", voterId: "user-3", rating: 5, createdAt: iso(15), updatedAt: iso(15) },
];

// Votes pour "all-closed" : votes pour mock-1, mock-2, mock-3
const allClosedVotes: Vote[] = [
  ...oneActiveRestClosedVotes,
];

export const MOCK_SCENARIOS: MockScenario[] = [
  {
    id: "empty",
    label: "Aucun thème",
    description: "État initial, aucun concours.",
    contests: noContests,
    votes: emptyVotes,
  },
  {
    id: "one-active-submission",
    label: "1 thème actif en soumission",
    description: "Un seul concours en phase de soumission.",
    contests: oneActiveSubmissionOnly,
    votes: oneActiveSubmissionVotes,
  },
  {
    id: "one-active-vote",
    label: "1 thème actif en vote",
    description: "Un seul concours en phase de vote.",
    contests: oneActiveVoteOnly,
    votes: oneActiveVoteVotes,
  },
  {
    id: "one-active-rest-closed",
    label: "1 thème actif, les autres fermés",
    description: "Un concours en cours, au moins 1 autre existant.",
    contests: oneActiveRestClosed,
    votes: oneActiveRestClosedVotes,
  },
  {
    id: "all-closed",
    label: "Tout fermé",
    description: "Tous les concours sont terminés, donc aucun en cours.",
    contests: allClosed,
    votes: allClosedVotes,
  },
];

export const DEFAULT_SCENARIO_ID = "one-active-rest-closed";
const STORAGE_KEY = "dev:mockScenario";

export const getStoredScenarioId = (): string => {
  if (typeof window === "undefined") return DEFAULT_SCENARIO_ID;
  return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_SCENARIO_ID;
};

export const setStoredScenarioId = (id: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, id);
};

export const getScenarioById = (id: string): MockScenario =>
  MOCK_SCENARIOS.find((s) => s.id === id) ??
  MOCK_SCENARIOS.find((s) => s.id === DEFAULT_SCENARIO_ID)!;
