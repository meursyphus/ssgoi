"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { type SsgoiConfig } from "@ssgoi/react";
import { sheet } from "@ssgoi/react/view-transitions";
import { MobileShowcaseShell } from "@/lib/components/mobile-showcase-shell";
import { BottomNav } from "../inbox/bottom-nav";

const BASE = "/demo/material-mail";

// Material Mail — only the sheet/scale path is wired. The Inbox → Mail Detail
// drill and Mail Detail → Reply axis/z transitions are intentionally mocked
// (cards are non-navigating) so the focus stays on the compose sheet.
//
// TODO axis/z: when the Mail Detail / Reply screens land, the second entry
// below should be uncommented. Today the underlying axis({ type: "z" })
// provider exists in core but is not UX-verified for this app yet.
const config: SsgoiConfig = {
  preserveScroll: true,
  transitions: [
    // FAB ✏️ → Compose (the main showcase of sheet/scale)
    ...sheet({
      type: "scale",
      enter: `${BASE}/compose`,
      exit: BASE,
    }),
    // ...axis({
    //   paths: [`${BASE}/m/*/reply`, `${BASE}/m/*`],
    //   type: "z",
    // }),
  ],
};

/**
 * Bottom nav lives outside the page transition (mirrors kakao-talk). It only
 * appears on the inbox path — the compose sheet covers it from above anyway.
 */
function BottomNavSlot() {
  const pathname = usePathname();
  if (pathname === BASE) return <BottomNav />;
  return null;
}

export function MaterialMailLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <MobileShowcaseShell
      config={config}
      contentClassName="bg-[#FAFAFE]"
      bottomSlot={<BottomNavSlot />}
    >
      {children}
    </MobileShowcaseShell>
  );
}
