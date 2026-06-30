import { Slot, component$, useSignal } from "@builder.io/qwik";
import type { SsgoiConfigQrl, SsgoiHostQrl } from "./types";
import { useSsgoi } from "./use-ssgoi";

export interface SsgoiProps {
  config$?: SsgoiConfigQrl;
  host$?: SsgoiHostQrl;
}

export const Ssgoi = component$<SsgoiProps>(({ config$, host$ }) => {
  const root = useSignal<HTMLElement>();

  useSsgoi(root, { config$, host$ });

  return (
    <div ref={root} data-ssgoi-root="" style={{ display: "contents" }}>
      <Slot />
    </div>
  );
});
