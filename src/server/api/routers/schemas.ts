import { z } from "zod";

export const categorySchema = z.enum(["calm", "happy", "sad", "scary"]);

export type Category = z.infer<typeof categorySchema>;

export const fileDocSchema = z.object({
  url: z.string(),
  name: z.string(),
  clasification: categorySchema,
  metadata: z.object({
    uploadedAt: z.number(),
    uploadedBy: z.string(),
  }),
});

export type FileDoc = z.infer<typeof fileDocSchema>;
