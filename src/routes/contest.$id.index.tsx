import { createFileRoute } from "@tanstack/react-router";
import ContestDetailPage from "@/features/contests/ContestDetailPage";
import { buildContestMeta } from "@/features/contests";
import { DEFAULT_SCENARIO_ID, getScenarioById } from "@/features/demo/scenarios";

export const Route = createFileRoute("/contest/$id/")({
  loader: ({ params }) =>
    getScenarioById(DEFAULT_SCENARIO_ID).contests.find((c) => c.id === params.id) ?? null,
  head: ({ loaderData }) => {
    const { title, description, image } = buildContestMeta(loaderData);
    const meta = [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ];
    if (image) meta.push({ property: "og:image", content: image });

    return { meta };
  },
  component: ContestDetailPage,
});
