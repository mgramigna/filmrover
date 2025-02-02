import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { ClickableDetail } from "@/components/clickable";
import { TMDBPoster } from "@/components/tmdb-poster";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import { isBefore } from "date-fns/isBefore";

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
    return redirect(`/play/${gameId}/victory`);
  }

  const filteredCast =
    credits.cast
      .sort((a, b) => {
        if (!a.popularity) return 1;
        if (!b.popularity) return -1;

        return b.popularity - a.popularity;
      })
      .filter(({ media_type }) => media_type === "movie")
      .filter(({ release_date }) => {
        if (!release_date) return false;

        const releaseDate = new Date(release_date);

        return isBefore(releaseDate, new Date());
      }) ?? [];

  const filteredCrew =
    credits.crew
      .sort((a, b) => {
        if (!a.popularity) return 1;
        if (!b.popularity) return -1;

        return b.popularity - a.popularity;
      })
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
      .sort((a, b) => {
        if (!a.popularity) return 1;
        if (!b.popularity) return -1;
        return b.popularity - a.popularity;
      })
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
      <div className="mt-8 flex flex-col items-center gap-4">
        <Heading variant="h3" className="text-center">
          {person.name}
        </Heading>
        <TMDBPoster slug={person.profile_path} title={person.name} />
      </div>
      <Separator className="my-6" />
      <Accordion type="multiple" defaultValue={["directing", "cast", "crew"]}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <AccordionItem value="directing">
            <AccordionTrigger>
              <Heading variant="h4" className="pb-2 text-center">
                Directing
              </Heading>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2">
                {directing.length > 0 ? (
                  directing.map(({ id, title, release_date }) => {
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
                ) : (
                  <p className="text-muted-foreground">No Directing credits</p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="cast">
            <AccordionTrigger>
              <Heading variant="h4" className="pb-2 text-center">
                Cast
              </Heading>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2">
                {filteredCast.length > 0 ? (
                  filteredCast.map(({ id, title, release_date }) => {
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
                ) : (
                  <p className="text-muted-foreground">No Cast credits</p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="crew">
            <AccordionTrigger>
              <Heading variant="h4" className="pb-2 text-center">
                Crew
              </Heading>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2">
                {filteredCrew.length > 0 ? (
                  filteredCrew.map(({ id, title, job }) => (
                    <ClickableDetail
                      key={id}
                      href={`/play/${gameId}/m/${id}`}
                      label={`${title} (${job})`}
                      type="movie"
                      id={id}
                    />
                  ))
                ) : (
                  <p className="text-muted-foreground">No Crew credits</p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </div>
      </Accordion>
    </div>
  );
}
