"use client";

import { Link } from "@/lib/link";
import { DragScroller } from "@/lib/components/drag-scroller";
import type { Guide } from "@/demo/pinterest/state/pin";

const TINT_BG: Record<Guide["tint"], string> = {
  pink: "bg-[#FAD1D1]",
  slate: "bg-[#D6DAE3]",
  lilac: "bg-[#E3D6F0]",
};

export function ChipRow({ query, guides }: { query: string; guides: Guide[] }) {
  if (guides.length === 0) return null;
  return (
    <DragScroller className="bg-white pt-1 pb-3" trackClassName="gap-2 px-3">
      {guides.map((guide) => (
        // Guided search: the chip refines the query into a new results page.
        <Link
          key={guide.label}
          href={`/demo/pinterest/search/${encodeURIComponent(`${query} ${guide.label}`)}`}
          scroll={false}
          className={`flex h-12 flex-shrink-0 items-stretch overflow-hidden rounded-2xl active:opacity-80 ${TINT_BG[guide.tint]}`}
        >
          <img
            src={guide.thumb}
            alt=""
            width={96}
            height={96}
            className="h-full w-12 object-cover"
          />
          <span className="flex items-center px-4 text-[15px] font-bold text-black">
            {guide.label}
          </span>
        </Link>
      ))}
    </DragScroller>
  );
}
