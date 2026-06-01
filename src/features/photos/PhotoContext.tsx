import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";
import type { Photo, PhotoContextValue } from "./types";
import { defaultPhotos } from "./mocks/photos.mocks";

export const PhotoContext = createContext<PhotoContextValue | null>(null);

interface IPhotoProviderProps {
  children: ReactNode;
}

export const PhotoProvider = ({ children }: IPhotoProviderProps) => {
  const [photos] = useState<Photo[]>(defaultPhotos);

  const photosByContest = useMemo(() => {
    const map = new Map<string, Photo[]>();
    for (const p of photos) {
      const arr = map.get(p.contestId);
      if (arr) arr.push(p);
      else map.set(p.contestId, [p]);
    }
    return map;
  }, [photos]);

  const getPhotosByContest = useCallback(
    (contestId: string) => photosByContest.get(contestId) ?? [],
    [photosByContest],
  );

  const getUserPhotosCount = useCallback(
    (contestId: string, userId: string) =>
      (photosByContest.get(contestId) ?? []).filter((p) => p.authorId === userId).length,
    [photosByContest],
  );

  const value = useMemo<PhotoContextValue>(
    () => ({ photos, getPhotosByContest, getUserPhotosCount }),
    [photos, getPhotosByContest, getUserPhotosCount],
  );

  return <PhotoContext.Provider value={value}>{children}</PhotoContext.Provider>;
};
