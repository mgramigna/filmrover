import { z } from "zod";

export const ReleaseDateSchema = z.union([
  z.literal(""),
  z.string().regex(/\d\d\d\d-\d\d-\d\d/),
]);
