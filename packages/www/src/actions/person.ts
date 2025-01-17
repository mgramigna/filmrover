import { TMDBClient } from "@filmrover/tmdb";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";

export const person = {
  getById: defineAction({
    input: z.object({
      id: z.number(),
    }),
    handler: async (input) => {
      const tmdb = new TMDBClient();
      const result = await tmdb.getPersonById({
        id: input.id,
      });

      if (result.isErr()) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error.message,
        });
      }

      return result.value;
    },
  }),
  getCredits: defineAction({
    input: z.object({
      id: z.number(),
    }),
    handler: async (input) => {
      const tmdb = new TMDBClient();
      const result = await tmdb.getCreditsForPerson({
        personId: input.id,
      });

      if (result.isErr()) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error.message,
        });
      }

      return result.value;
    },
  }),
  getRandomPopularPerson: defineAction({
    handler: async () => {
      const tmdb = new TMDBClient();

      // Choose between the first 10 pages of popular people
      const randomPage = Math.floor(Math.random() * 10) + 1;

      const result = await tmdb.searchPopularPeople({
        page: randomPage,
      });

      if (result.isErr()) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error.message,
        });
      }

      const { results } = result.value;

      return results[Math.floor(Math.random() * results.length)];
    },
  }),
};
