"use client";

import type { PinSimple } from "@/demo/pinterest/api/pin";
import { PinCard } from "../home/pin-card";

export function RelatedPins({ pins }: { pins: PinSimple[] }) {
  if (pins.length === 0) return null;
  const columns = [
    pins.filter((_, index) => index % 2 === 0),
    pins.filter((_, index) => index % 2 === 1),
  ];

  return (
    <section
      className="border-t border-black/5 px-2 pb-8 pt-5"
      aria-label="관련 사진"
    >
      <h2 className="mb-4 px-2 text-lg font-semibold text-black">관련 사진</h2>
      <div className="grid grid-cols-2 gap-2">
        {columns.map((column, index) => (
          <div key={index} className="flex flex-col gap-2">
            {column.map((pin) => (
              <PinCard key={pin.id} pin={pin} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
