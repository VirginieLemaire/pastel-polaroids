import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";
import { useCurrentUser } from "@/features/user";
import type { Photo, PhotoContextValue, CreatePhotoInput, UpdatePhotoInput } from "./types";
import { defaultPhotos } from "./mocks/photos.mocks";

export const PhotoContext = createContext<PhotoContextValue | null>(null);

interface IPhotoProviderProps {
  children: ReactNode;
}

export const PhotoProvider = ({ children }: IPhotoProviderProps) => {
  const { currentUser } = useCurrentUser();
  const [photos, setPhotos] = useState<Photo[]>(defaultPhotos);

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

  const submitPhoto = useCallback(
    (input: CreatePhotoInput): Photo => {
      const photo: Photo = {
        id: crypto.randomUUID(),
        contestId: input.contestId,
        authorId: currentUser.id,
        title: input.title.trim(),
        description: input.description?.trim() || undefined,
        imageUrl: input.imageUrl,
        createdAt: new Date().toISOString(),
      };
      setPhotos((prev) => [...prev, photo]);
      return photo;
    },
    [currentUser.id],
  );

  const updatePhoto = useCallback(
    (id: string, input: UpdatePhotoInput): Photo | undefined => {
      let updated: Photo | undefined;
      setPhotos((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          updated = {
            ...p,
            title: input.title.trim(),
            description: input.description?.trim() || undefined,
            imageUrl: input.imageUrl,
          };
          return updated;
        }),
      );
      return updated;
    },
    [],
  );

  const deletePhoto = useCallback((id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const value = useMemo<PhotoContextValue>(
    () => ({ photos, getPhotosByContest, getUserPhotosCount, submitPhoto, updatePhoto, deletePhoto }),
    [photos, getPhotosByContest, getUserPhotosCount, submitPhoto, updatePhoto, deletePhoto],
  );

  return <PhotoContext.Provider value={value}>{children}</PhotoContext.Provider>;
};
