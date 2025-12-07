import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getAllVoices, filterVoices, getCategories, getStatistics, getVoiceById } from "./voiceService";
import { getAllCustomSamplesWithAudio, getCustomVoiceSamples } from "./customVoiceService";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  voices: router({
    list: publicProcedure.query(() => {
      const voices = getAllVoices();
      return {
        success: true,
        voices,
        total: voices.length
      };
    }),
    filter: publicProcedure
      .input(z.object({
        gender: z.string().optional(),
        category: z.string().optional()
      }))
      .query(({ input }) => {
        const voices = filterVoices(input.gender, input.category);
        return {
          success: true,
          voices,
          total: voices.length
        };
      }),
    categories: publicProcedure.query(() => {
      return {
        success: true,
        categories: getCategories()
      };
    }),
    statistics: publicProcedure.query(() => {
      return {
        success: true,
        stats: getStatistics()
      };
    }),
    byId: publicProcedure
      .input(z.string())
      .query(({ input }) => {
        const voice = getVoiceById(input);
        if (!voice) {
          throw new Error('Voice not found');
        }
        return {
          success: true,
          voice
        };
      })
  }),

  // Custom voice samples with TTS generation and S3 caching
  customVoices: router({
    // Get voice configurations without audio (fast, no API calls)
    list: publicProcedure.query(() => {
      return {
        success: true,
        samples: getCustomVoiceSamples()
      };
    }),
    // Get voice samples with cached or generated audio URLs
    listWithAudio: publicProcedure.query(async () => {
      const samples = await getAllCustomSamplesWithAudio();
      return {
        success: true,
        samples
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
