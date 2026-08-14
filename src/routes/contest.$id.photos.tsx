import { createFileRoute } from "@tanstack/react-router";
import PhotosPage from "@/features/photos/PhotosPage";

export const Route = createFileRoute("/contest/$id/photos")({
  component: PhotosPage,
});
