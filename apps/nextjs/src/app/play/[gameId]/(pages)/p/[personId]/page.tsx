"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { useGame } from "@/context/GameContext";
import { useTimer } from "@/context/TimerContext";
import { api } from "@/trpc/react";

export default function MovieDetailPage() {
  const { gameId, personId: personIdString } = useParams<{
    gameId: string;
    personId: string;
  }>();

  const { game, isLoading: gameLoading } = useGame();
  const { pause } = useTimer();

  const personId = parseInt(personIdString);

  const { data: person, isLoading: personLoading } =
    api.person.getById.useQuery({
      id: personId,
    });

  const { data: credits } = api.person.getCredits.useQuery({
    id: personId,
  });

  if (gameLoading) {
    return null;
  }

  if (personId === game?.endPersonId) {
    pause();

    return (
      <div className="container mt-12 flex w-full flex-col items-center">
        <div className="flex justify-center">
          <h1 className="text-center text-5xl font-extrabold tracking-tight">
            You win!
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-12 flex w-full flex-col items-center">
      {!personLoading && person && (
        <div className="flex justify-center">
          <h1 className="text-center text-5xl font-extrabold tracking-tight">
            {person.name}
          </h1>
        </div>
      )}
      <div className="mt-12 flex w-full">
        <div>
          <h3 className="text-3xl font-extrabold tracking-tight">Cast</h3>
          {credits?.cast
            .sort((a, b) => b.popularity - a.popularity)
            .filter(({ media_type }) => media_type === "movie")
            .map(({ credit_id, id, title }) => (
              <div key={credit_id}>
                <Link href={`/play/${gameId}/m/${id}`}>{title}</Link>
              </div>
            ))}
        </div>
        <div>
          <h3 className="text-3xl font-extrabold tracking-tight">Crew</h3>
          {credits?.crew
            .sort((a, b) => b.popularity - a.popularity)
            .filter(({ media_type }) => media_type === "movie")
            .map(({ id, title, job }) => (
              <div key={`${id}-${job}`}>
                <Link href={`/play/${gameId}/m/${id}`}>
                  {title} ({job})
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
