import { TMDBPoster } from "@/components/tmdb-poster";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Form, redirect, useLoaderData } from "@remix-run/react";
import { ChevronRight, Clapperboard } from "lucide-react";
import { toast } from "sonner";
import { P, match } from "ts-pattern";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const meta: MetaFunction = () => {
  return [
    { title: "FilmRover | Play" },
    {
      name: "description",
      content: "Test your movie knowledge, Wikipedia-game style!",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  const startMovieId = url.searchParams.get("start_movie_id");
  const startPersonId = url.searchParams.get("start_person_id");

  const endMovieId = url.searchParams.get("end_movie_id");
  const endPersonId = url.searchParams.get("end_person_id");

  if (startMovieId && startPersonId) {
    throw new Response("Invalid URL", { status: 400 });
  }

  if (endMovieId && endPersonId) {
    throw new Response("Invalid URL", { status: 400 });
  }

  if (
    [
      [startMovieId, endMovieId],
      [startPersonId, endMovieId],
      [startMovieId, endPersonId],
      [startPersonId, endPersonId],
    ].filter(([a, b]) => a !== null && b !== null).length !== 1
  ) {
    throw new Response("Invalid URL", { status: 400 });
  }

  const [startMovie, endMovie, startPerson, endPerson] = await Promise.all([
    startMovieId
      ? api.movie.getById(Number(startMovieId))
      : Promise.resolve(null),
    endMovieId ? api.movie.getById(Number(endMovieId)) : Promise.resolve(null),
    startPersonId
      ? api.person.getById(Number(startPersonId))
      : Promise.resolve(null),
    endPersonId
      ? api.person.getById(Number(endPersonId))
      : Promise.resolve(null),
  ]);

  return {
    startMovie,
    endMovie,
    startPerson,
    endPerson,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { startMovieId, startPersonId, endMovieId, endPersonId } = zfd
    .formData({
      startMovieId: zfd.numeric(z.number().optional()),
      startPersonId: zfd.numeric(z.number().optional()),
      endMovieId: zfd.numeric(z.number().optional()),
      endPersonId: zfd.numeric(z.number().optional()),
    })
    .parse(await request.formData());

  const result = await api.game.create({
    startMovieId,
    startPersonId,
    endMovieId,
    endPersonId,
  });

  const firstSlug = match({ startMovieId, startPersonId })
    .with(
      { startMovieId: P.number },
      () => `/play/${result.gameId}/m/${startMovieId}`,
    )
    .with(
      { startPersonId: P.number },
      () => `/play/${result.gameId}/p/${startPersonId}`,
    )
    .otherwise(() => {
      throw new Response("Invalid URL", { status: 400 });
    });

  return redirect(firstSlug);
};

export default function Play() {
  const { startMovie, endMovie, startPerson, endPerson } =
    useLoaderData<typeof loader>();

  const startPoster = match({ startMovie, startPerson })
    .returnType<{ slug: string | null; title: string }>()
    .with({ startMovie: P.nonNullable }, ({ startMovie: movie }) => ({
      slug: movie.poster_path,
      title: movie.title,
    }))
    .with({ startPerson: P.nonNullable }, ({ startPerson: person }) => ({
      slug: person.profile_path,
      title: person.name,
    }))
    .otherwise(() => ({ slug: null, title: "" }));

  const endPoster = match({ endMovie, endPerson })
    .returnType<{ slug: string | null; title: string }>()
    .with({ endMovie: P.nonNullable }, ({ endMovie: movie }) => ({
      slug: movie.poster_path,
      title: movie.title,
    }))
    .with({ endPerson: P.nonNullable }, ({ endPerson: person }) => ({
      slug: person.profile_path,
      title: person.name,
    }))
    .otherwise(() => ({ slug: null, title: "" }));

  return (
    <div className="container px-4 pb-24 sm:px-0">
      <div className="m-auto max-w-screen-md">
        <div className="mt-12">
          <Heading variant="h4">Your Game</Heading>
          <Separator className="my-4" />
          <div className="grid grid-cols-3 place-items-center gap-y-4 px-8 md:px-12 lg:px-24">
            <Heading variant="h5" className="text-center">
              {startPoster.title}
            </Heading>
            <div />
            <Heading variant="h5" className="text-center">
              {endPoster.title}
            </Heading>
            <div className="flex flex-col items-center gap-4">
              <TMDBPoster slug={startPoster.slug} title={startPoster.title} />
            </div>
            <ChevronRight />
            <div className="flex flex-col items-center gap-4">
              <TMDBPoster slug={endPoster.slug} title={endPoster.title} />
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <ul className="mt-12 space-y-8">
            <li className="flex items-center gap-2">
              <Clapperboard className="text-muted-foreground" />
              <div className="flex-1">
                Navigate from {startPoster.title} to {endPoster.title} by
                clicking links
              </div>
            </li>
            <li className="flex items-center gap-2">
              <Clapperboard className="text-muted-foreground" />
              <div className="flex-1">
                Go as fast as you can, or try to minimize the number of clicks
                used.
              </div>
            </li>
            <li className="flex items-center gap-2">
              <Clapperboard className="text-muted-foreground" />
              <div className="flex-1">Have fun!</div>
            </li>
          </ul>
        </div>
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              navigator.clipboard
                .writeText(window.location.href)
                .then(() => {
                  toast.success("Copied link to clipboard");
                })
                .catch(() => {
                  toast.error("Something went wrong");
                });
            }}
          >
            Copy Game Link
          </Button>
          <Form method="POST">
            <input
              type="hidden"
              name="startMovieId"
              value={startMovie?.id ?? undefined}
            />
            <input
              type="hidden"
              name="startPersonId"
              value={startPerson?.id ?? undefined}
            />
            <input
              type="hidden"
              name="endMovieId"
              value={endMovie?.id ?? undefined}
            />
            <input
              type="hidden"
              name="endPersonId"
              value={endPerson?.id ?? undefined}
            />
            <Button type="submit">Start</Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
