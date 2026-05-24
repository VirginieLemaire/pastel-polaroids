import { useContext } from "react";
import { UserContext } from "./UserContext";

export const useCurrentUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useCurrentUser must be used within UserProvider");
  return ctx;
};
