import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import songs from "~/songs/songs.json";

export const mainRouter = createTRPCRouter({
  getSong: publicProcedure.query(() => {
    const { files } = songs;
    const randomSong = files[Math.floor(Math.random() * files.length)];

    return randomSong;
  }),
  test: protectedProcedure.query(() => {
    return "test";
  }),
});
