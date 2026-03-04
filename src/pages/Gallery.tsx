import { useNavigate } from "react-router-dom";
import { useContest } from "@/context/ContestContext";
import PolaroidCard from "@/components/PolaroidCard";

const rotations = [-3, 2, -1, 3, -2, 1, -3, 2];

const Gallery = () => {
  const { currentContest } = useContest();
  const navigate = useNavigate();

  if (!currentContest) { navigate("/"); return null; }

  return (
    <div className="min-h-screen bg-background">
      <header className="brutal-border border-t-0 border-x-0 bg-pastel-sky p-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="font-mono text-xl">←</button>
            <div>
              <h1 className="font-mono text-2xl font-bold">{currentContest.name}</h1>
              <p className="text-sm">Thème : {currentContest.theme}</p>
            </div>
          </div>
          <button onClick={() => navigate("/submit")} className="brutal-btn bg-pastel-butter text-sm">
            ＋ Ajouter
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {currentContest.photos.length === 0 ? (
          <div className="max-w-md mx-auto text-center bg-pastel-peach brutal-border brutal-shadow-lg p-10">
            <div className="text-5xl mb-4">🖼️</div>
            <h2 className="font-mono text-xl font-bold mb-2">Aucune photo pour l'instant</h2>
            <p className="mb-6">Soyez le premier à soumettre une photo !</p>
            <button onClick={() => navigate("/submit")} className="brutal-btn bg-pastel-mint">
              ＋ Soumettre une photo
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8 py-4">
            {currentContest.photos.map((photo, i) => (
              <PolaroidCard key={photo.id} {...photo} rotation={rotations[i % rotations.length]} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Gallery;
