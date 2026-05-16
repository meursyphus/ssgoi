"use client";

import { Loader2 } from "lucide-react";
import { usePin } from "@/demo/pinterest/state/pin";
import { PinCard } from "./pin-card";

export function Masonry() {
  const pinState = usePin((state) => ({ pins: state.pins }));

  if (pinState.pins.isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-neutral-400">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  const all = pinState.pins.data;
  const left = all.filter((_, i) => i % 2 === 0);
  const right = all.filter((_, i) => i % 2 === 1);

  return (
    <div className="grid grid-cols-2 gap-2 px-2">
      <div className="flex flex-col gap-2">
        {left.map((p) => (
          <PinCard key={p.id} pin={p} />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {right.map((p) => (
          <PinCard key={p.id} pin={p} />
        ))}
      </div>
    </div>
  );
}
