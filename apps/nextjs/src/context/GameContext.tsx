import type { PropsWithChildren } from "react";
import { createContext, useContext } from "react";
import { useParams } from "next/navigation";

import type { RouterOutputs } from "@filmrover/api";

import { api } from "@/trpc/react";

interface GameContextType {
  game?: RouterOutputs["game"]["getById"];
  isLoading?: boolean;
}

const GameContext = createContext<GameContextType>({});

export const GameProvider = ({ children }: PropsWithChildren) => {
  const { gameId } = useParams<{ gameId: string }>();
  const { data: game, isLoading } = api.game.getById.useQuery({
    id: gameId,
  });

  return (
    <GameContext.Provider
      value={{
        isLoading,
        game,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
