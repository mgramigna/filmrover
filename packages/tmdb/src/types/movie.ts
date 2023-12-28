import { z } from "zod";

export const MovieDetailSchema = z.object({
  id: z.number(),
  adult: z.boolean(),
  backdrop_path: z.string(),
  belongs_to_collection: z
    .object({
      id: z.number(),
      name: z.string(),
      poster_path: z.string(),
      backdrop_path: z.string(),
    })
    .nullable(),
  budget: z.number(),
  genres: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .array(),
  homepage: z.string().url(),
  imdb_id: z.string(),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string(),
  production_companies: z
    .object({
      id: z.number(),
      logo_path: z.string(),
      name: z.string(),
      origin_country: z.string(),
    })
    .array(),
  production_countries: z
    .object({
      iso_3166_1: z.string(),
      name: z.string(),
    })
    .array(),
  release_date: z.string().regex(/\d\d\d\d-\d\d-\d\d/),
  revenue: z.number(),
  runtime: z.number(),
  spoken_languages: z
    .object({
      english_name: z.string(),
      iso_639_1: z.string(),
      name: z.string(),
    })
    .array(),
  status: z.string(),
  tagline: z.string(),
  title: z.string(),
  video: z.boolean(),
  vote_average: z.number(),
  vote_count: z.number(),
});

export type MovieDetail = z.infer<typeof MovieDetailSchema>;
