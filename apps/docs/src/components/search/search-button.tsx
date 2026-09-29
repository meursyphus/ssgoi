"use client";

import { useSyncExternalStore, type MouseEvent } from "react";
import { Search } from "lucide-react";
import { useSiteSearch } from "@/lib/state";
import {
  holdKeyboard,
  isSearchDialogLoaded,
  preloadSearch,
  setOpener,
} from "./load";

function subscribeNever() {
  return () => {};
}

function isApple() {
  return /Mac|iPhone|iPad|iPod/.test(
    navigator.platform || navigator.userAgent || "",
  );
}

/** "⌘K" on Apple devices, "Ctrl K" elsewhere; null while server rendering. */
export function useSearchShortcutLabel(): string | null {
  return useSyncExternalStore(
    subscribeNever,
    () => (isApple() ? "⌘K" : "Ctrl K"),
    () => null,
  );
}

/**
 * Opens the ⌘K palette.
 * - `nav`: an icon on phones, a small "Search ⌘K" field from md up (SiteNav).
 * - `icon`: a 44px icon button (docs mobile header).
 */
export function SearchButton({ variant }: { variant: "nav" | "icon" }) {
  const actions = useSiteSearch((s) => s.actions);
  const shortcut = useSearchShortcutLabel();

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    setOpener(e.currentTarget);
    if (!isSearchDialogLoaded()) holdKeyboard();
    actions.open();
  };
  const intent = {
    onPointerEnter: preloadSearch,
    onPointerDown: preloadSearch,
    onFocus: preloadSearch,
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={onClick}
        {...intent}
        aria-label="Search docs and demos"
        aria-haspopup="dialog"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-ink-dim transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
      >
        <Search aria-hidden className="h-[18px] w-[18px]" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      {...intent}
      aria-label="Search docs and demos"
      aria-haspopup="dialog"
      aria-keyshortcuts="Meta+K Control+K"
      className="-mx-3 flex h-11 w-11 items-center justify-center rounded-full text-ink-dim transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 md:mx-0 md:h-8 md:w-auto md:gap-2 md:border md:border-white/10 md:bg-white/[0.03] md:pl-3 md:pr-1.5 md:hover:border-white/20"
    >
      <Search aria-hidden className="h-4 w-4 md:h-3.5 md:w-3.5" />
      <span className="hidden text-[13px] md:inline">Search</span>
      <kbd className="hidden h-5 min-w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-1.5 font-sans text-[11px] text-ink-faint md:inline-flex">
        {shortcut}
      </kbd>
    </button>
  );
}
