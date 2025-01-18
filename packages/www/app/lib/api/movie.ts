import { TMDBClient } from "@filmrover/tmdb";

export const movie = {
  getById: async (id: number) => {
    const tmdb = new TMDBClient();
    const result = await tmdb.getMovieById({
      id,
    });

    if (result.isErr()) {
      throw new Error(result.error.message);
    }

    return result.value;
  },
  getCredits: async (id: number) => {
    const tmdb = new TMDBClient();
    const result = await tmdb.getCreditsForMovie({
      movieId: id,
    });

    if (result.isErr()) {
      throw new Error(result.error.message);
    }

    return result.value;
  },
  getRandomPopularMovie: async () => {
    const tmdb = new TMDBClient();

    // Choose between the first 10 pages of popular people
    const randomPage = Math.floor(Math.random() * 10) + 1;

    const result = await tmdb.discoverMovies({
      page: randomPage,
    });

    if (result.isErr()) {
      throw new Error(result.error.message);
    }

    const { results } = result.value;

    return results[Math.floor(Math.random() * results.length)];
  },
};
