import type { Contest } from "@/context/ContestContext";
import { allClosed, noContests, oneActiveRestClosed, oneActiveSubmissionOnly, oneActiveVoteOnly } from "./mockDatas";

export interface MockScenario {
  id: string;
  label: string;
  description: string;
  contests: Contest[];
}

export const MOCK_SCENARIOS: MockScenario[] = [
  {
    id: "empty",
    label: "Aucun thème",
    description: "État initial, aucun concours.",
    contests: noContests,
  },
  {
    id: "one-active-submission",
    label: "1 thème actif en soumission",
    description: "Un seul concours en phase de soumission.",
    contests: oneActiveSubmissionOnly,
  },
  {
    id: "one-active-vote",
    label: "1 thème actif en vote",
    description: "Un seul concours en phase de vote.",
    contests: oneActiveVoteOnly,
  },
  {
    id: "one-active-rest-closed",
    label: "1 thème actif, les autres fermés",
    description: "Un concours en cours, au moins 1 autre existant.",
    contests: oneActiveRestClosed,
  },
  {
    id: "all-closed",
    label: "Tout fermé",
    description: "Tous les concours sont terminés, donc aucun en cours.",
    contests: allClosed,
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
