import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { getFirestore } from "firebase-admin/firestore";
import { serverApp } from "~/server/firebase";
import { type FileDoc, categorySchema, fileDocSchema } from "./schemas";

export const mainRouter = createTRPCRouter({
  getSong: publicProcedure.query(async () => {
    const db = getFirestore(serverApp);

    const res = await db
      .collection("files")
      .where("random", ">=", Math.random() * 100000)
      .orderBy("random")
      .limit(1)
      .get();

    const fileDocs: Array<FileDoc> = [];

    res.docs.forEach((doc) => {
      console.log(doc);
      const parsed = fileDocSchema.parse(doc.data());

      fileDocs.push(parsed);
    });

    return fileDocs[0]?.url;
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
