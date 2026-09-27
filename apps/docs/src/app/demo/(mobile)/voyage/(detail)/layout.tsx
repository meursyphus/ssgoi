import type { ReactNode } from "react";
import { MobileDetailShell } from "@/lib/components/mobile-detail-shell";

export default function DetailLayout({ children }: { children: ReactNode }) {
  // Story and Activity scroll the frame, so the boundary grows with its
  // content (with the default h-full, paint containment would crop a scrolled
  // page leaving the screen to one viewport). flex-col lets short screens
  // (compose) still fill the viewport: their roots are flex-1.
  return (
    <MobileDetailShell className="flex h-auto flex-col">
      {children}
    </MobileDetailShell>
  );
}
