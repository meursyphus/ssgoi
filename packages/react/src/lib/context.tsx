import { createContext, useContext } from "react";
import type { SsgoiContext } from "./types";

const SsgoiContextInstance = createContext<SsgoiContext | null>(null);

export const SsgoiProvider = SsgoiContextInstance.Provider;

export const useSsgoi = () => {
  const context = useContext(SsgoiContextInstance);
  if (!context) {
    throw new Error("useSsgoi must be used within SsgoiProvider");
  }
  return context;
};