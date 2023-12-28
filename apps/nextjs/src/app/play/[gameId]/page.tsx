"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useTimer } from "@/context/TimerContext";
import { api } from "@/trpc/react";

export default function GameIdPage() {
  const { gameId } = useParams<{ gameId: string }>();

  const { start, time } = useTimer();

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
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        Game
      </h1>
      <div>{time}</div>
      <Button onClick={start}>Time</Button>
      {startMovieId && (
        <Link href={`/play/${gameId}/m/${startMovieId}`}>
          <Button>Start</Button>
        </Link>
      )}
      <div>{startMovie?.title}</div>
      <div>{endMovie?.title}</div>
    </div>
  );
}
