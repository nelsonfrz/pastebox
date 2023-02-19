import { createTRPCRouter } from "./trpc";
import { textRouter } from "./routers/text";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  text: textRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
