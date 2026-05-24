import { useContext } from "react";
import { ContestContext } from "./ContestContext";

export const useContests = () => {
  const ctx = useContext(ContestContext);
  if (!ctx) throw new Error("useContests must be used within ContestProvider");
  return ctx;
};
