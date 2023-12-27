import { api } from "@/trpc/server";

export const runtime = "edge";

export default async function HomePage() {
  const pong = await api.ping.ping.query();
  console.log("RSC Posts:", pong);

  return (
    <main className="flex h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container mt-12 flex flex-col items-center justify-center gap-4 py-8">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          FilmRover
        </h1>
      </div>
    </main>
  );
}
