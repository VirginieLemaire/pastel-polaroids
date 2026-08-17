import { createFileRoute } from "@tanstack/react-router";
import ContestDetailPage from "@/features/contests/ContestDetailPage";

const TITLE = "Détail du thème — Photo de Famille";
const DESCRIPTION =
  "Découvrez le thème du concours en cours, sa phase, ses dates clés et le nombre de photos déjà soumises.";

export const Route = createFileRoute("/contest/$id/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: ContestDetailPage,
});
