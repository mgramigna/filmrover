import { games } from "@filmrover/db";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const gameRouter = createTRPCRouter({
  listGames: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.select().from(games);

    return result;
  }),
});
