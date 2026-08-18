import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Outlet,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { reportLovableError } from "@/lib/lovable-error-reporting";
import { UserProvider } from "@/features/user";
import { ContestProvider } from "@/features/contests";
import { PhotoProvider } from "@/features/photos";
import { VoteProvider } from "@/features/votes";
import DemoScenarioPanel from "@/features/demo/DemoScenarioPanel";
import BottomNav from "@/shared/ui/components/BottomNav";

import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { title: "Photo de Famille — Concours photo en famille" },
      {
        name: "description",
        content:
          "Créez un thème, postez vos photos, votez en famille et découvrez les gagnantes. Un concours photo simple et convivial.",
      },
      { property: "og:title", content: "Photo de Famille — Concours photo en famille" },
      {
        property: "og:description",
        content: "Créez un thème, postez vos photos, votez en famille et découvrez les gagnantes.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Photo de Famille" },
      { property: "og:locale", content: "fr_FR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Photo de Famille — Concours photo en famille" },
      {
        name: "twitter:description",
        content: "Créez un thème, postez vos photos, votez en famille et découvrez les gagnantes.",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: RootErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-60 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:font-mono focus:font-bold brutal-border brutal-shadow"
        >
          Aller au contenu principal
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <ContestProvider>
          <PhotoProvider>
            <VoteProvider>
              <DemoScenarioPanel />
              <div className="min-h-dvh flex flex-col pb-[calc(var(--bottom-nav-h)+3px)]">
                <Outlet />
              </div>
              <BottomNav />
            </VoteProvider>
          </PhotoProvider>
        </ContestProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-dvh flex flex-col items-center justify-center gap-6 p-6 bg-background text-foreground">
      <h1 className="text-2xl">Page introuvable</h1>
      <p className="text-muted-foreground">Cette page n'existe pas ou a été déplacée.</p>
      <Link to="/" className="brutal-btn">
        Retour à l'accueil
      </Link>
    </main>
  );
}

function RootErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <main id="main-content" tabIndex={-1} className="min-h-dvh flex flex-col items-center justify-center gap-6 p-6 bg-background text-foreground">
      <h1 className="text-2xl">Cette page n'a pas pu se charger</h1>
      <p className="text-muted-foreground">Une erreur est survenue. Vous pouvez réessayer ou revenir à l'accueil.</p>
      <div className="flex gap-4">
        <button
          type="button"
          className="brutal-btn"
          onClick={() => {
            void router.invalidate();
            reset();
          }}
        >
          Réessayer
        </button>
        <Link to="/" className="brutal-btn">
          Accueil
        </Link>
      </div>
    </main>
  );
}
