"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { type SsgoiConfig } from "@ssgoi/react";
import { sheet, zoom } from "@ssgoi/react/view-transitions";
import { MobileShowcaseShell } from "@/lib/components/mobile-showcase-shell";
import { BottomNav } from "../home/bottom-nav";

const BASE = "/demo/air-bnb";

const config: SsgoiConfig = {
  preserveScroll: true,
  transitions: [
    zoom({
      paths: [BASE, `${BASE}/listings/*`],
      type: "blur",
      variant: "fade",
    }),
    sheet({
      type: "static",
      enter: `${BASE}/listings/detail/checkout`,
      exit: `${BASE}/listings/detail`,
    }),
  ],
};

function BottomNavSlot() {
  const pathname = usePathname();
  if (pathname === BASE) return <BottomNav />;
  return null;
}

export function AirBnbLayoutClient({ children }: { children: ReactNode }) {
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
