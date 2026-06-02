import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import BrutalCard from "@/shared/ui/components/BrutalCard";
import BrutalButton from "@/shared/ui/components/BrutalButton";
import StatusBadge from "@/shared/ui/components/StatusBadge";
import { useContests } from "@/features/contests";
import { getContestStatus } from "@/features/contests/contestStatus";

export default function PhotosPage() {
  const { id = "" } = useParams();
  const { getContest } = useContests();
  const contest = getContest(id);

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

  return (
    <main className="flex-1 bg-background px-5 py-6">
      <div className="max-w-3xl mx-auto space-y-5">
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

        <BrutalCard color="butter">
          <p className="font-mono text-sm">
            Aucune photo à afficher pour le moment.
          </p>
        </BrutalCard>
      </div>
    </main>
  );
}
