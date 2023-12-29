import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimer(timeMillis: number): string {
  return dayjs().startOf("day").millisecond(timeMillis).format("mm:ss.SSS");
}
