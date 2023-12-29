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
      {children}
      <div className="sticky bottom-0 z-50 flex h-24 w-full items-center justify-between gap-4 bg-slate-900 p-4">
        <div className="flex w-1/3 justify-start rounded-xl text-xs sm:text-base">
          {dayjs().startOf("day").millisecond(time).format("mm:ss.SSS")}
        </div>
        <div></div>
        {endMovie && (
          <div className="flex w-1/3 justify-center text-xs sm:text-base">
            Navigate to{" "}
            <span className="font-bold">&quot;{endMovie.title}&quot;</span>
          </div>
        )}
        {endPerson && (
          <div className="flex w-1/3 justify-center text-xs sm:text-base">
            <div>
              Navigate to{" "}
              <span className="font-bold">&quot;{endPerson.name}&quot;</span>
            </div>
          </div>
        )}
        {!game?.isFinished && (
          <div className="flex w-1/3 justify-end">
            <Button
              size={"sm"}
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
    </>
  );
}
