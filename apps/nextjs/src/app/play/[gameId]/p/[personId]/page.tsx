"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { api } from "@/trpc/react";

export default function MovieDetailPage() {
  const { gameId, personId: personIdString } = useParams<{
    gameId: string;
    personId: string;
  }>();

  const personId = parseInt(personIdString);

  const { data: person } = api.person.getById.useQuery({
    id: personId,
  });

  const { data: credits } = api.person.getCredits.useQuery({
    id: personId,
  });

  return (
    <div className="container mt-12 flex flex-col items-center">
      {person && (
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          {person.name}
        </h1>
      )}
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
      {credits?.cast
        .sort((a, b) => b.popularity - a.popularity)
        .filter(({ media_type }) => media_type === "movie")
        .map(({ credit_id, id, title }) => (
          <div key={credit_id}>
            <Link href={`/play/${gameId}/m/${id}`}>{title}</Link>
          </div>
        ))}
    </div>
  );
}
