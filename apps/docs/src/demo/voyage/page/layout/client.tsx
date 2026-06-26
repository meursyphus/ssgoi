"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { type SsgoiConfig } from "@ssgoi/react";
import { sheet } from "@ssgoi/react/view-transitions";
import { MobileShowcaseShell } from "@/lib/components/mobile-showcase-shell";
import { BottomNav } from "../feed/bottom-nav";

const BASE = "/demo/voyage";

// Voyage showcases the `sheet` "blur" tone: tapping "New story" raises the
// compose sheet while the feed underneath blurs and recedes — a modal pushing
// the page out of focus, the way Gmail's compose floats over the inbox.
const config: SsgoiConfig = {
  preserveScroll: true,
  transitions: [
    ...sheet({
      type: "blur",
      enter: `${BASE}/compose`,
      exit: BASE,
    }),
  ],
};

/**
 * Bottom nav lives outside the page transition (mirrors material-mail). It only
 * shows on the feed — the compose sheet covers it from above anyway.
 */
function BottomNavSlot() {
  const pathname = usePathname();
  if (pathname === BASE) return <BottomNav />;
  return null;
}

export function VoyageLayoutClient({ children }: { children: ReactNode }) {
  return (
    <MobileShowcaseShell
      config={config}
      contentClassName="bg-white"
      bottomSlot={<BottomNavSlot />}
    >
      {children}
    </MobileShowcaseShell>
  );
}
