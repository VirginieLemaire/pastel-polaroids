import { DAY_MS } from "@/shared/utils/dateUtils";
import type { Contest, ContestStatus } from "./types";

export const formatDate = (iso: string | number) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

/** Date de fin de la phase courante (soumission, vote) ou de fin du concours. */
export const getPhaseEndDate = (
  contest: Omit<Contest, "photos">,
  status: ContestStatus
): number => {
  const createdAt = new Date(contest.createdAt).getTime();
  const voteBegins = createdAt + contest.submissionDays * DAY_MS;
  const voteEnd = voteBegins + contest.voteDays * DAY_MS;
  return status === "submission" ? voteBegins : voteEnd;
};

export const getNextStepText = (contest: Omit<Contest, 'photos'>, status: ContestStatus): string => {
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

/** Construit le titre et le texte du partage selon le statut du concours. */
export const buildShareText = (
  contest: Omit<Contest, "photos">,
  status: ContestStatus
): { title: string; text: string } => {
  const endDate = formatDate(getPhaseEndDate(contest, status));

  const lines: Record<ContestStatus, string> = {
    submission: `Concours en cours, viens poster tes soumissions pour le thème « ${contest.name} » avant le ${endDate} !`,
    vote: `Viens voter pour les photos du concours « ${contest.name} » avant le ${endDate} !`,
    closed: `Le concours « ${contest.name} » est terminé, viens découvrir les photos gagnantes !`,
  };

  const text = contest.description
    ? `${lines[status]}\n${contest.description}`
    : lines[status];

  return { title: `Concours photo : ${contest.name}`, text };
};


export const statusCorrespondingActionText: Record<ContestStatus, string> = {
  submission: "Soumettre une photo",
  vote: "Voter",
  closed: "Voir les photos"
};
