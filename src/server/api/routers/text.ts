import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const textRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const text = await ctx.prisma.text.findFirst({
        where: {
          id: input.id,
        },
      });
      if (
        text?.publicVisibility ||
        (text?.publicVisibility === false &&
          text.userId === ctx.session?.user.id)
      ) {
        const author = await ctx.prisma.user.findFirst({
          where: {
            id: text.userId,
          },
        });
        if (author) {
          return {
            ...text,
            author: author,
          };
        }
      }
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(100),
        description: z.string().min(1).max(200),
        content: z.string().min(1),
        publicVisibility: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.text.create({
        data: {
          title: input.title,
          description: input.description,
          content: input.content,
          userId: ctx.session.user.id,
          publicVisibility: input.publicVisibility,
        },
      });
    }),

  edit: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).max(100),
        description: z.string().min(1).max(200),
        content: z.string().min(1).max(100000),
        publicVisibility: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const text = await ctx.prisma.text.findFirst({
        where: {
          id: input.id,
        },
      });

      if (!text) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Text could not be found.",
        });
      }

      if (ctx.session.user.id !== text?.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to edit texts from someone else.",
        });
      }

      return await ctx.prisma.text.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          description: input.description,
          content: input.content,
          publicVisibility: input.publicVisibility,
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const text = await ctx.prisma.text.findFirst({
        where: {
          id: input.id,
        },
      });

      if (!text) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Text could not be found.",
        });
      }

      if (ctx.session.user.id !== text?.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to delete texts from someone else.",
        });
      }

      await ctx.prisma.text.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
