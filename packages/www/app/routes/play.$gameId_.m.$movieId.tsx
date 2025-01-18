import { api } from "@/lib/api";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

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
    // TODO: redirect to victory page
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
    <div>
      <div>
        <h1>{movie.title}</h1>
      </div>
      <div>
        <div>
          <div>
            <div>
              <h3>Directing</h3>
              {uniqueDirectors
                .sort((a, b) => b.popularity - a.popularity)
                .map(({ credit_id, name, id }) => (
                  <Link key={credit_id} to={`/play/${gameId}/p/${id}`}>
                    {name}
                  </Link>
                ))}
            </div>
          </div>
          <div>
            <div>
              <h3>Cast</h3>
              {credits.cast
                .sort((a, b) => b.popularity - a.popularity)
                .map(({ credit_id, id, name }) => (
                  <Link key={credit_id} to={`/play/${gameId}/p/${id}`}>
                    {name}
                  </Link>
                ))}
            </div>
          </div>
          <div>
            <div>
              <h3>Crew</h3>
              {uniqueCrew
                .sort((a, b) => b.popularity - a.popularity)
                .map(({ id, credit_id, name, job }) => (
                  <Link key={credit_id} to={`/play/${gameId}/p/${id}`}>
                    {name} {job}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
