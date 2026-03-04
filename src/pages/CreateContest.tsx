import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContest } from "@/context/ContestContext";

const CreateContest = () => {
  const { createContest } = useContest();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [theme, setTheme] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !theme || !endDate) return;
    createContest(name, theme, endDate);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="brutal-border border-t-0 border-x-0 bg-pastel-lavender p-6">
        <div className="container mx-auto flex items-center gap-4">
          <button onClick={() => navigate("/")} className="font-mono text-xl">←</button>
          <h1 className="font-mono text-2xl font-bold">Nouveau Concours</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
          <div className="bg-pastel-butter brutal-border brutal-shadow-lg p-8 space-y-6">
            <div>
              <label className="font-mono text-sm font-bold block mb-2">Nom du concours</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Vacances d'été 2026" className="brutal-input" required />
            </div>
            <div>
              <label className="font-mono text-sm font-bold block mb-2">Thème</label>
              <input type="text" value={theme} onChange={(e) => setTheme(e.target.value)}
                placeholder="Ex: Les moments de bonheur" className="brutal-input" required />
            </div>
            <div>
              <label className="font-mono text-sm font-bold block mb-2">Date de fin</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className="brutal-input font-mono" required />
            </div>
          </div>
          <div className="text-center">
            <button type="submit" className="brutal-btn bg-pastel-mint">✨ Lancer le concours</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateContest;
