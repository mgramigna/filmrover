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
  create: publicProcedure
    .input(
      z.object({
        startMovieId: z.number().nullish().default(null),
        endMovieId: z.number().nullish().default(null),
        startPersonId: z.number().nullish().default(null),
        endPersonId: z.number().nullish().default(null),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { startMovieId, startPersonId, endMovieId, endPersonId } = input;

      const createId = init({
        length: 10,
      });

      const id = createId();

      const [result] = await ctx.db
        .insert(games)
        .values({
          id,
          startMovieId,
          startPersonId,
          endMovieId,
          endPersonId,
          isFinished: false,
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
  complete: publicProcedure
    .input(
      z.object({
        gameId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(games)
        .set({
          isFinished: true,
        })
        .where(eq(games.id, input.gameId));
    }),
});
