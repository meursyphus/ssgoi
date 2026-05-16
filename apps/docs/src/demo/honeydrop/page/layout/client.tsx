"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { rotate } from "@ssgoi/react/view-transitions";
import { HostAnimation } from "@ssgoi/core/internal";
import { HiveMenu } from "../shared/hive-menu";
import { CornerMarks } from "../shared/corner-marks";

const BASE = "/demo/honeydrop";
const COURT = BASE;
const DROP = `${BASE}/drop`;

const config: SsgoiConfig = {
  transitions: rotate({ paths: [COURT, DROP] }),
};

export function HoneydropLayoutClient({ children }: { children: ReactNode }) {
  const [host] = useState(() => new HostAnimation());
  const router = useRouter();

  useEffect(() => {
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
  }, [router, host]);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-black text-white">
      <Ssgoi config={config} host={host}>
        <main className="relative h-full w-full">{children}</main>
      </Ssgoi>
      {/* fixed chrome — outside Ssgoi so it doesn't rotate with the page */}
      <HiveMenu />
      <CornerMarks />
    </div>
  );
}
