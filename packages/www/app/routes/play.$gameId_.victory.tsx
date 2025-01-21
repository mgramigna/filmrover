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
import { toast } from "sonner";
import { match, P } from "ts-pattern";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { gameId } = params;

  if (!gameId) {
    throw new Response(null, { status: 404 });
  }

  await api.game.complete(gameId);

  const game = await api.game.getById(gameId);

  const [startMovie, startPerson, endMovie, endPerson] = await Promise.all([
    game.startMovieId
      ? api.movie.getById(game.startMovieId)
      : Promise.resolve(null),
    game.startPersonId
      ? api.person.getById(game.startPersonId)
      : Promise.resolve(null),
    game.endMovieId
      ? api.movie.getById(game.endMovieId)
      : Promise.resolve(null),
    game.endPersonId
      ? api.person.getById(game.endPersonId)
      : Promise.resolve(null),
  ]);

  return {
    startMovie,
    startPerson,
    endMovie,
    endPerson,
  };
};

export default function GameVictoryPage() {
  const { endMovie, endPerson, startMovie, startPerson } =
    useLoaderData<typeof loader>();

  const { history } = useHistory();

  const { stopTimer, seconds } = useTimer();

  useEffect(() => {
    stopTimer();
  }, [stopTimer]);

  const start = match({ startMovie, startPerson })
    .with({ startMovie: P.nonNullable }, ({ startMovie: movie }) => ({
      type: "movie" as const,
      id: movie.id,
      slug: movie.poster_path,
      title: movie.title,
    }))
    .with({ startPerson: P.nonNullable }, ({ startPerson: person }) => ({
      type: "person" as const,
      id: person.id,
      slug: person.profile_path,
      title: person.name,
    }))
    .otherwise(() => ({ slug: null, title: "", type: null, id: null }));

  const end = match({ endMovie, endPerson })
    .with({ endMovie: P.nonNullable }, ({ endMovie: movie }) => ({
      type: "movie" as const,
      id: movie.id,
      slug: movie.poster_path,
      title: movie.title,
    }))
    .with({ endPerson: P.nonNullable }, ({ endPerson: person }) => ({
      type: "person" as const,
      id: person.id,
      slug: person.profile_path,
      title: person.name,
    }))
    .otherwise(() => ({ slug: null, title: "", type: null, id: null }));

  const getGameLink = () => {
    const base = `${window.location.origin}/play`;

    const params = new URLSearchParams();

    if (start.type === "movie") {
      params.append("start_movie_id", start.id.toString());
    } else if (start.type === "person") {
      params.append("start_person_id", start.id.toString());
    }

    if (end.type === "movie") {
      params.append("end_movie_id", end.id.toString());
    } else if (end.type === "person") {
      params.append("end_person_id", end.id.toString());
    }

    return `${base}?${params.toString()}`;
  };

  return (
    <div className="container px-4 pb-24 sm:px-0">
      <div className="mt-8 space-y-4">
        <div className="flex flex-col items-center gap-4">
          <Heading variant="h3" className="text-center">
            {end.title}
          </Heading>
          <TMDBPoster slug={end.slug} title={end.title} />
        </div>
        <div className="flex flex-col items-center gap-6">
          <Heading variant="h4" className="text-center">
            🎉 You win! 🎉
          </Heading>
          <div className="min-w-32 rounded-lg border p-4">
            <Heading variant="h5" className="text-center">
              {formatTime(seconds)}
            </Heading>
          </div>
          <Heading variant="h5" className="text-center">
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
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                const gameLink = getGameLink();

                const text = `I just got from ${start.title} to ${end.title} in ${formatTime(seconds)} with ${
                  history.length - 1
                } clicks on FilmRover! Give it a shot! ${gameLink}`;

                if (navigator.share) {
                  navigator.share({ text }).catch(console.error);
                } else {
                  navigator.clipboard
                    .writeText(text)
                    .then(() => {
                      toast.success("Copied link to clipboard");
                    })
                    .catch(() => {
                      toast.error("Something went wrong");
                    });
                }
              }}
            >
              Share
            </Button>
            <Button asChild>
              <Link to="/">Play again</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
