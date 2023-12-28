"use client";

import { useParams } from "next/navigation";

export default function GameIdPage() {
  const { gameId: _gameId } = useParams<{ gameId: string }>();

  return (
    <div className="container mt-12 flex flex-col items-center">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        Game
      </h1>
    </div>
  );
}
