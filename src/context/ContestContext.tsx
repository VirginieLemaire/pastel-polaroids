import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import {
  getScenarioById,
  getStoredScenarioId,
} from "@/dev/mockScenarios";

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

const DEV_SCENARIO_EVENT = "dev:scenario-change";

export const ContestProvider = ({ children }: { children: ReactNode }) => {
  const [contests, setContests] = useState<Contest[]>(
    () => getScenarioById(getStoredScenarioId()).contests
  );

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const handler = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      setContests(getScenarioById(id).contests);
    };
    window.addEventListener(DEV_SCENARIO_EVENT, handler);
    return () => window.removeEventListener(DEV_SCENARIO_EVENT, handler);
  }, []);

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

export const DEV_SCENARIO_CHANGE_EVENT = DEV_SCENARIO_EVENT;
