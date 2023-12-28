"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";

export default function MovieDetailPage() {
  const { gameId, movieId: movieIdString } = useParams<{
    gameId: string;
    movieId: string;
  }>();

  const movieId = parseInt(movieIdString);

  const { data: movie, isLoading: movieLoading } = api.movie.getById.useQuery({
    id: movieId,
  });

  const { data: credits } = api.movie.getCredits.useQuery({
    id: movieId,
  });

  const directors =
    credits?.crew.filter(
      ({ known_for_department }) => known_for_department === "Directing",
    ) ?? [];

  const uniqueDirectors = [
    ...new Map(directors.map((item) => [item.id, item])).values(),
  ];

  const crew =
    credits?.crew.filter(
      ({ known_for_department }) =>
        known_for_department !== "Directing" &&
        known_for_department !== "Acting",
    ) ?? [];

  const uniqueCrew = [...new Map(crew.map((item) => [item.id, item])).values()];

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
      <div className="mt-12 flex w-full gap-8">
        {movieLoading && (
          <div>
            <Skeleton className="h-[300px] w-[200px] bg-slate-500" />
          </div>
        )}
        {!movieLoading && movie?.poster_path && (
          <div>
            <Image
              src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
              width={200}
              height={300}
              alt={`${movie.title} Poster`}
              priority
            />
          </div>
        )}
        <div className="flex-1">
          {uniqueDirectors
            .sort((a, b) => b.popularity - a.popularity)
            .map(({ credit_id, name, id }) => (
              <div key={credit_id}>
                <Link href={`/play/${gameId}/p/${id}`}>{name} (Director)</Link>
              </div>
            ))}
        </div>
      </div>
      <div className="flex w-full gap-8">
        <div>
          <h3 className="text-3xl font-extrabold tracking-tight">Cast</h3>
          {credits?.cast
            .sort((a, b) => b.popularity - a.popularity)
            .map(({ id, name, character }) => (
              <div key={id}>
                <Link href={`/play/${gameId}/p/${id}`}>
                  {name} ({character})
                </Link>
              </div>
            ))}
        </div>
        <div>
          <h3 className="text-3xl font-extrabold tracking-tight">Crew</h3>
          {uniqueCrew
            .sort((a, b) => b.popularity - a.popularity)
            .map(({ id, credit_id, name, known_for_department }) => (
              <div key={credit_id}>
                <Link href={`/play/${gameId}/p/${id}`}>
                  {name} ({known_for_department})
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
