import { useEffect } from "react";
import Link from "next/link";

import type { RouterOutputs } from "@filmrover/api";

import { useTimer } from "@/context/TimerContext";
import { formatTimer } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { TMDBImage } from "./TMDBImage";
import { Button } from "./ui/button";

export const VictoryPage = ({
  gameId,
  person,
  movie,
}: {
  gameId: string;
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
      alert("Something went wrong");
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
        <Link href="/play">
          <Button>New Game</Button>
        </Link>
      </div>
    </div>
  );
};
