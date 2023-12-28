import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { TMDBClient } from "@filmrover/tmdb";

export const createTRPCContext = (opts: {
  headers: Headers;
  tmdbAccessToken: string;
}) => {
  const source = opts.headers.get("x-trpc-source") ?? "unknown";

  console.log(">>> tRPC Request from", source);

  return {
    source,
    tmdb: new TMDBClient(opts.tmdbAccessToken),
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
