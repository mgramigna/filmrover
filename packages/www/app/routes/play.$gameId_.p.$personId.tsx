import { api } from "@/lib/api";
import { isBefore } from "date-fns/isBefore";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ClickableDetail } from "@/components/clickable";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

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
    <div className="container px-4 pb-24 sm:px-0">
      <div className="mt-8 text-center">
        <Heading variant="h1">{person.name}</Heading>
      </div>
      <Separator className="my-6" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div>
          <div>
            <Heading variant="h3">Directing</Heading>
            <div className="flex flex-col gap-2">
              {directing.length > 0
                ? directing.map(({ id, title, release_date }) => {
                    const releaseDate = release_date
                      ? new Date(release_date)
                      : undefined;

                    return (
                      <div key={id}>
                        {title && (
                          <ClickableDetail
                            href={`/play/${gameId}/m/${id}`}
                            label={`${title} (${releaseDate?.getFullYear()})`}
                            type="movie"
                            id={id}
                          />
                        )}
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
        </div>
        <div>
          <div>
            <Heading variant="h3">Cast</Heading>
            <div className="flex flex-col gap-2">
              {filteredCast.length > 0
                ? filteredCast.map(({ id, title, release_date }) => {
                    const releaseDate = release_date
                      ? new Date(release_date)
                      : undefined;

                    return (
                      <div key={id}>
                        {title && (
                          <ClickableDetail
                            href={`/play/${gameId}/m/${id}`}
                            label={`${title} (${releaseDate?.getFullYear()})`}
                            type="movie"
                            id={id}
                          />
                        )}
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
        </div>
        <div>
          <div>
            <Heading variant="h3">Crew</Heading>
            <div className="flex flex-col gap-2">
              {filteredCrew.length > 0
                ? filteredCrew.map(({ id, title, job }) => (
                    <ClickableDetail
                      key={id}
                      href={`/play/${gameId}/m/${id}`}
                      label={`${title} (${job})`}
                      type="movie"
                      id={id}
                    />
                  ))
                : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
