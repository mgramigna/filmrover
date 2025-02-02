import { createContext, useContext, useEffect, useState } from "react";

export const TIMER_SECONDS_KEY = "timer-seconds";
export const TIMER_IS_RUNNING_KEY = "timer-running";

const TimerContext = createContext<{
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  seconds: number;
  isRunning: boolean;
}>({
  startTimer: () => {},
  stopTimer: () => {},
  resetTimer: () => {},
  seconds: 0,
  isRunning: false,
});

export const TimerProvider = ({
  children,
  gameId,
}: { children: React.ReactNode; gameId: string }) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  useEffect(() => {
    const savedSeconds = localStorage.getItem(`${gameId}-${TIMER_SECONDS_KEY}`);
    const savedIsRunning = localStorage.getItem(
      `${gameId}-${TIMER_IS_RUNNING_KEY}`,
    );

    if (savedSeconds) {
      setSeconds(Number.parseInt(savedSeconds, 10));
    }

    if (savedIsRunning === "true") {
      setIsRunning(true);
    }
  }, [gameId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          const newSeconds = prevSeconds + 1;
          localStorage.setItem(
            `${gameId}-${TIMER_SECONDS_KEY}`,
            newSeconds.toString(),
          );
          return newSeconds;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, gameId]);

  useEffect(() => {
    localStorage.setItem(
      `${gameId}-${TIMER_IS_RUNNING_KEY}`,
      isRunning.toString(),
    );
  }, [isRunning, gameId]);

  return (
    <TimerContext.Provider
      value={{
        startTimer,
        stopTimer,
        seconds,
        isRunning,
        resetTimer,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);

  if (context === undefined) {
    throw new Error("useTimer must be used within a TimerProvider");
  }

  return context;
};
