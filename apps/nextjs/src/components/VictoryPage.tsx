import { Fragment, useCallback, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Share2 } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@filmrover/api";

import { useHistory } from "@/context/HistoryContext";
import { useTimer } from "@/context/TimerContext";
import { cn, formatTimer } from "@/lib/utils";
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
  const { history } = useHistory();

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

  const getGameLink = useCallback(() => {
    if (!game) return;

    const start = {
      type:
        game.startMovieId != null ? ("movie" as const) : ("person" as const),
      id: game.startMovieId ?? game.startPersonId!,
    };

    const end = {
      type: game.endMovieId != null ? ("movie" as const) : ("person" as const),
      id: game.endMovieId ?? game.endPersonId!,
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

    return `${window.location.origin}/play?${params.toString()}`;
  }, [game]);

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
        <div className="rounded-lg border border-slate-50 p-4 text-center text-xl font-bold">
          {formatTimer(time)}
        </div>
        <div className="text-2xl font-bold">{history.length - 1} Clicks</div>
        <div className="flex flex-row flex-wrap items-center justify-center gap-8">
          {history.map(({ id, display }, i) => {
            const key = `${id}-${i}`;
            return (
              <Fragment key={key}>
                <div
                  className={cn(
                    "",
                    i === 0 && "text-yellow-300",
                    i === history.length - 1 && "text-green-300",
                  )}
                >
                  {display}
                </div>
                {i !== history.length - 1 && (
                  <ChevronRight className="text-slate-300" />
                )}
              </Fragment>
            );
          })}
        </div>
        <div className="mt-12 flex gap-4 pb-24">
          <Button
            disabled={!game}
            variant="ghost"
            onClick={() => {
              const gameLink = getGameLink();

              const text = `I just got from ${history[0]?.display} to ${history[
                history.length - 1
              ]?.display} in ${formatTimer(time)} with ${
                history.length - 1
              } clicks on FilmRover! Give it a shot! ${gameLink}`;

              if (navigator.share) {
                navigator
                  .share({
                    text,
                  })
                  .catch(console.error);
              } else {
                navigator.clipboard
                  .writeText(text)
                  .then(() => {
                    toast("Copied results to clipboard!");
                  })
                  .catch(() => {
                    toast("Something went wrong");
                  });
              }
            }}
          >
            <span className="inline-block pr-2">
              <Share2 />
            </span>
            Share Results
          </Button>
          <Link href="/play">
            <Button>New Game</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
