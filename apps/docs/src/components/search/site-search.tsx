"use client";

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ComponentType,
} from "react";
import { usePathname } from "next/navigation";
import { useSiteSearch } from "@/lib/state";
import { loadSearchDialog, setOpener } from "./load";

function subscribeNever() {
  return () => {};
}

function isTopWindow() {
  try {
    return window.self === window.top;
  } catch {
    return false;
  }
}

/** True for inputs, textareas, selects and contenteditable regions. */
export function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

function isDemoPath(pathname: string) {
  return pathname === "/demo" || pathname.startsWith("/demo/");
}

/**
 * Site-wide ⌘K palette host. Renders nothing on the server, under /demo/**,
 * and inside iframes — the catalog's live previews are this same app, and
 * their hotkeys must stay theirs.
 */
export function SiteSearch() {
  const pathname = usePathname();
  const topWindow = useSyncExternalStore(
    subscribeNever,
    isTopWindow,
    () => false,
  );
  if (!topWindow || isDemoPath(pathname)) return null;
  return <SiteSearchHost pathname={pathname} />;
}

function SiteSearchHost({ pathname }: { pathname: string }) {
  const { open, actions } = useSiteSearch((s) => ({
    open: s.open,
    actions: s.actions,
  }));
  const [Dialog, setDialog] = useState<ComponentType | null>(null);

  // Preload the chunk when the page goes idle, and at once if someone got to
  // ⌘K first.
  useEffect(() => {
    let cancelled = false;
    const load = () =>
      loadSearchDialog()
        .then((mod) => {
          if (!cancelled) setDialog(() => mod.SearchDialog);
        })
        .catch(() => {});
    if (open) {
      load();
      return () => {
        cancelled = true;
      };
    }
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(load, { timeout: 4000 })
      : window.setTimeout(load, 2500);
    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.isComposing || e.defaultPrevented || typeof e.key !== "string")
        return;
      const mod = e.metaKey || e.ctrlKey;
      if (mod && !e.altKey && !e.shiftKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpener(document.activeElement);
        actions.toggle();
        return;
      }
      // "/" belongs to the catalog's own search on the landing page.
      if (
        e.key === "/" &&
        !mod &&
        !e.altKey &&
        pathname !== "/" &&
        !isTypingTarget(e.target)
      ) {
        e.preventDefault();
        setOpener(document.activeElement);
        actions.open();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [actions, pathname]);

  return Dialog ? <Dialog /> : null;
}
