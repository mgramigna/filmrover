import { P, match } from "ts-pattern";
import { z } from "zod";

import { dailyChallenge, eq } from "@filmrover/db";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const challengeRouter = createTRPCRouter({
  addDailyChallenge: publicProcedure
    .input(
      z.object({
        startMovieId: z.number().nullish().default(null),
        endMovieId: z.number().nullish().default(null),
        startPersonId: z.number().nullish().default(null),
        endPersonId: z.number().nullish().default(null),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { startMovieId, startPersonId, endMovieId, endPersonId } = input;

      // Deactivate existing challenge
      await ctx.db
        .update(dailyChallenge)
        .set({
          isActive: false,
        })
        .where(eq(dailyChallenge.isActive, true));

      await ctx.db.insert(dailyChallenge).values({
        startMovieId,
        startPersonId,
        endMovieId,
        endPersonId,
        isActive: true,
      });
    }),
  getCurrentDailyChallenge: publicProcedure.query(async ({ ctx }) => {
    const [activeChallenge] = await ctx.db
      .select()
      .from(dailyChallenge)
      .where(eq(dailyChallenge.isActive, true))
      .limit(1);

    const startLabel = await match(activeChallenge)
      .with(
        { startMovieId: P.number },
        async ({ startMovieId }) =>
          (
            await ctx.tmdb.getMovieById({
              id: startMovieId,
            })
          ).unwrapOr(undefined)?.title,
      )
      .with(
        { startPersonId: P.number },
        async ({ startPersonId }) =>
          (await ctx.tmdb.getPersonById({ id: startPersonId })).unwrapOr(
            undefined,
          )?.name,
      )
      .otherwise(() => undefined);

    const endLabel = await match(activeChallenge)
      .with(
        { endMovieId: P.number },
        async ({ endMovieId }) =>
          (
            await ctx.tmdb.getMovieById({
              id: endMovieId,
            })
          ).unwrapOr(undefined)?.title,
      )
      .with(
        { endPersonId: P.number },
        async ({ endPersonId }) =>
          (await ctx.tmdb.getPersonById({ id: endPersonId })).unwrapOr(
            undefined,
          )?.name,
      )
      .otherwise(() => undefined);

    if (!startLabel || !endLabel) return undefined;

    return { ...activeChallenge, startLabel, endLabel };
  }),
});
