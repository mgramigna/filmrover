import { z } from "zod";

export const MovieCreditSchema = z.object({
  id: z.number(),
  cast: z
    .object({
      id: z.number(),
      adult: z.boolean(),
      gender: z.number(),
      known_for_department: z.enum([
        "Production",
        "Costume & Make-Up",
        "Lighting",
        "Acting",
        "Crew",
        "Directing",
        "Writing",
        "Editing",
        "Sound",
        "Visual Effects",
        "Camera",
        "Art",
      ]),
      name: z.string(),
      original_name: z.string(),
      popularity: z.number(),
      profile_path: z.string().nullable(),
      cast_id: z.number(),
      character: z.string(),
      credit_id: z.string(),
      order: z.number(),
    })
    .array(),
});

export type MovieCredit = z.infer<typeof MovieCreditSchema>;
