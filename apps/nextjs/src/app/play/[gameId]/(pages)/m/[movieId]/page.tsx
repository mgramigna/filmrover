"use client";

import { useParams } from "next/navigation";

import { ClickableDetail } from "@/components/ClickableDetail";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { TMDBImage } from "@/components/TMDBImage";
import { Skeleton } from "@/components/ui/skeleton";
import { VictoryPage } from "@/components/VictoryPage";
import { useGame } from "@/context/GameContext";
import { api } from "@/trpc/react";

export default function MovieDetailPage() {
  const { gameId, movieId: movieIdString } = useParams<{
    gameId: string;
    movieId: string;
  }>();

  const { game, isLoading: gameLoading } = useGame();

  const movieId = parseInt(movieIdString);

  const { data: movie, isLoading: movieLoading } = api.movie.getById.useQuery({
    id: movieId,
  });

  const { data: credits } = api.movie.getCredits.useQuery({
    id: movieId,
  });

  if (gameLoading) {
    return <div className="flex flex-1 flex-col" />;
  }

  const directors = credits?.crew.filter(({ job }) => job === "Director") ?? [];

  const uniqueDirectors = [
    ...new Map(directors.map((item) => [item.id, item])).values(),
  ];

  const uniqueCrew = [
    ...new Map(credits?.crew.map((item) => [item.id, item]) ?? []).values(),
  ];

  if (movieId === game?.endMovieId) {
    return <VictoryPage game={game} gameId={gameId} movie={movie} />;
  }

  return (
    <div className="container mt-12 flex w-full flex-1 flex-col items-center">
      <div className="flex justify-center">
        <h1 className="text-center text-5xl font-extrabold tracking-tight">
          {movie?.title}
        </h1>
      </div>
      <div className="mt-12 flex w-full justify-center gap-8">
        {movieLoading && (
          <div>
            <Skeleton className="relative h-[150px] w-[100px] flex-1 rounded-lg border border-slate-100 bg-slate-500 sm:h-[300px] sm:w-[200px]" />
          </div>
        )}
        {!movieLoading && movie?.poster_path && (
          <TMDBImage slug={movie.poster_path} priority />
        )}
        {!movieLoading && movie && !movie.poster_path && <ImagePlaceholder />}
      </div>
      <div className="mt-12 flex justify-center sm:w-full">
        <div className="grid grid-cols-1 gap-12 md:w-full md:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="text-3xl font-extrabold tracking-tight">
              Directing
            </h3>
            <div className="mt-8 flex flex-col gap-2">
              {uniqueDirectors
                .sort((a, b) => b.popularity - a.popularity)
                .map(({ credit_id, name, id }) => (
                  <div key={credit_id}>
                    <ClickableDetail
                      href={`/play/${gameId}/p/${id}`}
                      label={name}
                    />
                  </div>
                ))}
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold tracking-tight">Cast</h3>
            <div className="mt-8 flex flex-col gap-2">
              {credits?.cast
                .sort((a, b) => b.popularity - a.popularity)
                .map(({ id, name }) => (
                  <div key={id}>
                    <ClickableDetail
                      href={`/play/${gameId}/p/${id}`}
                      label={name}
                    />
                  </div>
                ))}
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold tracking-tight">Crew</h3>
            <div className="flex flex-col gap-2 pt-8">
              {uniqueCrew
                .sort((a, b) => b.popularity - a.popularity)
                .map(({ id, credit_id, name, job }) => (
                  <div key={credit_id}>
                    <ClickableDetail
                      href={`/play/${gameId}/p/${id}`}
                      label={`${name} (${job})`}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
