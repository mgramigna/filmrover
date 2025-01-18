import { api } from "@/lib/api";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, redirect, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async () => {
  const challenge = await api.challenge.getCurrentDailyChallenge();

  return challenge ?? null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { startMovieId, startPersonId, endMovieId, endPersonId } = zfd
    .formData({
      startMovieId: zfd.numeric(z.number().optional()),
      startPersonId: zfd.numeric(z.number().optional()),
      endMovieId: zfd.numeric(z.number().optional()),
      endPersonId: zfd.numeric(z.number().optional()),
    })
    .parse(await request.formData());

  const result = await api.game.create({
    startMovieId,
    startPersonId,
    endMovieId,
    endPersonId,
  });

  return redirect(`/play/${result.gameId}`);
};

export default function Index() {
  const challenge = useLoaderData<typeof loader>();

  return (
    <div>
      Daily C: {JSON.stringify(challenge)}
      {challenge && (
        <Form method="POST">
          <input
            type="hidden"
            name="startMovieId"
            value={challenge.startMovieId ?? undefined}
          />
          <input
            type="hidden"
            name="startPersonId"
            value={challenge.startPersonId ?? undefined}
          />
          <input
            type="hidden"
            name="endMovieId"
            value={challenge.endMovieId ?? undefined}
          />
          <input
            type="hidden"
            name="endPersonId"
            value={challenge.endPersonId ?? undefined}
          />
          <button type="submit">Create Game</button>k
        </Form>
      )}
    </div>
  );
}
