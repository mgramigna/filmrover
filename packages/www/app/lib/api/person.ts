import { TMDBClient } from "@filmrover/tmdb";

export const person = {
  getById: async (id: number) => {
    const tmdb = new TMDBClient();
    const result = await tmdb.getPersonById({
      id,
    });

    if (result.isErr()) {
      throw new Error(result.error.message);
    }

    return result.value;
  },
  getCredits: async (id: number) => {
    const tmdb = new TMDBClient();
    const result = await tmdb.getCreditsForPerson({
      personId: id,
    });

    if (result.isErr()) {
      throw new Error(result.error.message);
    }

    return result.value;
  },
  getRandomPopularPerson: async () => {
    const tmdb = new TMDBClient();

    // Choose between the first 10 pages of popular people
    const randomPage = Math.floor(Math.random() * 10) + 1;

    const result = await tmdb.searchPopularPeople({
      page: randomPage,
    });

    if (result.isErr()) {
      throw new Error(result.error.message);
    }

    const { results } = result.value;

    const filteredResults = results.filter(
      (person) =>
        person.name === person.original_name &&
        !person.adult &&
        person.known_for?.at(0)?.media_type === "movie",
    );

    if (filteredResults.length === 0) {
      return results[0];
    }

    return filteredResults[Math.floor(Math.random() * filteredResults.length)];
  },
};
