import { useEffect } from "react";

import { useTimer } from "@/context/TimerContext";
import { api } from "@/trpc/react";

export const VictoryPage = ({ gameId }: { gameId: string }) => {
  const { pause } = useTimer();
  const completeGameMutation = api.game.complete.useMutation({
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
    <div className="container mt-12 flex w-full flex-col items-center">
      <div className="flex justify-center">
        <h1 className="text-center text-5xl font-extrabold tracking-tight">
          You win!
        </h1>
      </div>
    </div>
  );
};
