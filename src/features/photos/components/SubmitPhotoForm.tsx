import { ChangeEvent, FormEvent, useRef, useState } from "react";
import BrutalButton from "@/shared/ui/components/BrutalButton";
import { createPhotoSchema } from "../schemas";
import type { CreatePhotoInput, Photo } from "../types";

interface ISubmitPhotoFormProps {
  contestId: string;
  initial?: Pick<Photo, "title" | "description" | "imageUrl">;
  submitLabel?: string;
  onSubmit: (data: CreatePhotoInput) => void;
  onCancel: () => void;
}

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const SubmitPhotoForm = ({
  contestId,
  initial,
  submitLabel = "Soumettre",
  onSubmit,
  onCancel,
}: ISubmitPhotoFormProps) => {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageUrl, setImageUrl] = useState<string>(initial?.imageUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setImageUrl(dataUrl);
      setError(null);
    } catch {
      setError("Impossible de lire l'image.");
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = createPhotoSchema.safeParse({
      contestId,
      title,
      description,
      imageUrl,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Formulaire invalide.");
      return;
    }
    onSubmit(parsed.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="photo-title" className="block font-mono text-sm font-bold mb-1">
          Titre
        </label>
        <input
          id="photo-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex. Coucher de soleil"
          className="brutal-input"
          autoFocus
          required
          maxLength={80}
        />
      </div>

      <div>
        <label htmlFor="photo-description" className="block font-mono text-sm font-bold mb-1">
          Description <span className="font-normal text-muted-foreground">(facultatif)</span>
        </label>
        <textarea
          id="photo-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Quelques mots sur cette photo…"
          rows={3}
          maxLength={280}
          className="brutal-input resize-none"
        />
      </div>

      <div>
        <span className="block font-mono text-sm font-bold mb-1">Photo</span>
        <div className="flex items-center gap-3">
          {imageUrl && (
            <div
              className="w-24 h-24 brutal-border bg-cover bg-center shrink-0"
              style={{ backgroundImage: `url(${imageUrl})` }}
              aria-label="Aperçu de la photo"
            />
          )}
          <div className="flex flex-wrap gap-2">
            <BrutalButton
              type="button"
              color="sky"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              {imageUrl ? "Changer" : "Choisir une image"}
            </BrutalButton>
            {imageUrl && (
              <BrutalButton type="button" color="pink" size="sm" onClick={handleRemoveImage}>
                Retirer
              </BrutalButton>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="font-mono text-sm bg-pastel-pink brutal-border p-2">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <BrutalButton type="button" color="pink" size="sm" onClick={onCancel}>
          Annuler
        </BrutalButton>
        <BrutalButton type="submit" color="mint" size="sm">
          {submitLabel}
        </BrutalButton>
      </div>
    </form>
  );
};

export default SubmitPhotoForm;
