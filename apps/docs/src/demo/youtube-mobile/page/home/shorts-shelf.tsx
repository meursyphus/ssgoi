import type { MockShort } from "../../mock-data";
import { MoreButton } from "../shared/action-sheet";
import { ShortsMark } from "../shared/brand";
import { ShortCard } from "../shared/short-card";

export function ShortsShelf({ shorts }: { shorts: MockShort[] }) {
  return (
    <section className="border-t border-neutral-200 px-3 pb-4 pt-4">
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <ShortsMark className="h-7 w-7 text-[#ff0033]" />
          <h1 className="text-[20px] font-bold">Shorts</h1>
        </div>
        <MoreButton menu="shelf" label="Shorts options" className="h-8 w-8" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {shorts.map((short) => (
          <ShortCard key={short.id} short={short} className="aspect-[0.64]" />
        ))}
      </div>
    </section>
  );
}
