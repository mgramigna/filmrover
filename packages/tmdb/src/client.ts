import type { Result } from "neverthrow";
import type { ZodType, ZodTypeDef } from "zod";
import { ResultAsync } from "neverthrow";

import type { MovieDetail, MovieSearchResult } from "./types";
import type { MovieCredit, PersonCredit } from "./types/credits";
import type { PersonDetail, PersonSearchResult } from "./types/person";
import { MovieDetailSchema, MovieSearchResultSchema } from "./types";
import { MovieCreditSchema, PersonCreditSchema } from "./types/credits";
import { PersonDetailSchema, PersonSearchResultSchema } from "./types/person";

const TMDB_API_URL = "https://api.themoviedb.org/3";

export class TMDBClient {
  baseUrl: string;

  constructor(public bearerToken: string) {
    this.baseUrl = TMDB_API_URL;
  }

  private fetch<T>({
    schema,
    path,
    query,
  }: {
    schema: ZodType<T, ZodTypeDef, T>;
    path: string;
    query?: string;
  }): ResultAsync<T, Error> {
    const queryString = query ? `?${query}` : "";

    console.log(`[TMDB] GET ${path}${queryString}`);

    return ResultAsync.fromPromise(
      fetch(`${this.baseUrl}/${path}${queryString}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.bearerToken}`,
        },
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(
              `${response.status} ${
                response.statusText
              } - ${await response.text()}`,
            );
          }

          return response.json();
        })
        .then((data: unknown) => schema.parse(data)),
      (e) => {
        if (e instanceof Error) {
          return new Error(e.message);
        }

        return new Error("Unknown error occurred querying tmdb API");
      },
    );
  }

  async getMovieById({
    id,
  }: {
    id: number;
  }): Promise<Result<MovieDetail, Error>> {
    const result = await this.fetch({
      schema: MovieDetailSchema,
      path: `/movie/${id}`,
    });

    return result;
  }

  async getCreditsForMovie({
    movieId,
  }: {
    movieId: number;
  }): Promise<Result<MovieCredit, Error>> {
    const result = await this.fetch({
      schema: MovieCreditSchema,
      path: `/movie/${movieId}/credits`,
    });

    return result;
  }

  async getCreditsForPerson({
    personId,
  }: {
    personId: number;
  }): Promise<Result<PersonCredit, Error>> {
    const result = await this.fetch({
      schema: PersonCreditSchema,
      path: `/person/${personId}/combined_credits`,
    });

    return result;
  }

  async searchMovieByTitle({
    title,
  }: {
    title: string;
  }): Promise<Result<MovieSearchResult, Error>> {
    const result = await this.fetch({
      schema: MovieSearchResultSchema,
      path: "/search/movie",
      query: new URLSearchParams({
        query: title,
      }).toString(),
    });

    return result;
  }

  async searchPersonByName({
    name,
  }: {
    name: string;
  }): Promise<Result<PersonSearchResult, Error>> {
    const result = await this.fetch({
      schema: PersonSearchResultSchema,
      path: "/search/person",
      query: new URLSearchParams({
        query: name,
      }).toString(),
    });

    return result;
  }

  async getPersonById({
    id,
  }: {
    id: number;
  }): Promise<Result<PersonDetail, Error>> {
    const result = await this.fetch({
      schema: PersonDetailSchema,
      path: `/person/${id}`,
    });

    return result;
  }

  async searchPopularMovies({
    page = 1,
  }: {
    page?: number;
  }): Promise<Result<MovieSearchResult, Error>> {
    const result = await this.fetch({
      schema: MovieSearchResultSchema,
      path: "/movie/popular",
      query: new URLSearchParams({
        page: page.toString(),
      }).toString(),
    });

    return result;
  }

  async discoverMovies({
    page = 1,
    includeInternational,
  }: {
    page?: number;
    includeInternational?: boolean;
  }): Promise<Result<MovieSearchResult, Error>> {
    const result = await this.fetch({
      schema: MovieSearchResultSchema,
      path: "/discover/movie",
      query: new URLSearchParams({
        page: page.toString(),
        ...(!includeInternational && { with_origin_country: "US" }),
      }).toString(),
    });

    return result;
  }

  async searchPopularPeople({
    page = 1,
  }: {
    page?: number;
  }): Promise<Result<PersonSearchResult, Error>> {
    const result = await this.fetch({
      schema: PersonSearchResultSchema,
      path: "/person/popular",
      query: new URLSearchParams({
        page: page.toString(),
      }).toString(),
    });

    return result;
  }
}
