import { movieRouter } from "./router/movie";
import { personRouter } from "./router/person";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  movie: movieRouter,
  person: personRouter,
});

export type AppRouter = typeof appRouter;
