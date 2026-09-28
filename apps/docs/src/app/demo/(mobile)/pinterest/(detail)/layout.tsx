import type { ReactNode } from "react";
import { MobileDetailShell } from "@/lib/components/mobile-detail-shell";

export default function DetailLayout({ children }: { children: ReactNode }) {
  // Every Pinterest detail screen scrolls the frame, so the boundary grows
  // with its content (min-h-full still covers short pages). With the shell's
  // default h-full, SSGOI's paint containment would crop a scrolled page
  // leaving the screen to one viewport and show black below it.
  return <MobileDetailShell className="h-auto">{children}</MobileDetailShell>;
}
