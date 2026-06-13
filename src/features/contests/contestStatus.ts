import { PastelColor } from "@/shared/ui/types";
import { DAY_MS } from "@/shared/utils/constants";
import type { Contest } from "@/features/contests";
import type { ContestStatus } from "@/features/contests";

export const STATUS_LABEL: Record<ContestStatus, string> = {
  submission: "Soumission",
  vote: "Vote",
  closed: "Clos",
};

export const STATUS_COLOR: Record<ContestStatus, PastelColor> = {
  submission: "mint",
  vote: "sky",
  closed: "lavender",
};

export const getContestStatus = (contest: Contest, now: Date = new Date()): ContestStatus => {
  const start = new Date(contest.createdAt).getTime();
  const voteBegins = start + contest.submissionDays * DAY_MS;
  const voteEnd = voteBegins + contest.voteDays * DAY_MS;
  const currentDate = Number(now.getTime());
  
  if (currentDate < voteBegins) return "submission";
  if (currentDate <= voteEnd) return "vote";
  return "closed";
};
