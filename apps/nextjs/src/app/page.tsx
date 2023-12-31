import Image from "next/image";
import Link from "next/link";
import { Coffee, Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";

export default async function HomePage() {
  const dailyChallenge = await api.challenge.getCurrentDailyChallenge.query();

  return (
    <div className="container mt-12 flex flex-col items-center lg:px-48">
      <h1 className="text-center text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        FilmRover
      </h1>
      <h3 className="mt-6 text-center text-2xl font-bold sm:text-3xl">
        Test your movie knowledge, &quot;Wikipedia Game&quot; style
      </h3>
      <div className="mt-10">
        <Link href="/play">
          <Button>Play a Game</Button>
        </Link>
      </div>
      {dailyChallenge && (
        <div className="mt-12">
          <h2 className="text-center text-2xl font-bold">
            Today&apos;s Challenge
          </h2>
          <div className="mt-8 flex gap-2 text-center text-xl">
            <div>{dailyChallenge.startLabel}</div>
            <div>➡️</div>
            <div>{dailyChallenge.endLabel}</div>
          </div>
        </div>
      )}
      <div className="mt-20">
        <h2 className="text-2xl font-bold">How to Play</h2>
      </div>
      <div className="mt-12 text-center text-xl">
        Each game, you will have a starting movie or person (actor/director), as
        well as a destination
      </div>
      <div className="mt-12 w-full md:w-[600px]">
        <Image
          className="rounded-lg border-2 border-slate-500"
          src={"/assets/selection-screenshot.png"}
          alt="Screenshot of the selection page"
          width={1678}
          height={1600}
          priority
        />
      </div>
      <div className="mt-12 text-center text-xl">
        Your goal is to navigate from the start to the destination as quickly as
        possible by clicking on &quot;links&quot;. Movies will link to people,
        and people will link to movies
      </div>
      <div className="mt-12 w-full md:w-[600px]">
        <Image
          className="rounded-lg border-2 border-slate-500"
          src={"/assets/movie-detail-screenshot.png"}
          alt="Screenshot of the movie detail page"
          width={2824}
          height={1584}
        />
      </div>
      <div className="mt-12 text-center text-xl">
        Once you reach the destination, you win!
      </div>
      <div className="mt-12 w-full md:w-[600px]">
        <Image
          className="rounded-lg border-2 border-slate-500"
          src={"/assets/victory-screenshot.png"}
          alt="Screenshot of the victory page"
          width={2468}
          height={1450}
        />
      </div>
      <div className="mt-12 flex flex-col justify-center gap-x-0 gap-y-8 pb-24 sm:flex-row sm:gap-x-8 sm:gap-y-0">
        <a
          href="https://buymeacoffee.com/mgramigna"
          target="blank"
          className="flex items-center"
        >
          <Button className="w-48 bg-orange-700 text-slate-50 hover:bg-orange-700/90">
            <span className="inline-block pr-2">
              <Coffee />
            </span>
            <span>Buy Me a Coffee</span>
          </Button>
        </a>
        <a
          href="https://github.com/mgramigna/filmrover"
          target="blank"
          className="flex items-center"
        >
          <Button variant={"secondary"} className="w-48">
            <span className="inline-block pr-2">
              <Github />
            </span>
            <span>View Source Code</span>
          </Button>
        </a>
      </div>
    </div>
  );
}
