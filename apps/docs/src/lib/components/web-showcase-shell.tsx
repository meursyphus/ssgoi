"use client";

import { type ReactNode } from "react";
import { OverlayProvider } from "overlay-kit";
import { Toaster, type ToasterProps } from "sonner";
import { StateProvider } from "@/lib/state";
import { DemoShell } from "@/lib/components/demo-shell";

export function WebShowcaseShell({
  children,
  toasterTheme,
}: {
  children: ReactNode;
  /** sonner 테마. 다크 배경 쇼케이스는 "dark", 기본은 system. */
  toasterTheme?: ToasterProps["theme"];
}) {
  return (
    <DemoShell>
      <StateProvider>
        <OverlayProvider>
          {children}
          <Toaster position="top-center" richColors theme={toasterTheme} />
        </OverlayProvider>
      </StateProvider>
    </DemoShell>
  );
}
