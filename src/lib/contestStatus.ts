import type { Contest } from "@/context/ContestContext";

export type ContestStatus = "submission" | "vote" | "closed";

export const STATUS_LABEL: Record<ContestStatus, string> = {
  submission: "Soumission",
  vote: "Vote",
  closed: "Clôturé",
};

export const STATUS_COLOR: Record<ContestStatus, string> = {
  submission: "bg-pastel-mint",
  vote: "bg-pastel-butter",
  closed: "bg-pastel-lavender",
};

const DAY_MS = 24 * 60 * 60 * 1000;

export const getContestStatus = (contest: Contest, now: Date = new Date()): ContestStatus => {
  const start = new Date(contest.createdAt).getTime();
  const submissionEnd = start + contest.submissionDays * DAY_MS;
  const voteEnd = submissionEnd + contest.voteDays * DAY_MS;
  const t = now.getTime();
  if (t < submissionEnd) return "submission";
  if (t < voteEnd) return "vote";
  return "closed";
};
