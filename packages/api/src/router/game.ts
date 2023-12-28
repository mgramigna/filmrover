import { init } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";

import { games } from "@filmrover/db";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const gameRouter = createTRPCRouter({
  listGames: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.select().from(games);

    return result;
  }),
  createGame: publicProcedure.mutation(async ({ ctx }) => {
    const createId = init({
      length: 10,
    });

    const id = createId();

    const [result] = await ctx.db
      .insert(games)
      .values({
        id,
      })
      .returning({
        gameId: games.id,
      });

    if (!result) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error creating game",
      });
    }

    return result.gameId;
  }),
});
