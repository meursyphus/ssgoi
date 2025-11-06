import type { GetTransitionConfig } from "../types";

export type PendingTransition = {
  from?: string;
  to?: string;
  outResolve?: (transition: GetTransitionConfig) => void;
  inResolve?: (transition: GetTransitionConfig) => void;
};
