import type { Contest } from "@/features/contests";
import type { Vote } from "@/features/votes/types";
import type { Photo } from "@/features/photos/types";
import { defaultVotes } from "@/features/votes/mocks/votes.mocks";
import { defaultPhotos } from "@/features/photos/mocks/photos.mocks";
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
  photos: Photo[];
  votes: Vote[];
}

/** Ne garde que les données rattachées aux thèmes présents dans le scénario. */
const contestIdsOf = (contests: Contest[]) => new Set(contests.map((c) => c.id));

const photosOf = (contests: Contest[]): Photo[] => {
  const ids = contestIdsOf(contests);
  return defaultPhotos.filter((p) => ids.has(p.contestId));
};

const votesOf = (contests: Contest[]): Vote[] => {
  const ids = contestIdsOf(contests);
  return defaultVotes.filter((v) => ids.has(v.contestId));
};

export const DEMO_SCENARIOS: IDemoScenario[] = [
  {
    id: "empty",
    label: "Aucun thème",
    description:
      "Point de départ : la page d'accueil propose de créer un thème via le formulaire.",
    contests: noContests,
    photos: [],
    votes: [],
  },
  {
    id: "one-active-submission",
    label: "Thème en phase de soumission",
    description:
      "Envoi de photos (3 maximum par personne), avec modification et suppression de ses propres photos.",
    contests: oneActiveSubmissionOnly,
    photos: photosOf(oneActiveSubmissionOnly),
    // Aucun vote possible pendant la phase de soumission
    votes: [],
  },
  {
    id: "one-active-vote",
    label: "Thème en phase de vote",
    description:
      "Notation de 1 à 5 étoiles, en anonymat total : aucun auteur ni note des autres n'est affiché.",
    contests: oneActiveVoteOnly,
    photos: photosOf(oneActiveVoteOnly),
    votes: votesOf(oneActiveVoteOnly),
  },
  {
    id: "one-active-rest-closed",
    label: "Un thème en cours + anciens thèmes",
    description:
      "Navigation entre le thème du moment et les thèmes déjà terminés depuis l'accueil.",
    contests: oneActiveRestClosed,
    photos: photosOf(oneActiveRestClosed),
    votes: votesOf(oneActiveRestClosed),
  },
  {
    id: "all-closed",
    label: "Tous les thèmes clos",
    description:
      "Résultats visibles : auteurs révélés, notes moyennes et photos gagnantes.",
    contests: allClosed,
    photos: photosOf(allClosed),
    votes: votesOf(allClosed),
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
