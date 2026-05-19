import { useState } from "react";
import { DEFAULT_SUBMISSION_DAYS, DEFAULT_VOTE_DAYS } from "@/context/ContestContext";

interface CreateContestFormProps {
  onSubmit: (values: { name: string; submissionDays: number; voteDays: number }) => void;
}

const CreateContestForm = ({ onSubmit }: CreateContestFormProps) => {
  const [name, setName] = useState("");
  const [submissionDays, setSubmissionDays] = useState<number>(DEFAULT_SUBMISSION_DAYS);
  const [voteDays, setVoteDays] = useState<number>(DEFAULT_VOTE_DAYS);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      submissionDays: Number.isFinite(submissionDays) && submissionDays > 0 ? submissionDays : DEFAULT_SUBMISSION_DAYS,
      voteDays: Number.isFinite(voteDays) && voteDays > 0 ? voteDays : DEFAULT_VOTE_DAYS,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="contest-name" className="font-mono text-sm font-bold block mb-2">
          Nom du thème
        </label>
        <input
          id="contest-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex : Les moments de bonheur"
          className="brutal-input"
          required
          autoFocus
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="submission-days" className="font-mono text-sm font-bold block mb-2">
            Soumission (jours)
          </label>
          <input
            id="submission-days"
            type="number"
            min={1}
            value={submissionDays}
            onChange={(e) => setSubmissionDays(parseInt(e.target.value, 10))}
            className="brutal-input font-mono"
          />
          <p className="text-xs text-muted-foreground mt-1">Défaut : {DEFAULT_SUBMISSION_DAYS} j</p>
        </div>
        <div>
          <label htmlFor="vote-days" className="font-mono text-sm font-bold block mb-2">
            Vote (jours)
          </label>
          <input
            id="vote-days"
            type="number"
            min={1}
            value={voteDays}
            onChange={(e) => setVoteDays(parseInt(e.target.value, 10))}
            className="brutal-input font-mono"
          />
          <p className="text-xs text-muted-foreground mt-1">Défaut : {DEFAULT_VOTE_DAYS} j</p>
        </div>
      </div>

      <div className="text-center pt-2">
        <button type="submit" className="brutal-btn bg-pastel-mint">
          ✨ Créer le thème
        </button>
      </div>
    </form>
  );
};

export default CreateContestForm;
