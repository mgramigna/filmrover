"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import dayjs from "dayjs";

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
    return <VictoryPage game={game} gameId={gameId} person={person} />;
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
      <div className="mt-12 flex justify-center pb-24 md:w-full">
        <div className="grid w-full grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center">
            <div className="flex flex-col gap-2">
              <h3 className="mb-8 text-3xl font-extrabold tracking-tight">
                Directing
              </h3>
              {directing.length > 0 ? (
                directing.map(({ id, title }) => (
                  <div key={id}>
                    {title && (
                      <ClickableDetail
                        href={`/play/${gameId}/m/${id}`}
                        label={title}
                        type="movie"
                        id={id}
                      />
                    )}
                  </div>
                ))
              ) : !creditsLoading ? (
                <div className="w-72 text-sm italic">None</div>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex flex-col gap-2">
              <h3 className="mb-8 text-3xl font-extrabold tracking-tight">
                Cast
              </h3>
              {filteredCast.length > 0 ? (
                filteredCast.map(({ credit_id, id, title, release_date }) => {
                  const releaseDate = dayjs(release_date);
                  return (
                    <div key={credit_id}>
                      {title && (
                        <ClickableDetail
                          href={`/play/${gameId}/m/${id}`}
                          label={`${title}${
                            releaseDate.isValid()
                              ? ` (${releaseDate.format("YYYY")})`
                              : ""
                          }`}
                          type="movie"
                          id={id}
                        />
                      )}
                    </div>
                  );
                })
              ) : !creditsLoading ? (
                <div className="w-72 text-sm italic">None</div>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex flex-col gap-2">
              <h3 className="mb-8 text-3xl font-extrabold tracking-tight">
                Crew
              </h3>
              {filteredCrew.length > 0 ? (
                filteredCrew.map(({ id, title, job }) => (
                  <div key={`${id}-${job}`}>
                    <ClickableDetail
                      href={`/play/${gameId}/m/${id}`}
                      label={`${title} (${job})`}
                      type="movie"
                      id={id}
                    />
                  </div>
                ))
              ) : !creditsLoading ? (
                <div className="w-72 text-sm italic">None</div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
