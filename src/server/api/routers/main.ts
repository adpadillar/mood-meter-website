import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { serverApp } from "~/server/firebase";
import {
  type FileDoc,
  categorySchema,
  fileDocSchema,
  experimentSchema,
} from "./schemas";
import { TRPCError } from "@trpc/server";

export const mainRouter = createTRPCRouter({
  getExperimentSong: publicProcedure.query(async () => {
    const db = getFirestore(serverApp);

    const res = await db
      .collection("files")
      .orderBy("expCount", "asc")
      .limit(1)
      .get();

    const fileDocs: Array<FileDoc> = [];

    res.docs.forEach((doc) => {
      const parsed = fileDocSchema.parse(doc.data());

      fileDocs.push(parsed);
    });

    if (!fileDocs[0]) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    return fileDocs[0];
  }),
  uploadSongExperiment: publicProcedure
    .input(
      z.object({
        id: z.string(),
        experiment: experimentSchema,
      })
    )
    .mutation(async ({ input }) => {
      const db = getFirestore(serverApp);

      const docRef = db.collection("files").doc(input.id);

      // add one to expCount field
      await docRef.update({
        expCount: FieldValue.increment(1),
      });

      // create new experiment
      await db.collection("experiments").add({ ...input.experiment });
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
