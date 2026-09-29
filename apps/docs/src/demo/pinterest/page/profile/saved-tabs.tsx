"use client";

import { usePin, type SavedView } from "@/demo/pinterest/state/pin";

const TABS: { view: SavedView; label: string }[] = [
  { view: "pins", label: "핀" },
  { view: "boards", label: "보드" },
];

export function SavedTabs() {
  const pin = usePin((state) => ({
    savedView: state.savedView,
    actions: state.actions,
  }));
  return (
    <div
      role="tablist"
      className="sticky top-0 z-10 flex justify-center gap-6 bg-white/95 pt-1 pb-2 backdrop-blur"
    >
      {TABS.map((tab) => {
        const active = pin.savedView === tab.view;
        return (
          <button
            key={tab.view}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => pin.actions.setSavedView(tab.view)}
            className={`relative py-2 text-[16px] transition-colors ${
              active ? "font-bold text-black" : "font-medium text-neutral-500"
            }`}
          >
            {tab.label}
            {active && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-black" />
            )}
          </button>
        );
      })}
    </div>
  );
}
