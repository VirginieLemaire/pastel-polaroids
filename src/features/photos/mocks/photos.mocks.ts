import type { Photo } from "../types";

export const defaultPhotos: Photo[] = [
  {
    id: "photo-1",
    contestId: "mock-1",
    authorId: "user-1",
    title: "Coucher de soleil à la plage",
    description: "Dernier soir des vacances, lumière dorée.",
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "photo-2",
    contestId: "mock-1",
    authorId: "user-other",
    title: "Pique-nique en montagne",
    imageUrl:
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1200&auto=format&fit=crop",
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "photo-3",
    contestId: "mock-1",
    authorId: "user-1",
    title: "Baignade au lac",
    description: "Les enfants n'ont jamais voulu sortir de l'eau.",
    imageUrl:
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1200&auto=format&fit=crop",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];
