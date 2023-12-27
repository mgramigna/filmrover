import { pingRouter } from "./router/ping";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  ping: pingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
