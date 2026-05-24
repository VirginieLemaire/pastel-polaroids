import type { Contest } from "./types";

export const canEditContest = (contest: Contest, userId: string): boolean =>
  contest.authorId === userId;
