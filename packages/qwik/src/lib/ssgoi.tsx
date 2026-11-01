import { Slot, component$, useSignal } from "@builder.io/qwik";
import type { SsgoiConfigQrl, SsgoiHostQrl } from "./types";
import type { SsgoiFramework } from "./layout-boundary";
import { useSsgoi } from "./use-ssgoi";

export interface SsgoiProps {
  config$?: SsgoiConfigQrl;
  host$?: SsgoiHostQrl;
  framework?: SsgoiFramework;
}

export const Ssgoi = component$<SsgoiProps>(({ config$, host$, framework }) => {
  const root = useSignal<HTMLElement>();

  useSsgoi(root, { config$, host$, framework });

  return (
    <div ref={root} data-ssgoi-root="" style={{ display: "contents" }}>
      <Slot />
    </div>
  );
});
