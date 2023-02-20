import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

import type { Text } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: input.id,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User could not be found.",
        });
      }

      let texts: Text[] = [];

      if (user.id === ctx.session?.user.id) {
        texts = await ctx.prisma.text.findMany({
          orderBy: [
            {
              date: "desc",
            },
          ],
          where: {
            userId: input.id,
          },
        });
      } else {
        texts = await ctx.prisma.text.findMany({
          where: {
            userId: input.id,
            publicVisibility: true,
          },
        });
      }

      return {
        ...user,
        texts: texts,
      };
    }),

  edit: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3).max(100),
        description: z.string().max(200),
        image: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
          description: input.description,
          image: input.image,
        },
      });
    }),
});
