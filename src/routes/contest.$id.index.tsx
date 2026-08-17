import { createFileRoute } from "@tanstack/react-router";
import ContestDetailPage from "@/features/contests/ContestDetailPage";
import { DEFAULT_SCENARIO_ID, getScenarioById } from "@/features/demo/scenarios";

const TITLE = "Détail du thème — Photo de Famille";
const DESCRIPTION =
  "Découvrez le thème du concours en cours, sa phase, ses dates clés et le nombre de photos déjà soumises.";

/** Demande à Unsplash une variante recadrée au ratio recommandé pour og:image (1200x630). */
const toOgImageUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "images.unsplash.com") return url;
    parsed.searchParams.set("w", "1200");
    parsed.searchParams.set("h", "630");
    parsed.searchParams.set("fit", "crop");
    return parsed.toString();
  } catch {
    return url;
  }
};

export const Route = createFileRoute("/contest/$id/")({
  loader: ({ params }) =>
    getScenarioById(DEFAULT_SCENARIO_ID).contests.find((c) => c.id === params.id) ?? null,
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: TITLE },
          { name: "description", content: DESCRIPTION },
          { property: "og:title", content: TITLE },
          { property: "og:description", content: DESCRIPTION },
        ],
      };
    }

    const title = `Concours photo : ${loaderData.name}`;
    const description = loaderData.description || DESCRIPTION;
    const meta = [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ];
    if (loaderData.coverImage?.startsWith("http")) {
      meta.push({ property: "og:image", content: toOgImageUrl(loaderData.coverImage) });
    }

    return { meta };
  },
  component: ContestDetailPage,
});
