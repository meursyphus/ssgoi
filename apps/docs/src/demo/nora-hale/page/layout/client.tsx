"use client";

import { useState, type ReactNode } from "react";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { strip } from "@ssgoi/react/view-transitions";
import { HostAnimation } from "@ssgoi/core/internal";
import { useShowcaseFrameBridge } from "@/lib/hooks";
import { SiteHeader } from "../shared/site-header";

const BASE = "/demo/nora-hale";
const ARCHIVE = BASE;
const ABOUT = `${BASE}/about`;

const config: SsgoiConfig = {
  transitions: strip({ paths: [ARCHIVE, ABOUT] }),
};

export function NoraHaleLayoutClient({ children }: { children: ReactNode }) {
  const [host] = useState(() => new HostAnimation());
  useShowcaseFrameBridge(host);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#f4ecdd] text-[#1a1a1a]">
      <SiteHeader />
      <Ssgoi config={config} host={host}>
        <main className="relative h-full w-full">{children}</main>
      </Ssgoi>
    </div>
  );
}
