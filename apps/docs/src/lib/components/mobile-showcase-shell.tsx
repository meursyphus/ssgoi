"use client";

import { type ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { OverlayProvider } from "overlay-kit";
import { Toaster } from "sonner";
import { StateProvider } from "@/lib/state";
import { MobileFrame } from "@/lib/components/mobile-frame";
import { DemoShell, SsgoiWithHost } from "@/lib/components/demo-shell";
import { cn } from "@/lib/utils";

/** Mobile demo shell with one demo-local SSGOI root. */
export function MobileShowcaseShell({
  config,
  children,
  contentClassName,
  bottomSlot,
  withTransitionBoundary = true,
}: {
  config: SsgoiConfig;
  children: ReactNode;
  /** Extra classes for the scrollable content area. */
  contentClassName?: string;
  /** Fixed content outside the transition region, such as a bottom nav. */
  bottomSlot?: ReactNode;
  /**
   * Most demos use the default pathname boundary. Persistent-layout demos
   * place boundaries in their route-group shells instead.
   */
  withTransitionBoundary?: boolean;
}) {
  return (
    <DemoShell>
      <StateProvider>
        <OverlayProvider>
          <MobileFrame
            contentClassName={contentClassName}
            bottomSlot={bottomSlot}
          >
            <SsgoiWithHost
              config={config}
              withTransitionBoundary={withTransitionBoundary}
              boundaryClassName={cn(
                "h-full min-h-full bg-black",
                contentClassName,
              )}
            >
              {children}
            </SsgoiWithHost>
          </MobileFrame>
          <Toaster position="top-center" richColors />
        </OverlayProvider>
      </StateProvider>
    </DemoShell>
  );
}
