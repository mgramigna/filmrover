import { z } from "zod";

import { BaseSearchResultSchema, ReleaseDateSchema } from "./shared";

export const MovieDetailSchema = z.object({
  id: z.number(),
  adult: z.boolean(),
  backdrop_path: z.string().nullable(),
  belongs_to_collection: z
    .object({
      id: z.number(),
      name: z.string(),
      poster_path: z.string().nullable(),
      backdrop_path: z.string().nullable(),
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
  original_title: z.string().optional(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string().nullable(),
  production_companies: z
    .object({
      id: z.number(),
      logo_path: z.string().nullable(),
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
  release_date: ReleaseDateSchema,
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

export const MovieSearchResultSchema = BaseSearchResultSchema.extend({
  results: MovieDetailSchema.pick({
    id: true,
    title: true,
    original_title: true,
    original_language: true,
    adult: true,
    backdrop_path: true,
    overview: true,
    popularity: true,
    poster_path: true,
    release_date: true,
    video: true,
    vote_average: true,
    vote_count: true,
  })
    .extend({
      genre_ids: z.number().array(),
    })
    .array(),
});

export type MovieSearchResult = z.infer<typeof MovieSearchResultSchema>;
