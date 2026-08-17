import { createFileRoute } from "@tanstack/react-router";
import AllResultsPage from "@/features/photos/AllResultsPage";

const TITLE = "Galerie des résultats — Photo de Famille";
const DESCRIPTION =
  "Parcourez toutes les photos des concours clos, filtrez par thème et retrouvez les photos gagnantes.";

export const Route = createFileRoute("/photos")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: AllResultsPage,
});
