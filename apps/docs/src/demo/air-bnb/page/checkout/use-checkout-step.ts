"use client";

import { usePathname } from "next/navigation";
import { getCheckoutStepFromPathname } from "./steps";

export function useCheckoutStep() {
  return getCheckoutStepFromPathname(usePathname());
}
