import { useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";

import type { RouterOutputs } from "@filmrover/api";

import { useTimer } from "@/context/TimerContext";
import { formatTimer } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { TMDBImage } from "./TMDBImage";
import { Button } from "./ui/button";

export const VictoryPage = ({
  game,
  gameId,
  person,
  movie,
}: {
  gameId: string;
  game?: RouterOutputs["game"]["getById"];
  person?: RouterOutputs["person"]["getById"];
  movie?: RouterOutputs["movie"]["getById"];
}) => {
  const { pause, time } = useTimer();

  const utils = api.useUtils();
  const completeGameMutation = api.game.complete.useMutation({
    onSuccess: async () => {
      await utils.game.getById.invalidate();
    },
    onError: () => {
      toast("Something went wrong");
    },
  });

  useEffect(() => {
    pause();

    completeGameMutation.mutate({
      gameId,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pause, gameId]);

  return (
    <div className="container mt-12 flex w-full flex-1 flex-col items-center">
      <div className="flex justify-center">
        <h1 className="text-center text-5xl font-extrabold tracking-tight">
          {movie ? movie.title : person ? person.name : null}
        </h1>
      </div>
      <div className="mt-12">
        {movie?.poster_path ? (
          <TMDBImage slug={movie.poster_path} />
        ) : movie ? null : person?.profile_path ? (
          <TMDBImage slug={person.profile_path} />
        ) : person ? (
          <ImagePlaceholder />
        ) : null}
      </div>
      <div className="mt-12 flex flex-col items-center gap-8">
        <h2 className="text-center text-4xl font-extrabold tracking-tight">
          🎉 You win! 🎉
        </h2>
        <div className="text-center text-3xl font-bold tracking-tight">
          {formatTimer(time)}
        </div>
        <div className="mt-12 flex gap-4">
          <Button
            variant="ghost"
            disabled={!game}
            onClick={() => {
              const start = {
                type:
                  game!.startMovieId != null
                    ? ("movie" as const)
                    : ("person" as const),
                id:
                  game!.startMovieId != null
                    ? game!.startMovieId
                    : game!.startPersonId!,
              };

              const end = {
                type:
                  game!.endMovieId != null
                    ? ("movie" as const)
                    : ("person" as const),
                id:
                  game!.endMovieId != null
                    ? game!.endMovieId
                    : game!.endPersonId!,
              };

              const params = new URLSearchParams({
                ...(start.type === "movie"
                  ? {
                      startMovie: start.id.toString(),
                    }
                  : {
                      startPerson: start.id.toString(),
                    }),
                ...(end.type === "movie"
                  ? {
                      endMovie: end.id.toString(),
                    }
                  : {
                      endPerson: end.id.toString(),
                    }),
              });

              navigator.clipboard
                .writeText(
                  `${window.location.origin}/play?${params.toString()}`,
                )
                .then(() => {
                  toast("Copied game link to clipboard!");
                })
                .catch(() => {
                  toast("Something went wrong");
                });
            }}
          >
            Copy Game Link
          </Button>
          <Link href="/play">
            <Button>New Game</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
