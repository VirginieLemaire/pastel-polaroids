/**
 * Fournit le contexte TanStack Router (Link, useNavigate, useParams…) sans
 * faire correspondre de route réelle : utile pour isoler un composant en
 * test (vitest) ou dans Storybook, où seuls les hooks routeur doivent
 * fonctionner, pas le rendu d'une page.
 */
import { QueryClient } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRouter,
  RouterContextProvider,
} from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { routeTree } from "../routeTree.gen";

export const createTestRouter = () =>
  createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ["/"] }),
    context: { queryClient: new QueryClient() },
  });

export const TestRouterProvider = ({ children }: { children: ReactNode }) => {
  const [router] = useState(createTestRouter);
  return (
    <RouterContextProvider router={router}>{children}</RouterContextProvider>
  );
};
