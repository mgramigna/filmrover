"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

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
        {startMovie && (
          <div>
            <h3 className="text-3xl font-bold tracking-tight">
              {startMovie.title}
            </h3>
            <Image
              src={`https://image.tmdb.org/t/p/original/${startMovie.poster_path}`}
              width={200}
              height={300}
              alt={`${startMovie.title} Poster`}
            />
          </div>
        )}
        {startPerson && (
          <div>
            <h3 className="text-3xl font-bold tracking-tight">
              {startPerson.name}
            </h3>
            <Image
              src={`https://image.tmdb.org/t/p/original/${startPerson.profile_path}`}
              width={200}
              height={300}
              alt={`${startPerson.name} Picture`}
            />
          </div>
        )}
        <ArrowRight />
        {endMovie && (
          <div>
            <h3 className="text-3xl font-bold tracking-tight">
              {endMovie.title}
            </h3>
            <Image
              src={`https://image.tmdb.org/t/p/original/${endMovie.poster_path}`}
              width={200}
              height={300}
              alt={`${endMovie.title} Poster`}
            />
          </div>
        )}
        {endPerson && (
          <div>
            <h3 className="text-3xl font-bold tracking-tight">
              {endPerson.name}
            </h3>
            <Image
              src={`https://image.tmdb.org/t/p/original/${endPerson.profile_path}`}
              width={200}
              height={300}
              alt={`${endPerson.name} Picture`}
            />
          </div>
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
