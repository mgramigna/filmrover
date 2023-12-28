"use client";

import { GameProvider } from "@/context/GameContext";
import { TimerProvider } from "@/context/TimerContext";

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GameProvider>
      <TimerProvider>{children}</TimerProvider>
    </GameProvider>
  );
}
