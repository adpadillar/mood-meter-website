import { z } from "zod";

export const categorySchema = z.enum(["calm", "happy", "sad", "scary"]);

export type Category = z.infer<typeof categorySchema>;

export const fileDocSchema = z.object({
  url: z.string(),
  name: z.string(),
  random: z.number(), // For random index
  expCount: z.number(), // Number of times the file has been played
  clasification: categorySchema,
  metadata: z.object({
    uploadedAt: z.number(),
    uploadedBy: z.string(),
  }),
  id: z.string().optional(), // Id of the file in the database
});

export type FileDoc = z.infer<typeof fileDocSchema>;
