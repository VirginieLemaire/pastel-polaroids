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

// Votes pour "one-active-vote" : votes pour mock-1 UNIQUEMENT
// user-1 (auteur de photo-1 et photo-3) vote pour photo-2 (user-2)
// user-2 (auteur de photo-2) vote pour photo-1 et photo-3 (user-1)
const oneActiveVoteVotes: Vote[] = [
  // user-1 vote pour photo-2
  { id: "vote-1", photoId: "photo-2", contestId: "mock-1", voterId: "user-1", rating: 4, createdAt: iso(2), updatedAt: iso(2) },
  // user-2 vote pour photo-1
  { id: "vote-2", photoId: "photo-1", contestId: "mock-1", voterId: "user-2", rating: 5, createdAt: iso(1), updatedAt: iso(1) },
  // user-2 vote pour photo-3
  { id: "vote-3", photoId: "photo-3", contestId: "mock-1", voterId: "user-2", rating: 3, createdAt: iso(3), updatedAt: iso(3) },
];

// Votes pour "one-active-rest-closed" : votes pour mock-1 (actif) + mock-2 (fermé)
// mock-1 : user-1 vote pour photo-2; user-2 vote pour photo-1, photo-3
// mock-2 : user-1 vote pour photo-4, photo-6, photo-7, photo-9
//         user-2 vote pour photo-5, photo-6, photo-8, photo-9
//         user-3 vote pour photo-4, photo-5, photo-7, photo-8
const oneActiveRestClosedVotes: Vote[] = [
  ...oneActiveVoteVotes,
  // mock-2 : user-1 votes (pas pour ses photos 5,8)
  { id: "vote-4", photoId: "photo-4", contestId: "mock-2", voterId: "user-1", rating: 4, createdAt: iso(10), updatedAt: iso(10) },
  { id: "vote-5", photoId: "photo-6", contestId: "mock-2", voterId: "user-1", rating: 5, createdAt: iso(11), updatedAt: iso(11) },
  { id: "vote-6", photoId: "photo-7", contestId: "mock-2", voterId: "user-1", rating: 3, createdAt: iso(12), updatedAt: iso(12) },
  { id: "vote-7", photoId: "photo-9", contestId: "mock-2", voterId: "user-1", rating: 4, createdAt: iso(13), updatedAt: iso(13) },
  // mock-2 : user-2 votes (pas pour ses photos 4,7)
  { id: "vote-8", photoId: "photo-5", contestId: "mock-2", voterId: "user-2", rating: 5, createdAt: iso(14), updatedAt: iso(14) },
  { id: "vote-9", photoId: "photo-6", contestId: "mock-2", voterId: "user-2", rating: 4, createdAt: iso(15), updatedAt: iso(15) },
  { id: "vote-10", photoId: "photo-8", contestId: "mock-2", voterId: "user-2", rating: 5, createdAt: iso(16), updatedAt: iso(16) },
  { id: "vote-11", photoId: "photo-9", contestId: "mock-2", voterId: "user-2", rating: 3, createdAt: iso(17), updatedAt: iso(17) },
  // mock-2 : user-3 votes (pas pour ses photos 6,9)
  { id: "vote-12", photoId: "photo-4", contestId: "mock-2", voterId: "user-3", rating: 4, createdAt: iso(18), updatedAt: iso(18) },
  { id: "vote-13", photoId: "photo-5", contestId: "mock-2", voterId: "user-3", rating: 5, createdAt: iso(19), updatedAt: iso(19) },
  { id: "vote-14", photoId: "photo-7", contestId: "mock-2", voterId: "user-3", rating: 2, createdAt: iso(20), updatedAt: iso(20) },
  { id: "vote-15", photoId: "photo-8", contestId: "mock-2", voterId: "user-3", rating: 4, createdAt: iso(21), updatedAt: iso(21) },
];

// Votes pour "all-closed" : votes pour mock-1, mock-2, mock-3
// mock-3 : user-1 vote pour photo-11, photo-12, photo-14, photo-15
//         user-2 vote pour photo-10, photo-12, photo-13, photo-15
//         user-3 vote pour photo-10, photo-11, photo-13, photo-14
const allClosedVotes: Vote[] = [
  ...oneActiveRestClosedVotes,
  // mock-3 : user-1 votes (pas pour ses photos 10,13)
  { id: "vote-16", photoId: "photo-11", contestId: "mock-3", voterId: "user-1", rating: 5, createdAt: iso(25), updatedAt: iso(25) },
  { id: "vote-17", photoId: "photo-12", contestId: "mock-3", voterId: "user-1", rating: 4, createdAt: iso(24), updatedAt: iso(24) },
  { id: "vote-18", photoId: "photo-14", contestId: "mock-3", voterId: "user-1", rating: 3, createdAt: iso(23), updatedAt: iso(23) },
  { id: "vote-19", photoId: "photo-15", contestId: "mock-3", voterId: "user-1", rating: 5, createdAt: iso(22), updatedAt: iso(22) },
  // mock-3 : user-2 votes (pas pour ses photos 11,14)
  { id: "vote-20", photoId: "photo-10", contestId: "mock-3", voterId: "user-2", rating: 4, createdAt: iso(26), updatedAt: iso(26) },
  { id: "vote-21", photoId: "photo-12", contestId: "mock-3", voterId: "user-2", rating: 5, createdAt: iso(27), updatedAt: iso(27) },
  { id: "vote-22", photoId: "photo-13", contestId: "mock-3", voterId: "user-2", rating: 3, createdAt: iso(28), updatedAt: iso(28) },
  { id: "vote-23", photoId: "photo-15", contestId: "mock-3", voterId: "user-2", rating: 4, createdAt: iso(29), updatedAt: iso(29) },
  // mock-3 : user-3 votes (pas pour ses photos 12,15)
  { id: "vote-24", photoId: "photo-10", contestId: "mock-3", voterId: "user-3", rating: 5, createdAt: iso(30), updatedAt: iso(30) },
  { id: "vote-25", photoId: "photo-11", contestId: "mock-3", voterId: "user-3", rating: 4, createdAt: iso(31), updatedAt: iso(31) },
  { id: "vote-26", photoId: "photo-13", contestId: "mock-3", voterId: "user-3", rating: 5, createdAt: iso(32), updatedAt: iso(32) },
  { id: "vote-27", photoId: "photo-14", contestId: "mock-3", voterId: "user-3", rating: 3, createdAt: iso(33), updatedAt: iso(33) },
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
