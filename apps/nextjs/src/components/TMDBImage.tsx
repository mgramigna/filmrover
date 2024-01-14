import _Image from "next/image";

import { cn } from "@/lib/utils";

// TODO: re-enable next Image once I'm not blowing through my caching limit
export const TMDBImage = ({
  slug,
  title,
  priority: _priority,
  size = "default",
}: {
  slug: string;
  title?: string;
  priority?: boolean;
  size?: "default" | "sm";
}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      {title && (
        <h3
          className={cn(
            "text-center font-bold tracking-tight",
            size === "default" && "text-xl sm:text-3xl",
            size === "sm" && "text-base",
          )}
        >
          {title}
        </h3>
      )}
      <div
        className={cn(
          "relative  flex-1 rounded-lg border border-slate-100",
          size === "default" && "h-[150px] w-[100px] sm:h-[300px] sm:w-[200px]",
          size === "sm" && "h-[150px] w-[100px]",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="h-full w-full rounded-lg"
          src={`https://image.tmdb.org/t/p/original${slug}`}
          alt={title}
        />
      </div>
    </div>
  );
};
