"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { TMDBImage } from "@/components/TMDBImage";
import { Button } from "@/components/ui/button";
import { useTimer } from "@/context/TimerContext";
import { api } from "@/trpc/react";

export default function GameIdPage() {
  const router = useRouter();
  const { gameId } = useParams<{ gameId: string }>();

  const { start } = useTimer();

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
      <div className="flex w-full items-center justify-evenly">
        {startMovie?.poster_path && (
          <TMDBImage
            slug={startMovie.poster_path}
            title={startMovie.title}
            priority
          />
        )}
        {startPerson?.profile_path && (
          <TMDBImage
            slug={startPerson.profile_path}
            title={startPerson.name}
            priority
          />
        )}
        <div className="h-10 w-10">
          <ArrowRight className="h-full w-full" />
        </div>
        {endMovie?.poster_path && (
          <TMDBImage
            slug={endMovie.poster_path}
            title={endMovie.title}
            priority
          />
        )}
        {endPerson?.profile_path && (
          <TMDBImage
            slug={endPerson.profile_path}
            title={endPerson.name}
            priority
          />
        )}
      </div>
      {startMovieId && (
        <div className="mt-12">
          <Button
            onClick={() => {
              start();
              router.push(`/play/${gameId}/m/${startMovieId}`);
            }}
          >
            Start Game
          </Button>
        </div>
      )}
      {startPersonId && (
        <div className="mt-12">
          <Button
            onClick={() => {
              start();
              router.push(`/play/${gameId}/p/${startPersonId}`);
            }}
          >
            Start Game
          </Button>
        </div>
      )}
    </div>
  );
}
