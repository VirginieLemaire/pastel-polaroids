import type { Contest } from "@/features/contests";

const DAY = 24 * 60 * 60 * 1000;
const ME = "user-1";
const OTHER = "user-other";

export const noContests: Contest[] = [];

export const oneActiveSubmissionOnly: Contest[] = [
  {
    id: "mock-1",
    name: "Vacances d'été",
    description: "Les meilleurs souvenirs de l'été en famille.",
    coverImage: undefined,
    createdAt: new Date(Date.now() - 1 * DAY).toISOString(),
    submissionDays: 7,
    voteDays: 3,
    authorId: ME,
    photos: [],
  },
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
    authorId: ME,
    photos: [],
  },
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
    authorId: ME,
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
    authorId: OTHER,
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
    authorId: ME,
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
    authorId: ME,
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
    authorId: OTHER,
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
    authorId: ME,
    photos: [],
  },
];
