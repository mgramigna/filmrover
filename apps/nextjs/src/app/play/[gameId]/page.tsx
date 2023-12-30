"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { TMDBImage } from "@/components/TMDBImage";
import { Button } from "@/components/ui/button";
import { useHistory } from "@/context/HistoryContext";
import { useTimer } from "@/context/TimerContext";
import { api } from "@/trpc/react";

export default function GameIdPage() {
  const router = useRouter();
  const { gameId } = useParams<{ gameId: string }>();

  const { start } = useTimer();
  const { logHistory } = useHistory();

  const { data: game } = api.game.getById.useQuery({
    id: gameId,
  });

  const { startMovieId, endMovieId, startPersonId, endPersonId } = game ?? {};

  const { data: startMovie } = api.movie.getById.useQuery(
    {
      id: startMovieId!,
    },
    {
      enabled: !!startMovieId,
    },
  );

  const { data: endMovie } = api.movie.getById.useQuery(
    {
      id: endMovieId!,
    },
    {
      enabled: !!endMovieId,
    },
  );

  const { data: startPerson } = api.person.getById.useQuery(
    {
      id: startPersonId!,
    },
    {
      enabled: !!startPersonId,
    },
  );

  const { data: endPerson } = api.person.getById.useQuery(
    {
      id: endPersonId!,
    },
    {
      enabled: !!endPersonId,
    },
  );

  if (game?.isFinished) {
    return (
      <div className="container mt-12 flex flex-col items-center">
        <h3 className="text-3xl font-bold tracking-tight">Game Ended</h3>
        <div>This game has already been completed</div>

        <Link href="/play">
          <Button>Start a New Game</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-12 flex flex-col items-center">
      <h1 className="text-5xl font-extrabold tracking-tight">Your Game</h1>
      <div className="mt-12 flex w-full items-center justify-evenly">
        {startMovie?.poster_path && (
          <TMDBImage slug={startMovie.poster_path} priority />
        )}
        {startPerson?.profile_path && (
          <TMDBImage slug={startPerson.profile_path} priority />
        )}
        <div className="h-10 w-10">
          <ArrowRight className="h-full w-full" />
        </div>
        {endMovie?.poster_path && (
          <TMDBImage slug={endMovie.poster_path} priority />
        )}
        {endPerson?.profile_path && (
          <TMDBImage slug={endPerson.profile_path} priority />
        )}
      </div>
      <div className="mt-12 text-center text-xl">
        Navigate from{" "}
        <span className="font-bold">
          {startMovie?.title ?? startPerson?.name}
        </span>{" "}
        to{" "}
        <span className="font-bold">{endMovie?.title ?? endPerson?.name}</span>{" "}
        as quickly as possible by clicking links on each page
      </div>
      <div className="mt-12 flex gap-4">
        <Link href="/play">
          <Button variant="ghost">Start Over</Button>
        </Link>
        {startMovieId && (
          <div>
            <Button
              onClick={() => {
                if (startMovie?.title) {
                  logHistory({
                    type: "movie",
                    id: startMovieId,
                    display: startMovie.title,
                  });
                }
                start();
                router.push(`/play/${gameId}/m/${startMovieId}`);
              }}
            >
              Start Game
            </Button>
          </div>
        )}
        {startPersonId && (
          <div>
            <Button
              onClick={() => {
                if (startPerson?.name) {
                  logHistory({
                    type: "person",
                    id: startPersonId,
                    display: startPerson?.name,
                  });
                }
                start();
                router.push(`/play/${gameId}/p/${startPersonId}`);
              }}
            >
              Start Game
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
