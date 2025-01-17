import { db, games, eq } from "@filmrover/db";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";

export const game = {
  getById: defineAction({
    input: z.object({
      id: z.string(),
    }),
    handler: async (input) => {
      const [result] = await db
        .select()
        .from(games)
        .where(eq(games.id, input.id));

      if (!result) {
        throw new ActionError({
          code: "NOT_FOUND",
          message: `Game ${input.id} does not exist`,
        });
      }

      return result;
    },
  }),
  list: defineAction({
    handler: async () => {
      const result = await db.select().from(games);

      return result;
    },
  }),
  create: defineAction({
    input: z.object({
      startMovieId: z.number().nullish().default(null),
      endMovieId: z.number().nullish().default(null),
      startPersonId: z.number().nullish().default(null),
      endPersonId: z.number().nullish().default(null),
    }),
    accept: "form",
    handler: async (input) => {
      const { startMovieId, startPersonId, endMovieId, endPersonId } = input;

      const [result] = await db
        .insert(games)
        .values({
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
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error creating game",
        });
      }

      return { gameId: result.gameId };
    },
  }),
  complete: defineAction({
    input: z.object({
      gameId: z.string(),
    }),
    handler: async (input) => {
      await db
        .update(games)
        .set({
          isFinished: true,
        })
        .where(eq(games.id, input.gameId));
    },
  }),
};
