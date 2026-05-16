import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export { createAction, resolveActions } from "./action";
export { ActionError } from "./action-error";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
