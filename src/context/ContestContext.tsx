import { createContext, useContext, useState, ReactNode } from "react";

export interface Photo {
  id: string;
  imageUrl: string;
  title: string;
  author: string;
  date: string;
  description?: string;
}

export interface Contest {
  id: string;
  name: string;
  theme: string;
  startDate: string;
  endDate: string;
  photos: Photo[];
}

interface ContestContextType {
  currentContest: Contest | null;
  createContest: (name: string, theme: string, endDate: string) => void;
  addPhoto: (photo: Omit<Photo, "id" | "date">) => void;
}

const ContestContext = createContext<ContestContextType | null>(null);

export const useContest = () => {
  const ctx = useContext(ContestContext);
  if (!ctx) throw new Error("useContest must be used within ContestProvider");
  return ctx;
};

export const ContestProvider = ({ children }: { children: ReactNode }) => {
  const [currentContest, setCurrentContest] = useState<Contest | null>(null);

  const createContest = (name: string, theme: string, endDate: string) => {
    setCurrentContest({
      id: crypto.randomUUID(),
      name,
      theme,
      startDate: new Date().toLocaleDateString("fr-FR"),
      endDate,
      photos: [],
    });
  };

  const addPhoto = (photo: Omit<Photo, "id" | "date">) => {
    if (!currentContest) return;
    setCurrentContest({
      ...currentContest,
      photos: [
        ...currentContest.photos,
        {
          ...photo,
          id: crypto.randomUUID(),
          date: new Date().toLocaleDateString("fr-FR"),
        },
      ],
    });
  };

  return (
    <ContestContext.Provider value={{ currentContest, createContest, addPhoto }}>
      {children}
    </ContestContext.Provider>
  );
};
