"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { api } from "@/trpc/react";

export default function MovieDetailPage() {
  const { gameId, movieId: movieIdString } = useParams<{
    gameId: string;
    movieId: string;
  }>();

  const movieId = parseInt(movieIdString);

  const { data: movie } = api.movie.getById.useQuery({
    id: movieId,
  });

  const { data: credits } = api.movie.getCredits.useQuery({
    id: movieId,
  });

  return (
    <div className="container mt-12 flex flex-col items-center">
      {movie && (
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          {movie.title}
        </h1>
      )}
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
  );
}
