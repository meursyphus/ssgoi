"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { HostAnimation } from "@ssgoi/core/internal";
import { OverlayProvider } from "overlay-kit";
import { Toaster } from "sonner";
import { StateProvider } from "@/lib/state";
import { MobileFrame } from "@/lib/components/mobile-frame";

/**
 * 모바일 쇼케이스용 공통 셸.
 *
 * 모든 쇼케이스 layout/client.tsx는 이걸로 감싸기만 하면 된다.
 *
 * 추가로 — 이 셸이 iframe 안에서 띄워질 때 외부 부모 페이지(showcase 상세)와
 * postMessage 프로토콜로 통신한다:
 *
 *   부모 → demo (postMessage 수신):
 *     { type: "ssgoi-showcase:navigate", path }
 *       → next/navigation router.push(path)
 *     { type: "ssgoi-showcase:host", command, payload? }
 *       command: "play" | "pause" | "reverse" | "complete" | "rate"(payload:number)
 *
 *   demo → 부모 (window.parent.postMessage):
 *     { type: "ssgoi-showcase:status", status }
 *       status: "idle" | "playing" | "reversing" | "paused" | "settled"
 *
 * 같은 origin(=docs 단일 앱)에서 iframe을 띄울 거라 origin 체크 없이도 안전하다.
 */
export function MobileShowcaseShell({
  config,
  children,
}: {
  config: SsgoiConfig;
  children: ReactNode;
}) {
  const hostRef = useRef<HostAnimation | null>(null);
  if (!hostRef.current) hostRef.current = new HostAnimation();
  const router = useRouter();

  useEffect(() => {
    const host = hostRef.current!;

    function onMessage(e: MessageEvent) {
      const data = e.data;
      if (!data || typeof data !== "object") return;
      if (
        data.type === "ssgoi-showcase:navigate" &&
        typeof data.path === "string"
      ) {
        router.push(data.path);
        return;
      }
      if (
        data.type === "ssgoi-showcase:host" &&
        typeof data.command === "string"
      ) {
        switch (data.command) {
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
            if (typeof data.payload === "number") {
              host.playbackRate = data.payload;
            }
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
    // announce mount so the parent can re-sync after iframe reloads
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
        <MobileFrame>
          <Ssgoi config={config} host={hostRef.current!}>
            {children}
          </Ssgoi>
        </MobileFrame>
        <Toaster position="top-center" richColors />
      </OverlayProvider>
    </StateProvider>
  );
}
