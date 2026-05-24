import { createAvatar } from "@dicebear/core";
import { botttsNeutral } from "@dicebear/collection";

const diceBearColors = [
  'F0C2D1', // --pastel-pink
  'D2C6EC', // --pastel-lavender
  'B3E6D5', // --pastel-mint
  'F7E8BA', // --pastel-butter
  'C2E0F0', // --pastel-sky
  'F7CFBA', // --pastel-peach
];

const cache = new Map<string, string>();

export const getAvatarDataUri = (seed: string): string => {
  const cached = cache.get(seed);
  if (cached) return cached;
  const svg = createAvatar(botttsNeutral, { seed, backgroundColor: diceBearColors }).toString();
  const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  cache.set(seed, dataUri);
  return dataUri;
};
