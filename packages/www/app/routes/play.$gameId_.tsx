import PersistentTimer from "@/components/timer";
import { TimerProvider, useTimer } from "@/components/timer-provider";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
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

  const destinationName = match({ endMovie, endPerson })
    .with({ endMovie: P.nonNullable }, ({ endMovie }) => endMovie.title)
    .with({ endPerson: P.nonNullable }, ({ endPerson }) => endPerson.name)
    .otherwise(() => "");

  return (
    <TimerProvider gameId={game.id}>
      <Helper destinationName={destinationName} />
    </TimerProvider>
  );
}

const Helper = ({ destinationName }: { destinationName: string }) => {
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
      <div className="sticky top-0 z-10 bg-primary text-primary-foreground py-2">
        <div className="container px-4 sm:px-0">
          <div className="flex items-center">
            <div className="flex-1">
              <PersistentTimer />
            </div>
            <div className="flex flex-1 justify-center">
              <p className="text-center">
                Navigate to <span className="font-bold">{destinationName}</span>
              </p>
            </div>
            <div className="flex flex-1 justify-end">
              <Button asChild variant="secondary">
                <Link to="/">Give Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
};
