"use client";

import { GameProvider } from "@/context/GameContext";
import { HistoryProvider } from "@/context/HistoryContext";
import { TimerProvider } from "@/context/TimerContext";

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GameProvider>
      <TimerProvider>
        <HistoryProvider>{children}</HistoryProvider>
      </TimerProvider>
    </GameProvider>
  );
}
