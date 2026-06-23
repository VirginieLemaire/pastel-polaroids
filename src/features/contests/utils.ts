import { DAY_MS } from "@/shared/utils/dateUtils";
import type { Contest, ContestStatus } from "./types";

export const formatDate = (iso: string | number) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export const getNextStepText = (contest: Contest, status: ContestStatus): string => {
  const createdAt = new Date(contest.createdAt).getTime();
  const voteBegins = createdAt + contest.submissionDays * DAY_MS;
  const voteEnd = voteBegins + contest.voteDays * DAY_MS;

  switch (status) {
    case "submission":
      return `Prochaine étape : début des votes le ${formatDate(voteBegins)}`;
    case "vote":
      return `Prochaine étape : résultats le ${formatDate(voteEnd)}`;
    case "closed":
      return `Concours terminé le ${formatDate(voteEnd)}`;
    default:
      return "";
  }
};

export const statusCorrespondingActionText: Record<ContestStatus, string> = {
  submission: "Soumettre une photo",
  vote: "Voter",
  closed: "Voir les photos"
};
