"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

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
    return null;
  }

  const directors = credits?.crew.filter(({ job }) => job === "Director") ?? [];

  const uniqueDirectors = [
    ...new Map(directors.map((item) => [item.id, item])).values(),
  ];

  const uniqueCrew = [
    ...new Map(credits?.crew.map((item) => [item.id, item]) ?? []).values(),
  ];

  if (movieId === game?.endMovieId) {
    return <VictoryPage gameId={gameId} />;
  }

  return (
    <div className="container mt-12 flex w-full flex-col items-center">
      {movieLoading && (
        <div>
          <Skeleton className="h-10 w-[400px] bg-slate-500" />
        </div>
      )}
      {!movieLoading && movie && (
        <div className="flex justify-center">
          <h1 className="text-center text-5xl font-extrabold tracking-tight">
            {movie.title}
          </h1>
        </div>
      )}
      <div className="mt-12 flex w-full justify-center gap-8">
        {movieLoading && (
          <div>
            <Skeleton className="h-[300px] w-[200px] bg-slate-500" />
          </div>
        )}
        {!movieLoading && movie?.poster_path && (
          <TMDBImage slug={movie.poster_path} priority />
        )}
      </div>
      <div className="mt-12 flex w-full justify-evenly gap-8">
        <div>
          <h3 className="text-3xl font-extrabold tracking-tight">
            Director(s)
          </h3>
          {uniqueDirectors
            .sort((a, b) => b.popularity - a.popularity)
            .map(({ credit_id, name, id }) => (
              <div key={credit_id}>
                <Link href={`/play/${gameId}/p/${id}`}>{name}</Link>
              </div>
            ))}
        </div>
        {credits && credits.cast.length > 0 && (
          <div>
            <h3 className="text-3xl font-extrabold tracking-tight">Cast</h3>
            {credits?.cast
              .sort((a, b) => b.popularity - a.popularity)
              .map(({ id, name }) => (
                <div key={id}>
                  <Link href={`/play/${gameId}/p/${id}`}>{name}</Link>
                </div>
              ))}
          </div>
        )}
        <div>
          <h3 className="text-3xl font-extrabold tracking-tight">Crew</h3>
          {uniqueCrew
            .sort((a, b) => b.popularity - a.popularity)
            .map(({ id, credit_id, name, job }) => (
              <div key={credit_id}>
                <Link href={`/play/${gameId}/p/${id}`}>
                  {name} ({job})
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
