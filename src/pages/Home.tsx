import { useState } from "react";
import BrutalButton from "@/components/BrutalButton";
import BrutalCard from "@/components/BrutalCard";
import Modal from "@/components/Modal";
import PolaroidCard from "@/components/PolaroidCard";

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background px-6 py-12">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="text-center space-y-2">
          <h1 className="font-mono text-3xl md:text-4xl font-bold">Photo de Famille</h1>
          <p className="font-mono text-sm text-muted-foreground">
            Design system — étape 2
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="font-mono text-xl font-bold">Boutons</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <BrutalButton color="mint">Mint</BrutalButton>
            <BrutalButton color="pink">Pink</BrutalButton>
            <BrutalButton color="lavender">Lavender</BrutalButton>
            <BrutalButton color="butter">Butter</BrutalButton>
            <BrutalButton color="sky">Sky</BrutalButton>
            <BrutalButton color="peach">Peach</BrutalButton>
            <BrutalButton color="mint" icon="＋">Ajouter</BrutalButton>
            <BrutalButton color="lavender" size="sm">Petit</BrutalButton>
            <BrutalButton color="butter" size="lg">Grand</BrutalButton>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-mono text-xl font-bold">Cartes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BrutalCard color="mint">
              <h3 className="font-mono font-bold mb-2">Mint</h3>
              <p className="text-sm">Carte brutaliste, bordure et ombre.</p>
            </BrutalCard>
            <BrutalCard color="pink" large>
              <h3 className="font-mono font-bold mb-2">Pink (ombre large)</h3>
              <p className="text-sm">Variante plus marquée.</p>
            </BrutalCard>
            <BrutalCard color="lavender">
              <h3 className="font-mono font-bold mb-2">Lavender</h3>
              <p className="text-sm">Encore une.</p>
            </BrutalCard>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-mono text-xl font-bold">Polaroïds</h2>
          <div className="flex flex-wrap gap-8 justify-center">
            <PolaroidCard rotation={-3} title="Sans image" />
            <PolaroidCard rotation={2} title="Vacances" onClick={() => alert("Cliqué !")} />
            <PolaroidCard
              rotation={-1}
              title="Avec image"
              imageUrl="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400"
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-mono text-xl font-bold">Modale</h2>
          <BrutalButton color="butter" onClick={() => setModalOpen(true)}>
            Ouvrir la modale
          </BrutalButton>
          <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Exemple de modale">
            <p className="mb-4">
              Fermable via la croix, l'overlay, ou la touche <kbd className="font-mono">Esc</kbd>.
            </p>
            <input
              type="text"
              placeholder="Premier champ focusé"
              className="brutal-input mb-4"
            />
            <div className="flex justify-end gap-2">
              <BrutalButton color="pink" size="sm" onClick={() => setModalOpen(false)}>
                Annuler
              </BrutalButton>
              <BrutalButton color="mint" size="sm" onClick={() => setModalOpen(false)}>
                Valider
              </BrutalButton>
            </div>
          </Modal>
        </section>
      </div>
    </main>
  );
};

export default Home;
