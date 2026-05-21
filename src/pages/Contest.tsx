import { Link, useParams } from "react-router-dom";
import { useContests } from "@/context/ContestContext";
import BrutalCard from "@/components/BrutalCard";
import BrutalButton from "@/components/BrutalButton";

const Contest = () => {
  const { id = "" } = useParams();
  const { getContest } = useContests();
  const contest = getContest(id);

  return (
    <main className="min-h-screen bg-background px-6 py-12">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link to="/" className="font-mono text-sm underline">
          ← Retour
        </Link>
        {contest ? (
          <BrutalCard color="mint" large>
            <h1 className="font-mono text-2xl font-bold mb-2">{contest.name}</h1>
            <p className="font-mono text-sm">
              Soumission : {contest.submissionDays}j — Vote : {contest.voteDays}j
            </p>
            <p className="font-mono text-xs text-muted-foreground mt-2">
              Créé le {new Date(contest.createdAt).toLocaleString("fr-FR")}
            </p>
          </BrutalCard>
        ) : (
          <BrutalCard color="pink">
            <p className="font-mono">Thème introuvable.</p>
            <Link to="/" className="inline-block mt-3">
              <BrutalButton color="mint" size="sm">Accueil</BrutalButton>
            </Link>
          </BrutalCard>
        )}
        <p className="font-mono text-xs text-muted-foreground">
          Page placeholder — détail complet à l'étape 5.
        </p>
      </div>
    </main>
  );
};

export default Contest;
