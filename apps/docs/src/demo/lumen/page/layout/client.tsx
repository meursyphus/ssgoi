"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { film } from "@ssgoi/react/view-transitions";
import { HostAnimation } from "@ssgoi/core/internal";

const BASE = "/demo/lumen";
const FOUNDATIONS = BASE;
const CINEMATIC_EYE = `${BASE}/cinematic-eye`;

const config: SsgoiConfig = {
  transitions: film({ paths: [FOUNDATIONS, CINEMATIC_EYE] }),
};

export function LumenLayoutClient({ children }: { children: ReactNode }) {
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
    <div className="relative h-dvh w-full overflow-hidden bg-black text-white">
      <Ssgoi config={config} host={hostRef.current!}>
        {children}
      </Ssgoi>
    </div>
  );
}
