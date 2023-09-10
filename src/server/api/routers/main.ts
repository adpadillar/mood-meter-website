import { readFileSync, readdirSync } from "fs";
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
    // load json file in src/songs/songs.json
    const fileContent = readFileSync("src/songs/songs.json", "utf-8");
    const songs = JSON.parse(fileContent) as { files: string[] };

    // get random song
    const randomSong =
      songs.files[Math.floor(Math.random() * songs.files.length)];

    return randomSong;
  }),
});
