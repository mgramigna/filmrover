import { useTimer } from "@/components/timer-provider";
import { TMDBPoster } from "@/components/tmdb-poster";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { api } from "@/lib/api";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { match, P } from "ts-pattern";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { gameId } = params;

  if (!gameId) {
    throw new Response(null, { status: 404 });
  }

  await api.game.complete(gameId);

  const game = await api.game.getById(gameId);

  const [startMovie, endMovie, startPerson, endPerson] = await Promise.all([
    game.startMovieId
      ? api.movie.getById(game.startMovieId)
      : Promise.resolve(null),
    game.endMovieId
      ? api.movie.getById(game.endMovieId)
      : Promise.resolve(null),
    game.startPersonId
      ? api.person.getById(game.startPersonId)
      : Promise.resolve(null),
    game.endPersonId
      ? api.person.getById(game.endPersonId)
      : Promise.resolve(null),
  ]);

  return {
    game,
    startMovie,
    endMovie,
    startPerson,
    endPerson,
  };
};

export default function GameVictoryPage() {
  const { game, endMovie, endPerson, startMovie, startPerson } =
    useLoaderData<typeof loader>();

  const { stopTimer } = useTimer();

  useEffect(() => {
    stopTimer();
  }, [stopTimer]);

  const startPoster = match({ startMovie, startPerson })
    .returnType<{ slug: string | null; title: string }>()
    .with({ startMovie: P.nonNullable }, ({ startMovie: movie }) => ({
      slug: movie.poster_path,
      title: movie.title,
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
      title: movie.title,
    }))
    .with({ endPerson: P.nonNullable }, ({ endPerson: person }) => ({
      slug: person.profile_path,
      title: person.name,
    }))
    .otherwise(() => ({ slug: null, title: "" }));

  return (
    <div className="container px-4 pb-24 sm:px-0">
      <div className="mt-8 flex flex-col items-center gap-4">
        <Heading variant="h1" className="text-center">
          Victory!
        </Heading>
        <TMDBPoster slug={startPoster.slug} title={startPoster.title} />
        <TMDBPoster slug={endPoster.slug} title={endPoster.title} />
      </div>
      <Button asChild className="mt-8">
        <Link to="/">Play again</Link>
      </Button>
    </div>
  );
}
