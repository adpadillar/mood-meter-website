import { readdirSync } from "fs";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const mainRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getSong: publicProcedure.query(() => {
    // load filenames in public/
    const songs = readdirSync("./public").filter((file) => {
      return file.endsWith(".mp3");
    });

    const song = songs[Math.floor(Math.random() * songs.length)];

    return song;
  }),
});
