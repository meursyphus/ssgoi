"use client";

import { usePin } from "@/demo/pinterest/state/pin";
import { PinGrid } from "../shared/pin-grid";

/** The 핀 tab: every saved pin, newest first; each one zooms open. */
export function SavedPins() {
  const pin = usePin((state) => ({ saved: state.saved }));
  if (pin.saved.data.length === 0) {
    return (
      <p className="px-4 py-12 text-center text-[13px] text-neutral-500">
        아직 저장한 핀이 없어요.
      </p>
    );
  }
  return <PinGrid pins={pin.saved.data} />;
}
