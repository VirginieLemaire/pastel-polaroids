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
  {
    id: "photo-4",
    contestId: "mock-2",
    authorId: "user-other",
    title: "Un sapin à travers un sapin",
    imageUrl:
      "https://images.unsplash.com/photo-1514377006585-6e7975371bd6?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "photo-5",
    contestId: "mock-2",
    authorId: "user-1",
    title: "Cadeaux !",
    description: "Les cadeaux emballés dans du papier kraft sont si beaux",
    imageUrl:
      "https://images.unsplash.com/photo-1545608444-f045a6db6133?q=80&w=1473&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];
