import { createFileRoute } from "@tanstack/react-router";
import AllResultsPage from "@/features/photos/AllResultsPage";

export const Route = createFileRoute("/photos")({
  component: AllResultsPage,
});
