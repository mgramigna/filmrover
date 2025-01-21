import { dailyChallenge, db, eq } from "@filmrover/db";
import { TMDBClient } from "@filmrover/tmdb";
import type { APIGatewayProxyHandler } from "aws-lambda";
import invariant from "tiny-invariant";
import { match } from "ts-pattern";

const getRandomType = () =>
  Math.random() < 0.5 ? ("movie" as const) : ("person" as const);

const getRandomPopularMovie = async (tmdb: TMDBClient) => {
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
};

const getRandomPopularPerson = async (tmdb: TMDBClient) => {
  // Choose between the first 10 pages of popular people
  const randomPage = Math.floor(Math.random() * 10) + 1;

  const result = await tmdb.searchPopularPeople({
    page: randomPage,
  });

  if (result.isErr()) {
    throw new Error(result.error.message);
  }

  const { results } = result.value;

  return results[Math.floor(Math.random() * results.length)];
};

const rollRandomSelection = async (
  tmdb: TMDBClient,
  dataType: "movie" | "person",
) => {
  return match(dataType)
    .with("movie", async () => getRandomPopularMovie(tmdb))
    .with("person", async () => getRandomPopularPerson(tmdb))
    .exhaustive();
};

export const handler: APIGatewayProxyHandler = async () => {
  const tmdb = new TMDBClient();

  const randomStartType = getRandomType();
  let randomEndType = getRandomType();

  const randomStart = await rollRandomSelection(tmdb, randomStartType);
  let randomEnd = await rollRandomSelection(tmdb, randomEndType);

  if (!randomStart || !randomEnd) {
    console.error("Failed to get random selection");

    return {
      statusCode: 500,
      body: "Failed to get random selection",
    };
  }

  // Re-roll end if they're the same
  while (randomStart.id === randomEnd?.id) {
    randomEndType = getRandomType();
    randomEnd = await rollRandomSelection(tmdb, randomEndType);
  }

  invariant(randomStart && randomEnd, "Failed to get random selection");

  const challengeInput = match({
    startType: randomStartType,
    endType: randomEndType,
  })
    .with({ startType: "movie", endType: "movie" }, () => ({
      startMovieId: randomStart.id,
      endMovieId: randomEnd.id,
      startPersonId: null,
      endPersonId: null,
    }))
    .with({ startType: "movie", endType: "person" }, () => ({
      startMovieId: randomStart.id,
      endMovieId: null,
      startPersonId: null,
      endPersonId: randomEnd.id,
    }))
    .with({ startType: "person", endType: "movie" }, () => ({
      startMovieId: null,
      endMovieId: randomEnd.id,
      startPersonId: randomStart.id,
      endPersonId: null,
    }))
    .with({ startType: "person", endType: "person" }, () => ({
      startMovieId: null,
      endMovieId: null,
      startPersonId: randomStart.id,
      endPersonId: randomEnd.id,
    }))
    .exhaustive();

  const { startMovieId, startPersonId, endMovieId, endPersonId } =
    challengeInput;

  // Deactivate existing challenge
  await db
    .update(dailyChallenge)
    .set({
      isActive: false,
    })
    .where(eq(dailyChallenge.isActive, true));

  await db.insert(dailyChallenge).values({
    startMovieId,
    startPersonId,
    endMovieId,
    endPersonId,
    isActive: true,
  });

  return { statusCode: 200, body: JSON.stringify(challengeInput) };
};
