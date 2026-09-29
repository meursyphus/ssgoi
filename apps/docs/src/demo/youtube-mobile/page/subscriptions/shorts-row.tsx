import { ChevronRight } from "lucide-react";
import { Link } from "@/lib/link";
import { BASE, type MockShort } from "../../mock-data";
import { ShortsMark } from "../shared/brand";
import { ShortCard } from "../shared/short-card";

export function ShortsRow({ shorts }: { shorts: MockShort[] }) {
  return (
    <section className="border-y border-neutral-200 py-4">
      <Link
        href={`${BASE}/shorts`}
        scroll={false}
        className="mb-3 flex w-fit items-center gap-2 px-4 active:opacity-70"
      >
        <ShortsMark className="h-7 w-7 text-[#ff0033]" />
        <h1 className="text-[20px] font-bold">Shorts</h1>
        <ChevronRight className="h-5 w-5 text-neutral-500" />
      </Link>
      <div className="scrollbar-hide flex gap-2 overflow-x-auto px-3">
        {shorts.map((short) => (
          <ShortCard
            key={short.id}
            short={short}
            className="aspect-[0.65] w-[156px] shrink-0"
          />
        ))}
      </div>
    </section>
  );
}
