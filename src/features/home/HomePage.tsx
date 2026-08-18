import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@/lib/router-compat";
import { X, Info } from "lucide-react";
import BrutalButton from "@/shared/ui/components/BrutalButton";
import BrutalCard from "@/shared/ui/components/BrutalCard";
import Modal from "@/shared/ui/components/Modal";
import CreateContestForm from "@/features/contests/components/CreateContestForm";
import StatusBadge from "@/shared/ui/components/StatusBadge";
import PolaroidCard from "@/shared/ui/components/PolaroidCard";
import { useContests } from "@/features/contests";
import type { CreateContestInput, Contest } from "@/features/contests";
import { getContestStatus } from "@/features/contests/contestStatus";

const pickOpenContest = (contests: Contest[]): Contest | null => {
  const openContest = contests.find((c) => getContestStatus(c) !== "closed")
  return openContest ? openContest : null;
};

const DEMO_HINT_DISMISSED_KEY = "demoHintDismissed";

export default function HomePage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [othersOpen, setOthersOpen] = useState(false);
  // SSR-safe : le serveur rend sans le bandeau, le client le révèle après hydratation
  const [demoHintVisible, setDemoHintVisible] = useState(false);
  useEffect(() => {
    try {
      setDemoHintVisible(localStorage.getItem(DEMO_HINT_DISMISSED_KEY) !== "true");
    } catch {
      setDemoHintVisible(true);
    }
  }, []);
  const { contests, createContest } = useContests();
  const navigate = useNavigate();

  const dismissDemoHint = () => {
    setDemoHintVisible(false);
    try {
      localStorage.setItem(DEMO_HINT_DISMISSED_KEY, "true");
    } catch {
      // ignore storage errors
    }
  };
  
  const currentContest = useMemo(
    () => (contests.length > 0 ? pickOpenContest(contests) : null),
    [contests]
  );

  const others = useMemo(
    () => {
      if (currentContest) {
        return contests.length > 0
          ? contests
              .filter((c) => c.id !== currentContest.id)
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              )
          : []
      } else {
        return contests.length > 0
          ? contests
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              )
          : []      
      }
    }, 
    [contests, currentContest]
  );

  const handleCreate = (data: CreateContestInput) => {
    const contest = createContest(data);
    setCreateOpen(false);
    navigate(`/contest/${contest.id}`);
  };

  return (
    <>
      <header className="text-center space-y-2 bg-background px-6 pt-12 mt-8 mb-10">
        <h1 className="font-mono text-4xl md:text-5xl font-bold">Photo de Famille</h1>
        <p className="font-mono text-sm text-muted-foreground">
          Concours photo en famille, un thème à la fois.
        </p>
      </header>

      <main className="flex-1 bg-background px-6 pb-12 flex flex-col">
      {demoHintVisible && (
        <div className="w-full max-w-md mx-auto mb-6 brutal-border bg-pastel-butter p-3 flex items-start gap-3 shadow-[3px_3px_0_0_hsl(var(--foreground))]">
          <Info aria-hidden="true" className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm leading-snug flex-1">
            Utilise le bouton <span className="font-bold">Mode démo</span> en haut à droite pour explorer l'application et tester toutes les fonctionnalités.
          </p>
          <button
            type="button"
            onClick={dismissDemoHint}
            aria-label="Masquer l'astuce mode démo"
            className="brutal-border bg-background hover:bg-pastel-peach p-1 shrink-0"
          >
            <X aria-hidden="true" className="w-4 h-4" />
          </button>
        </div>
      )}

      <section className="flex-1 flex justify-center flex-col w-full max-w-md mx-auto">
        {currentContest ? 
          (
            <div className="flex flex-col items-center gap-4">
              <PolaroidCard
                imageUrl={currentContest.coverImage}
                title={currentContest.name}
                rotation={-2}
                onClick={() => navigate(`/contest/${currentContest.id}`)}
              />
              <StatusBadge status={getContestStatus(currentContest)} />
            </div>

          ) : 
          (
            <section className="flex-1 flex flex-col items-center justify-center gap-6">
              <BrutalButton
                color="mint"
                shape="round"
                size="lg"
                onClick={() => setCreateOpen(true)}
                aria-label="Créer un nouveau thème"
              >
                ＋
              </BrutalButton>
              <p className="font-mono font-bold text-lg">Nouveau thème</p>
            </section>
          )
        }
        {others.length > 0 && (
          <div className="flex items-center justify-center pt-8 pb-4">
            <BrutalButton color="sky" size="md" onClick={() => setOthersOpen(true)}>
              Anciens thèmes ({others.length})
            </BrutalButton>
          </div>
        )}
      </section>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Créer un thème">
        <CreateContestForm onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} />
      </Modal>
      <Modal open={othersOpen} onClose={() => setOthersOpen(false)} title="Anciens thèmes">
        <ul className="space-y-3">
          {others.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => {
                  setOthersOpen(false);
                  navigate(`/contest/${c.id}`);
                }}
                className="w-full text-left"
              >
                <BrutalCard color="card" className="flex items-center gap-3">
                  <div
                    className="w-14 h-14 brutal-border bg-cover bg-center bg-pastel-sky shrink-0"
                    style={
                      c.coverImage
                        ? { backgroundImage: `url(${c.coverImage})` }
                        : undefined
                    }
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-mono font-bold truncate">{c.name}</p>
                    <StatusBadge status={getContestStatus(c)} />
                  </div>
                </BrutalCard>
              </button>
            </li>
          ))}
        </ul>
      </Modal>
      </main>
    </>
  );
};