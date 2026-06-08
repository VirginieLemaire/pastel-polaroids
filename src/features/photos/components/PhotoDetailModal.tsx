import Modal from "@/shared/ui/components/Modal";
import CoverImage from "@/shared/ui/components/CoverImage";
import type { Contest } from "@/features/contests";
import { getContestStatus } from "@/features/contests/contestStatus";
import { getUserName } from "@/features/user";
import { isAuthoredPhoto, type VisiblePhoto } from "../visibility";

interface PhotoDetailModalProps {
  photo: VisiblePhoto | null;
  contest: Contest;
  onClose: () => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const PhotoDetailModal = ({ photo, contest, onClose }: PhotoDetailModalProps) => {
  if (!photo) return null;
  const status = getContestStatus(contest);
  const authored = isAuthoredPhoto(photo);
  // Anonymat strict en phase vote : pas de nom d'auteur pour les photos des autres.
  const showAuthor = authored && (status === "submission" || status === "closed");

  return (
    <Modal open={photo !== null} onClose={onClose} title={photo.title || "Photo"}>
      <div className="space-y-4">
        <div className="w-full brutal-border bg-background">
          <CoverImage
            src={photo.imageUrl}
            alt={photo.title || "Photo sans titre"}
            priority={true}
            className="w-full max-h-[60vh]"
          />
        </div>

        <dl className="font-mono text-sm space-y-2">
          {photo.description && (
            <div>
              <dt className="text-xs text-muted-foreground">Description</dt>
              <dd className="break-words whitespace-pre-wrap">{photo.description}</dd>
            </div>
          )}
          {showAuthor && (
            <div>
              <dt className="text-xs text-muted-foreground">Auteur</dt>
              <dd>{getUserName(photo.authorId)}</dd>
            </div>
          )}
          <div>
            <dt className="text-xs text-muted-foreground">Soumise le</dt>
            <dd>{formatDate(photo.createdAt)}</dd>
          </div>
        </dl>
      </div>
    </Modal>
  );
};

export default PhotoDetailModal;
