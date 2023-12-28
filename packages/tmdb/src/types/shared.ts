import { z } from "zod";

export const ReleaseDateSchema = z.union([
  z.literal(""),
  z.string().regex(/\d\d\d\d-\d\d-\d\d/),
]);

export const BaseSearchResultSchema = z.object({
  page: z.number(),
  total_pages: z.number(),
  total_results: z.number(),
  results: z.never(),
});
