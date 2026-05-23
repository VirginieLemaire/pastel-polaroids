import { createContext, ReactNode, useCallback, useMemo, useState } from "react";

export interface Contest {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  createdAt: string;
  submissionDays: number;
  voteDays: number;
  photos: unknown[];
}

export interface CreateContestInput {
  name: string;
  description?: string;
  coverImage?: string;
  submissionDays: number;
  voteDays: number;
}

export interface ContestContextValue {
  contests: Contest[];
  createContest: (input: CreateContestInput) => Contest;
  getContest: (id: string) => Contest | undefined;
}

export const ContestContext = createContext<ContestContextValue | null>(null);

const DAY = 24 * 60 * 60 * 1000;

const MOCK_CONTESTS: Contest[] = [
  {
    id: "mock-1",
    name: "Vacances d'été",
    description: "Les meilleurs souvenirs de l'été en famille.",
    coverImage: "/placeholder.svg",
    createdAt: new Date(Date.now() - 1 * DAY).toISOString(),
    submissionDays: 7,
    voteDays: 3,
    photos: [],
  },
  {
    id: "mock-2",
    name: "Noël 2025",
    description: "Photos de Noël en famille.",
    coverImage: "/placeholder.svg",
    createdAt: new Date(Date.now() - 30 * DAY).toISOString(),
    submissionDays: 5,
    voteDays: 2,
    photos: [],
  },
  {
    id: "mock-3",
    name: "Anniversaire de Mamie",
    description: "Souvenirs des 80 ans de Mamie.",
    coverImage: "/placeholder.svg",
    createdAt: new Date(Date.now() - 60 * DAY).toISOString(),
    submissionDays: 4,
    voteDays: 3,
    photos: [],
  },
];

export const ContestProvider = ({ children }: { children: ReactNode }) => {
  const [contests, setContests] = useState<Contest[]>(MOCK_CONTESTS);

  const createContest: ContestContextValue["createContest"] = useCallback((input) => {
    const contest: Contest = {
      id: crypto.randomUUID(),
      name: input.name.trim(),
      description: input.description?.trim() || undefined,
      coverImage: input.coverImage,
      createdAt: new Date().toISOString(),
      submissionDays: input.submissionDays,
      voteDays: input.voteDays,
      photos: [],
    };
    setContests((prev) => [...prev, contest]);
    return contest;
  }, []);

  const getContest = useCallback(
    (id: string) => contests.find((c) => c.id === id),
    [contests]
  );

  const value = useMemo(
    () => ({ contests, createContest, getContest }),
    [contests, createContest, getContest]
  );

  return <ContestContext.Provider value={value}>{children}</ContestContext.Provider>;
};
