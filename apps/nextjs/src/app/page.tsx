import { api } from "@/trpc/server";

export default async function HomePage() {
  const movie = await api.movie.getById.query({
    id: 11,
  });

  return (
    <main className="dark flex h-screen flex-col items-center bg-gradient-to-b from-slate-800 to-slate-950 text-white">
      <div className="container mt-12 flex flex-col items-center justify-center gap-4 py-8">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          FilmRover
        </h1>
      </div>
    </main>
  );
}
