import { cn } from "@/lib/utils";

export const TMDBPoster = ({
  slug,
  title,
  size = "default",
}: {
  slug: string | null;
  title?: string;
  size?: "default" | "sm";
}) => {
  return (
    <div
      className={cn(
        "relative rounded-lg border",
        size === "default" && "h-[150px] w-[100px] sm:h-[300px] sm:w-[200px]",
        size === "sm" && "h-[150px] w-[100px]",
      )}
    >
      {!slug && (
        <div className="flex h-full w-full rounded-lg bg-accent text-muted-foreground">
          <div className="m-auto">
            <p className="text-muted-foreground">No image</p>
          </div>
        </div>
      )}
      {slug && (
        <img
          className="h-full w-full rounded-lg"
          src={`https://image.tmdb.org/t/p/original${slug}`}
          alt={title}
        />
      )}
    </div>
  );
};
