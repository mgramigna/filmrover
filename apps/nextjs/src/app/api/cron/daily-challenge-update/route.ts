import { match } from "ts-pattern";

import type { RouterInputs } from "@filmrover/api";

import { api } from "@/trpc/server";

export const dynamic = "force-dynamic";

const getRandomType = () =>
  Math.random() < 0.5 ? ("movie" as const) : ("person" as const);

const rollRandomSelection = async (dataType: "movie" | "person") => {
  return match(dataType)
    .with("movie", async () => api.movie.getRandomPopularMovie.query())
    .with("person", async () => api.person.getRandomPopularPerson.query())
    .exhaustive();
};

const GET = async () => {
  const randomStartType = getRandomType();
  let randomEndType = getRandomType();

  const randomStart = await rollRandomSelection(randomStartType);
  let randomEnd = await rollRandomSelection(randomEndType);

  if (!randomStart || !randomEnd) {
    return Response.json(
      { success: false },
      {
        status: 500,
      },
    );
  }

  // Re-roll end if they're the same
  while (randomStart.id === randomEnd!.id) {
    randomEndType = getRandomType();
    randomEnd = await rollRandomSelection(randomEndType);
  }

  const challengeInput = match({
    startType: randomStartType,
    endType: randomEndType,
  })
    .returnType<RouterInputs["challenge"]["addDailyChallenge"]>()
    .with({ startType: "movie", endType: "movie" }, () => ({
      startMovieId: randomStart.id,
      endMovieId: randomEnd!.id,
    }))
    .with({ startType: "movie", endType: "person" }, () => ({
      startMovieId: randomStart.id,
      endPersonId: randomEnd!.id,
    }))
    .with({ startType: "person", endType: "movie" }, () => ({
      startPersonId: randomStart.id,
      endMovieId: randomEnd!.id,
    }))
    .with({ startType: "person", endType: "person" }, () => ({
      startPersonId: randomStart.id,
      endPersonId: randomEnd!.id,
    }))
    .exhaustive();

  await api.challenge.addDailyChallenge.mutate(challengeInput);

  return Response.json({
    success: true,
    start: `${randomStartType}/${randomStart.id}`,
    end: `${randomEndType}/${randomEnd?.id}`,
  });
};

export { GET };
