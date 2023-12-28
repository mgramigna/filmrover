"use client";

import { CreateGameForm } from "@/components/forms/CreateGameForm";

export default function CreateGamePage() {
  return (
    <div className="container mt-12 flex flex-col items-center">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        Create Game
      </h1>
      <CreateGameForm />
    </div>
  );
}
