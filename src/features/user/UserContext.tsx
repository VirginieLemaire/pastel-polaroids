import { createContext, ReactNode, useMemo } from "react";
import { CURRENT_USER } from "./mockUser";
import type { UserContextValue } from "./types";

export const UserContext = createContext<UserContextValue | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const value = useMemo<UserContextValue>(() => ({ currentUser: CURRENT_USER }), []);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
