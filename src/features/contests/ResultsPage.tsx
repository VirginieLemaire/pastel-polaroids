import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Filter } from "lucide-react";
import BrutalCard from "@/shared/ui/components/BrutalCard";
import BrutalButton from "@/shared/ui/components/BrutalButton";
import PhotoGrid from "@/shared/ui/components/PhotoGrid";
import StatusBadge from "@/shared/ui/components/StatusBadge";
import { useContests, getContestStatus } from "@/features/contests";
import { usePhotos } from "@/features/photos";
import { useVotes, NEUTRAL_RATING, getExpectedVoterIds } from "@/features/votes";
import type { VisiblePhotoWithResults } from "@/features/photos/visibility";
import type { Photo } from "@/features/photos/types";

/**
 * Page dédiée à l'affichage des résultats d'un concours.
 * Accessible via /contest/:id/results
 */
export default function ResultsPage() {
  const { id = "" } = useParams();
  const { getContest } = useContests();
  const { getPhotosByContest } = usePhotos();
  const { getRankedPhotos, getWinners } = useVotes();
  
  const contest = getContest(id);
  const allPhotos = getPhotosByContest(id);

  // État pour le filtre
  const [showOnlyWinners, setShowOnlyWinners] = useState(false);

  // Calcul des résultats
  const { photosWithResults, winners, expectedVoterIds } = useMemo(() => {
    if (allPhotos.length === 0) {
      return { photosWithResults: [], winners: [], expectedVoterIds: [] };
    }

    // Récupérer les votants attendus (auteurs des photos)
    const voterIds = getExpectedVoterIds(allPhotos as Photo[]);

    // Calculer les photos classées avec leurs notes
    const rankedPhotos = getRankedPhotos(allPhotos as Photo[], voterIds);

    // Identifier les gagnants
    const winners = getWinners(allPhotos as Photo[], voterIds);
    const winnerIds = new Set(winners.map((w) => w.photo.id));

    // Préparer les photos avec leurs résultats
    const photosWithResults: VisiblePhotoWithResults[] = rankedPhotos.map(
      (ranked) => ({
        photo: ranked.photo,
        averageRating: ranked.averageRating,
        isWinner: winnerIds.has(ranked.photo.id),
      })
    );

    return { photosWithResults, winners, expectedVoterIds: voterIds };
  }, [allPhotos, getRankedPhotos, getWinners]);

  // Message à afficher si pas de photos
  if (!contest) {
    return (
      <main className="flex-1 bg-background px-6 py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <Link
            to="/"
            className="font-mono text-sm font-bold inline-flex items-center gap-1 hover:underline"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Retour
          </Link>
          <BrutalCard color="pink">
            <p className="font-mono">Concours introuvable.</p>
            <Link to="/" className="inline-block mt-3">
              <BrutalButton color="mint" size="sm">
                Accueil
              </BrutalButton>
            </Link>
          </BrutalCard>
        </div>
      </main>
    );
  }

  // Message si le concours n'est pas en phase closed
  const status = getContestStatus(contest);
  if (status !== "closed") {
    return (
      <main className="flex-1 bg-background px-6 py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <Link
            to={`/contest/${contest.id}`}
            className="font-mono text-sm font-bold inline-flex items-center gap-1 hover:underline"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Retour au concours
          </Link>
          <BrutalCard color="butter">
            <p className="font-mono">
              Les résultats seront disponibles une fois le concours terminé.
            </p>
            <p className="font-mono text-sm text-muted-foreground mt-2">
              Statut actuel : <StatusBadge status={status} />
            </p>
          </BrutalCard>
        </div>
      </main>
    );
  }

  // Message si aucune photo
  if (photosWithResults.length === 0) {
    return (
      <main className="flex-1 bg-background px-6 py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <Link
            to={`/contest/${contest.id}`}
            className="font-mono text-sm font-bold inline-flex items-center gap-1 hover:underline"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Retour au concours
          </Link>
          <BrutalCard color="butter">
            <p className="font-mono">Aucune photo n'a été soumise pour ce concours.</p>
          </BrutalCard>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-background px-5 py-6">
      <div className="max-w-5xl mx-auto space-y-5">
        {/* En-tête */}
        <Link
          to={`/contest/${contest.id}`}
          className="font-mono text-sm font-bold inline-flex items-center gap-1 hover:underline"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Retour au concours
        </Link>

        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-xs text-muted-foreground">Résultats</p>
            <h1 className="font-mono text-2xl font-bold truncate">
              {contest.name}
            </h1>
          </div>
          <StatusBadge status={status} />
        </header>

        {/* Informations sur les résultats */}
        <div className="space-y-3">
          {/* Nombre de votants */}
          <BrutalCard color="butter">
            <p className="font-mono text-sm">
              {expectedVoterIds.length} votant{expectedVoterIds.length > 1 ? "s" : ""} 
              ont participé au vote.
              {winners.length > 0 && (
                <>
                  <br />
                  <strong>
                    {winners.length} photo{winners.length > 1 ? "s" : ""} gagnante{winners.length > 1 ? "s" : ""}
                  </strong>
                  {winners.length === 1 && ` : « ${winners[0].photo.title} »`}
                </>
              )}
            </p>
          </BrutalCard>

          {/* Filtre */}
          {winners.length > 0 && (
            <div className="flex items-center gap-2">
              <BrutalButton
                color={showOnlyWinners ? "mint" : "sky"}
                size="sm"
                icon={<Filter size={14} aria-hidden="true" />}
                onClick={() => setShowOnlyWinners((prev) => !prev)}
                aria-pressed={showOnlyWinners}
              >
                {showOnlyWinners ? "Toutes les photos" : "Gagnantes seulement"}
              </BrutalButton>
            </div>
          )}
        </div>

        {/* Grille des photos avec résultats */}
        <PhotoGrid
          photos={photosWithResults}
          contest={contest}
          mode="results"
          showWinnerBadge
          sortBy="rating"
          filter={{ onlyWinners: showOnlyWinners }}
          onPhotoClick={(photo) => {
            // TODO: Ouvrir la modale de détail si nécessaire
          }}
        />

        {/* Légende pour les notes neutres */}
        {photosWithResults.some((p) => {
          const votesCount = allPhotos.filter((ph) => ph.id === (p.photo as Photo).id).length;
          return votesCount < expectedVoterIds.length;
        }) && (
          <BrutalCard color="lavender">
            <p className="font-mono text-xs text-muted-foreground">
              ⚠️ Note : Les photos sont notées sur 5. Si un·e votant·e n'a pas noté 
              une photo, une note neutre de <strong>{NEUTRAL_RATING}</strong> est attribuée 
              pour garantir l'équité.
            </p>
          </BrutalCard>
        )}
      </div>
    </main>
  );
}
