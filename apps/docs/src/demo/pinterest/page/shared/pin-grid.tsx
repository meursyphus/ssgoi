"use client";

import type { PinSimple } from "@/demo/pinterest/state/pin";
import { PinCard } from "../home/pin-card";

/** Two-column masonry of pins; every card zooms into its close-up. */
export function PinGrid({ pins }: { pins: PinSimple[] }) {
  const columns = [
    pins.filter((_, index) => index % 2 === 0),
    pins.filter((_, index) => index % 2 === 1),
  ];
  return (
    <div className="grid grid-cols-2 gap-2">
      {columns.map((column, index) => (
        <div key={index} className="flex flex-col gap-2">
          {column.map((pin) => (
            <PinCard key={pin.id} pin={pin} />
          ))}
        </div>
      ))}
    </div>
  );
}
