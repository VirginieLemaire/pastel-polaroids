import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BrutalButton from "@/components/BrutalButton";
import Modal from "@/components/Modal";
import CreateContestForm from "@/components/CreateContestForm";
import { useContests } from "@/context/ContestContext";

const Home = () => {
  const [open, setOpen] = useState(false);
  const { createContest } = useContests();
  const navigate = useNavigate();

  const handleCreate = (data: { name: string; submissionDays: number; voteDays: number }) => {
    const contest = createContest(data);
    setOpen(false);
    navigate(`/contest/${contest.id}`);
  };

  return (
    <main className="min-h-screen bg-background px-6 py-16 flex flex-col">
      <header className="text-center space-y-2 mb-16">
        <h1 className="font-mono text-4xl md:text-5xl font-bold">Photo de Famille</h1>
        <p className="font-mono text-sm text-muted-foreground">
          Concours photo en famille, un thème à la fois.
        </p>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center gap-6">
        <BrutalButton
          color="mint"
          shape="round"
          size="lg"
          onClick={() => setOpen(true)}
          aria-label="Créer un nouveau thème"
        >
          ＋
        </BrutalButton>
        <p className="font-mono font-bold text-lg">Nouveau thème</p>
      </section>

      <Modal open={open} onClose={() => setOpen(false)} title="Créer un thème">
        <CreateContestForm onSubmit={handleCreate} onCancel={() => setOpen(false)} />
      </Modal>
    </main>
  );
};

export default Home;
