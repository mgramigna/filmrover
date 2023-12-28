import { z } from "zod";

import { BaseSearchResultSchema } from "./shared";

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
