import type { Result } from "neverthrow";
import type { ZodType, ZodTypeDef } from "zod";
import { ResultAsync } from "neverthrow";

import type { MovieDetail } from "./types";
import type { MovieCredit, PersonCredit } from "./types/credits";
import { MovieDetailSchema } from "./types";
import { MovieCreditSchema, PersonCreditSchema } from "./types/credits";

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
}