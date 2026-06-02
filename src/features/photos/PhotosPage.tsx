import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import BrutalCard from "@/shared/ui/components/BrutalCard";
import BrutalButton from "@/shared/ui/components/BrutalButton";
import StatusBadge from "@/shared/ui/components/StatusBadge";
import PolaroidCard from "@/shared/ui/components/PolaroidCard";
import Modal from "@/shared/ui/components/Modal";
import { useContests } from "@/features/contests";
import { getContestStatus } from "@/features/contests/contestStatus";
import { useCurrentUser } from "@/features/user";
import {
  usePhotos,
  getVisiblePhotos,
  canUserSubmit,
  MAX_PHOTOS_PER_USER,
  type CreatePhotoInput,
} from "@/features/photos";
import SubmitPhotoForm from "@/features/photos/components/SubmitPhotoForm";

// Petite rotation pseudo-aléatoire stable pour l'effet polaroid éparpillé.
const getRotation = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return ((hash % 7) - 3); // -3°..+3°
};

export default function PhotosPage() {
  const { id = "" } = useParams();
  const { getContest } = useContests();
  const { currentUser } = useCurrentUser();
  const { getPhotosByContest, getUserPhotosCount, submitPhoto } = usePhotos();
  const contest = getContest(id);
  const [isFormOpen, setFormOpen] = useState(false);

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

  const status = getContestStatus(contest);
  const allPhotos = getPhotosByContest(contest.id);
  const visiblePhotos = getVisiblePhotos(allPhotos, contest, currentUser.id);
  const userCount = getUserPhotosCount(contest.id, currentUser.id);
  const canSubmit = canUserSubmit(contest, userCount);
  const showSubmitArea = status === "submission";

  const emptyMessage =
    status === "submission"
      ? "Vous n'avez encore soumis aucune photo pour ce thème."
      : "Aucune photo n'a été soumise pour ce thème.";

  const handleSubmit = (data: CreatePhotoInput) => {
    submitPhoto(data);
    setFormOpen(false);
  };

  return (
    <main className="flex-1 bg-background px-5 py-6">
      <div className="max-w-5xl mx-auto space-y-5">
        <Link
          to={`/contest/${contest.id}`}
          className="font-mono text-sm font-bold inline-flex items-center gap-1 hover:underline"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Retour au thème
        </Link>

        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-xs text-muted-foreground">Photos du thème</p>
            <h1 className="font-mono text-2xl font-bold truncate">{contest.name}</h1>
          </div>
          <StatusBadge status={status} />
        </header>

        {showSubmitArea && (
          <BrutalCard color="mint">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-sm">
                Vos soumissions&nbsp;: <strong>{userCount}/{MAX_PHOTOS_PER_USER}</strong>
              </p>
              <BrutalButton
                color="butter"
                size="sm"
                icon={<Plus size={14} aria-hidden="true" />}
                disabled={!canSubmit}
                aria-disabled={!canSubmit}
                title={canSubmit ? undefined : "Limite de 3 photos atteinte."}
                onClick={() => setFormOpen(true)}
              >
                Soumettre une photo
              </BrutalButton>
            </div>
          </BrutalCard>
        )}

        {visiblePhotos.length === 0 ? (
          <BrutalCard color="butter">
            <p className="font-mono text-sm">{emptyMessage}</p>
          </BrutalCard>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {visiblePhotos.map((photo) => (
              <li key={photo.id}>
                <PolaroidCard
                  imageUrl={photo.imageUrl}
                  title={photo.title}
                  rotation={getRotation(photo.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal open={isFormOpen} onClose={() => setFormOpen(false)} title="Soumettre une photo">
        <SubmitPhotoForm
          contestId={contest.id}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>
    </main>
  );
}
