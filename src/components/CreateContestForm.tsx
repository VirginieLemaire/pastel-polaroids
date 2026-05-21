import { FormEvent, useState } from "react";
import BrutalButton from "./BrutalButton";

interface CreateContestFormProps {
  onSubmit: (data: { name: string; submissionDays: number; voteDays: number }) => void;
  onCancel: () => void;
}

const CreateContestForm = ({ onSubmit, onCancel }: CreateContestFormProps) => {
  const [name, setName] = useState("");
  const [submissionDays, setSubmissionDays] = useState(15);
  const [voteDays, setVoteDays] = useState(3);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Le nom du thème est requis.");
      return;
    }
    if (submissionDays < 1 || voteDays < 1) {
      setError("Les durées doivent être ≥ 1 jour.");
      return;
    }
    onSubmit({ name: name.trim(), submissionDays, voteDays });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="contest-name" className="block font-mono text-sm font-bold mb-1">
          Nom du thème
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
        <p role="alert" className="font-mono text-sm text-foreground bg-pastel-pink brutal-border p-2">
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
