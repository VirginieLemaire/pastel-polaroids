import { isoDaysAgo } from "@/shared/utils/dateUtils";
import type { Vote } from "../types";

// Notes attribuées par les autres utilisateurs (user-2, user-3) sur les photos
// existantes — user-1 n'a encore rien voté pour pouvoir tester l'UI.
export const defaultVotes: Vote[] = [
  // contest mock-1
  { id: "vote-1", photoId: "photo-1", contestId: "mock-1", voterId: "user-2", rating: 4, createdAt: isoDaysAgo(1), updatedAt: isoDaysAgo(1) },
  { id: "vote-2", photoId: "photo-1", contestId: "mock-1", voterId: "user-3", rating: 5, createdAt: isoDaysAgo(1), updatedAt: isoDaysAgo(1) },
  { id: "vote-3", photoId: "photo-2", contestId: "mock-1", voterId: "user-1", rating: 3, createdAt: isoDaysAgo(1), updatedAt: isoDaysAgo(1) },
  { id: "vote-4", photoId: "photo-2", contestId: "mock-1", voterId: "user-3", rating: 2, createdAt: isoDaysAgo(1), updatedAt: isoDaysAgo(1) },
  { id: "vote-5", photoId: "photo-3", contestId: "mock-1", voterId: "user-2", rating: 5, createdAt: isoDaysAgo(1), updatedAt: isoDaysAgo(1) },
  { id: "vote-6", photoId: "photo-3", contestId: "mock-1", voterId: "user-3", rating: 4, createdAt: isoDaysAgo(1), updatedAt: isoDaysAgo(1) },
  // contest mock-2
  { id: "vote-7", photoId: "photo-4", contestId: "mock-2", voterId: "user-1", rating: 3, createdAt: isoDaysAgo(1), updatedAt: isoDaysAgo(1) },
  { id: "vote-8", photoId: "photo-4", contestId: "mock-2", voterId: "user-3", rating: 4, createdAt: isoDaysAgo(1), updatedAt: isoDaysAgo(1) },
  { id: "vote-9", photoId: "photo-5", contestId: "mock-2", voterId: "user-2", rating: 5, createdAt: isoDaysAgo(1), updatedAt: isoDaysAgo(1) },
  { id: "vote-10", photoId: "photo-5", contestId: "mock-2", voterId: "user-3", rating: 5, createdAt: isoDaysAgo(1), updatedAt: isoDaysAgo(1) },
];
