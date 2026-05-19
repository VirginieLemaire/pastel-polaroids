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
  createdAt: string; // ISO
  submissionDays: number;
  voteDays: number;
  photos: Photo[];
}

interface CreateContestInput {
  name: string;
  submissionDays?: number;
  voteDays?: number;
}

interface ContestContextType {
  currentContest: Contest | null;
  contests: Contest[];
  createContest: (input: CreateContestInput) => string;
  addPhoto: (photo: Omit<Photo, "id" | "date">) => void;
}

export const DEFAULT_SUBMISSION_DAYS = 15;
export const DEFAULT_VOTE_DAYS = 3;

const ContestContext = createContext<ContestContextType | null>(null);

export const useContest = () => {
  const ctx = useContext(ContestContext);
  if (!ctx) throw new Error("useContest must be used within ContestProvider");
  return ctx;
};

export const ContestProvider = ({ children }: { children: ReactNode }) => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [currentContestId, setCurrentContestId] = useState<string | null>(null);

  const createContest = ({ name, submissionDays, voteDays }: CreateContestInput) => {
    const id = crypto.randomUUID();
    const contest: Contest = {
      id,
      name,
      createdAt: new Date().toISOString(),
      submissionDays: submissionDays ?? DEFAULT_SUBMISSION_DAYS,
      voteDays: voteDays ?? DEFAULT_VOTE_DAYS,
      photos: [],
    };
    setContests((prev) => [...prev, contest]);
    setCurrentContestId(id);
    return id;
  };

  const currentContest = contests.find((c) => c.id === currentContestId) ?? null;

  const addPhoto = (photo: Omit<Photo, "id" | "date">) => {
    if (!currentContest) return;
    setContests((prev) =>
      prev.map((c) =>
        c.id === currentContest.id
          ? {
              ...c,
              photos: [
                ...c.photos,
                { ...photo, id: crypto.randomUUID(), date: new Date().toLocaleDateString("fr-FR") },
              ],
            }
          : c
      )
    );
  };

  return (
    <ContestContext.Provider value={{ currentContest, contests, createContest, addPhoto }}>
      {children}
    </ContestContext.Provider>
  );
};
