import Link from "next/link";

import { Button } from "@/components/ui/button";

export default async function HomePage() {
  return (
    <div className="container mt-12 flex flex-col items-center">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        FilmRover
      </h1>
      <Link href="/play">
        <Button>Play</Button>
      </Link>
    </div>
  );
}
