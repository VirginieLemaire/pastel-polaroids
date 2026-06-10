import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";
import { useCurrentUser } from "@/features/user";
import type { Vote, VoteContextValue, Rating } from "./types";
import { defaultVotes } from "./mocks/votes.mocks";
import { castVoteSchema } from "./schemas";

export const VoteContext = createContext<VoteContextValue | null>(null);

export const VoteProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useCurrentUser();
  const [votes, setVotes] = useState<Vote[]>(defaultVotes);

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

  const value = useMemo<VoteContextValue>(
    () => ({
      votes,
      getVoteByUser,
      getVotesForPhoto,
      getAverageRating,
      castVote,
      removeVote,
    }),
    [votes, getVoteByUser, getVotesForPhoto, getAverageRating, castVote, removeVote],
  );

  return <VoteContext.Provider value={value}>{children}</VoteContext.Provider>;
};
