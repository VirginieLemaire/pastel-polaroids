import { useMemo, useState } from "react";
import { Link, useParams } from "@/lib/router-compat";
import { ArrowLeft, Pencil, Plus, Trash2, Filter } from "lucide-react";
import BrutalCard from "@/shared/ui/components/BrutalCard";
import BrutalButton from "@/shared/ui/components/BrutalButton";
import StatusBadge from "@/shared/ui/components/StatusBadge";
import PhotoGrid, { type PhotoWithActions, type PhotoWithResults } from "@/shared/ui/components/PhotoGrid";
import Modal from "@/shared/ui/components/Modal";
import { useContests } from "@/features/contests";
import { getContestStatus } from "@/features/contests/contestStatus";
import { useCurrentUser } from "@/features/user";
import { useVotes, getExpectedVoterIds } from "@/features/votes";
import {
  usePhotos,
  getVisiblePhotos,
  isAuthoredPhoto,
  canUserSubmit,
  canEditPhoto,
  canDeletePhoto,
  MAX_PHOTOS_PER_USER,
  type CreatePhotoInput,
  type Photo,
  type VisiblePhoto,
} from "@/features/photos";
import SubmitPhotoForm from "@/features/photos/components/SubmitPhotoForm";
import PhotoDetailModal from "@/features/photos/components/PhotoDetailModal";
import type { VisiblePhotoWithResults } from "@/features/photos/visibility";

type FormState = { mode: "create" } | { mode: "edit"; photo: Photo } | null;

