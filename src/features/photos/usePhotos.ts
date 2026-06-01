import { useContext } from "react";
import { PhotoContext } from "./PhotoContext";

export const usePhotos = () => {
  const ctx = useContext(PhotoContext);
  if (!ctx) throw new Error("usePhotos must be used within PhotoProvider");
  return ctx;
};
