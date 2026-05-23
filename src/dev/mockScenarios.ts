import type { Contest } from "@/context/ContestContext";

const DAY = 24 * 60 * 60 * 1000;

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
    contests: [],
  },
  {
    id: "single-active",
    label: "1 thème actif",
    description: "Un seul concours en phase de soumission.",
    contests: [
      {
        id: "mock-single",
        name: "Vacances d'été",
        description: "Les meilleurs souvenirs de l'été en famille.",
        coverImage: undefined,
        createdAt: new Date(Date.now() - 1 * DAY).toISOString(),
        submissionDays: 7,
        voteDays: 3,
        photos: [],
      },
    ],
  },
  {
    id: "multiple",
    label: "Plusieurs thèmes",
    description: "Un thème actif + anciens thèmes fermés.",
    contests: [
      {
        id: "mock-1",
        name: "Vacances d'été",
        description: "Les meilleurs souvenirs de l'été en famille.",
        coverImage: undefined,
        createdAt: new Date(Date.now() - 1 * DAY).toISOString(),
        submissionDays: 7,
        voteDays: 3,
        photos: [],
      },
      {
        id: "mock-2",
        name: "Noël 2025",
        description: "Photos de Noël en famille.",
        coverImage: undefined,
        createdAt: new Date(Date.now() - 30 * DAY).toISOString(),
        submissionDays: 5,
        voteDays: 2,
        photos: [],
      },
      {
        id: "mock-3",
        name: "Anniversaire de Mamie",
        description: "Souvenirs des 80 ans de Mamie.",
        coverImage: undefined,
        createdAt: new Date(Date.now() - 60 * DAY).toISOString(),
        submissionDays: 4,
        voteDays: 3,
        photos: [],
      },
    ],
  },
  {
    id: "voting",
    label: "Thème en vote",
    description: "Soumission terminée, vote en cours.",
    contests: [
      {
        id: "mock-voting",
        name: "Sortie au parc",
        description: "Phase de vote en cours.",
        coverImage: undefined,
        createdAt: new Date(Date.now() - 8 * DAY).toISOString(),
        submissionDays: 7,
        voteDays: 3,
        photos: [],
      },
    ],
  },
  {
    id: "all-closed",
    label: "Tout fermé",
    description: "Tous les concours sont terminés.",
    contests: [
      {
        id: "closed-1",
        name: "Pâques 2024",
        coverImage: undefined,
        createdAt: new Date(Date.now() - 200 * DAY).toISOString(),
        submissionDays: 5,
        voteDays: 2,
        photos: [],
      },
      {
        id: "closed-2",
        name: "Halloween 2024",
        coverImage: undefined,
        createdAt: new Date(Date.now() - 150 * DAY).toISOString(),
        submissionDays: 4,
        voteDays: 2,
        photos: [],
      },
    ],
  },
];

export const DEFAULT_SCENARIO_ID = "multiple";
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
