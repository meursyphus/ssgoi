"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  Ban,
  Captions,
  CircleMinus,
  Clock,
  FileText,
  Flag,
  ListPlus,
  MoreVertical,
  Settings2,
  Share2,
  Shuffle,
  ThumbsDown,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

type SheetItem = { label: string; icon: LucideIcon; toast: string };
type Sheet = { title?: string; items?: SheetItem[]; content?: ReactNode };

const SHARE: SheetItem = { label: "Share", icon: Share2, toast: "Link copied" };

export const MENUS = {
  video: [
    {
      label: "Save to Watch later",
      icon: Clock,
      toast: "Saved to Watch later",
    },
    {
      label: "Save to playlist",
      icon: ListPlus,
      toast: "Saved to Saved creative ideas",
    },
    SHARE,
    {
      label: "Not interested",
      icon: Ban,
      toast: "Got it. You'll see fewer videos like this",
    },
    {
      label: "Don't recommend channel",
      icon: CircleMinus,
      toast: "We won't recommend this channel to you",
    },
  ],
  short: [
    SHARE,
    {
      label: "Not interested",
      icon: Ban,
      toast: "Got it. You'll see fewer Shorts like this",
    },
    { label: "Send feedback", icon: Flag, toast: "Thanks for the feedback" },
  ],
  shelf: [
    {
      label: "Fewer Shorts",
      icon: ThumbsDown,
      toast: "You'll see fewer Shorts on Home",
    },
  ],
  player: [
    { label: "Description", icon: FileText, toast: "Description opened" },
    { label: "Captions", icon: Captions, toast: "Captions on (English)" },
    { label: "Quality", icon: Settings2, toast: "Quality set to Auto (1080p)" },
    { label: "Report", icon: Flag, toast: "Thanks for letting us know" },
  ],
  history: [
    {
      label: "Remove from watch history",
      icon: Trash2,
      toast: "Removed from watch history",
    },
    {
      label: "Save to playlist",
      icon: ListPlus,
      toast: "Saved to Saved creative ideas",
    },
    SHARE,
  ],
  playlist: [
    { label: "Shuffle play", icon: Shuffle, toast: "Shuffling your playlist" },
    SHARE,
  ],
  channel: [
    SHARE,
    { label: "Report user", icon: Flag, toast: "Thanks for letting us know" },
  ],
} satisfies Record<string, SheetItem[]>;

let current: Sheet | null = null;
const listeners = new Set<() => void>();
const emit = (next: Sheet | null) => {
  current = next;
  listeners.forEach((listener) => listener());
};
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function openActionSheet(sheet: Sheet) {
  emit(sheet);
}

export function closeActionSheet() {
  emit(null);
}

export function MoreButton({
  menu,
  label = "More actions",
  className = "",
  iconClassName = "h-5 w-5",
}: {
  menu: keyof typeof MENUS;
  label?: string;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => openActionSheet({ items: MENUS[menu] })}
      className={`flex items-center justify-center rounded-full active:bg-black/10 ${className}`}
    >
      <MoreVertical className={iconClassName} />
    </button>
  );
}

/**
 * Bottom action sheet, rendered inside the phone frame's scroll area as the
 * last child of a full-height flex column (`mt-auto` puts it at the end even
 * when the page is absolutely positioned): `sticky bottom-0` keeps it on the
 * visible bottom edge at any scroll position.
 */
export function ActionSheetHost() {
  const sheet = useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
  const pathname = usePathname();
  useEffect(() => () => emit(null), [pathname]);

  return (
    <div className="pointer-events-none sticky bottom-0 z-50 mt-auto h-0">
      <AnimatePresence>
        {sheet && (
          <>
            <motion.button
              key="scrim"
              type="button"
              aria-label="Close menu"
              onClick={() => emit(null)}
              className="pointer-events-auto absolute inset-x-0 bottom-0 h-[100dvh] bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            />
            <motion.div
              key="panel"
              role="menu"
              className="pointer-events-auto absolute inset-x-2 bottom-2 max-h-[70dvh] overflow-y-auto rounded-2xl bg-white pb-2 text-neutral-950 shadow-xl"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              exit={{ y: "110%" }}
              transition={{ type: "spring", stiffness: 520, damping: 44 }}
            >
              <span className="mx-auto mb-1 mt-2 block h-1 w-9 rounded-full bg-neutral-300" />
              {sheet.title && (
                <h2 className="px-5 pb-2 pt-1 text-[16px] font-bold">
                  {sheet.title}
                </h2>
              )}
              {sheet.content}
              {sheet.items?.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    emit(null);
                    toast(item.toast);
                  }}
                  className="flex h-12 w-full items-center gap-4 px-5 text-left text-[15px] active:bg-neutral-100"
                >
                  <item.icon className="h-5 w-5 shrink-0" strokeWidth={1.8} />
                  {item.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
