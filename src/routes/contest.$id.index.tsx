import { createFileRoute } from "@tanstack/react-router";
import ContestDetailPage from "@/features/contests/ContestDetailPage";

export const Route = createFileRoute("/contest/$id/")({
  component: ContestDetailPage,
});
