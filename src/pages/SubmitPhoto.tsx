import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContest } from "@/context/ContestContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload } from "lucide-react";

const SubmitPhoto = () => {
  const { currentContest, addPhoto } = useContest();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setImageUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !imageUrl) return;
    addPhoto({ title, author, description, imageUrl });
    navigate("/gallery");
  };

  if (!currentContest) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="brutal-border border-t-0 border-x-0 bg-pastel-butter p-6">
        <div className="container mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-mono text-2xl font-bold text-foreground">
            Soumettre une photo
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
          {/* Photo upload */}
          <div className="bg-card brutal-border brutal-shadow-lg p-4 pb-10">
            <label className="block cursor-pointer">
              <div className="brutal-border bg-muted aspect-square flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-8">
                    <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="font-mono text-sm text-muted-foreground">
                      Cliquer pour ajouter une photo
                    </p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                required
              />
            </label>
          </div>

          {/* Info fields */}
          <div className="bg-pastel-pink brutal-border brutal-shadow p-6 space-y-4">
            <div>
              <label className="font-mono text-sm font-bold text-foreground block mb-2">
                Titre de la photo
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Mamie au jardin"
                className="w-full brutal-border bg-card p-3 font-display text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
                required
              />
            </div>

            <div>
              <label className="font-mono text-sm font-bold text-foreground block mb-2">
                Photographe
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ex: Tonton Michel"
                className="w-full brutal-border bg-card p-3 font-display text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
                required
              />
            </div>

            <div>
              <label className="font-mono text-sm font-bold text-foreground block mb-2">
                Description (optionnel)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Racontez l'histoire derrière cette photo..."
                rows={3}
                className="w-full brutal-border bg-card p-3 font-display text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground resize-none"
              />
            </div>
          </div>

          <div className="text-center">
            <Button type="submit" variant="mint" size="lg" className="gap-2">
              <Upload className="w-5 h-5" />
              Soumettre la photo
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SubmitPhoto;
