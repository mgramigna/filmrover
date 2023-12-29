import Image from "next/image";

import { cn } from "@/lib/utils";

export const TMDBImage = ({
  slug,
  title,
  priority,
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
