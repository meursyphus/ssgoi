"use client";

import { type ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { jaemin } from "@ssgoi/react/view-transitions";
import { DemoShell, SsgoiWithHost } from "@/lib/components/demo-shell";
import { FloatingHeader } from "../shared/floating-header";

const BASE = "/demo/yuzu-club";
const HOME = BASE;
const FLAVORS = `${BASE}/flavors`;

const config: SsgoiConfig = {
  transitions: jaemin({ paths: [HOME, FLAVORS] }),
};

export function YuzuClubLayoutClient({ children }: { children: ReactNode }) {
  return (
    <DemoShell>
      <div className="relative h-dvh w-full overflow-hidden bg-[#fff5d6] text-[#1a1a2e]">
        <SsgoiWithHost config={config}>
          <main className="relative h-full w-full">{children}</main>
        </SsgoiWithHost>
        <FloatingHeader />
      </div>
    </DemoShell>
  );
}
