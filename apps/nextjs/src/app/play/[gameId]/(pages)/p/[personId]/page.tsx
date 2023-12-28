"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { TMDBImage } from "@/components/TMDBImage";
import { Skeleton } from "@/components/ui/skeleton";
import { VictoryPage } from "@/components/VictoryPage";
import { useGame } from "@/context/GameContext";
import { api } from "@/trpc/react";

export default function PersonDetailPage() {
  const { gameId, personId: personIdString } = useParams<{
    gameId: string;
    personId: string;
  }>();

  const { game, isLoading: gameLoading } = useGame();

  const personId = parseInt(personIdString);

  const { data: person, isLoading: personLoading } =
    api.person.getById.useQuery({
      id: personId,
    });

  const { data: credits } = api.person.getCredits.useQuery({
    id: personId,
  });

  const filteredCast = useMemo(
    () =>
      credits?.cast
        .sort((a, b) => b.popularity - a.popularity)
        .filter(({ media_type }) => media_type === "movie") ?? [],
    [credits],
  );

  const filteredCrew = useMemo(
    () =>
      credits?.crew
        .sort((a, b) => b.popularity - a.popularity)
        .filter(({ media_type }) => media_type === "movie") ?? [],
    [credits],
  );

  if (gameLoading) {
    return null;
  }

  if (personId === game?.endPersonId) {
    return <VictoryPage gameId={gameId} />;
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
      <div className="mt-12 flex w-full justify-center gap-8">
        {personLoading && (
          <div>
            <Skeleton className="relative h-[150px] w-[100px] flex-1 rounded-lg border border-slate-100 bg-slate-500 sm:h-[300px] sm:w-[200px]" />
          </div>
        )}
        {!personLoading && person?.profile_path && (
          <TMDBImage slug={person.profile_path} priority />
        )}
        {!personLoading && person && !person.profile_path && (
          <div className="flex h-[150px] w-[100px] rounded-lg border border-slate-100 bg-slate-700 sm:h-[300px] sm:w-[200px]">
            <div className="m-auto">No Image</div>
          </div>
        )}
      </div>
      <div className="mt-12 flex w-full justify-evenly">
        {filteredCast.length > 0 && (
          <div>
            <h3 className="text-3xl font-extrabold tracking-tight">Cast</h3>
            {filteredCast.map(({ credit_id, id, title }) => (
              <div key={credit_id}>
                <Link href={`/play/${gameId}/m/${id}`}>{title}</Link>
              </div>
            ))}
          </div>
        )}
        {filteredCrew.length > 0 && (
          <div>
            <h3 className="text-3xl font-extrabold tracking-tight">Crew</h3>
            {filteredCrew.map(({ id, title, job }) => (
              <div key={`${id}-${job}`}>
                <Link href={`/play/${gameId}/m/${id}`}>
                  {title} ({job})
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
