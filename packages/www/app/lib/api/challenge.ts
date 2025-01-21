import { dailyChallenge, db, eq } from "@filmrover/db";
import { TMDBClient } from "@filmrover/tmdb";
import { P, match } from "ts-pattern";

export const challenge = {
  addDailyChallenge: async (input: {
    startMovieId: number | null;
    endMovieId: number | null;
    startPersonId: number | null;
    endPersonId: number | null;
  }) => {
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
  getCurrentDailyChallenge: async () => {
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
          (await tmdb.getPersonById({ id: startPersonId })).unwrapOr(undefined)
            ?.name,
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
};
