import { createFileRoute } from "@tanstack/react-router";
import HomePage from "@/features/home/HomePage";

const TITLE = "Photo de Famille — Concours photo en famille";
const DESCRIPTION =
  "Créez un thème, postez vos photos, votez en famille et découvrez les gagnantes. Un concours photo simple et convivial.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: HomePage,
});
