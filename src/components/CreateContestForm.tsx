import { ChangeEvent, FormEvent, useRef, useState } from "react";
import BrutalButton from "./BrutalButton";

interface CreateContestFormProps {
  onSubmit: (data: {
    name: string;
    description?: string;
    coverImage?: string;
    submissionDays: number;
    voteDays: number;
  }) => void;
  onCancel: () => void;
}

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const CreateContestForm = ({ onSubmit, onCancel }: CreateContestFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<string | undefined>(undefined);
  const [submissionDays, setSubmissionDays] = useState(15);
  const [voteDays, setVoteDays] = useState(3);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setCoverImage(dataUrl);
    } catch {
      setError("Impossible de lire l'image.");
    }
  };

  const handleRemoveCover = () => {
    setCoverImage(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Le titre du thème est requis.");
      return;
    }
    if (submissionDays < 1 || voteDays < 1) {
      setError("Les durées doivent être ≥ 1 jour.");
      return;
    }
    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      coverImage,
      submissionDays,
      voteDays,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="contest-name" className="block font-mono text-sm font-bold mb-1">
          Titre
        </label>
        <input
          id="contest-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex. Vacances d'été"
          className="brutal-input"
          autoFocus
        />
      </div>

      <div>
        <label htmlFor="contest-description" className="block font-mono text-sm font-bold mb-1">
          Description <span className="font-normal text-muted-foreground">(facultatif)</span>
        </label>
        <textarea
          id="contest-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Quelques mots sur le thème…"
          rows={3}
          className="brutal-input resize-none"
        />
      </div>

      <div>
        <span className="block font-mono text-sm font-bold mb-1">
          Photo d'illustration <span className="font-normal text-muted-foreground">(facultatif)</span>
        </span>
        <div className="flex items-center gap-3">
          {coverImage && (
            <div
              className="w-24 h-24 brutal-border bg-cover bg-center shrink-0"
              style={{ backgroundImage: `url(${coverImage})` }}
              aria-label="Aperçu de l'illustration"
            />
          )}
          <div className="flex flex-wrap gap-2">
            <BrutalButton
              type="button"
              color="sky"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              {coverImage ? "Changer" : "Choisir une image"}
            </BrutalButton>
            {coverImage && (
              <BrutalButton type="button" color="pink" size="sm" onClick={handleRemoveCover}>
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="submission-days" className="block font-mono text-sm font-bold mb-1">
            Soumission (jours)
          </label>
          <input
            id="submission-days"
            type="number"
            min={1}
            value={submissionDays}
            onChange={(e) => setSubmissionDays(Number(e.target.value))}
            className="brutal-input"
          />
        </div>
        <div>
          <label htmlFor="vote-days" className="block font-mono text-sm font-bold mb-1">
            Vote (jours)
          </label>
          <input
            id="vote-days"
            type="number"
            min={1}
            value={voteDays}
            onChange={(e) => setVoteDays(Number(e.target.value))}
            className="brutal-input"
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
          Créer
        </BrutalButton>
      </div>
    </form>
  );
};

export default CreateContestForm;
