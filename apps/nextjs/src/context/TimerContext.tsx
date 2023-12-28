import type { PropsWithChildren } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface TimerContextType {
  time: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

const TimerContext = createContext<TimerContextType>({
  time: 0,
  isRunning: false,
  /* eslint-disable @typescript-eslint/no-empty-function */
  start: () => {},
  pause: () => {},
  reset: () => {},
  /* eslint-enable @typescript-eslint/no-empty-function */
});

export const TimerProvider = ({ children }: PropsWithChildren) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setTime(0);
    setIsRunning(false);
  }, []);

  return (
    <TimerContext.Provider
      value={{
        time,
        isRunning,
        start,
        pause,
        reset,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);
