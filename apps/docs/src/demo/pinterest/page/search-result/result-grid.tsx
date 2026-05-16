"use client";

import { Loader2 } from "lucide-react";
import { usePin } from "@/demo/pinterest/state/pin";
import { PinCard } from "../home/pin-card";

export function ResultGrid() {
  const pinState = usePin((state) => ({
    isSearching: state.isSearching,
    results: state.searchResults,
  }));

  if (pinState.isSearching && pinState.results.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-neutral-500">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (pinState.results.length === 0) {
    return (
      <div className="px-4 py-12 text-center text-[13px] text-neutral-500">
        결과가 없어요.
      </div>
    );
  }

  const left = pinState.results.filter((_, i) => i % 2 === 0);
  const right = pinState.results.filter((_, i) => i % 2 === 1);

  return (
    <div className="grid grid-cols-2 gap-2 px-2 pt-2">
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
