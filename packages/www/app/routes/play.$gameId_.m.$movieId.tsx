import { ClickableDetail } from "@/components/clickable";
import { TMDBPoster } from "@/components/tmdb-poster";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { gameId, movieId } = params;

  if (!gameId || !movieId) {
    throw new Response(null, { status: 404 });
  }

  const [game, movie, credits] = await Promise.all([
    api.game.getById(gameId),
    api.movie.getById(Number(movieId)),
    api.movie.getCredits(Number(movieId)),
  ]);

  if (game.endMovieId === Number(movieId)) {
    return redirect(`/play/${gameId}/victory`);
  }

  const directors = credits.crew.filter(({ job }) => job === "Director") ?? [];

  const uniqueDirectors = [
    ...new Map(directors.map((item) => [item.id, item])).values(),
  ];

  const uniqueCrew = [
    ...new Map(credits.crew.map((item) => [item.id, item]) ?? []).values(),
  ];

  return { gameId, movie, credits, uniqueDirectors, uniqueCrew };
};

export default function MoviePage() {
  const { gameId, movie, credits, uniqueCrew, uniqueDirectors } =
    useLoaderData<typeof loader>();

  return (
    <div className="container px-4 pb-24 sm:px-0">
      <div className="mt-8 flex flex-col items-center gap-4">
        <Heading variant="h1" className="text-center">
          {movie.title}
        </Heading>
        <TMDBPoster slug={movie.poster_path} title={movie.title} />
      </div>
      <Separator className="my-6" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div>
          <div>
            <Heading variant="h3">Directing</Heading>
            <div className="flex flex-col gap-2">
              {uniqueDirectors
                .sort((a, b) => b.popularity - a.popularity)
                .map(({ credit_id, name, id }) => (
                  <ClickableDetail
                    href={`/play/${gameId}/p/${id}`}
                    label={name}
                    type="person"
                    id={id}
                    key={credit_id}
                  />
                ))}
            </div>
          </div>
        </div>
        <div>
          <div>
            <Heading variant="h3">Cast</Heading>
            <div className="flex flex-col gap-2">
              {credits.cast
                .sort((a, b) => b.popularity - a.popularity)
                .map(({ credit_id, id, name }) => (
                  <ClickableDetail
                    href={`/play/${gameId}/p/${id}`}
                    label={name}
                    type="person"
                    id={id}
                    key={credit_id}
                  />
                ))}
            </div>
          </div>
        </div>
        <div>
          <div>
            <Heading variant="h3">Crew</Heading>
            <div className="flex flex-col gap-2">
              {uniqueCrew
                .sort((a, b) => b.popularity - a.popularity)
                .map(({ id, credit_id, name, job }) => (
                  <ClickableDetail
                    href={`/play/${gameId}/p/${id}`}
                    label={`${name} (${job})`}
                    type="person"
                    id={id}
                    key={credit_id}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
