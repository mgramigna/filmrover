import { z } from "zod";

import { ReleaseDateSchema } from "./shared";

const DepartmentSchema = z.enum([
  "Creator",
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
]);

const CastOrCrewDetailSchema = z.object({
  id: z.number(),
  adult: z.boolean(),
  gender: z.number(),
  known_for_department: DepartmentSchema,
  name: z.string(),
  original_name: z.string(),
  popularity: z.number(),
  profile_path: z.string().nullable(),
  credit_id: z.string(),
});

export const MovieCreditSchema = z.object({
  id: z.number(),
  cast: CastOrCrewDetailSchema.extend({
    character: z.string(),
    cast_id: z.number(),
    order: z.number().optional(),
  }).array(),
  crew: CastOrCrewDetailSchema.extend({
    department: DepartmentSchema,
    job: z.string(),
  }).array(),
});

export type MovieCredit = z.infer<typeof MovieCreditSchema>;

const BasePersonCreditSchema = z.object({
  id: z.number(),
  adult: z.boolean(),
  backdrop_path: z.string().nullable(),
  genre_ids: z.number().array().optional(),
  original_language: z.string(),
  original_title: z.string().optional(),
  overview: z.string(),
  popularity: z.number().optional(),
  poster_path: z.string().nullable(),
  release_date: ReleaseDateSchema.optional(),
  title: z.string().optional(),
  vote_average: z.number().optional(),
  vote_count: z.number().optional(),

  media_type: z.string(),
});

export const PersonCastCreditSchema = BasePersonCreditSchema.extend({
  character: z.string(),
  credit_id: z.string(),
  order: z.number().optional(),
  video: z.boolean().optional(),
});

export const PersonCrewCreditSchema = BasePersonCreditSchema.extend({
  department: DepartmentSchema,
  job: z.string(),
});

export const PersonCreditSchema = z.object({
  id: z.number(),
  cast: PersonCastCreditSchema.array(),
  crew: PersonCrewCreditSchema.array(),
});

export type PersonCredit = z.infer<typeof PersonCreditSchema>;
