import { challengeRouter } from "./router/challenge";
import { gameRouter } from "./router/game";
import { movieRouter } from "./router/movie";
import { personRouter } from "./router/person";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  challenge: challengeRouter,
  movie: movieRouter,
  person: personRouter,
  game: gameRouter,
});

export type AppRouter = typeof appRouter;
