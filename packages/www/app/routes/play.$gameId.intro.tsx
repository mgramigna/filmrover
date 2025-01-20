import { api } from "@/lib/api";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { gameId } = params;

  if (!gameId) {
    throw new Response(null, { status: 404 });
  }

  const game = await api.game.getById(gameId);

  return game;
};

export default function PlayHomepage() {
  const game = useLoaderData<typeof loader>();

  return (
    <div>
      <div>Game: {JSON.stringify(game)}</div>
      <div>
        {game.startMovieId && (
          <Link to={`/play/${game.id}/m/${game.startMovieId}`}>Start</Link>
        )}
        {game.startPersonId && (
          <Link to={`/play/${game.id}/m/${game.startPersonId}`}>Start</Link>
        )}
      </div>
    </div>
  );
}
