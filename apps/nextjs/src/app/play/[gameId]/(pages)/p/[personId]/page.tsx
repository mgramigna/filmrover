"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";

import { ClickableDetail } from "@/components/ClickableDetail";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
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

  const { data: credits, isLoading: creditsLoading } =
    api.person.getCredits.useQuery({
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
        .filter(
          ({ media_type, department }) =>
            media_type === "movie" && department !== "Directing",
        ) ?? [],
    [credits],
  );

  const directing = useMemo(
    () =>
      credits?.crew
        .sort((a, b) => b.popularity - a.popularity)
        .filter(
          ({ media_type, department }) =>
            media_type === "movie" && department === "Directing",
        ) ?? [],
    [credits],
  );

  if (gameLoading) {
    return <div className="flex flex-1 flex-col" />;
  }

  if (personId === game?.endPersonId) {
    return <VictoryPage gameId={gameId} person={person} />;
  }

  return (
    <div className="container mt-12 flex w-full flex-1 flex-col items-center">
      <div className="flex justify-center">
        <h1 className="text-center text-5xl font-extrabold tracking-tight">
          {person?.name}
        </h1>
      </div>
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
          <ImagePlaceholder />
        )}
      </div>
      <div className="mt-12 flex justify-center md:w-full">
        <div className="grid w-full grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="text-3xl font-extrabold tracking-tight">
              Directing
            </h3>
            <div className="mt-8 flex flex-col gap-2">
              {directing.length > 0 ? (
                directing.map(({ id, title }) => (
                  <div key={id}>
                    {title && (
                      <ClickableDetail
                        href={`/play/${gameId}/m/${id}`}
                        label={title}
                      />
                    )}
                  </div>
                ))
              ) : !creditsLoading ? (
                <div className="text-sm italic">None</div>
              ) : null}
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold tracking-tight">Cast</h3>
            <div className="mt-8 flex flex-col gap-2">
              {filteredCast.length > 0 ? (
                filteredCast.map(({ credit_id, id, title }) => (
                  <div key={credit_id}>
                    {title && (
                      <ClickableDetail
                        href={`/play/${gameId}/m/${id}`}
                        label={title}
                      />
                    )}
                  </div>
                ))
              ) : !creditsLoading ? (
                <div className="text-sm italic">None</div>
              ) : null}
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold tracking-tight">Crew</h3>
            <div className="mt-8 flex flex-col gap-2">
              {filteredCrew.length > 0 ? (
                filteredCrew.map(({ id, title, job }) => (
                  <div key={`${id}-${job}`}>
                    <ClickableDetail
                      href={`/play/${gameId}/m/${id}`}
                      label={`${title} (${job})`}
                    />
                  </div>
                ))
              ) : !creditsLoading ? (
                <div className="text-sm italic">None</div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
