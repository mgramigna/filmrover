"use client";

import { useRouter } from "next/navigation";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import { useGame } from "@/context/GameContext";
import { useTimer } from "@/context/TimerContext";
import { api } from "@/trpc/react";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { time, reset } = useTimer();
  const { game } = useGame();

  const { endMovieId, endPersonId } = game ?? {};

  const { data: endMovie } = api.movie.getById.useQuery(
    {
      id: endMovieId!,
    },
    {
      enabled: !!endMovieId,
    },
  );

  const { data: endPerson } = api.person.getById.useQuery(
    {
      id: endPersonId!,
    },
    {
      enabled: !!endPersonId,
    },
  );

  return (
    <>
      <div className="sticky top-0 z-50 flex h-16 w-full items-center justify-center bg-slate-800 p-4">
        {endMovie && (
          <div>
            Navigate to{" "}
            <span className="font-bold">&quot;{endMovie.title}&quot;</span>
          </div>
        )}
        {endPerson && (
          <div>
            Navigate to{" "}
            <span className="font-bold">&quot;{endPerson.name}&quot;</span>
          </div>
        )}
        <div className="absolute left-4 rounded-xl">
          {dayjs().startOf("day").millisecond(time).format("mm:ss.SSS")}
        </div>
        {!game?.isFinished && (
          <div className="absolute right-4">
            <Button
              onClick={() => {
                reset();
                router.replace("/play");
              }}
            >
              Give Up
            </Button>
          </div>
        )}
      </div>
      {children}
    </>
  );
}
