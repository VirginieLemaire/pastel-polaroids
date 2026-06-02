import { z } from "zod";

export const createPhotoSchema = z.object({
  contestId: z.string().min(1),
  title: z
    .string()
    .trim()
    .min(1, "Le titre est requis.")
    .max(80, "80 caractères maximum."),
  description: z
    .string()
    .trim()
    .max(280, "280 caractères maximum.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  imageUrl: z
    .string()
    .trim()
    .min(1, "Une image est requise.")
    // Accepte URL http(s) OU data URL (upload local converti en base64).
    .refine(
      (v) => /^https?:\/\//i.test(v) || v.startsWith("data:image/"),
      "URL d'image invalide (http(s) ou data:image attendus).",
    ),
});

export type CreatePhotoInputParsed = z.infer<typeof createPhotoSchema>;
