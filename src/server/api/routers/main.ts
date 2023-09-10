import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { files } from "~/songs/songs.json";

export const mainRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getSong: publicProcedure.query(() => {
    const randomSong = files[Math.floor(Math.random() * files.length)];

    return randomSong;
  }),
});
