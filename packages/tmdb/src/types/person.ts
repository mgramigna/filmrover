import { z } from "zod";

import { BaseSearchResultSchema } from "./shared";

export const PersonDetailSchema = z.object({
  // TODO: make this an actually accurate type
  id: z.number(),
  name: z.string(),
  profile_path: z.string().nullable(),
});

export type PersonDetail = z.infer<typeof PersonDetailSchema>;

export const PersonSearchResultSchema = BaseSearchResultSchema.extend({
  // TODO: make this an actually accurate type
  results: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .array(),
});

export type PersonSearchResult = z.infer<typeof PersonSearchResultSchema>;
