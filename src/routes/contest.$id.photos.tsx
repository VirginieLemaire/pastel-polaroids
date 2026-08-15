import { createFileRoute } from "@tanstack/react-router";
import PhotosPage from "@/features/photos/PhotosPage";

const TITLE = "Photos du thème — Photo de Famille";
const DESCRIPTION =
  "Soumettez jusqu'à trois photos, votez pour les photos du thème et consultez les résultats une fois le concours clos.";

export const Route = createFileRoute("/contest/$id/photos")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: PhotosPage,
});
