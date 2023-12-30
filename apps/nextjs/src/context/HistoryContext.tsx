import type { PropsWithChildren } from "react";
import { createContext, useCallback, useContext, useState } from "react";

export interface HistoryObject {
  type: "movie" | "person";
  id: number;
  display: string;
}

interface HistoryContextType {
  history: HistoryObject[];
  logHistory: (val: HistoryObject) => void;
}

const HistoryContext = createContext<HistoryContextType>({
  history: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  logHistory: () => {},
});

export const HistoryProvider = ({ children }: PropsWithChildren) => {
  const [history, setHistory] = useState<HistoryObject[]>([]);

  const logHistory = useCallback((item: HistoryObject) => {
    setHistory((current) => [...current, item]);
  }, []);

  return (
    <HistoryContext.Provider
      value={{
        history,
        logHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);
