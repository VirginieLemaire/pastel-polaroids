import { useNavigate } from "react-router-dom";
import { useContest } from "@/context/ContestContext";
import { Button } from "@/components/ui/button";
import PolaroidCard from "@/components/PolaroidCard";
import { ArrowLeft, Plus } from "lucide-react";

const rotations = [-3, 2, -1, 3, -2, 1, -3, 2];

const Gallery = () => {
  const { currentContest } = useContest();
  const navigate = useNavigate();

  if (!currentContest) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="brutal-border border-t-0 border-x-0 bg-pastel-sky p-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-mono text-2xl font-bold text-foreground">
                {currentContest.name}
              </h1>
              <p className="font-display text-sm text-foreground">
                Thème : {currentContest.theme}
              </p>
            </div>
          </div>
          <Button
            variant="butter"
            onClick={() => navigate("/submit")}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {currentContest.photos.length === 0 ? (
          <div className="max-w-md mx-auto text-center bg-pastel-peach brutal-border brutal-shadow-lg p-10">
            <div className="text-5xl mb-4">🖼️</div>
            <h2 className="font-mono text-xl font-bold text-foreground mb-2">
              Aucune photo pour l'instant
            </h2>
            <p className="font-display text-foreground mb-6">
              Soyez le premier à soumettre une photo !
            </p>
            <Button
              variant="mint"
              onClick={() => navigate("/submit")}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Soumettre une photo
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8 py-4">
            {currentContest.photos.map((photo, i) => (
              <PolaroidCard
                key={photo.id}
                imageUrl={photo.imageUrl}
                title={photo.title}
                author={photo.author}
                date={photo.date}
                description={photo.description}
                rotation={rotations[i % rotations.length]}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Gallery;
