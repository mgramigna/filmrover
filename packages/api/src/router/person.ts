import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const personRouter = createTRPCRouter({
  getById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const result = await ctx.tmdb.getPersonById({
        id: input.id,
      });

      if (result.isErr()) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error.message,
          cause: result.error,
        });
      }

      return result.value;
    }),
  getCredits: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const result = await ctx.tmdb.getCreditsForPerson({
        personId: input.id,
      });

      if (result.isErr()) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error.message,
          cause: result.error,
        });
      }

      return result.value;
    }),
  search: publicProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const result = await ctx.tmdb.searchPersonByName({
        name: input.name.toLowerCase(),
      });

      if (result.isErr()) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error.message,
          cause: result.error,
        });
      }

      return result.value;
    }),
  getRandomPopularPerson: publicProcedure.query(async ({ ctx }) => {
    // Choose between the first 5 pages of popular people
    const randomPage = Math.floor(Math.random() * 5) + 1;

    const result = await ctx.tmdb.searchPopularPeople({
      page: randomPage,
    });

    if (result.isErr()) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: result.error.message,
        cause: result.error,
      });
    }

    const { results } = result.value;

    return results[Math.floor(Math.random() * results.length)];
  }),
});
