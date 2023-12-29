import { cn } from "@/lib/utils";

export const ImagePlaceholder = ({
  size = "default",
  noText,
}: {
  size?: "sm" | "default";
  noText?: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex  rounded-lg border border-slate-100 bg-slate-700",
        size === "default" && "h-[150px] w-[100px] sm:h-[300px] sm:w-[200px]",
        size === "sm" && "h-[75px] w-[50px] sm:h-[150px] sm:w-[100px]",
      )}
    >
      {!noText && (
        <div className={cn("m-auto", size === "sm" && "text-xs")}>No Image</div>
      )}
    </div>
  );
};
