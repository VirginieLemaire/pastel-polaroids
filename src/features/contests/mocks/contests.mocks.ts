import { DAY_MS, type Contest } from "@/features/contests";

export const noContests: Contest[] = [];

export const oneActiveSubmissionOnly: Contest[] = [
  {
    id: "mock-1",
    name: "Vacances d'été",
    description: "Les meilleurs souvenirs de l'été en famille.",
    coverImage: "https://images.unsplash.com/photo-1564419431636-fe02f0eff7aa?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    createdAt: new Date(Date.now() - 1 * DAY_MS).toISOString(),
    submissionDays: 7,
    voteDays: 3,
    authorId: "user-1",
    photos: [],
  },
];

export const oneActiveVoteOnly: Contest[] = [
  {
    id: "mock-1",
    name: "Vacances d'été",
    description: "Les meilleurs souvenirs de l'été en famille.",
    coverImage: "https://images.unsplash.com/photo-1564419431636-fe02f0eff7aa?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    createdAt: new Date(Date.now() - 7 * DAY_MS).toISOString(),
    submissionDays: 7,
    voteDays: 3,
    authorId: "user-1",
    photos: [],
  },
];

export const oneActiveRestClosed: Contest[] = [
  {
    id: "mock-1",
    name: "Vacances d'été",
    description: "Les meilleurs souvenirs de l'été en famille.",
    coverImage: "https://images.unsplash.com/photo-1564419431636-fe02f0eff7aa?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    createdAt: new Date(Date.now() - 1 * DAY_MS).toISOString(),
    submissionDays: 7,
    voteDays: 3,
    authorId: "user-1",
    photos: [],
  },
  {
    id: "mock-2",
    name: "Noël 2025",
    description: "Photos de Noël en famille.",
    coverImage: undefined,
    createdAt: new Date(Date.now() - 30 * DAY_MS).toISOString(),
    submissionDays: 5,
    voteDays: 2,
    authorId: "user-2",
    photos: [],
  },
  {
    id: "mock-3",
    name: "Anniversaire de Mamie",
    description: "Souvenirs des 80 ans de Mamie.",
    coverImage: undefined,
    createdAt: new Date(Date.now() - 60 * DAY_MS).toISOString(),
    submissionDays: 4,
    voteDays: 3,
    authorId: "user-3",
    photos: [],
  },
];

export const allClosed: Contest[] = [
  {
    id: "mock-1",
    name: "Vacances d'été",
    description: "Les meilleurs souvenirs de l'été en famille.",
    coverImage: "https://images.unsplash.com/photo-1564419431636-fe02f0eff7aa?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    createdAt: new Date(Date.now() - 30 * DAY_MS).toISOString(),
    submissionDays: 7,
    voteDays: 3,
    authorId: "user-1",
    photos: [],
  },
  {
    id: "mock-2",
    name: "Noël 2025",
    description: "Photos de Noël en famille.",
    coverImage: "https://images.unsplash.com/photo-1545048702-79362596cdc9?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    createdAt: new Date(Date.now() - 50 * DAY_MS).toISOString(),
    submissionDays: 5,
    voteDays: 2,
    authorId: "user-2",
    photos: [],
  },
  {
    id: "mock-3",
    name: "Anniversaire de Mamie",
    description: "Souvenirs des 80 ans de Mamie.",
    coverImage: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    createdAt: new Date(Date.now() - 70 * DAY_MS).toISOString(),
    submissionDays: 4,
    voteDays: 3,
    authorId: "user-3",
    photos: [],
  },
];
