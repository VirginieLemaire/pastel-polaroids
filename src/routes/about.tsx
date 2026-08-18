import { createFileRoute } from "@tanstack/react-router";
import AboutPage from "@/features/about/AboutPage";

const TITLE = "À propos — Photo de Famille";
const DESCRIPTION =
  "Comment fonctionne le mode démo de Photo de Famille, et pourquoi vous pouvez tester toutes les fonctionnalités sans risque.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: AboutPage,
});
