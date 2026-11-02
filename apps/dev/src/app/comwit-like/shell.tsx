"use client";

import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import {
  Ssgoi,
  useSsgoiTransition,
  type SsgoiConfig,
  type SsgoiFramework,
} from "@ssgoi/react";
import { drill, hero } from "@ssgoi/react/view-transitions";

/**
 * A reduced copy of how Comwit mounts SSGOI: one <Ssgoi framework> around a
 * <main> scroller that is the scroll container on mobile and `overflow:
 * visible` (document scrolls) from md up. Boundaries are SsgoiPageBoundary in
 * the group layouts and pages; Cache Components hide/show them.
 */

const LIST = "/comwit-like/list";
const ITEM = "/comwit-like/item/:id";

const desktopTransitions: SsgoiConfig["transitions"] = [
  {
    from: LIST,
    to: ITEM,
    transition: hero({ type: "fade", variant: "smooth" }),
    preserveScroll: { from: true, to: false },
  },
];

const mobileTransitions: SsgoiConfig["transitions"] = [
  {
    from: LIST,
    to: ITEM,
    transition: drill({ type: "parallax" }),
    preserveScroll: { from: true, to: false },
  },
  {
    priority: -100,
    on: "/comwit-like/**",
    except: [LIST],
    transition: drill({ type: "parallax" }),
  },
];

const config: SsgoiConfig = {
  transitions: ({ isMobile }) =>
    isMobile ? mobileTransitions : desktopTransitions,
};

const framework: SsgoiFramework = {
  useRoute: () => {
    const pathname = usePathname();
    return pathname == null ? null : { pathname };
  },
};

type TraceEvent = {
  t: number;
  type: string;
  path?: string | null;
  detail?: string;
};

declare global {
  interface Window {
    __ssgoiTrace?: TraceEvent[];
  }
}

/** App-side trace: boundary display flips and hero key arrivals, timestamped. */
function useTrace() {
  useEffect(() => {
    const trace: TraceEvent[] = (window.__ssgoiTrace = []);
    const push = (type: string, el: Element | null, detail?: string) =>
      trace.push({
        t: performance.now(),
        type,
        path: el?.getAttribute("data-ssgoi-transition"),
        detail,
      });
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        const el = m.target as HTMLElement;
        if (
          m.type === "attributes" &&
          el.hasAttribute("data-ssgoi-transition")
        ) {
          push("style", el, el.style.getPropertyValue("display") || "(flow)");
          continue;
        }
        for (const node of m.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.hasAttribute("data-ssgoi-transition")) push("mount", node);
          const heroNode = node.matches("[data-hero-enter-key]")
            ? node
            : node.querySelector("[data-hero-enter-key]");
          if (heroNode) {
            push(
              "hero-enter-key",
              heroNode.closest("[data-ssgoi-transition]"),
              heroNode.getAttribute("data-hero-enter-key") ?? undefined,
            );
          }
          for (const sub of node.querySelectorAll("[data-ssgoi-transition]")) {
            push("mount", sub);
          }
        }
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style"],
    });
    // Scroll events on whichever element scrolls at this viewport.
    const main = document.querySelector<HTMLElement>("[data-scroller]");
    const docScrolls = !main || getComputedStyle(main).overflowY === "visible";
    const scroller = docScrolls ? document.documentElement : main;
    const target: EventTarget = docScrolls ? window : scroller;
    const onScroll = () =>
      trace.push({
        t: performance.now(),
        type: "scroll",
        detail: `${scroller.scrollTop} h=${scroller.scrollHeight}`,
      });
    target.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      target.removeEventListener("scroll", onScroll);
    };
  }, []);
}

/** Mirrors the provider's transition state into the trace. */
function TraceState() {
  const state = useSsgoiTransition();
  useEffect(() => {
    window.__ssgoiTrace?.push({
      t: performance.now(),
      type: `state:${state.status}`,
      detail:
        state.status === "idle"
          ? undefined
          : `${state.from} -> ${state.to} (${state.direction})`,
    });
  }, [state]);
  return null;
}

export function ComwitLikeShell({ children }: { children: ReactNode }) {
  useTrace();
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-neutral-950 text-neutral-100 md:h-auto md:overflow-visible">
      <Ssgoi config={config} framework={framework}>
        <TraceState />
        <main
          data-scroller=""
          className="relative z-0 flex-1 overflow-y-auto overflow-x-clip overscroll-y-contain md:flex-none md:overflow-visible"
        >
          {children}
        </main>
      </Ssgoi>
    </div>
  );
}
