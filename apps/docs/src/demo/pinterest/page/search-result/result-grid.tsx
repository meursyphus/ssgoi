"use client";

import type { PinSimple } from "@/demo/pinterest/state/pin";
import { PinGrid } from "../shared/pin-grid";

export function ResultGrid({ results }: { results: PinSimple[] }) {
  if (results.length === 0) {
    return (
      <div className="px-4 py-12 text-center text-[13px] text-neutral-500">
        결과가 없어요.
      </div>
    );
  }
  return (
    <div className="px-2 pt-2">
      <PinGrid pins={results} />
    </div>
  );
}
