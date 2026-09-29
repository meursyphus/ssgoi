"use client";

import type { PinSimple } from "@/demo/pinterest/state/pin";
import { PinGrid } from "../shared/pin-grid";

export function RelatedPins({ pins }: { pins: PinSimple[] }) {
  if (pins.length === 0) return null;
  return (
    <section
      className="border-t border-black/5 px-2 pb-8 pt-5"
      aria-label="관련 사진"
    >
      <h2 className="mb-4 px-2 text-lg font-semibold text-black">관련 사진</h2>
      <PinGrid pins={pins} />
    </section>
  );
}
