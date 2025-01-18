import { api } from "@/lib/api";
import { isBefore } from "date-fns/isBefore";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { gameId, personId } = params;

  if (!gameId || !personId) {
    throw new Response(null, { status: 404 });
  }

  const [game, person, credits] = await Promise.all([
    api.game.getById(gameId),
    api.person.getById(Number(personId)),
    api.person.getCredits(Number(personId)),
  ]);

  if (game.endPersonId === Number(personId)) {
    // TODO: redirect to victory page
  }

  const filteredCast =
    credits.cast
      .sort((a, b) => b.popularity - a.popularity)
      .filter(({ media_type }) => media_type === "movie")
      .filter(({ release_date }) => {
        if (!release_date) return false;

        const releaseDate = new Date(release_date);

        return isBefore(releaseDate, new Date());
      }) ?? [];

  const filteredCrew =
    credits.crew
      .sort((a, b) => b.popularity - a.popularity)
      .filter(
        ({ media_type, department }) =>
          media_type === "movie" && department !== "Directing",
      )
      .filter(({ release_date }) => {
        if (!release_date) return false;

        const releaseDate = new Date(release_date);

        return isBefore(releaseDate, new Date());
      }) ?? [];

  const directing =
    credits.crew
      .sort((a, b) => b.popularity - a.popularity)
      .filter(
        ({ media_type, department }) =>
          media_type === "movie" && department === "Directing",
      ) ?? [];

  return { gameId, person, filteredCast, filteredCrew, directing };
};

export default function PersonPage() {
  const { gameId, person, filteredCast, filteredCrew, directing } =
    useLoaderData<typeof loader>();

  return (
    <div>
      <div>
        <h1>{person.name}</h1>
      </div>
      <div>
        <div>
          <div>
            <div>
              <h3>Directing</h3>
              {directing.length > 0
                ? directing.map(({ id, title, release_date }) => {
                    const releaseDate = release_date
                      ? new Date(release_date)
                      : undefined;

                    return (
                      <div key={id}>
                        {title && (
                          <a href={`/play/${gameId}/m/${id}`}>
                            {title} ({releaseDate?.getFullYear()})
                          </a>
                        )}
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
          <div>
            <div>
              <h3>Cast</h3>
              {filteredCast.length > 0
                ? filteredCast.map(({ id, title, release_date }) => {
                    const releaseDate = release_date
                      ? new Date(release_date)
                      : undefined;

                    return (
                      <div key={id}>
                        {title && (
                          <Link to={`/play/${gameId}/m/${id}`}>
                            {title} ({releaseDate?.getFullYear()})
                          </Link>
                        )}
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
          <div>
            <div>
              <h3>Crew</h3>
              {filteredCrew.length > 0
                ? filteredCrew.map(({ id, title, job }) => (
                    <Link key={id} to={`/play/${gameId}/m/${id}`}>
                      {title} ({job})
                    </Link>
                  ))
                : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
