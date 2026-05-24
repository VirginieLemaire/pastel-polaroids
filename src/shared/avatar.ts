import { createAvatar } from "@dicebear/core";
import { thumbs } from "@dicebear/collection";

const cache = new Map<string, string>();

export const getAvatarDataUri = (seed: string): string => {
  const cached = cache.get(seed);
  if (cached) return cached;
  const svg = createAvatar(thumbs, { seed, radius: 50 }).toString();
  const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  cache.set(seed, dataUri);
  return dataUri;
};
