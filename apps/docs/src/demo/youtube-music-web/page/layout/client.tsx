"use client";

import { type ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { sheet } from "@ssgoi/react/view-transitions";
import { OverlayProvider } from "overlay-kit";
import { Toaster } from "sonner";
import { StateProvider } from "@/lib/state";
import { DemoShell, SsgoiWithHost } from "@/lib/components/demo-shell";
import { TopNav } from "./top-nav";
import { Sidebar } from "./sidebar";
import { PlayerBar } from "./player-bar";

const BASE = "/demo/youtube-music-web";

const config: SsgoiConfig = {
  transitions: [
    // home ↔ watch — sheet (default static: 백그라운드는 가만히, 시트만 슬라이드)
    ...sheet({ enter: `${BASE}/watch`, exit: BASE }),
  ],
};

export function YoutubeMusicLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DemoShell>
      <StateProvider>
        <OverlayProvider>
          <div className="flex h-dvh w-full flex-col overflow-hidden bg-[#030303] text-white">
            <TopNav />
            <div className="flex min-h-0 flex-1">
              <Sidebar />
              <main className="relative z-0 min-w-0 flex-1 overflow-hidden">
                <SsgoiWithHost config={config}>{children}</SsgoiWithHost>
              </main>
            </div>
            <PlayerBar />
          </div>
          <Toaster position="top-center" richColors theme="dark" />
        </OverlayProvider>
      </StateProvider>
    </DemoShell>
  );
}
