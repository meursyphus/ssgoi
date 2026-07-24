"use client";

import { type ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { sheet } from "@ssgoi/react/view-transitions";
import { SsgoiWithHost } from "@/lib/components/demo-shell";
import { WebShowcaseShell } from "@/lib/components/web-showcase-shell";
import { TopNav } from "./top-nav";
import { Sidebar } from "./sidebar";
import { PlayerBar } from "./player-bar";

const BASE = "/demo/youtube-music-web";

const config: SsgoiConfig = {
  transitions: [
    // home ↔ watch — sheet (default static: 백그라운드는 가만히, 시트만 슬라이드)
    { from: BASE, to: `${BASE}/watch`, transition: sheet() },
  ],
};

export function YoutubeMusicLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <WebShowcaseShell toasterTheme="dark">
      <div className="flex h-dvh w-full flex-col overflow-hidden bg-[#030303] text-white">
        <TopNav />
        <div className="flex min-h-0 flex-1">
          <Sidebar />
          <main className="relative z-0 min-w-0 flex-1 overflow-hidden">
            <SsgoiWithHost
              config={config}
              boundaryClassName="h-full min-h-full bg-[#030303]"
            >
              {children}
            </SsgoiWithHost>
          </main>
        </div>
        <PlayerBar />
      </div>
    </WebShowcaseShell>
  );
}
