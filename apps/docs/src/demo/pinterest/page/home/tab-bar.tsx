"use client";

import { DragScroller } from "@/lib/components/drag-scroller";
import { usePin, HOME_BOARD_ALL } from "@/demo/pinterest/state/pin";

const TABS = [HOME_BOARD_ALL, "멋진 발명품", "Study room decor", "만년필"];

export function TabBar() {
  const pin = usePin((state) => ({
    board: state.board,
    actions: state.actions,
  }));
  return (
    <DragScroller
      role="tablist"
      className="bg-white pt-1 pb-2"
      trackClassName="gap-5 px-4"
    >
      {TABS.map((tab) => {
        const active = pin.board === tab;
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => pin.actions.selectBoard(tab)}
            className={`relative flex-shrink-0 py-2 text-[15px] transition-colors ${
              active ? "font-bold text-black" : "font-medium text-neutral-500"
            }`}
          >
            {tab}
            {active && (
              <span className="absolute -bottom-0 left-0 right-0 h-[3px] rounded-full bg-black" />
            )}
          </button>
        );
      })}
    </DragScroller>
  );
}
