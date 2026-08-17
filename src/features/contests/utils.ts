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

const FALLBACK_META_TITLE = "Détail du thème — Photo de Famille";
const FALLBACK_META_DESCRIPTION =
  "Découvrez le thème du concours en cours, sa phase, ses dates clés et le nombre de photos déjà soumises.";

/** Demande à Unsplash une variante recadrée au ratio recommandé pour og:image (1200x630). */
export const toOgImageUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "images.unsplash.com") return url;
    parsed.searchParams.set("w", "1200");
    parsed.searchParams.set("h", "630");
    parsed.searchParams.set("fit", "crop");
    return parsed.toString();
  } catch {
    return url;
  }
};

export interface ContestMeta {
  title: string;
  description: string;
  image?: string;
}

/** Balises de partage (titre/description/image) pour la page d'un thème, avec repli générique. */
export const buildContestMeta = (
  contest: Pick<Contest, "name" | "description" | "coverImage"> | null | undefined
): ContestMeta => {
  if (!contest) {
    return { title: FALLBACK_META_TITLE, description: FALLBACK_META_DESCRIPTION };
  }

  const title = `Concours photo : ${contest.name}`;
  const description = contest.description || FALLBACK_META_DESCRIPTION;
  const image = contest.coverImage?.startsWith("http")
    ? toOgImageUrl(contest.coverImage)
    : undefined;

  return { title, description, image };
};
