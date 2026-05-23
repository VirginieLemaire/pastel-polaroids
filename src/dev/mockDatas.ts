import { Contest } from '@/context/ContestContext';

const DAY = 24 * 60 * 60 * 1000;

export const noContests = [];

export const oneActiveSubmissionOnly: Contest[] = [
  {
    id: "mock-1",
    name: "Vacances d'été",
    description: "Les meilleurs souvenirs de l'été en famille.",
    coverImage: undefined,
    createdAt: new Date(Date.now() - 1 * DAY).toISOString(),
    submissionDays: 7,
    voteDays: 3,
    photos: [],
  }
];

export const oneActiveVoteOnly: Contest[] = [
  {
    id: "mock-1",
    name: "Vacances d'été",
    description: "Les meilleurs souvenirs de l'été en famille.",
    coverImage: undefined,
    createdAt: new Date(Date.now() - 7 * DAY).toISOString(),
    submissionDays: 7,
    voteDays: 3,
    photos: [],
  }
];

export const oneActiveRestClosed: Contest[] = [
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
];

export const allClosed: Contest[] = [
  {
    id: "mock-1",
    name: "Vacances d'été",
    description: "Les meilleurs souvenirs de l'été en famille.",
    coverImage: undefined,
    createdAt: new Date(Date.now() - 30 * DAY).toISOString(),
    submissionDays: 7,
    voteDays: 3,
    photos: [],
  },
  {
    id: "mock-2",
    name: "Noël 2025",
    description: "Photos de Noël en famille.",
    coverImage: undefined,
    createdAt: new Date(Date.now() - 50 * DAY).toISOString(),
    submissionDays: 5,
    voteDays: 2,
    photos: [],
  },
  {
    id: "mock-3",
    name: "Anniversaire de Mamie",
    description: "Souvenirs des 80 ans de Mamie.",
    coverImage: undefined,
    createdAt: new Date(Date.now() - 70 * DAY).toISOString(),
    submissionDays: 4,
    voteDays: 3,
    photos: [],
  },
];