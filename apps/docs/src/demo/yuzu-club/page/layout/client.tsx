"use client";

import { useState, type ReactNode } from "react";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { jaemin } from "@ssgoi/react/view-transitions";
import { HostAnimation } from "@ssgoi/core/internal";
import { useShowcaseFrameBridge } from "@/lib/hooks";
import { FloatingHeader } from "../shared/floating-header";

const BASE = "/demo/yuzu-club";
const HOME = BASE;
const FLAVORS = `${BASE}/flavors`;

const config: SsgoiConfig = {
  transitions: jaemin({ paths: [HOME, FLAVORS] }),
};

export function YuzuClubLayoutClient({ children }: { children: ReactNode }) {
  const [host] = useState(() => new HostAnimation());
  useShowcaseFrameBridge(host);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#fff5d6] text-[#1a1a2e]">
      <Ssgoi config={config} host={host}>
        <main className="relative h-full w-full">{children}</main>
      </Ssgoi>
      <FloatingHeader />
    </div>
  );
}
