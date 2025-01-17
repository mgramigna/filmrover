import { dailyChallenge, db, eq } from "@filmrover/db";
import { TMDBClient } from "@filmrover/tmdb";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { match, P } from "ts-pattern";

export const challenge = {
  addDailyChallenge: defineAction({
    input: z.object({
      startMovieId: z.number().nullish().default(null),
      endMovieId: z.number().nullish().default(null),
      startPersonId: z.number().nullish().default(null),
      endPersonId: z.number().nullish().default(null),
    }),
    handler: async (input) => {
      const { startMovieId, startPersonId, endMovieId, endPersonId } = input;

      // Deactivate existing challenge
      await db
        .update(dailyChallenge)
        .set({
          isActive: false,
        })
        .where(eq(dailyChallenge.isActive, true));

      await db.insert(dailyChallenge).values({
        startMovieId,
        startPersonId,
        endMovieId,
        endPersonId,
        isActive: true,
      });
    },
  }),
  getCurrentDailyChallenge: defineAction({
    handler: async () => {
      const tmdb = new TMDBClient();
      const [activeChallenge] = await db
        .select()
        .from(dailyChallenge)
        .where(eq(dailyChallenge.isActive, true))
        .limit(1);

      const startLabel = await match(activeChallenge)
        .with(
          { startMovieId: P.number },
          async ({ startMovieId }) =>
            (
              await tmdb.getMovieById({
                id: startMovieId,
              })
            ).unwrapOr(undefined)?.title,
        )
        .with(
          { startPersonId: P.number },
          async ({ startPersonId }) =>
            (await tmdb.getPersonById({ id: startPersonId })).unwrapOr(
              undefined,
            )?.name,
        )
        .otherwise(() => undefined);

      const endLabel = await match(activeChallenge)
        .with(
          { endMovieId: P.number },
          async ({ endMovieId }) =>
            (
              await tmdb.getMovieById({
                id: endMovieId,
              })
            ).unwrapOr(undefined)?.title,
        )
        .with(
          { endPersonId: P.number },
          async ({ endPersonId }) =>
            (await tmdb.getPersonById({ id: endPersonId })).unwrapOr(undefined)
              ?.name,
        )
        .otherwise(() => undefined);

      if (!startLabel || !endLabel) return undefined;

      return { ...activeChallenge, startLabel, endLabel };
    },
  }),
};
