import { z } from "zod";

export const ratingSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

export const castVoteSchema = z.object({
  photoId: z.string().min(1),
  contestId: z.string().min(1),
  rating: ratingSchema,
});
