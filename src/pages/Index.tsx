import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContest } from "@/context/ContestContext";
import Modal from "@/components/Modal";
import CreateContestForm from "@/components/CreateContestForm";

const Index = () => {
  const { currentContest, createContest } = useContest();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  // Cas B (concours en cours) — sera refondu en étape 1B
  if (currentContest) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <main className="container mx-auto px-4 py-12 flex-1">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="bg-pastel-mint brutal-border brutal-shadow-lg p-8 text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Concours en cours
              </p>
              <h2 className="font-mono text-3xl font-bold mb-2">{currentContest.name}</h2>
              <p className="font-mono text-sm text-muted-foreground">
                {currentContest.photos.length} photo(s) soumise(s)
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate("/submit")} className="brutal-btn bg-pastel-butter">
                ＋ Soumettre une photo
              </button>
              <button onClick={() => navigate("/gallery")} className="brutal-btn bg-pastel-lavender">
                🖼️ Voir la galerie
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Cas A — aucun concours
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
        <div className="flex flex-col items-center gap-3 mb-16">
          <div className="text-5xl" aria-hidden="true">📷</div>
          <h1 className="font-mono text-2xl md:text-3xl font-bold">Photo de Famille</h1>
          <p className="font-mono text-sm text-muted-foreground">Concours photo de famille</p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            aria-label="Créer un nouveau thème"
            className="w-24 h-24 flex items-center justify-center text-5xl font-mono font-bold brutal-border brutal-shadow-lg bg-pastel-mint hover:translate-x-[2px] hover:translate-y-[2px] transition-transform"
          >
            +
          </button>
          <span className="font-mono text-base font-bold">Nouveau thème</span>
          <p className="text-sm text-muted-foreground max-w-xs">
            Aucun concours en cours. Lancez le premier thème de la famille !
          </p>
        </div>
      </main>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nouveau thème">
        <CreateContestForm
          onSubmit={({ name, submissionDays, voteDays }) => {
            createContest({ name, submissionDays, voteDays });
            setModalOpen(false);
            // Placeholder : la page de détail du thème arrive en étape 2
            navigate("/gallery");
          }}
        />
      </Modal>
    </div>
  );
};

export default Index;
