import { useMemo, useState } from "react";
import { Link } from "@/lib/router-compat";
import { ArrowLeft, Filter, Trophy } from "lucide-react";
import BrutalCard from "@/shared/ui/components/BrutalCard";
import BrutalButton from "@/shared/ui/components/BrutalButton";
import PhotoGrid, { type PhotoWithResults } from "@/shared/ui/components/PhotoGrid";
import PhotoDetailModal from "@/features/photos/components/PhotoDetailModal";
import { useContests, getContestStatus } from "@/features/contests";
import { usePhotos } from "@/features/photos";
import { useVotes, getExpectedVoterIds } from "@/features/votes";
import type { Contest } from "@/features/contests/types";
import type { Photo } from "@/features/photos/types";
import type { VisiblePhoto } from "@/features/photos";

/**
 * Page affichant toutes les photos de tous les concours CLOS.
 * Accessible via /photos
 * 
 * Fonctionnalités :
 * - Affiche toutes les photos des concours terminés
 * - Filtre par concours (sélection multiple)
 * - Filtre "Gagnantes seulement"
 */
export default function AllResultsPage() {
  const { contests } = useContests();
  const { photos } = usePhotos();
  const { getRankedPhotos, getWinners } = useVotes();

  // État des filtres
  const [selectedContestIds, setSelectedContestIds] = useState<string[]>([]);
  const [showOnlyWinners, setShowOnlyWinners] = useState(false);
  
  // État pour la modale de détail
  const [detailIndex, setDetailIndex] = useState<number | null>(null);

  // Récupérer les concours clos
  const closedContests = useMemo(() => {
    return contests.filter((contest) => getContestStatus(contest) === "closed");
  }, [contests]);

  // Si un concours est sélectionné, utiliser celui-ci, sinon tous les concours clos
  const contestIdsToShow = useMemo(() => {
    return selectedContestIds.length > 0 ? selectedContestIds : closedContests.map((c) => c.id);
  }, [selectedContestIds, closedContests]);

  // Photos filtrées par concours clos
  const photosForClosedContests = useMemo(() => {
    return photos.filter((photo) => contestIdsToShow.includes(photo.contestId));
  }, [photos, contestIdsToShow]);

  // Calcul des résultats pour chaque concours
  const allPhotosWithResults = useMemo<PhotoWithResults[]>(() => {
    if (photosForClosedContests.length === 0) return [];

    // Grouper les photos par concours
    const photosByContest = new Map<string, Photo[]>();
    for (const photo of photosForClosedContests) {
      const contestPhotos = photosByContest.get(photo.contestId) ?? [];
      contestPhotos.push(photo);
      photosByContest.set(photo.contestId, contestPhotos);
    }

    // Calculer les résultats pour chaque concours
    const results: PhotoWithResults[] = [];
    
    for (const [contestId, contestPhotos] of photosByContest) {
      const voterIds = getExpectedVoterIds(contestPhotos);
      const rankedPhotos = getRankedPhotos(contestPhotos, voterIds);
      const winners = getWinners(contestPhotos, voterIds);
      const winnerIds = new Set(winners.map((w) => w.photo.id));

      for (const ranked of rankedPhotos) {
        results.push({
          photo: ranked.photo,
          averageRating: ranked.averageRating,
          isWinner: winnerIds.has(ranked.photo.id),
        });
      }
    }

    // Trier par note décroissante
    return results.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
  }, [photosForClosedContests, getRankedPhotos, getWinners]);

  // Grouper les photos par concours pour le filtre
  const contestOptions = useMemo(() => {
    return closedContests.map((contest) => ({
      id: contest.id,
      name: contest.name,
      // Compter le nombre de photos de ce concours
      photoCount: photosForClosedContests.filter((p) => p.contestId === contest.id).length,
    }));
  }, [closedContests, photosForClosedContests]);

  // Compter le nombre de gagnantes
  const winnerCount = useMemo(() => {
    return allPhotosWithResults.filter((p) => p.isWinner).length;
  }, [allPhotosWithResults]);

  // Trouver le contest pour chaque photo (pour l'affichage)
  const getContestForPhoto = (photoId: string): Contest | undefined => {
    const photo = photos.find((p) => p.id === photoId);
    if (!photo) return undefined;
    return contests.find((c) => c.id === photo.contestId);
  };

  // Liste ordonnée utilisée pour naviguer d'une photo à l'autre dans la modale
  const detailList = useMemo(
    () =>
      showOnlyWinners
        ? allPhotosWithResults.filter((p) => p.isWinner)
        : allPhotosWithResults,
    [allPhotosWithResults, showOnlyWinners],
  );

  const current = detailIndex !== null ? detailList[detailIndex] : undefined;
  const currentContest = current
    ? contests.find((c) => c.id === (current.photo as Photo).contestId)
    : undefined;

  // Si aucun concours clos
  if (closedContests.length === 0) {
    return (
      <main className="flex-1 bg-background px-6 py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <Link to="/" className="font-mono text-sm underline inline-flex items-center gap-1">
            <ArrowLeft size={16} aria-hidden="true" /> Retour
          </Link>
          <BrutalCard color="butter">
            <p className="font-mono">Aucun concours n'est encore terminé.</p>
          </BrutalCard>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-background px-5 py-6">
      <div className="max-w-5xl mx-auto space-y-5">
        <Link
          to="/"
          className="font-mono text-sm font-bold inline-flex items-center gap-1 hover:underline"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Retour
        </Link>

        <header className="flex justify-center gap-3">
            <h1 className="font-mono text-3xl font-bold">Résultats</h1>
            <Trophy size={40} className="text-yellow-600" />

        </header>
            <p className="font-mono text-s text-center text-muted-foreground">Photos de tous les concours</p>

        {/* Informations globales */}
        {allPhotosWithResults.length > 0 && (
          // <BrutalCard color="butter">
            <p className="font-mono text-sm">
              {allPhotosWithResults.length} photo{allPhotosWithResults.length > 1 ? "s" : ""} {" "}
              répartie{allPhotosWithResults.length > 1 ? "s" : ""} dans {closedContests.length} concours terminé{closedContests.length > 1 ? "s" : ""}.
              {winnerCount > 0 && (
                <>
                  <br />
                  <strong>{winnerCount} photo{winnerCount > 1 ? "s" : ""} gagnante{winnerCount > 1 ? "s" : ""}</strong>.
                </>
              )}
            </p>
          // </BrutalCard>
        )}

        {/* Filtres */}
        <div className="space-y-3">
          {/* Filtre par concours (sélection multiple) */}
          {contestOptions.length > 1 && (
            <BrutalCard color="sky">
              <div className="space-y-2">
                <p className="font-mono text-sm font-bold">Filtrer par concours :</p>
                <div className="flex flex-wrap gap-2">
                  {contestOptions.map((contest) => {
                    const isSelected = selectedContestIds.includes(contest.id);
                    return (
                      <BrutalButton
                        key={contest.id}
                        color={isSelected ? "mint" : "sky"}
                        size="sm"
                        onClick={() => {
                          setSelectedContestIds((prev) =>
                            isSelected
                              ? prev.filter((id) => id !== contest.id)
                              : [...prev, contest.id]
                          );
                        }}
                        aria-pressed={isSelected}
                      >
                        {contest.name} ({contest.photoCount})
                      </BrutalButton>
                    );
                  })}
                  {selectedContestIds.length > 0 && (
                    <BrutalButton
                      color="pink"
                      size="sm"
                      onClick={() => setSelectedContestIds([])}
                    >
                      Effacer
                    </BrutalButton>
                  )}
                </div>
              </div>
            </BrutalCard>
          )}

          {/* Filtre gagnantes */}
          {allPhotosWithResults.some((p) => p.isWinner) && (
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

        {/* Grille des photos */}
        {allPhotosWithResults.length === 0 ? (
          <BrutalCard color="butter">
            <p className="font-mono text-sm">Aucune photo à afficher.</p>
          </BrutalCard>
        ) : (
          <PhotoGrid
            photos={allPhotosWithResults}
            // Pour PhotoGrid, il faut un contest. On utilise le premier contest trouvé
            contest={closedContests[0]!}
            mode="results"
            showWinnerBadge
            sortBy="rating"
            filter={{ onlyWinners: showOnlyWinners }}
            onPhotoClick={(photo) => {
              const index = detailList.findIndex((item) => item.photo.id === photo.id);
              setDetailIndex(index === -1 ? null : index);
            }}
          />
        )}

        {/* Modale de détail */}
        {current && currentContest && (
          <PhotoDetailModal
            photo={current.photo as VisiblePhoto}
            contest={currentContest}
            onClose={() => setDetailIndex(null)}
            averageRating={current.averageRating}
            isWinner={current.isWinner}
            onPrev={
              detailIndex !== null && detailIndex > 0
                ? () => setDetailIndex(detailIndex - 1)
                : undefined
            }
            onNext={
              detailIndex !== null && detailIndex < detailList.length - 1
                ? () => setDetailIndex(detailIndex + 1)
                : undefined
            }
            positionLabel={
              detailIndex !== null ? `${detailIndex + 1} / ${detailList.length}` : undefined
            }
          />
        )}
      </div>
    </main>
  );
}
