import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getStockStatusColor = (value) => {
  if (value < 5) return "text-red-500";
  else if (value < 10) return "text-yellow-600";
  else return "text-emerald-600";
};
