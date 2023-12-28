"use client";

import { GameProvider } from "@/context/GameContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <GameProvider>{children}</GameProvider>;
}
