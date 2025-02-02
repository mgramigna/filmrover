import { TMDBPoster } from "@/components/tmdb-poster";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { LoaderButton } from "@/components/ui/loader-button";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, redirect, useFetcher, useLoaderData } from "@remix-run/react";
import { ChevronRight, Clapperboard } from "lucide-react";
import { P, match } from "ts-pattern";

export const meta: MetaFunction = () => {
  return [
    { title: "FilmRover" },
    {
      name: "description",
      content: "Test your movie knowledge, Wikipedia-game style!",
    },
  ];
};

const getGameLink = ({
  endMovieId,
  endPersonId,
  startMovieId,
  startPersonId,
}: {
  startMovieId: number | null;
  startPersonId: number | null;
  endMovieId: number | null;
  endPersonId: number | null;
}) => {
  let res = "/play?";

  if (startMovieId) {
    res += `start_movie_id=${startMovieId}&`;
  }

  if (startPersonId) {
    res += `start_person_id=${startPersonId}&`;
  }

  if (endMovieId) {
    res += `end_movie_id=${endMovieId}&`;
  }

  if (endPersonId) {
    res += `end_person_id=${endPersonId}&`;
  }

  return res;
};

export const loader = async () => {
  const challenge = await api.challenge.getCurrentDailyChallenge();

  const [startMovie, endMovie, startPerson, endPerson] = await Promise.all([
    challenge?.startMovieId
      ? api.movie.getById(challenge.startMovieId)
      : Promise.resolve(null),
    challenge?.endMovieId
      ? api.movie.getById(challenge.endMovieId)
      : Promise.resolve(null),
    challenge?.startPersonId
      ? api.person.getById(challenge.startPersonId)
      : Promise.resolve(null),
    challenge?.endPersonId
      ? api.person.getById(challenge.endPersonId)
      : Promise.resolve(null),
  ]);

  return { challenge, startMovie, endMovie, startPerson, endPerson };
};

export const action = async (_: ActionFunctionArgs) => {
  const [randomMovie, randomPerson, randomMovie2, randomPerson2] =
    await Promise.all([
      api.movie.getRandomPopularMovie(),
      api.person.getRandomPopularPerson(),
      api.movie.getRandomPopularMovie(),
      api.person.getRandomPopularPerson(),
    ]);

  let startMovieId: number | null = null;
  let startPersonId: number | null = null;
  let endMovieId: number | null = null;
  let endPersonId: number | null = null;

  if (Math.random() < 0.5) {
    startMovieId = randomMovie.id;
  } else {
    startPersonId = randomPerson.id;
  }

  if (Math.random() < 0.5) {
    endMovieId = randomMovie2.id;
  } else {
    endPersonId = randomPerson2.id;
  }

  return redirect(
    getGameLink({ startMovieId, startPersonId, endMovieId, endPersonId }),
  );
};

export default function Index() {
  const { challenge, startMovie, endMovie, startPerson, endPerson } =
    useLoaderData<typeof loader>();

  const fetcher = useFetcher<typeof action>();

  const startPoster = match({ startMovie, startPerson })
    .returnType<{ slug: string | null; title: string }>()
    .with({ startMovie: P.nonNullable }, ({ startMovie: movie }) => ({
      slug: movie.poster_path,
      title: `${movie.title}${movie.release_date ? ` (${new Date(movie.release_date).getFullYear()})` : ""}`,
    }))
    .with({ startPerson: P.nonNullable }, ({ startPerson: person }) => ({
      slug: person.profile_path,
      title: person.name,
    }))
    .otherwise(() => ({ slug: null, title: "" }));

  const endPoster = match({ endMovie, endPerson })
    .returnType<{ slug: string | null; title: string }>()
    .with({ endMovie: P.nonNullable }, ({ endMovie: movie }) => ({
      slug: movie.poster_path,
      title: `${movie.title}${movie.release_date ? ` (${new Date(movie.release_date).getFullYear()})` : ""}`,
    }))
    .with({ endPerson: P.nonNullable }, ({ endPerson: person }) => ({
      slug: person.profile_path,
      title: person.name,
    }))
    .otherwise(() => ({ slug: null, title: "" }));

  return (
    <div className="container px-4 pb-24 sm:px-0">
      <div className="m-auto max-w-screen-md">
        <div className="mt-12 space-y-4 text-center">
          <Heading variant="h1">FilmRover</Heading>
          <Heading variant="h3">
            Test your movie knowledge, Wikipedia-game style!
          </Heading>
        </div>
        {challenge && (
          <div className="mt-12">
            <Heading variant="h4">Today's Challenge</Heading>
            <Separator className="my-4" />
            <div className="grid grid-cols-3 place-items-center px-8 md:px-12 lg:px-24">
              <div className="flex flex-col items-center gap-4">
                <Heading variant="h5" className="text-center">
                  {startPoster.title}
                </Heading>
                <TMDBPoster
                  slug={startPoster.slug}
                  title={startPoster.title}
                  size="sm"
                />
              </div>
              <ChevronRight />
              <div className="flex flex-col items-center gap-4">
                <Heading variant="h5" className="text-center">
                  {endPoster.title}
                </Heading>
                <TMDBPoster
                  slug={endPoster.slug}
                  title={endPoster.title}
                  size="sm"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <Button asChild className="mt-8">
                <Link
                  to={getGameLink({
                    startMovieId: challenge.startMovieId,
                    startPersonId: challenge.startPersonId,
                    endMovieId: challenge.endMovieId,
                    endPersonId: challenge.endPersonId,
                  })}
                >
                  Play Daily Challenge
                </Link>
              </Button>
            </div>
          </div>
        )}
        <Heading variant="h4" className="mt-12 text-center">
          Or... play a random game
        </Heading>
        <fetcher.Form method="POST" className="flex justify-center">
          <LoaderButton
            type="submit"
            className="mt-8"
            variant="secondary"
            isLoading={fetcher.state === "submitting"}
          >
            Generate Random Game
          </LoaderButton>
        </fetcher.Form>
        <Heading variant="h4" className="mt-12">
          How to Play
        </Heading>
        <Separator className="my-4" />
        <ul className="mt-12 space-y-8">
          <li className="flex items-center gap-2">
            <Clapperboard className="text-muted-foreground" />
            <div className="flex-1">
              Navigate from your start to destination by clicking links
            </div>
          </li>
          <li className="flex items-center gap-2">
            <Clapperboard className="text-muted-foreground" />
            <div className="flex-1">
              Movies link to people, and people link to movies
            </div>
          </li>
          <li className="flex items-center gap-2">
            <Clapperboard className="text-muted-foreground" />
            <div className="flex-1">
              Click wisely! A lot more connections exist than you might think,
              but one wrong click can ruin your day
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
