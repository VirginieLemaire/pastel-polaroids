export interface Contest {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  createdAt: string;
  submissionDays: number;
  voteDays: number;
  authorId: string;
  photos: unknown[];
}

export interface CreateContestInput {
  name: string;
  description?: string;
  coverImage?: string;
  submissionDays: number;
  voteDays: number;
}

export interface UpdateContestInput {
  name: string;
  description?: string;
  coverImage?: string;
  submissionDays: number;
  voteDays: number;
}

export interface ContestContextValue {
  contests: Contest[];
  createContest: (input: CreateContestInput) => Contest;
  updateContest: (id: string, input: UpdateContestInput) => Contest | undefined;
  deleteContest: (id: string) => void;
  getContest: (id: string) => Contest | undefined;
}

export type ContestStatus = "submission" | "vote" | "closed";