"use client";

import Image from "next/image";
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

  const { startMovieId, endMovieId } = game ?? {};

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
    </div>
  );
}
