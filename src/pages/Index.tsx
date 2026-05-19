import { useNavigate } from "react-router-dom";
import { useContest } from "@/context/ContestContext";

const Index = () => {
  const { currentContest } = useContest();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="brutal-border border-t-0 border-x-0 bg-pastel-pink p-6">
        <div className="container mx-auto flex items-center gap-3 border-0 opacity-100">
          <span className="text-background brutal-border p-2 text-xl bg-[#141414]/0">📷</span>
          <h1 className="font-mono text-2xl md:text-3xl font-bold">Photo de Famille</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {currentContest ?
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="bg-pastel-mint brutal-border brutal-shadow-lg p-8 text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">Concours en cours</p>
              <h2 className="font-mono text-3xl font-bold mb-2">{currentContest.name}</h2>
              <p className="text-lg mb-1">Thème : <strong>{currentContest.theme}</strong></p>
              <p className="font-mono text-sm text-muted-foreground">{currentContest.photos.length} photo(s) soumise(s)</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate("/submit")} className="brutal-btn bg-pastel-butter">
                ＋ Soumettre une photo
              </button>
              <button onClick={() => navigate("/gallery")} className="brutal-btn bg-pastel-lavender">
                🖼️ Voir la galerie
              </button>
            </div>

            {currentContest.photos.length > 0 &&
          <div className="bg-card brutal-border brutal-shadow p-6">
                <h3 className="font-mono text-lg font-bold mb-4">Dernières soumissions</h3>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {currentContest.photos.slice(-3).map((photo) =>
              <div key={photo.id} className="flex-shrink-0 w-32 bg-card brutal-border p-2 pb-6">
                      <div className="w-full h-28 brutal-border overflow-hidden bg-muted">
                        <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
                      </div>
                      <p className="mt-2 text-xs font-mono truncate text-center">{photo.title}</p>
                    </div>
              )}
                </div>
              </div>
          }
          </div> :

        <div className="max-w-xl mx-auto text-center space-y-8">
            <div className="bg-pastel-lavender brutal-border brutal-shadow-lg p-10">
              <div className="text-6xl mb-4">📷</div>
              <h2 className="font-mono text-3xl font-bold mb-3">Pas de concours en cours</h2>
              <p className="text-lg">Créez un nouveau concours photo pour commencer l'aventure en famille !</p>
            </div>
            <button onClick={() => navigate("/create")} className="brutal-btn bg-pastel-mint">
              ＋ Créer un concours
            </button>
          </div>
        }
      </main>

      <footer className="brutal-border border-b-0 border-x-0 bg-pastel-peach p-4 mt-12">
        <p className="text-center font-mono text-sm">Photo de Famille © 2026 — Fait avec 💛</p>
      </footer>
    </div>);

};

export default Index;