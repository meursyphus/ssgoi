"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { sheet } from "@ssgoi/react/view-transitions";
import { HostAnimation } from "@ssgoi/core/internal";
import { OverlayProvider } from "overlay-kit";
import { Toaster } from "sonner";
import { StateProvider } from "@/lib/state";
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
  const hostRef = useRef<HostAnimation | null>(null);
  if (!hostRef.current) hostRef.current = new HostAnimation();
  const router = useRouter();

  useEffect(() => {
    const host = hostRef.current!;

    function onMessage(e: MessageEvent) {
      const d = e.data;
      if (!d || typeof d !== "object") return;
      if (d.type === "ssgoi-showcase:navigate" && typeof d.path === "string") {
        router.push(d.path);
        return;
      }
      if (d.type === "ssgoi-showcase:host" && typeof d.command === "string") {
        switch (d.command) {
          case "play":
            host.play();
            break;
          case "pause":
            host.pause();
            break;
          case "reverse":
            host.reverse();
            break;
          case "complete":
            host.complete();
            break;
          case "rate":
            if (typeof d.payload === "number") host.playbackRate = d.payload;
            break;
        }
      }
    }

    function broadcast() {
      const status = host.isAnimating
        ? host.isReversing
          ? "reversing"
          : "playing"
        : host.isPaused
          ? "paused"
          : host.isComplete
            ? "settled"
            : "idle";
      window.parent.postMessage({ type: "ssgoi-showcase:status", status }, "*");
    }

    window.addEventListener("message", onMessage);
    const unsub = host.subscribe(broadcast);
    window.parent.postMessage(
      { type: "ssgoi-showcase:ready", path: window.location.pathname },
      "*",
    );

    return () => {
      window.removeEventListener("message", onMessage);
      unsub();
    };
  }, [router]);

  return (
    <StateProvider>
      <OverlayProvider>
        <div className="flex h-dvh w-full flex-col overflow-hidden bg-[#030303] text-white">
          <TopNav />
          <div className="flex min-h-0 flex-1">
            <Sidebar />
            <main className="relative min-w-0 flex-1 overflow-hidden">
              <Ssgoi config={config} host={hostRef.current!}>
                {children}
              </Ssgoi>
            </main>
          </div>
          <PlayerBar />
        </div>
        <Toaster position="top-center" richColors theme="dark" />
      </OverlayProvider>
    </StateProvider>
  );
}
