import Image from "next/image";

export const TMDBImage = ({
  slug,
  title,
  priority,
}: {
  slug: string;
  title?: string;
  priority?: boolean;
}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      {title && (
        <h3 className="text-center text-xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h3>
      )}
      <div className="relative h-[150px] w-[100px] flex-1 rounded-lg border border-slate-100 sm:h-[300px] sm:w-[200px]">
        <Image
          className="rounded-lg"
          src={`https://image.tmdb.org/t/p/original${slug}`}
          alt={`${title} Image`}
          priority={priority}
          width={200}
          height={300}
        />
      </div>
    </div>
  );
};
