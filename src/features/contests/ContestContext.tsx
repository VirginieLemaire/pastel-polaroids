import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { getScenarioById, getStoredScenarioId } from "@/dev/mockScenarios";
import { useCurrentUser } from "@/features/user";
import type { Contest, ContestContextValue } from "./types";

const DEV_SCENARIO_EVENT = "dev:scenario-change";
export const DEV_SCENARIO_CHANGE_EVENT = DEV_SCENARIO_EVENT;

export const ContestContext = createContext<ContestContextValue | null>(null);

export const ContestProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useCurrentUser();
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

  const createContest: ContestContextValue["createContest"] = useCallback(
    (input) => {
      const contest: Contest = {
        id: crypto.randomUUID(),
        name: input.name.trim(),
        description: input.description?.trim() || undefined,
        coverImage: input.coverImage,
        createdAt: new Date().toISOString(),
        submissionDays: input.submissionDays,
        voteDays: input.voteDays,
        authorId: currentUser.id,
        photos: [],
      };
      setContests((prev) => [...prev, contest]);
      return contest;
    },
    [currentUser.id]
  );

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
