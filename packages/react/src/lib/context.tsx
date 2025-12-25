"use client";

import { createContext, useContext } from "react";
import type { ReactSsgoiContext } from "./types";

const SsgoiContextInstance = createContext<ReactSsgoiContext | null>(null);

export const SsgoiProvider = SsgoiContextInstance.Provider;

export const useSsgoi = (): ReactSsgoiContext => {
  const context = useContext(SsgoiContextInstance);
  if (!context) {
    throw new Error("useSsgoi must be used within SsgoiProvider");
  }
  return context;
};
