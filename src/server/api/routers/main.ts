import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import songs from "~/songs/songs.json";
import { getFirestore } from "firebase-admin/firestore";
import { serverApp } from "~/server/firebase";
import { type FileDoc, categorySchema, fileDocSchema } from "./schemas";

export const mainRouter = createTRPCRouter({
  getSong: publicProcedure.query(() => {
    const { files } = songs;
    const randomSong = files[Math.floor(Math.random() * files.length)];

    return randomSong;
  }),
  getSongsByCategory: protectedProcedure
    .input(
      z.object({
        category: categorySchema,
      })
    )
    .query(async ({ input }) => {
      const db = getFirestore(serverApp);

      const res = await db
        .collection("files")
        .where("clasification", "==", input.category)
        .get();

      const fileDocs: Array<FileDoc> = [];

      res.docs.forEach((doc) => {
        const parsed = fileDocSchema.parse(doc.data());

        fileDocs.push(parsed);
      });

      return {
        songFiles: fileDocs,
      };
    }),
});
export { categorySchema };
