"use client";

import type { CreateGameFormType } from "@/components/forms/CreateGameForm";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { CreateGameForm } from "@/components/forms/CreateGameForm";
import { api } from "@/trpc/react";

export default function CreateGamePage() {
  const router = useRouter();

  const createGameMutation = api.game.create.useMutation({
    onSuccess: (gameId) => {
      router.push(`/play/${gameId}`);
    },
    onError: () => {
      toast("Something went wrong");
    },
  });

  const onCreateGameFormSubmit = useCallback(
    (form: CreateGameFormType) => {
      createGameMutation.mutate(form);
    },
    [createGameMutation],
  );

  return (
    <div className="container flex flex-col items-center">
      <CreateGameForm onSubmit={onCreateGameFormSubmit} />
    </div>
  );
}
