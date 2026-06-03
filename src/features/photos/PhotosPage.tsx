import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
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
  isAuthoredPhoto,
  canUserSubmit,
  canEditPhoto,
  canDeletePhoto,
  MAX_PHOTOS_PER_USER,
  type CreatePhotoInput,
  type Photo,
} from "@/features/photos";
import SubmitPhotoForm from "@/features/photos/components/SubmitPhotoForm";

// Rotation pseudo-aléatoire stable pour l'effet polaroid éparpillé.
const getRotation = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  // Fractional degrees for smoother spread, range -8°..+8°
  return ((hash % 1600) / 100) - 8;
};

type FormState = { mode: "create" } | { mode: "edit"; photo: Photo } | null;

export default function PhotosPage() {
  const { id = "" } = useParams();
  const { getContest } = useContests();
  const { currentUser } = useCurrentUser();
  const { getPhotosByContest, getUserPhotosCount, submitPhoto, updatePhoto, deletePhoto } =
    usePhotos();
  const contest = getContest(id);
  const [form, setForm] = useState<FormState>(null);

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
                onClick={() => setForm({ mode: "create" })}
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
            {visiblePhotos.map((photo) => {
              const isOwn = isAuthoredPhoto(photo);
              const showActions =
                isOwn && canEditPhoto(photo as Photo, contest, currentUser.id);
              return (
                <li key={photo.id} className="flex flex-col items-center gap-2">
                  <PolaroidCard
                    imageUrl={photo.imageUrl}
                    title={photo.title}
                    rotation={getRotation(photo.id)}
                  />
                  {showActions && (
                    <div className="flex gap-2">
                      <BrutalButton
                        type="button"
                        color="sky"
                        size="sm"
                        icon={<Pencil size={14} aria-hidden="true" />}
                        onClick={() => setForm({ mode: "edit", photo: photo as Photo })}
                      >
                        Éditer
                      </BrutalButton>
                      {canDeletePhoto(photo as Photo, contest, currentUser.id) && (
                        <BrutalButton
                          type="button"
                          color="pink"
                          size="sm"
                          icon={<Trash2 size={14} aria-hidden="true" />}
                          onClick={() => handleDelete(photo as Photo)}
                        >
                          Suppr.
                        </BrutalButton>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
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
    </main>
  );
}
