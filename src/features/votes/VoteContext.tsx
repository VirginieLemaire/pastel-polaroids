import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useCurrentUser } from "@/features/user";
import type { Vote, VoteContextValue, Rating } from "./types";
import { defaultVotes } from "./mocks/votes.mocks";
import { castVoteSchema } from "./schemas";
import {
  NEUTRAL_RATING,
  getPhotoAverageRating as computePhotoAverageRating,
  getRankedPhotos as computeRankedPhotos,
  getWinners as computeWinners,
  isPhotoWinner as computeIsPhotoWinner,
} from "./results";
import { getScenarioById, getStoredScenarioId } from "@/features/demo/scenarios";
import type { Photo } from "@/features/photos/types";
import { DEV_SCENARIO_CHANGE_EVENT } from "../contests";

export const VoteContext = createContext<VoteContextValue | null>(null);

export const VoteProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useCurrentUser();
  const [votes, setVotes] = useState<Vote[]>(
    () => getScenarioById(getStoredScenarioId()).votes,
  );

  // Le visiteur peut changer de scénario de démo à tout moment
  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      setVotes(getScenarioById(id).votes);
    };
    window.addEventListener(DEV_SCENARIO_CHANGE_EVENT, handler);
    return () => window.removeEventListener(DEV_SCENARIO_CHANGE_EVENT, handler);
  }, []);

  const votesByPhoto = useMemo(() => {
    const map = new Map<string, Vote[]>();
    for (const v of votes) {
      const arr = map.get(v.photoId);
      if (arr) arr.push(v);
      else map.set(v.photoId, [v]);
    }
    return map;
  }, [votes]);

  const getVotesForPhoto = useCallback(
    (photoId: string) => votesByPhoto.get(photoId) ?? [],
    [votesByPhoto],
  );

  const getVoteByUser = useCallback(
    (photoId: string, userId: string) =>
      (votesByPhoto.get(photoId) ?? []).find((v) => v.voterId === userId),
    [votesByPhoto],
  );

  const getAverageRating = useCallback(
    (photoId: string) => {
      const list = votesByPhoto.get(photoId) ?? [];
      if (list.length === 0) return null;
      const sum = list.reduce((acc, v) => acc + v.rating, 0);
      return sum / list.length;
    },
    [votesByPhoto],
  );

  const castVote = useCallback(
    (photoId: string, contestId: string, rating: Rating) => {
      const parsed = castVoteSchema.safeParse({ photoId, contestId, rating });
      if (!parsed.success) return;
      const now = new Date().toISOString();
      setVotes((prev) => {
        const existing = prev.find(
          (v) => v.photoId === photoId && v.voterId === currentUser.id,
        );
        if (existing) {
          return prev.map((v) =>
            v.id === existing.id ? { ...v, rating, updatedAt: now } : v,
          );
        }
        return [
          ...prev,
          {
            id: crypto.randomUUID(),
            photoId,
            contestId,
            voterId: currentUser.id,
            rating,
            createdAt: now,
            updatedAt: now,
          },
        ];
      });
    },
    [currentUser.id],
  );

  const removeVote = useCallback(
    (photoId: string) => {
      setVotes((prev) =>
        prev.filter(
          (v) => !(v.photoId === photoId && v.voterId === currentUser.id),
        ),
      );
    },
    [currentUser.id],
  );

  // Fonctions de calcul des résultats avec votes neutres
  const getPhotoAverageRating = useCallback(
    (photoId: string, expectedVoterIds: string[]): number | null => {
      return computePhotoAverageRating(photoId, votes, expectedVoterIds);
    },
    [votes],
  );

  const getRankedPhotos = useCallback(
    (
      photos: Photo[],
      expectedVoterIds: string[],
    ): { photo: Photo; averageRating: number }[] => {
      return computeRankedPhotos(photos, votes, expectedVoterIds);
    },
    [votes],
  );

  const getWinners = useCallback(
    (
      photos: Photo[],
      expectedVoterIds: string[],
    ): { photo: Photo; averageRating: number }[] => {
      return computeWinners(photos, votes, expectedVoterIds);
    },
    [votes],
  );

  const isPhotoWinner = useCallback(
    (
      photoId: string,
      photos: Photo[],
      expectedVoterIds: string[],
    ): boolean => {
      return computeIsPhotoWinner(photoId, photos, votes, expectedVoterIds);
    },
    [votes],
  );

  const value = useMemo<VoteContextValue>(
    () => ({
      votes,
      getVoteByUser,
      getVotesForPhoto,
      getAverageRating,
      getPhotoAverageRating,
      getRankedPhotos,
      getWinners,
      isPhotoWinner,
      castVote,
      removeVote,
    }),
    [
      votes,
      getVoteByUser,
      getVotesForPhoto,
      getAverageRating,
      getPhotoAverageRating,
      getRankedPhotos,
      getWinners,
      isPhotoWinner,
      castVote,
      removeVote,
    ],
  );

  return <VoteContext.Provider value={value}>{children}</VoteContext.Provider>;
};
