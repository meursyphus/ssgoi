"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { HostAnimation } from "@ssgoi/core/internal";

export type ShowcaseFrameStatus =
  | "idle"
  | "playing"
  | "reversing"
  | "paused"
  | "settled";

export const showcaseFrameProtocol = {
  messages: {
    navigate: "ssgoi-showcase:navigate",
    host: "ssgoi-showcase:host",
    status: "ssgoi-showcase:status",
    ready: "ssgoi-showcase:ready",
  },
  hostCommands: {
    play: (host: HostAnimation) => host.play(),
    pause: (host: HostAnimation) => host.pause(),
    reverse: (host: HostAnimation) => host.reverse(),
    complete: (host: HostAnimation) => host.complete(),
    rate: (host: HostAnimation, payload: unknown) => {
      if (typeof payload === "number") host.playbackRate = payload;
    },
  },
  getStatus(host: HostAnimation): ShowcaseFrameStatus {
    if (host.isAnimating) return host.isReversing ? "reversing" : "playing";
    if (host.isPaused) return "paused";
    if (host.isComplete) return "settled";
    return "idle";
  },
} as const;

type HostCommand = keyof typeof showcaseFrameProtocol.hostCommands;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isHostCommand(command: unknown): command is HostCommand {
  return (
    typeof command === "string" && command in showcaseFrameProtocol.hostCommands
  );
}

function postToParent(message: object) {
  if (window.parent === window) return;
  window.parent.postMessage(message, "*");
}

export function useShowcaseFrameBridge(host: HostAnimation) {
  const router = useRouter();

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      const data = e.data;
      if (!isRecord(data)) return;

      if (
        data.type === showcaseFrameProtocol.messages.navigate &&
        typeof data.path === "string"
      ) {
        router.push(data.path, { scroll: false });
        return;
      }

      if (
        data.type === showcaseFrameProtocol.messages.host &&
        isHostCommand(data.command)
      ) {
        showcaseFrameProtocol.hostCommands[data.command](host, data.payload);
      }
    }

    function broadcast() {
      postToParent({
        type: showcaseFrameProtocol.messages.status,
        status: showcaseFrameProtocol.getStatus(host),
      });
    }

    window.addEventListener("message", onMessage);
    const unsubscribe = host.subscribe(broadcast);
    postToParent({
      type: showcaseFrameProtocol.messages.ready,
      path: window.location.pathname,
    });

    return () => {
      window.removeEventListener("message", onMessage);
      unsubscribe();
    };
  }, [router, host]);
}
