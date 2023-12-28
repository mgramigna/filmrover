"use client";

import { useTimer } from "@/context/TimerContext";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { time } = useTimer();
  return (
    <div>
      <div>{time}</div>
      {children}
    </div>
  );
}
