import { init } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { eq, games } from "@filmrover/db";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const gameRouter = createTRPCRouter({
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const [result] = await ctx.db
        .select()
        .from(games)
        .where(eq(games.id, input.id));

      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Game ${input.id} does not exist`,
        });
      }

      return result;
    }),
  list: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.select().from(games);

    return result;
  }),
  create: publicProcedure.mutation(async ({ ctx }) => {
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
