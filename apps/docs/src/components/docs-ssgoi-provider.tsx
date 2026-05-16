"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { scroll } from "@ssgoi/react/view-transitions";
import { HostAnimation } from "@ssgoi/core/internal";

const config: SsgoiConfig = {
  preserveScroll: false,
  transitions: [
    scroll({
      paths: ["/", "/showcase"],
      type: "non-directional",
      direction: "up",
    }),
  ],
};

/**
 * docs(landing + /showcase) 전역 SSgoi 프로바이더.
 *
 * 또한 — 자기 자신을 showcase 데모로도 쓸 수 있도록(`slug: ssgoi-docs`),
 * iframe 안에서 띄워졌을 때 부모(showcase 상세)와 postMessage 프로토콜로
 * 통신한다. MobileShowcaseShell과 동일한 인터페이스:
 *
 *   부모 → docs:
 *     { type: "ssgoi-showcase:navigate", path }
 *     { type: "ssgoi-showcase:host", command, payload? }
 *
 *   docs → 부모:
 *     { type: "ssgoi-showcase:status", status }
 *     { type: "ssgoi-showcase:ready", path }
 *
 * iframe 밖에선 window.parent === window라 broadcast가 자기 자신으로 가지만
 * 핸들러가 그 type을 받지 않으므로 no-op.
 */
export function DocsSsgoiProvider({ children }: { children: ReactNode }) {
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
      if (window.parent === window) return;
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
    if (window.parent !== window) {
      window.parent.postMessage(
        { type: "ssgoi-showcase:ready", path: window.location.pathname },
        "*",
      );
    }

    return () => {
      window.removeEventListener("message", onMessage);
      unsub();
    };
  }, [router]);

  return (
    <Ssgoi config={config} host={hostRef.current!}>
      {children}
    </Ssgoi>
  );
}
