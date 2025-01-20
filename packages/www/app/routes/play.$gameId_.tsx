import PersistentTimer from "@/components/timer";
import { TimerProvider, useTimer } from "@/components/timer-provider";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { useEffect } from "react";
import { match, P } from "ts-pattern";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { gameId } = params;

  if (!gameId) {
    throw new Response(null, { status: 404 });
  }

  const game = await api.game.getById(gameId);

  const [endMovie, endPerson] = await Promise.all([
    game.endMovieId
      ? api.movie.getById(game.endMovieId)
      : Promise.resolve(null),
    game.endPersonId
      ? api.person.getById(game.endPersonId)
      : Promise.resolve(null),
  ]);

  return { game, endMovie, endPerson };
};

export default function PlayHomepage() {
  const { game, endPerson, endMovie } = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="text-center">
        Navigate to{" "}
        {match({ endMovie, endPerson })
          .with({ endMovie: P.nonNullable }, ({ endMovie }) => (
            <span>{endMovie.title}</span>
          ))
          .with({ endPerson: P.nonNullable }, ({ endPerson }) => (
            <span>{endPerson.name}</span>
          ))
          .otherwise(() => "home")}
      </div>
      <Button asChild className="mt-8">
        <Link to="/">Give Up</Link>
      </Button>
      <TimerProvider gameId={game.id}>
        <Helper />
      </TimerProvider>
    </div>
  );
}

const Helper = () => {
  const location = useLocation();

  const { isRunning, startTimer } = useTimer();

  useEffect(() => {
    if (
      !isRunning &&
      (location.pathname.includes("/m/") || location.pathname.includes("/p/"))
    ) {
      startTimer();
    }
  }, [startTimer, location.pathname, isRunning]);

  return (
    <div>
      <PersistentTimer />
      <Outlet />
    </div>
  );
};
