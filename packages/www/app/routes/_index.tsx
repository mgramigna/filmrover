import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

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

const getGameLink = ({
  endMovieId,
  endPersonId,
  startMovieId,
  startPersonId,
}: {
  startMovieId: number | null;
  startPersonId: number | null;
  endMovieId: number | null;
  endPersonId: number | null;
}) => {
  let res = "/play?";

  if (startMovieId) {
    res += `start_movie_id=${startMovieId}&`;
  }

  if (startPersonId) {
    res += `start_person_id=${startPersonId}&`;
  }

  if (endMovieId) {
    res += `end_movie_id=${endMovieId}&`;
  }

  if (endPersonId) {
    res += `end_person_id=${endPersonId}&`;
  }

  return res;
};

export default function Index() {
  const challenge = useLoaderData<typeof loader>();

  return (
    <div>
      Daily C: {JSON.stringify(challenge)}
      {challenge && (
        <Button asChild>
          <Link
            to={getGameLink({
              startMovieId: challenge.startMovieId,
              startPersonId: challenge.startPersonId,
              endMovieId: challenge.endMovieId,
              endPersonId: challenge.endPersonId,
            })}
          >
            Play Daily Challenge
          </Link>
        </Button>
      )}
    </div>
  );
}
