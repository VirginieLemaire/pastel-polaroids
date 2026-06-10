import { useContext } from "react";
import { VoteContext } from "./VoteContext";

export const useVotes = () => {
  const ctx = useContext(VoteContext);
  if (!ctx) throw new Error("useVotes must be used within VoteProvider");
  return ctx;
};
