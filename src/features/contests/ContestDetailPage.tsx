import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import BrutalCard from "@/shared/ui/components/BrutalCard";
import BrutalButton from "@/shared/ui/components/BrutalButton";
import StatusBadge from "@/shared/ui/components/StatusBadge";
import { useContests, canEditContest, STATUS_LABEL, STATUS_COLOR } from "@/features/contests";
import { useCurrentUser } from "@/features/user";
import { getContestStatus } from "@/features/contests/contestStatus";
import { getAvatarDataUri } from "@/shared/utils/getAvatarUri";
import ImagePlaceHolder from "@/shared/ui/components/ImagePlaceHolder";
import CoverImage from "@/shared/ui/components/CoverImage";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

const statusCorrespondingActionText = {
  submission: "Soumettre une photo",
  vote: "Voter",
  closed: "Voir les photos"
};

export default function ContestDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { getContest } = useContests();
  const { currentUser } = useCurrentUser();
  const contest = getContest(id);

  if (!contest) {
    return (
      <main className="min-h-screen bg-background px-6 py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <Link to="/" className="font-mono text-sm underline inline-flex items-center gap-1">
            <ArrowLeft size={16} aria-hidden="true" /> Retour
          </Link>
          <BrutalCard color="pink">
            <p className="font-mono">Thème introuvable.</p>
            <Link to="/" className="inline-block mt-3">
              <BrutalButton color="mint" size="sm">Accueil</BrutalButton>
            </Link>
          </BrutalCard>
        </div>
      </main>
    );
  }

  const status = getContestStatus(contest);
  const isAuthor = canEditContest(contest, currentUser.id);
  // Pour l'instant, l'auteur du thème = currentUser quand isAuthor (sinon nom générique).
  // Le switcher multi-users introduira un lookup propre.
  const authorName = isAuthor ? currentUser.name : "Un autre membre";
  const authorSeed = contest.authorId;
  const photoCount = contest.photos.length;

  return (
    <main className="min-h-screen bg-background px-5 py-6">
      <div className="max-w-2xl mx-auto space-y-5">
        <Link
          to="/"
          className="font-mono text-sm font-bold inline-flex items-center gap-1 hover:underline"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Retour
        </Link>
        {/* Head part */}
        <div className="flex flex-wrap md:flex-nowrap gap-2">
          {/* Cover */}
          {contest.coverImage ? (
            <CoverImage
              src={contest.coverImage}
              alt={contest.name}
              priority={true} // priority load cause immediatly visible
              className="brutal-shadow md:w-2/3"
            />
          ) : (
            <ImagePlaceHolder className="brutal-shadow bg-pastel-sky/40 md:w-2/3"/>
          )}
          {/* Author + status */}
          <div className="w-full flex items-center gap-3 md:flex-col md:flex-wrap md:align-items-center md:self-end md:w-1/3">
            <img
              src={getAvatarDataUri(authorSeed)}
              alt=""
              width={40}
              height={40}
              className="w-10 h-10 brutal-border brutal-shadow bg-background shrink-0 md:w-20 md:h-20"
            />
            <p className="font-mono text-sm flex-1 min-w-0 truncate md:flex md:flex-col">
              Créé par <span className="font-bold">{authorName}</span>
            </p>
            <StatusBadge status={status} />
          </div>
        </div>

        {/* Post-it */}
        <BrutalCard color="butter" large className="-rotate-1">
          <h1 className="font-mono text-2xl font-bold mb-2">{contest.name}</h1>
          {contest.description && (
            <p className="font-mono text-sm mb-3 whitespace-pre-wrap">{contest.description}</p>
          )}
          <p className="font-mono text-sm">
            Soumission&nbsp;: {contest.submissionDays}j&nbsp;•&nbsp;Vote&nbsp;: {contest.voteDays}j
          </p>
          <p className="font-mono text-xs text-muted-foreground mt-2">
            Créé le {formatDate(contest.createdAt)}
          </p>
          <p className="font-mono text-xs text-muted-foreground mt-1">
            {photoCount === 0
              ? "Aucune photo soumise pour l'instant."
              : `${photoCount} photo${photoCount > 1 ? "s" : ""} soumise${photoCount > 1 ? "s" : ""}.`}
          </p>
        </BrutalCard>

        {/* CTA */}
        <BrutalButton
          color={STATUS_COLOR[status]}
          size="lg"
          className="w-full"
          onClick={() => navigate(`/contest/${contest.id}/photos`)}
        >
          {statusCorrespondingActionText[status]}
        </BrutalButton>

        {/* Édition (auteur uniquement) */}
        {isAuthor && (
          <div className="flex justify-end gap-2">
            <BrutalButton
              color="sky"
              size="sm"
              icon={<Pencil size={14} aria-hidden="true" />}
              onClick={() => console.info("[TODO] Éditer le thème", contest.id)}
            >
              Éditer
            </BrutalButton>
            <BrutalButton
              color="pink"
              size="sm"
              icon={<Trash2 size={14} aria-hidden="true" />}
              onClick={() => console.info("[TODO] Éditer le thème", contest.id)}
            >
              Supprimer
            </BrutalButton>
          </div>
        )}
      </div>
    </main>
  );
};