export default function PhotosPage() {
  const { id = "" } = useParams();
  const { getContest } = useContests();
  const { currentUser } = useCurrentUser();
  const { getPhotosByContest, getUserPhotosCount, submitPhoto, updatePhoto, deletePhoto } =
    usePhotos();
  const contest = getContest(id);
  const [form, setForm] = useState<FormState>(null);
  const [detailIndex, setDetailIndex] = useState<number | null>(null);

  if (!contest) {
    return (
      <main className="flex-1 bg-background px-6 py-12">
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

  const { getRankedPhotos, getWinners } = useVotes();
  const status = getContestStatus(contest);
  const allPhotos = getPhotosByContest(contest.id);
  const visiblePhotos = getVisiblePhotos(allPhotos, contest, currentUser.id);
  const userCount = getUserPhotosCount(contest.id, currentUser.id);
  const canSubmit = canUserSubmit(contest, userCount);
  const showSubmitArea = status === "submission";
  
  // État pour le filtre "gagnantes seulement" (uniquement en phase closed)
  const [showOnlyWinners, setShowOnlyWinners] = useState(false);

  // Calcul des résultats pour la phase closed
  const { photosWithResults, winners } = useMemo(() => {
    if (status !== "closed" || allPhotos.length === 0) {
      return { photosWithResults: [], winners: [] };
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

    return { photosWithResults, winners };
  }, [status, allPhotos, getRankedPhotos, getWinners]);

  const emptyMessage =
    status === "submission"
      ? "Vous n'avez encore soumis aucune photo pour ce thème."
      : "Aucune photo n'a été soumise pour ce thème.";

  const handleCreate = (data: CreatePhotoInput) => {
    submitPhoto(data);
    setForm(null);
  };

  const handleEdit = (photoId: string, data: CreatePhotoInput) => {
    updatePhoto(photoId, {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
    });
    setForm(null);
  };

  const handleDelete = (photo: Photo) => {
    if (window.confirm(`Supprimer la photo « ${photo.title} » ? Action définitive.`)) {
      deletePhoto(photo.id);
    }
  };

  // Préparer les photos avec leurs actions pour PhotoGrid
  const photosWithActions = useMemo<PhotoWithActions[]>(() => {
    return visiblePhotos.map((photo) => {
      const isOwn = isAuthoredPhoto(photo);
      const showActions = isOwn && canEditPhoto(photo as Photo, contest, currentUser.id);
      
      // Générer les boutons d'action si nécessaire
      const actions = showActions ? (
        <div className="flex gap-2">
          <BrutalButton
            type="button"
            color="sky"
            size="sm"
            icon={<Pencil size={14} aria-hidden="true" />}
            onClick={(e) => {
              e.stopPropagation();
              setForm({ mode: "edit", photo: photo as Photo });
            }}
          >
            Éditer
          </BrutalButton>
          {canDeletePhoto(photo as Photo, contest, currentUser.id) && (
            <BrutalButton
              type="button"
              color="pink"
              size="sm"
              icon={<Trash2 size={14} aria-hidden="true" />}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(photo as Photo);
              }}
            >
              Suppr.
            </BrutalButton>
          )}
        </div>
      ) : null;

      return {
        photo,
        actions,
      };
    });
  }, [visiblePhotos, contest, currentUser.id, setForm, handleDelete]);

  // Liste utilisée pour naviguer d'une photo à l'autre dans la modale de détail
  const detailList = useMemo<{ photo: VisiblePhoto; averageRating?: number; isWinner?: boolean }[]>(() => {
    if (status !== "closed") return visiblePhotos.map((photo) => ({ photo }));
    return showOnlyWinners ? photosWithResults.filter((p) => p.isWinner) : photosWithResults;
  }, [status, visiblePhotos, photosWithResults, showOnlyWinners]);

  const findDetailIndex = (photoId: string) => {
    const index = detailList.findIndex((item) => item.photo.id === photoId);
    return index === -1 ? null : index;
  };



  return (
    <>
      <header className="max-w-5xl mx-auto w-full px-5 pt-6 pb-5 space-y-5">
        <Link
          to={`/contest/${contest.id}`}
          className="font-mono text-sm font-bold inline-flex items-center gap-1 hover:underline"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Retour au thème
        </Link>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-xs text-muted-foreground">Photos du thème</p>
            <h1 className="font-mono text-2xl font-bold truncate">{contest.name}</h1>
          </div>
          <StatusBadge status={status} />
        </div>
      </header>

      <main className="flex-1 bg-background px-5 pb-6">
      <div className="max-w-5xl mx-auto space-y-5">
        {showSubmitArea && (
          <BrutalCard color="mint">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-sm">
                Vos soumissions&nbsp;: <strong>{userCount}/{MAX_PHOTOS_PER_USER}</strong>
              </p>
              {canSubmit ? (
                <BrutalButton
                  color="butter"
                  size="sm"
                  icon={<Plus size={14} aria-hidden="true" />}
                  onClick={() => setForm({ mode: "create" })}
                >
                  Soumettre une photo
                </BrutalButton>
              ) : (
                <p role="status" className="font-mono text-sm max-w-sm">
                  Vous avez atteint la limite de {MAX_PHOTOS_PER_USER} photos.
                  Supprimez une de vos photos pour pouvoir en proposer une autre.
                </p>
              )}
            </div>
          </BrutalCard>
        )}

        {/* Filtre pour les gagnantes (uniquement en phase closed) */}
        {status === "closed" && winners.length > 0 && (
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

        {visiblePhotos.length === 0 ? (
          <BrutalCard color="butter">
            <p className="font-mono text-sm">{emptyMessage}</p>
          </BrutalCard>
        ) : status === "closed" ? (
          /* En phase closed : afficher les résultats */
          <PhotoGrid
            photos={photosWithResults}
            contest={contest}
            mode="results"
            showWinnerBadge
            sortBy="rating"
            filter={{ onlyWinners: showOnlyWinners }}
            onPhotoClick={(photo) => setDetailIndex(findDetailIndex(photo.id))}
          />
        ) : (
          /* En phase submission/vote : afficher avec actions */
          <PhotoGrid
            photos={photosWithActions}
            contest={contest}
            mode={status}
            onPhotoClick={(photo) => setDetailIndex(findDetailIndex(photo.id))}
          />
        )}

      </div>

      <Modal
        open={form !== null}
        onClose={() => setForm(null)}
        title={form?.mode === "edit" ? "Éditer la photo" : "Soumettre une photo"}
      >
        {form?.mode === "edit" ? (
          <SubmitPhotoForm
            contestId={contest.id}
            initial={form.photo}
            submitLabel="Enregistrer"
            onSubmit={(data) => handleEdit(form.photo.id, data)}
            onCancel={() => setForm(null)}
          />
        ) : (
          <SubmitPhotoForm
            contestId={contest.id}
            onSubmit={handleCreate}
            onCancel={() => setForm(null)}
          />
        )}
      </Modal>

      <PhotoDetailModal 
        photo={detailIndex !== null ? detailList[detailIndex]?.photo ?? null : null} 
        contest={contest} 
        onClose={() => setDetailIndex(null)}
        averageRating={detailIndex !== null ? detailList[detailIndex]?.averageRating : undefined}
        isWinner={detailIndex !== null ? detailList[detailIndex]?.isWinner : undefined}
        onPrev={detailIndex !== null && detailIndex > 0 ? () => setDetailIndex(detailIndex - 1) : undefined}
        onNext={
          detailIndex !== null && detailIndex < detailList.length - 1
            ? () => setDetailIndex(detailIndex + 1)
            : undefined
        }
        positionLabel={detailIndex !== null ? `${detailIndex + 1} / ${detailList.length}` : undefined}
      />

      </main>
    </>
  );
}
