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
        <Heading variant="h3" className="text-center">
          {movie.title}{" "}
          {movie.release_date
            ? `(${new Date(movie.release_date).getFullYear()})`
            : ""}
        </Heading>
        <TMDBPoster slug={movie.poster_path} title={movie.title} />
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
                {uniqueDirectors
                  .sort((a, b) => {
                    if (!a.popularity) return 1;
                    if (!b.popularity) return -1;

                    return b.popularity - a.popularity;
                  })
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
                {credits.cast
                  .sort((a, b) => {
                    if (!a.popularity) return 1;
                    if (!b.popularity) return -1;

                    return b.popularity - a.popularity;
                  })
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
                {uniqueCrew
                  .sort((a, b) => {
                    if (!a.popularity) return 1;
                    if (!b.popularity) return -1;

                    return b.popularity - a.popularity;
                  })
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
            </AccordionContent>
          </AccordionItem>
        </div>
      </Accordion>
    </div>
  );
}
