import { type Signal, type NoSerialize } from "@builder.io/qwik";
import type { SsgoiContext } from "./types";
export declare const SsgoiContextId: import("@builder.io/qwik").ContextId<
  Signal<NoSerialize<SsgoiContext> | null>
>;
export declare const useSsgoi: () => Signal<NoSerialize<SsgoiContext> | null>;
