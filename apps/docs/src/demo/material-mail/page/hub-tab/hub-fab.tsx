"use client";

import { toast } from "sonner";
import type { HubContent } from "./content";

export function HubFab({ fab }: { fab: NonNullable<HubContent["fab"]> }) {
  const Icon = fab.icon;
  return (
    // Same line as the inbox's Compose FAB: 10px above the 70px nav, which
    // itself sits on the bottom safe area.
    <div className="pointer-events-none sticky bottom-safe-20 z-20 h-0">
      <button
        type="button"
        onClick={() => toast(fab.toast)}
        className="pointer-events-auto absolute right-5 bottom-0 flex items-center gap-2.5 rounded-2xl bg-indigo-100/95 px-4 py-3.5 text-[15px] font-medium text-indigo-700 shadow-[0_3px_8px_rgba(67,56,202,0.18),_0_1px_2px_rgba(67,56,202,0.12)] active:bg-indigo-200"
      >
        <Icon size={20} strokeWidth={2.25} />
        <span>{fab.label}</span>
      </button>
    </div>
  );
}
