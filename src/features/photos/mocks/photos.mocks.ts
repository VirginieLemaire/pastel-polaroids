import { isoDaysAgo } from "@/shared/utils/dateUtils";
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
    createdAt: isoDaysAgo(1),
  },
  {
    id: "photo-2",
    contestId: "mock-1",
    authorId: "user-2",
    title: "Pique-nique en montagne",
    imageUrl:
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1200&auto=format&fit=crop",
    createdAt: isoDaysAgo(1)
  },
  {
    id: "photo-3",
    contestId: "mock-1",
    authorId: "user-1",
    title: "Baignade au lac",
    description: "Les enfants n'ont jamais voulu sortir de l'eau.",
    imageUrl:
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1200&auto=format&fit=crop",
    createdAt: isoDaysAgo(1)
  },
  {
    id: "photo-4",
    contestId: "mock-2",
    authorId: "user-2",
    title: "Un sapin à travers un sapin",
    imageUrl:
      "https://images.unsplash.com/photo-1514377006585-6e7975371bd6?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    createdAt: isoDaysAgo(1)
  },
  {
    id: "photo-5",
    contestId: "mock-2",
    authorId: "user-1",
    title: "Cadeaux !",
    description: "Les cadeaux emballés dans du papier kraft sont si beaux",
    imageUrl:
      "https://images.unsplash.com/photo-1545608444-f045a6db6133?q=80&w=1473&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    createdAt: isoDaysAgo(1)
  },
  {
    id: "photo-6",
    contestId: "mock-2",
    authorId: "user-3",
    title: "Décorations de Noël",
    description: "Guirlandes et bougies pour une ambiance chaleureuse",
    imageUrl:
      "https://images.unsplash.com/photo-1577025728734-7ec67bdb97d0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bm8lQzMlQUJsJTIwYm91Z2llc3xlbnwwfHwwfHx8Mg%3D%3D&auto=format&fit=crop",
    createdAt: isoDaysAgo(1)
  },
  {
    id: "photo-7",
    contestId: "mock-2",
    authorId: "user-2",
    title: "Neige sur les toits",
    imageUrl:
      "https://images.unsplash.com/photo-1610988430894-a917eecf7432?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop",
    createdAt: isoDaysAgo(1)
  },
  {
    id: "photo-8",
    contestId: "mock-2",
    authorId: "user-1",
    title: "Feu de cheminée",
    description: "Un moment paisible devant les flammes",
    imageUrl:
      "https://images.unsplash.com/photo-1696814543693-31fcf942ccb7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop",
    createdAt: isoDaysAgo(1)
  },
  {
    id: "photo-9",
    contestId: "mock-2",
    authorId: "user-3",
    title: "Marché de Noël",
    description: "Des couleurs vives sous les lumières de fête",
    imageUrl:
      "https://images.unsplash.com/photo-1575659458448-27b1d2836de2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop",
    createdAt: isoDaysAgo(1)
  },
  {
    id: "photo-10",
    contestId: "mock-3",
    authorId: "user-1",
    title: "Le cadeau apporté par Sophie",
    description: "C'est si joli dans ses petites mains",
    imageUrl:
      "https://images.unsplash.com/photo-1590538141485-2790d32fc62a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop",
    createdAt: isoDaysAgo(1)
  },
  {
    id: "photo-11",
    contestId: "mock-3",
    authorId: "user-2",
    title: "Ballons d'anniversaire",
    imageUrl:
      "https://images.unsplash.com/photo-1509909756405-be0199881695?q=80&w=1470&auto=format&fit=crop",
    createdAt: isoDaysAgo(1)
  },
  {
    id: "photo-12",
    contestId: "mock-3",
    authorId: "user-3",
    title: "Décos de gâteaux",
    description: "Préparés par Wendy",
    imageUrl:
      "https://images.unsplash.com/photo-1578922864601-79dcc7cbcea9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGFubml2ZXJzYWlyZSUyMG1hbWllfGVufDB8fDB8fHwy&auto=format&fit=crop",
    createdAt: isoDaysAgo(1)
  },
  {
    id: "photo-13",
    contestId: "mock-3",
    authorId: "user-1",
    title: "Banderole",
    imageUrl:
      "https://images.unsplash.com/photo-1622107795650-24e72a695404?q=80&w=1473&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop",
    createdAt: isoDaysAgo(1),
  },
  {
    id: "photo-14",
    contestId: "mock-3",
    authorId: "user-2",
    title: "Lumières",
    description: "Les guirlandes scintillent à la nuit tombée",
    imageUrl:
      "https://images.unsplash.com/photo-1717829025763-13fb9e652b99?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop",
    createdAt: isoDaysAgo(1)
  },
  {
    id: "photo-15",
    contestId: "mock-3",
    authorId: "user-3",
    title: "bon anniversaire",
    description: "Le papier cadeau ^^",
    imageUrl:
      "https://images.unsplash.com/photo-1759523350278-b8f653dc68da?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop",
    createdAt: isoDaysAgo(1)
  },
];
