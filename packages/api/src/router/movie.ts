import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const movieRouter = createTRPCRouter({
  getById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const result = await ctx.tmdb.getMovieById({
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
  search: publicProcedure
    .input(
      z.object({
        title: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const result = await ctx.tmdb.searchMovieByTitle({
        title: input.title.toLowerCase(),
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
      const result = await ctx.tmdb.getCreditsForMovie({
        movieId: input.id,
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
  getRandomPopularMovie: publicProcedure.query(async ({ ctx }) => {
    // Choose between the first 10 pages of popular people
    const randomPage = Math.floor(Math.random() * 10) + 1;

    const result = await ctx.tmdb.discoverMovies({
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
