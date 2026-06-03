import { getContestStatus } from "./contestStatus";
import type { Contest } from "./types";

export const canEditContest = (contest: Contest, userId: string): boolean =>
  contest.authorId === userId && getContestStatus(contest) !== "closed";

export const canDeleteContest = (contest: Contest, userId: string): boolean =>
  contest.authorId === userId && getContestStatus(contest) !== "closed";
