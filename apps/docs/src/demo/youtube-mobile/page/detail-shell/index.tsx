import type { ReactNode } from "react";
import { MobileDetailShell } from "@/lib/components/mobile-detail-shell";
import { ActionSheetHost } from "../shared/action-sheet";

/**
 * (detail) boundary. Watch, channel and search pages scroll the frame, so the
 * boundary grows with its content: with the shell's default h-full, SSGOI's
 * paint containment crops a scrolled page that is leaving (watch → up next)
 * to one viewport and shows blank below it. An auto-height parent can't
 * resolve h-full, so scrolling pages `grow` to at least one viewport and the
 * viewport-locked screens (Shorts player, Create) fill it with
 * `absolute inset-0`. The ⋮ action sheet comes last in the column, so its
 * sticky bottom stays on screen at any scroll position.
 */
export default function DetailShell({ children }: { children: ReactNode }) {
  return (
    <MobileDetailShell className="relative flex h-auto flex-col">
      {children}
      <ActionSheetHost />
    </MobileDetailShell>
  );
}
