import { useHistory } from "@/components/history-provider";
import { formatTime } from "@/components/timer";
import { useTimer } from "@/components/timer-provider";
import { TMDBPoster } from "@/components/tmdb-poster";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { match, P } from "ts-pattern";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { gameId } = params;

  if (!gameId) {
    throw new Response(null, { status: 404 });
  }

  await api.game.complete(gameId);

  const game = await api.game.getById(gameId);

  const [endMovie, endPerson] = await Promise.all([
    game.endMovieId
      ? api.movie.getById(game.endMovieId)
      : Promise.resolve(null),
    game.endPersonId
      ? api.person.getById(game.endPersonId)
      : Promise.resolve(null),
  ]);

  return {
    endMovie,
    endPerson,
  };
};

export default function GameVictoryPage() {
  const { endMovie, endPerson } = useLoaderData<typeof loader>();

  const { history } = useHistory();

  const { stopTimer, seconds } = useTimer();

  useEffect(() => {
    stopTimer();
  }, [stopTimer]);

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
      <div className="mt-8 space-y-4">
        <div className="flex flex-col items-center gap-4">
          <Heading variant="h1" className="text-center">
            {endPoster.title}
          </Heading>
          <TMDBPoster slug={endPoster.slug} title={endPoster.title} />
        </div>
        <div className="flex flex-col items-center gap-6">
          <Heading variant="h2" className="text-center">
            🎉 You win! 🎉
          </Heading>
          <div className="min-w-32 rounded-lg border p-4">
            <Heading variant="h3" className="text-center">
              {formatTime(seconds)}
            </Heading>
          </div>
          <Heading variant="h4" className="text-center">
            {history.length} click{history.length === 1 ? "" : "s"}
          </Heading>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {history.map((entry, i) => (
              <div key={entry.id} className="flex items-center gap-2">
                <p
                  className={cn(
                    "text-center",
                    i === 0 && "font-bold",
                    i === history.length - 1 && "font-bold text-primary",
                  )}
                >
                  {entry.display}
                </p>
                {i !== history.length - 1 && <ChevronRight />}
              </div>
            ))}
          </div>
          <Button asChild>
            <Link to="/">Play again</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
