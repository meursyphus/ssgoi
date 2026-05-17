"use client";

import { createContext, useContext } from "react";
import type { SsgoiContext } from "@ssgoi/core/types";

const SsgoiContextInstance = createContext<SsgoiContext | null>(null);

export const SsgoiProvider = SsgoiContextInstance.Provider;

export const useSsgoi = (): SsgoiContext => {
  const ctx = useContext(SsgoiContextInstance);
  if (!ctx) throw new Error("useSsgoi must be used within Ssgoi provider");
  return ctx;
};
