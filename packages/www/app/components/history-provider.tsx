import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const CLICK_HISTORY_KEY = "clickHistory";

type HistoryObject = {
  type: "movie" | "person";
  id: number;
  display: string;
};

const HistoryContext = createContext<{
  history: HistoryObject[];
  logHistory: (entry: HistoryObject) => void;
  clearHistory: () => void;
}>({
  history: [],
  logHistory: () => {},
  clearHistory: () => {},
});

export const HistoryProvider = ({
  children,
  gameId,
}: { children: ReactNode; gameId: string }) => {
  const [history, setHistory] = useState<HistoryObject[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem(`${gameId}-${CLICK_HISTORY_KEY}`);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (_) {
        setHistory([]);
      }
    }
  }, [gameId]);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem(
        `${gameId}-${CLICK_HISTORY_KEY}`,
        JSON.stringify(history),
      );
    }
  }, [history, gameId]);

  const logHistory = useCallback((entry: HistoryObject) => {
    setHistory((prev) => [...prev, entry]);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem(`${gameId}-${CLICK_HISTORY_KEY}`);
  };

  return (
    <HistoryContext.Provider
      value={{
        history,
        logHistory,
        clearHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);

  if (!context) {
    throw new Error(
      "useClickHistory must be used within a ClickHistoryProvider",
    );
  }

  return context;
};
