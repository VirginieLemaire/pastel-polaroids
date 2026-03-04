import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContest } from "@/context/ContestContext";

const SubmitPhoto = () => {
  const { currentContest, addPhoto } = useContest();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  if (!currentContest) { navigate("/"); return null; }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { const url = URL.createObjectURL(file); setPreviewUrl(url); setImageUrl(url); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !imageUrl) return;
    addPhoto({ title, author, description, imageUrl });
    navigate("/gallery");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="brutal-border border-t-0 border-x-0 bg-pastel-butter p-6">
        <div className="container mx-auto flex items-center gap-4">
          <button onClick={() => navigate("/")} className="font-mono text-xl">←</button>
          <h1 className="font-mono text-2xl font-bold">Soumettre une photo</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
          <div className="bg-card brutal-border brutal-shadow-lg p-4 pb-10">
            <label className="block cursor-pointer">
              <div className="brutal-border bg-muted aspect-square flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt="Aperçu" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-8">
                    <div className="text-4xl mb-3">📤</div>
                    <p className="font-mono text-sm text-muted-foreground">Cliquer pour ajouter une photo</p>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" required />
            </label>
          </div>

          <div className="bg-pastel-pink brutal-border brutal-shadow p-6 space-y-4">
            <div>
              <label className="font-mono text-sm font-bold block mb-2">Titre de la photo</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Mamie au jardin" className="brutal-input" required />
            </div>
            <div>
              <label className="font-mono text-sm font-bold block mb-2">Photographe</label>
              <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ex: Tonton Michel" className="brutal-input" required />
            </div>
            <div>
              <label className="font-mono text-sm font-bold block mb-2">Description (optionnel)</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Racontez l'histoire derrière cette photo..." rows={3}
                className="brutal-input resize-none" />
            </div>
          </div>

          <div className="text-center">
            <button type="submit" className="brutal-btn bg-pastel-mint">📤 Soumettre la photo</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SubmitPhoto;
