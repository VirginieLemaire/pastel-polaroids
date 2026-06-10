export type Rating = 1 | 2 | 3 | 4 | 5;

export interface Vote {
  id: string;
  photoId: string;
  contestId: string;
  voterId: string;
  rating: Rating;
  createdAt: string;
  updatedAt: string;
}

export interface VoteContextValue {
  votes: Vote[];
  getVoteByUser: (photoId: string, userId: string) => Vote | undefined;
  getVotesForPhoto: (photoId: string) => Vote[];
  getAverageRating: (photoId: string) => number | null;
  castVote: (photoId: string, contestId: string, rating: Rating) => void;
  removeVote: (photoId: string) => void;
}
