"use client";

import type { Guide, PinSimple } from "@/demo/pinterest/state/pin";
import { ResultHeader } from "./header";
import { ChipRow } from "./chip-row";
import { ResultGrid } from "./result-grid";

export default function SearchResultPage({
  query,
  results,
  guides,
}: {
  query: string;
  results: PinSimple[];
  guides: Guide[];
}) {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <ResultHeader query={query} />
      <ChipRow query={query} guides={guides} />
      <div className="flex-1 pb-6">
        <ResultGrid results={results} />
      </div>
    </div>
  );
}
